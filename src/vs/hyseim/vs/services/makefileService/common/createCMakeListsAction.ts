import { Action } from 'vs/base/common/actions';
import { ACTION_ID_CREATE_MAKEFILE, ACTION_LABEL_CREATE_MAKEFILE, IMakefileService } from 'vs/hyseim/vs/services/makefileService/common/type';
import { IHyseimWorkspaceService } from 'vs/hyseim/vs/services/workspace/common/type';
import { INotificationService } from 'vs/platform/notification/common/notification';

export class CreateCMakeListsAction extends Action {
	static readonly ID: string = ACTION_ID_CREATE_MAKEFILE;
	static readonly LABEL: string = ACTION_LABEL_CREATE_MAKEFILE;

	constructor(
		id = CreateCMakeListsAction.ID, label = CreateCMakeListsAction.LABEL,
		@IMakefileService private readonly makefileService: IMakefileService,
		@IHyseimWorkspaceService private readonly hyseimWorkspaceService: IHyseimWorkspaceService,
		@INotificationService private readonly notificationService: INotificationService,
	) {
		super(id, label);
	}

	async run() {
		return Promise.resolve().then(() => {
			return this.makefileService.generateMakefile(this.hyseimWorkspaceService.requireCurrentWorkspace());
		}).then(() => {
			this.notificationService.info('Success...');
		}, (e) => {
			this.notificationService.error(e);
		});
	}
}
