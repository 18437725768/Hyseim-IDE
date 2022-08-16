//// included by "vs/workbench/workbench.main.ts"

// json editors base
import 'vs/hyseim/vs/workbench/jsonGUIEditor/service/electron-browser/contribution';
import 'vs/hyseim/vs/workbench/jsonGUIEditor/common/contribution';
// Settings support
import 'vs/hyseim/vs/workbench/config/browser/categoryContribution';
import 'vs/hyseim/vs/workbench/config/electron-browser/pathSettingsContribution';
import 'vs/hyseim/vs/workbench/config/common/flashSettingsContribution';
import 'vs/hyseim/vs/workbench/config/browser/internalSettingsCategoryContribution';
import 'vs/hyseim/vs/platform/config/common/registry';
// Settings Content
import 'vs/hyseim/vs/workbench/cmake/common/configFile';
import 'vs/hyseim/vs/workbench/serialMonitor/common/configContribution';
import 'vs/hyseim/vs/workbench/serialUpload/common/configContribution';
import 'vs/hyseim/vs/platform/openocd/common/openocd';
import 'vs/hyseim/vs/platform/openocd/common/jtag';
import 'vs/hyseim/vs/platform/openocd/common/ftdi';
import 'vs/hyseim/vs/platform/openocd/common/custom';
// ipc channel (client)
import 'vs/hyseim/vs/services/ipc/browser/ipcChannelWorkbench';
// Logger
import 'vs/hyseim/vs/services/channelLogger/electron-browser/service';
// Misc Services
import 'vs/hyseim/vs/services/github/node/githubServiceContribution';
import 'vs/hyseim/vs/services/path/electron-browser/contribution';
import 'vs/hyseim/vs/services/fileCompress/electron-browser/contribution';
import 'vs/hyseim/vs/services/fileSystem/node/nodeFileSystemService';
import 'vs/hyseim/vs/services/workspace/electron-browser/contribution';
import 'vs/hyseim/vs/services/download/node/nodeRequestService'; // network request
import 'vs/hyseim/vs/services/download/electron-browser/nodeDownloadService'; // download
import 'vs/hyseim/vs/services/download/electron-browser/downloadWithProgressService'; // download
import 'vs/hyseim/vs/platform/vscode/electron-browser/relaunchRenderService';
// IO Config
import 'vs/hyseim/vs/workbench/fpioaConfig/electron-browser/fpioaContribution';
import 'vs/hyseim/vs/workbench/fpioaConfig/common/packagings/includeAllContribution';
// flash manager
import 'vs/hyseim/vs/workbench/flashManager/electron-browser/flashManagerContribution';
// Serial Devices
import 'vs/hyseim/vs/services/serialPort/node/serialPortService';
import 'vs/hyseim/vs/services/serialPort/common/configContribution';
import 'vs/hyseim/vs/services/serialPort/common/reloadAction';
// Serial Upload
import 'vs/hyseim/vs/workbench/serialUpload/node/uploadContribution';
// Serial Monitor
import 'vs/hyseim/vs/workbench/serialMonitor/electron-browser/serialMonitorPanel';
import 'vs/hyseim/vs/workbench/serialMonitor/common/toggleSerialMonitorAction';
import 'vs/hyseim/vs/workbench/serialMonitor/electron-browser/actions/register';
//build
import 'vs/hyseim/vs/workbench/topMenu/electron-browser/buildMenuContribution';
// app top menus
import 'vs/hyseim/vs/workbench/topMenu/electron-browser/hyseimMenuContribution';
import 'vs/hyseim/vs/workbench/topMenu/node/shortcutsContribution';
// cmake
import 'vs/hyseim/vs/workbench/cmake/electron-browser/cmakeContribution';
import 'vs/hyseim/vs/services/makefileService/node/contribution';
// bottom buttons
import 'vs/hyseim/vs/workbench/bottomBar/electron-browser/statusBarContribution';
import 'vs/hyseim/vs/workbench/bottomBar/common/hyseimButtonContribution';
// Package Manager
import 'vs/hyseim/vs/workbench/packageManager/browser/actionsContribution';
import 'vs/hyseim/vs/workbench/packageManager/electron-browser/mainPanelContribution';
// hyseim-package-json editor
import 'vs/hyseim/vs/workbench/hyseimPackageJsonEditor/electron-browser/hyseimJsonContribution';
// OpenOCD
import 'vs/hyseim/vs/services/openocd/electron-browser/actionConfigContribution';
import 'vs/hyseim/vs/services/openocd/electron-browser/openOCDService';
// sudo
import 'vs/hyseim/vs/platform/sudo/electron-browser/register';
// updater
import 'vs/hyseim/vs/code/electron-browser/updater/register';
// bootstrap
import 'vs/hyseim/vs/workbench/bootstrap/electron-browser/hyseimBootstrap';
// open actions
import 'vs/hyseim/vs/platform/open/electron-browser/register';
// file dialog
import 'vs/hyseim/vs/platform/fileDialog/common/configContribution';
// super flash
import 'vs/hyseim/vs/services/makefileService/superFlash/node/configContribution'
import 'vs/hyseim/vs/services/makefileService/superFlash/node/superFlashHookContribution'
