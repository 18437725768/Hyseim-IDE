import { AbstractFieldControl } from 'vs/hyseim/vs/workbench/hyseimPackageJsonEditor/electron-browser/fields/base';
import { visualStudioIconClass } from 'vs/hyseim/vs/platform/vsicons/browser/vsIconRender';
import { ACTION_ID_PACKAGE_MANAGER_OPEN_MARKET, ACTION_LABEL_PACKAGE_MANAGER_OPEN_MARKET } from 'vs/hyseim/vs/base/common/menu/packageManager';

export class OpenManagerControl extends AbstractFieldControl<string> {
	createControlList() {
		const addButton = this.createCommonButton(
			visualStudioIconClass('browser-download'),
			ACTION_LABEL_PACKAGE_MANAGER_OPEN_MARKET,
			'',
		);
		this._register(addButton.onDidClick(() => {
			return this.commandService.executeCommand(ACTION_ID_PACKAGE_MANAGER_OPEN_MARKET);
		}));
	}
}
