import { registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { FileCompressService, IFileCompressService } from 'vs/hyseim/vs/services/fileCompress/node/fileCompressService';

registerSingleton(IFileCompressService, FileCompressService);
