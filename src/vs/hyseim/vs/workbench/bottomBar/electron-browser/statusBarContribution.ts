import { registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { IHyseimStatusControllerService } from 'vs/hyseim/vs/workbench/bottomBar/common/type';
import { HyseimStatusControllerService } from 'vs/hyseim/vs/workbench/bottomBar/common/hyseimStatusControllerService';

registerSingleton(IHyseimStatusControllerService, HyseimStatusControllerService);
