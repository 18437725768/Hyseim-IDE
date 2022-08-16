import { FpioaEditorAction } from 'vs/hyseim/vs/workbench/fpioaConfig/electron-browser/fpioaActions';
import { FpioaEditorInput } from 'vs/hyseim/vs/workbench/fpioaConfig/electron-browser/fpioaEditorInput';
import { FpioaEditor } from 'vs/hyseim/vs/workbench/fpioaConfig/electron-browser/editor/fpioaEditor';
import 'vs/hyseim/vs/workbench/fpioaConfig/node/fpioaService';
import { registerExternalAction } from 'vs/hyseim/vs/workbench/actionRegistry/common/registerAction';
import { ACTION_CATEGORY_TOOLS } from 'vs/hyseim/vs/base/common/menu/tools';
import { CustomJsonRegistry } from 'vs/hyseim/vs/workbench/jsonGUIEditor/common/register';
import { FPIOA_FILE_NAME } from 'vs/hyseim/vs/base/common/constants/wellknownFiles';
import { FPIOA_EDITOR_ID, FPIOA_EDITOR_TITLE } from 'vs/hyseim/vs/workbench/fpioaConfig/common/ids';
import { Registry } from 'vs/platform/registry/common/platform';
import { Extensions as JSONExtensions, IJSONContributionRegistry } from 'vs/platform/jsonschemas/common/jsonContributionRegistry';
import { fpioaSchema, fpioaSchemaId } from 'vs/hyseim/vs/base/common/jsonSchemas/deviceManagerSchema';

CustomJsonRegistry.registerCustomEditor(
	FPIOA_EDITOR_ID,
	FPIOA_EDITOR_TITLE,
	FpioaEditor,
	FpioaEditorInput,
);

CustomJsonRegistry.registerCustomJson(FPIOA_EDITOR_ID, FPIOA_FILE_NAME, fpioaSchemaId);

registerExternalAction(ACTION_CATEGORY_TOOLS, FpioaEditorAction);

Registry.as<IJSONContributionRegistry>(JSONExtensions.JSONContribution).registerSchema(fpioaSchemaId, fpioaSchema);
