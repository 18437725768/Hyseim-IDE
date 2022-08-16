import { registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { ISudoService, SudoService } from 'vs/hyseim/vs/platform/sudo/node/sudoService';

registerSingleton(ISudoService, SudoService);
