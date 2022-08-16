import { FileCompressService, IFileCompressService } from 'vs/hyseim/vs/services/fileCompress/node/fileCompressService';
import { registerMainSingleton } from 'vs/hyseim/vs/platform/instantiation/common/mainExtensions';

registerMainSingleton(IFileCompressService, FileCompressService);
