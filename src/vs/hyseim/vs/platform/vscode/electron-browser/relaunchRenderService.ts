import { IRelaunchService } from 'vs/hyseim/vs/platform/vscode/common/relaunchService';
import { registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { IHyseimClientService, MainThreadMethod } from 'vs/hyseim/vs/services/ipc/common/ipcType';

export class RenderRelaunchService implements IRelaunchService {
	_serviceBrand: any;

	constructor(
		@IHyseimClientService channelService: IHyseimClientService,
	) {
		channelService.initService<IRelaunchService>(this, IRelaunchService);
	}

	@MainThreadMethod(IRelaunchService)
	public createLogsTarball(): Promise<string> {
		return null as any;
	}

	@MainThreadMethod(IRelaunchService)
	public connect() {
		return null as any;
	}

	@MainThreadMethod(IRelaunchService)
	public launchUpdater() {
		return null as any;
	}

	@MainThreadMethod(IRelaunchService)
	public relaunch() {
		return null as any;
	}
}

registerSingleton(IRelaunchService, RenderRelaunchService);
