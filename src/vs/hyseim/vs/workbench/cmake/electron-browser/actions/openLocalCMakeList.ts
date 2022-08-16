import { Action } from 'vs/base/common/actions';
import { ACTION_ID_OPEN_CMAKE_LIST_CONFIG } from 'vs/hyseim/vs/workbench/cmake/common/actionIds';
import { localize } from 'vs/nls';
import { exists, writeFile } from 'vs/base/node/pfs';
import { IEditorService } from 'vs/workbench/services/editor/common/editorService';
import { URI } from 'vs/base/common/uri';
import { ICMakeService } from 'vs/hyseim/vs/workbench/cmake/common/type';
import { CMAKE_CONFIG_FILE_NAME } from 'vs/hyseim/vs/base/common/constants/wellknownFiles';
import { IHyseimWorkspaceService } from 'vs/hyseim/vs/services/workspace/common/type';

export class OpenLocalCMakeListAction extends Action {
	static readonly ID = ACTION_ID_OPEN_CMAKE_LIST_CONFIG;
	static readonly LABEL = localize('open', 'Open {1}', CMAKE_CONFIG_FILE_NAME);

	constructor(
		id: string = OpenLocalCMakeListAction.ID, label: string = OpenLocalCMakeListAction.LABEL,
		@IHyseimWorkspaceService private readonly hyseimWorkspaceService: IHyseimWorkspaceService,
		@IEditorService private readonly editorService: IEditorService,
		@ICMakeService private readonly cmakeService: ICMakeService,
	) {
		super(id, label);
	}

	async run(): Promise<void> {
		const file = this.hyseimWorkspaceService.requireCurrentWorkspaceFile(CMAKE_CONFIG_FILE_NAME);
		if (!await exists(file)) {
			await writeFile(file, `{
	// cmake config file
	"$schema": "vscode://schemas/CMakeLists",
}`);
		}

		await this.cmakeService.rescanCurrentFolder();

		await this.editorService.openEditor({ resource: URI.file(file) });
	}
}
