import { registerExternalAction } from 'vs/hyseim/vs/workbench/actionRegistry/common/registerAction';
import { CreateReportAction } from 'vs/hyseim/vs/code/electron-browser/updater/actions/createReportAction';
import { ACTION_CATEGORY_TOOLS } from 'vs/hyseim/vs/base/common/menu/tools';
import { QuitUpdateAction } from 'vs/hyseim/vs/code/electron-browser/updater/actions/quitUpdateAction';
import { RebootAction } from 'vs/hyseim/vs/code/electron-browser/updater/actions/rebootAction';

registerExternalAction(ACTION_CATEGORY_TOOLS, CreateReportAction);
registerExternalAction(ACTION_CATEGORY_TOOLS, QuitUpdateAction);
registerExternalAction(ACTION_CATEGORY_TOOLS, RebootAction);
