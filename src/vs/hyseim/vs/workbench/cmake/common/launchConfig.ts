import { ICompound, ILaunch } from 'vs/workbench/contrib/debug/common/debug';
import { IEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IWorkspaceContextService, IWorkspaceFolder } from 'vs/platform/workspace/common/workspace';
import { INodePathService } from 'vs/hyseim/vs/services/path/common/type';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { resolvePath } from 'vs/hyseim/vs/base/common/resolvePath';
import { executableExtension } from 'vs/hyseim/vs/base/common/platformEnv';
import { URI } from 'vs/base/common/uri';
import { localize } from 'vs/nls';
// import { getLimitedEnvironment } from 'vs/hyseim/vs/workbench/cmake/node/environmentVars';
import { IEditor } from 'vs/workbench/common/editor';
import { JSONVisitor } from 'vs/base/common/json';

export class WorkspaceMaixLaunch implements ILaunch {
	protected GDB: string;

	constructor(
		protected port: number,
		protected programFile: string,
		@IEditorService protected editorService: IEditorService,
		@IWorkspaceContextService protected contextService: IWorkspaceContextService,
		@INodePathService protected nodePathService: INodePathService,
		@IEnvironmentService environmentService: IEnvironmentService,
		@IConfigurationService protected configurationService: IConfigurationService,
		@IWorkspaceContextService protected workspaceContextService: IWorkspaceContextService,
	) {
		this.GDB = resolvePath(nodePathService.getToolchainBinPath(), 'riscv32-unknown-elf-gdb' + executableExtension);
	}

	public get workspace(): IWorkspaceFolder {
		return this.workspaceContextService.getWorkspace().folders[0];
	}

	public get uri(): URI {
		return this.contextService.getWorkspace().folders[0].toResource('.vscode/launch.json');
	}

	public get name(): string {
		return localize('workspace', 'workspace');
	}

	public get hidden(): boolean {
		return true;
	}

	public getCompound(name: string): ICompound | undefined {
		return undefined;
	}

	public getConfigurationNames(includeCompounds = true): string[] {
		return ['default'];
	}

	public getConfiguration(name: string = '') {

		return {
			// id: 'hyseim',
			// type: 'hyseim',
			// request: 'launch',
			// name: 'KDBG',
			// executable: this.programFile,
			// target: `127.0.0.1:${this.port}`,
			// cwd: '${workspaceRoot}/build',
			// internalConsoleOptions: 'openOnSessionStart' as any,
			// env: getLimitedEnvironment(this.nodePathService, this.configurationService).env,
			// autorun: [],
			// gdbpath: this.GDB,
			name: 'HDBG',
			type: 'cppdbg',
			request: 'launch',
			program: this.programFile,
			args: [],
			stopAtEntry: false,
			cwd: '${workspaceRoot}/build',
			environment: [],
			// externalConsole: false,
			MIMode: 'gdb',
			miDebuggerPath: this.GDB,
			// miDebuggerServerAddress: `127.0.0.1:${this.port}`,
			setupCommands: [
				{
					description: 'Enable pretty-printing for gdb',
					text: '-enable-pretty-printing',
					ignoreFailures: true
				},
				{ text: 'file ' + this.programFile },
				{ text: 'target extended-remote:' + this.port },
				{ text: 'monitor reset halt' },
				{ text: 'monitor adapter speed 100' },
				{ text: 'load' },
				{ text: 'monitor adapter speed 1000' },
				// {text: 'b main', ignoreFailures: true}
			]
		};
	}

	openConfigFile(sideBySide: boolean, preserveFocus: boolean, type?: string): Promise<{ editor: IEditor, created: boolean }> {
		return this.editorService.openEditor({
			resource: this.uri,
		}).then(editor => {
			if (editor) {
				return { editor, created: false };
			} else {
				throw new Error('Failed to open editor.');
			}
		});
	}
}

export class LaunchVisitor implements JSONVisitor {
	private depthInArray = 0;
	private depthInObject = 0;
	private lastProperty: string;
	private configurationsArrayPosition: number;
	private isInConfig: boolean;
	private lastObjectBegin: number;
	private lastObjectEnd: number;
	private idHyseimFound = false;
	private idHyseimEndFound = false;
	private idHyseimWatchProperty = false;

	constructor() {
		this.onLiteralValue = this.onLiteralValue.bind(this);
		this.onObjectProperty = this.onObjectProperty.bind(this);
		this.onObjectEnd = this.onObjectEnd.bind(this);
		this.onObjectBegin = this.onObjectBegin.bind(this);
		this.onArrayBegin = this.onArrayBegin.bind(this);
		this.onArrayEnd = this.onArrayEnd.bind(this);
	}

	get Result() {
		return {
			arrayPos: this.configurationsArrayPosition,
			found: this.idHyseimFound,
			start: this.lastObjectBegin,
			end: this.lastObjectEnd,
		};
	}

	onLiteralValue(value: any, offset: number, length: number) {
		if (!this.idHyseimFound && this.idHyseimWatchProperty && value === 'hyseim') {
			this.idHyseimFound = true;
		}
	}

	onObjectProperty(property: string, offset: number, length: number) {
		this.lastProperty = property;

		if (!this.idHyseimFound && this.depthInObject === 1 && property === 'id') { // try to find id=hyseim
			this.idHyseimWatchProperty = true;
		}
	}

	onObjectEnd(offset: number, length: number) {
		if (!this.isInConfig || this.idHyseimEndFound) {
			return;
		}
		this.depthInObject--;
		if (this.depthInObject === 0 && this.idHyseimFound) {
			this.lastObjectEnd = offset + 1;
			this.idHyseimEndFound = true;
		}
	}

	onObjectBegin(offset: number, length: number) {
		if (!this.isInConfig || this.idHyseimEndFound) {
			return;
		}
		if (this.depthInObject === 0) {
			this.lastObjectBegin = offset;
		}
		this.depthInObject++;
	}

	onArrayBegin(offset: number, length: number) {
		if (this.lastProperty === 'configurations' && this.depthInArray === 0) {
			this.configurationsArrayPosition = offset + 1;
			this.isInConfig = true;
		}
		this.depthInArray++;
	}

	onArrayEnd() {
		this.depthInArray--;
		if (this.depthInArray === 0) {
			// go out of `configurations`
			this.isInConfig = false;
		}
	}
}
