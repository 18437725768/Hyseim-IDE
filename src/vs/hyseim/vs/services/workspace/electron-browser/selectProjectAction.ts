import { Action } from 'vs/base/common/actions';
import { ICMakeService } from 'vs/hyseim/vs/workbench/cmake/common/type';
import { ACTION_ID_SELECT_FOLDER, ACTION_LABEL_SELECT_FOLDER } from 'vs/hyseim/vs/services/workspace/common/actionId';
import { IQuickInputService, IQuickPickItem, QuickPickInput } from 'vs/platform/quickinput/common/quickInput';
import { localize } from 'vs/nls';
import { CMakeProjectTypes } from 'vs/hyseim/vs/base/common/jsonSchemas/cmakeConfigSchema';
import { basename } from 'vs/base/common/path';
import { IHyseimWorkspaceService } from 'vs/hyseim/vs/services/workspace/common/type';

interface IPickWithFolder extends IQuickPickItem {
	folder: string;
	cmake: boolean;
}

export class SelectWorkspaceFolderAction extends Action {
	public static readonly ID = ACTION_ID_SELECT_FOLDER;
	public static readonly LABEL = ACTION_LABEL_SELECT_FOLDER;

	constructor(
		id = SelectWorkspaceFolderAction.ID, label = SelectWorkspaceFolderAction.LABEL,
		@ICMakeService private readonly cmakeService: ICMakeService,
		@IQuickInputService private readonly quickInputService: IQuickInputService,
		@IHyseimWorkspaceService private readonly workspaceService: IHyseimWorkspaceService,
		@IHyseimWorkspaceService private readonly hyseimWorkspaceService: IHyseimWorkspaceService,
	) {
		super(id, label);
	}

	async run(): Promise<void> {
		const allOpenFolder = await this.workspaceService.getAllWorkspace();
		const currentSelected = await this.workspaceService.getCurrentWorkspace();

		const selectionLibrary: QuickPickInput<IPickWithFolder>[] = [{ type: 'separator', label: localize('library', 'Library') }];
		const selectionExecutable: QuickPickInput<IPickWithFolder>[] = [{ type: 'separator', label: localize('executable', 'Executable') }];
		const selectionNotProject: QuickPickInput<IPickWithFolder>[] = [{ type: 'separator', label: localize('notProject', 'Non project') }];

		let active: IPickWithFolder | undefined;

		for (const path of allOpenFolder) {
			const pkg = await this.hyseimWorkspaceService.readProjectSetting(path);
			if (pkg) {
				const selection: IPickWithFolder = {
					label: pkg.name,
					description: localize('folder', 'Folder: {0}', basename(path)),
					folder: path,
					cmake: true,
				};

				if (pkg.type === CMakeProjectTypes.executable) {
					selectionExecutable.push(selection);
				} else {
					selectionLibrary.push(selection);
				}

				if (currentSelected === path) {
					active = selection;
				}
			} else {
				const selection: IPickWithFolder = {
					label: basename(path),
					description: localize('folder', 'Folder: {0}', basename(path)),
					folder: path,
					cmake: false,
				};

				selectionNotProject.push(selection);
			}
		}

		const selections = [
			...(selectionExecutable.length > 1 ? selectionExecutable : []),
			...(selectionLibrary.length > 1 ? selectionLibrary : []),
			...(selectionNotProject.length > 1 ? selectionNotProject : []),
		];

		const sel = await this.quickInputService.pick<IPickWithFolder>(selections, {
			placeHolder: localize('selectFolder', 'Select working folder'),
			matchOnLabel: true,
			matchOnDescription: true,
			canPickMany: false,
			activeItem: active,
		});

		if (!sel) {
			return;
		}

		await this.workspaceService.changeWorkspaceByPath(sel.folder);
		await this.cmakeService.rescanCurrentFolder();
	}
}
