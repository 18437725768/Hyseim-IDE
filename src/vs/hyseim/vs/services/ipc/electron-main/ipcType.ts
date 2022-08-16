import { createDecorator } from 'vs/platform/instantiation/common/instantiation';

export interface IHyseimServerService {
	_serviceBrand: any;

}

export const IHyseimServerService = createDecorator<IHyseimServerService>('hyseimIPCService');
