import { registerExternalAction, registerInternalAction } from 'vs/hyseim/vs/workbench/actionRegistry/common/registerAction';
import { OpenPackagesMarketPlaceAction } from 'vs/hyseim/vs/workbench/packageManager/browser/actions/openPackagesMarketPlaceAction';
import { DisplayPackageDetailAction } from 'vs/hyseim/vs/workbench/packageManager/browser/actions/displayPackageDetailAction';
import { InstallEveryDependencyAction } from 'vs/hyseim/vs/workbench/packageManager/browser/actions/installDependencyAction';
import { ACTION_CATEGORY_PACKAGE_MANAGER } from 'vs/hyseim/vs/base/common/menu/packageManager';

registerInternalAction(ACTION_CATEGORY_PACKAGE_MANAGER, DisplayPackageDetailAction);
registerExternalAction(ACTION_CATEGORY_PACKAGE_MANAGER, OpenPackagesMarketPlaceAction);
registerExternalAction(ACTION_CATEGORY_PACKAGE_MANAGER, InstallEveryDependencyAction);
