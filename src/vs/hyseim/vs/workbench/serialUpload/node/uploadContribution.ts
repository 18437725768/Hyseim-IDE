import { MaixSerialBuildUploadAction, MaixSerialUploadAction } from 'vs/hyseim/vs/workbench/serialUpload/node/uploadAction';
import { registerExternalAction } from 'vs/hyseim/vs/workbench/actionRegistry/common/registerAction';
import { ACTION_CATEGORY_SERIAL_PORT } from 'vs/hyseim/vs/base/common/menu/serialPort';
import { MaixSerialRebootAction, MaixSerialRebootISPAction } from 'vs/hyseim/vs/workbench/serialUpload/node/rebootAction';
import { MaixSerialSelectDefaultAction } from 'vs/hyseim/vs/workbench/serialUpload/node/selectDefaultAction';

registerExternalAction(ACTION_CATEGORY_SERIAL_PORT, MaixSerialUploadAction);
registerExternalAction(ACTION_CATEGORY_SERIAL_PORT, MaixSerialBuildUploadAction);

registerExternalAction(ACTION_CATEGORY_SERIAL_PORT, MaixSerialRebootAction);
registerExternalAction(ACTION_CATEGORY_SERIAL_PORT, MaixSerialRebootISPAction);
registerExternalAction(ACTION_CATEGORY_SERIAL_PORT, MaixSerialSelectDefaultAction);
