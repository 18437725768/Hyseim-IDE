import { IFpioaService } from 'vs/hyseim/vs/workbench/fpioaConfig/common/types';
import { URI } from 'vs/base/common/uri';
import { registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IBeforeBuildEvent, IMakefileService } from 'vs/hyseim/vs/services/makefileService/common/type';
import { exists } from 'vs/base/node/pfs';
import { resolvePath } from 'vs/hyseim/vs/base/common/resolvePath';
import { FPIOA_FILE_NAME, PROJECT_CONFIG_FOLDER_NAME } from 'vs/hyseim/vs/base/common/constants/wellknownFiles';
import { CMAKE_CHANNEL, CMAKE_CHANNEL_TITLE } from 'vs/hyseim/vs/workbench/cmake/common/type';
import { IChannelLogger, IChannelLogService } from 'vs/hyseim/vs/services/channelLogger/common/type';
import { FpioaModel } from 'vs/hyseim/vs/workbench/fpioaConfig/common/fpioaModel';
import { getChipPackaging } from 'vs/hyseim/vs/workbench/fpioaConfig/common/packagingRegistry';
import { INodeFileSystemService } from 'vs/hyseim/vs/services/fileSystem/common/type';
import { wrapHeaderFile } from 'vs/hyseim/vs/base/common/cpp/wrapHeaderFile';
import { CMakeProjectTypes } from 'vs/hyseim/vs/base/common/jsonSchemas/cmakeConfigSchema';
import { ICustomJsonEditorService } from 'vs/hyseim/vs/workbench/jsonGUIEditor/service/common/type';
import { IFPIOAMapData } from 'vs/hyseim/vs/base/common/jsonSchemas/deviceManagerSchema';

export class FpioaService implements IFpioaService {
	public _serviceBrand: any;

	private readonly logger: IChannelLogger;

	constructor(
		@IMakefileService makefileService: IMakefileService,
		@IChannelLogService channelLogService: IChannelLogService,
		@IInstantiationService instantiationService: IInstantiationService,
		@IEditorService editorService: IEditorService,
		@INodeFileSystemService private readonly nodeFileSystemService: INodeFileSystemService,
		@ICustomJsonEditorService private readonly customJsonEditorService: ICustomJsonEditorService,
	) {
		this.logger = channelLogService.createChannel(CMAKE_CHANNEL_TITLE, CMAKE_CHANNEL);
		makefileService.onPrepareBuild((event) => event.waitUntil(this.runIfExists(event)));
	}

	async runIfExists(event: IBeforeBuildEvent) {
		const mainProject = event.projects[0];
		if (!mainProject) {
			// this.logger.info('[FPIOA Editor] No main project.');
			return;
		}

		const allSections: string[] = [];
		for (const project of event.projects.slice().reverse()) {
			if (project.json.type === CMakeProjectTypes.library || project.json.type === CMakeProjectTypes.folder) {
				this.logger.info('[FPIOA Editor] NOT enabled for %s.', project.json.name);
				continue;
			}
			const configFile = resolvePath(project.path, PROJECT_CONFIG_FOLDER_NAME, FPIOA_FILE_NAME);
			if (await exists(configFile)) {
				const model = this.customJsonEditorService.createJsonModel<IFPIOAMapData, FpioaModel>(URI.file(configFile), FpioaModel);
				if (!model) {
					throw new Error('Cannot create model for file: ' + configFile);
				}
				await model.load();
				const sections = this.generate(model);
				if (sections.length !== 0) {
					allSections.push(...sections);
					this.logger.info('[FPIOA Editor] Enabled for %s.', project.json.name);
					continue;
				}
			}
			this.logger.info('[FPIOA Editor] NOT enabled for %s.', project.json.name);
		}

		if (allSections.length) {
			this.logger.info('write fpioa config into', resolvePath(mainProject.path, PROJECT_CONFIG_FOLDER_NAME, 'fpioa-config.*'));
			await this.nodeFileSystemService.writeFileIfChanged(
				resolvePath(mainProject.path, PROJECT_CONFIG_FOLDER_NAME, 'fpioa-config.h'),
				this.createHeader(),
			);
			await this.nodeFileSystemService.writeFileIfChanged(
				resolvePath(mainProject.path, PROJECT_CONFIG_FOLDER_NAME, 'fpioa-config.c'),
				this.createSource(allSections),
			);

			event.registerGlobalExtraSource(['fpioa-config.c']);
			event.registerGlobalConstructor('ide_config_fpioa', 'fpioa-config.h');
		} else {
			await this.nodeFileSystemService.deleteFileIfExists(
				resolvePath(mainProject.path, PROJECT_CONFIG_FOLDER_NAME, 'fpioa-config.h'),
			);
			await this.nodeFileSystemService.deleteFileIfExists(
				resolvePath(mainProject.path, PROJECT_CONFIG_FOLDER_NAME, 'fpioa-config.c'),
			);
		}
	}

	private generate(model: FpioaModel): string[] {
		if (!model.currentChip) {
			return [];
		}

		const ret = getChipPackaging(model.currentChip);
		if (!ret) {
			throw new Error('Unknown chip type: ' + model.currentChip);
		}

		const { generator, geometry } = ret;
		const generatedConfigSections: string[] = [];
		for (const [funcId, pinLoc] of Object.entries(model.getPinMap())) {
			if (funcId !== undefined) {
				generatedConfigSections.push(`ret += ${generator.setterFuncName}(${geometry.IOPinPlacement[pinLoc]}, ${generator.funcNamePrefix}${funcId});`);
			}
		}

		return generatedConfigSections;
	}

	private createHeader() {
		return wrapHeaderFile(`int ide_config_fpioa();`, 'IDE_FPIOA');
	}

	private createSource(allSections: string[]) {
		// language=TEXT
		return `#include <fpioa.h>
#include "fpioa-config.h"

int ide_config_fpioa() {
int ret = 0;

${allSections.join('\n')}

return ret;
}
`;
	}
}

registerSingleton(IFpioaService, FpioaService);
