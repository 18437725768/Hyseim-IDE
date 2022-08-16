import { Registry } from 'vs/platform/registry/common/platform';
import { Extensions as WorkbenchExtensions, IWorkbenchContribution, IWorkbenchContributionsRegistry } from 'vs/workbench/common/contributions';
import { LifecyclePhase } from 'vs/platform/lifecycle/common/lifecycle';
import { Disposable } from 'vs/base/common/lifecycle';
import { IMakefileService } from 'vs/hyseim/vs/services/makefileService/common/type';
import { IFlashManagerService } from 'vs/hyseim/vs/workbench/flashManager/common/flashManagerService';

class FlashManagerHookContribution extends Disposable implements IWorkbenchContribution {
	constructor(
		@IMakefileService makefileService: IMakefileService,
		@IFlashManagerService flashManagerService: IFlashManagerService,
	) {
		super();
		this._register(
			makefileService.onPrepareBuild((event) => {
				event.waitUntil(flashManagerService.handlePrecompileEvent(event));
			}),
		);
	}
}

Registry.as<IWorkbenchContributionsRegistry>(WorkbenchExtensions.Workbench)
	.registerWorkbenchContribution(FlashManagerHookContribution, LifecyclePhase.Restored);
