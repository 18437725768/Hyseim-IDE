import { NodePathService } from 'vs/hyseim/vs/services/path/node/nodePathService';
import { INodePathService } from 'vs/hyseim/vs/services/path/common/type';
import { registerMainSingleton } from 'vs/hyseim/vs/platform/instantiation/common/mainExtensions';

registerMainSingleton(INodePathService, NodePathService);
