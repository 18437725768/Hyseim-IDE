import { ISudoService, SudoService } from 'vs/hyseim/vs/platform/sudo/node/sudoService';
import { registerMainSingleton } from 'vs/hyseim/vs/platform/instantiation/common/mainExtensions';

registerMainSingleton(ISudoService, SudoService);
