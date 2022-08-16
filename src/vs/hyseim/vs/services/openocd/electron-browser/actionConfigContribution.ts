import { registerExternalAction } from 'vs/hyseim/vs/workbench/actionRegistry/common/registerAction';
import { ACTION_CATEGORY_JTAG, ACTION_CATEGORY_OPENOCD } from 'vs/hyseim/vs/base/common/menu/openocd';
import { OpenOCDRestartAction, OpenOCDStartAction, OpenOCDStopAction } from 'vs/hyseim/vs/services/openocd/electron-browser/actions/openocdStartStopAction';
import { InstallJTagDriverAction, InstallJTagOfficialDriverAction } from 'vs/hyseim/vs/services/openocd/electron-browser/actions/jtagBase';
import { DetectJTagIdAction } from 'vs/hyseim/vs/services/openocd/electron-browser/actions/jtagFindId';
import { isWindows } from 'vs/base/common/platform';

registerExternalAction(ACTION_CATEGORY_JTAG, DetectJTagIdAction);
registerExternalAction(ACTION_CATEGORY_JTAG, InstallJTagDriverAction);
if (isWindows) {
	registerExternalAction(ACTION_CATEGORY_JTAG, InstallJTagOfficialDriverAction);
}

registerExternalAction(ACTION_CATEGORY_OPENOCD, OpenOCDStartAction);
registerExternalAction(ACTION_CATEGORY_OPENOCD, OpenOCDStopAction);
registerExternalAction(ACTION_CATEGORY_OPENOCD, OpenOCDRestartAction);
