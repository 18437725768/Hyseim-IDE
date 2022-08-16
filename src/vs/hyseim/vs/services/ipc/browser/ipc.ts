import { IChannel } from 'vs/base/parts/ipc/common/ipc';
import { createChannelDecorator } from 'vs/hyseim/vs/platform/instantiation/common/ipcExtensions';

export interface IHyseimMainIpcChannelClient extends IChannel {
	_serviceBrand: any;
}

export interface IHyseimServiceRunnerChannelClient extends IChannel {
	_serviceBrand: any;
}

export const IHyseimMainIpcChannel = createChannelDecorator<IHyseimMainIpcChannelClient>('hyseim:ipc');
export const IHyseimServiceRunnerChannel = createChannelDecorator<IHyseimServiceRunnerChannelClient>('hyseim:service-rpc');

