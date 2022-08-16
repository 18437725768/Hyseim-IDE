import { IServerChannel } from 'vs/base/parts/ipc/common/ipc';
import { createChannelDecorator } from 'vs/hyseim/vs/platform/instantiation/common/ipcExtensions';

export interface IHyseimMainIpcChannel extends IServerChannel {
	_serviceBrand: any;
}

export interface IHyseimServiceRunnerChannel extends IServerChannel {
	_serviceBrand: any;
}

export const IHyseimMainIpcChannel = createChannelDecorator<IHyseimMainIpcChannel>('hyseim:ipc');
export const IHyseimServiceRunnerChannel = createChannelDecorator<IHyseimServiceRunnerChannel>('hyseim:service-rpc');
