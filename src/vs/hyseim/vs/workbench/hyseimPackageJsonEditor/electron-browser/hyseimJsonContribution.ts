import { HyseimPackageJsonEditor } from 'vs/hyseim/vs/workbench/hyseimPackageJsonEditor/electron-browser/hyseimPackageJsonEditor';
import { HyseimPackageJsonEditorInput } from 'vs/hyseim/vs/workbench/hyseimPackageJsonEditor/electron-browser/hyseimPackageJsonEditorInput';
import { registerExternalAction } from 'vs/hyseim/vs/workbench/actionRegistry/common/registerAction';
import { OpenPackageJsonEditorAction } from 'vs/hyseim/vs/workbench/hyseimPackageJsonEditor/electron-browser/openPackageJsonEditorAction';
import { ACTION_CATEGORY_TOOLS } from 'vs/hyseim/vs/base/common/menu/tools';
import { CMAKE_CONFIG_FILE_NAME } from 'vs/hyseim/vs/base/common/constants/wellknownFiles';
import { KENDRYTE_PACKAGE_JSON_EDITOR_ID, KENDRYTE_PACKAGE_JSON_EDITOR_TITLE } from 'vs/hyseim/vs/workbench/hyseimPackageJsonEditor/common/ids';
import { CustomJsonRegistry } from 'vs/hyseim/vs/workbench/jsonGUIEditor/common/register';
import { cmakeSchemaId } from 'vs/hyseim/vs/base/common/jsonSchemas/cmakeConfigSchema';

CustomJsonRegistry.registerCustomEditor(
	KENDRYTE_PACKAGE_JSON_EDITOR_ID,
	KENDRYTE_PACKAGE_JSON_EDITOR_TITLE,
	HyseimPackageJsonEditor,
	HyseimPackageJsonEditorInput,
);
CustomJsonRegistry.registerCustomJson(KENDRYTE_PACKAGE_JSON_EDITOR_ID, CMAKE_CONFIG_FILE_NAME, cmakeSchemaId);

registerExternalAction(ACTION_CATEGORY_TOOLS, OpenPackageJsonEditorAction);
