import { localize } from 'vs/nls';

export const ACTION_CATEGORY_BUILD_DEBUG = localize('and', '{0} and {1}', localize('build', 'Build'), localize('debug', 'Debug'));

export const ACTION_ID_SHOW_CMAKE_LOG = 'workbench.action.hyseim.show-cmake-log';
export const ACTION_LABEL_SHOW_CMAKE_LOG = localize('show.log.cmake', 'Click to show CMake log.');

export const ACTION_ID_MAIX_CMAKE_CLEANUP = 'workbench.action.hyseim.cleanup';
export const ACTION_LABEL_MAIX_CMAKE_CLEANUP = localize('cleanup', 'Cleanup');

export const ACTION_ID_MAIX_CMAKE_CONFIGURE = 'workbench.action.hyseim.configure';
export const ACTION_LABEL_MAIX_CMAKE_CONFIGURE = localize('configure', 'Configure');

export const ACTION_ID_MAIX_CMAKE_BUILD = 'workbench.action.hyseim.build';
export const ACTION_LABEL_MAIX_CMAKE_BUILD = localize('build', 'Build');

export const ACTION_ID_MAIX_CMAKE_RUN = 'workbench.action.hyseim.run';
export const ACTION_LABEL_MAIX_CMAKE_RUN = localize('run', 'Run');
export const ACTION_ID_MAIX_CMAKE_BUILD_RUN = 'workbench.action.hyseim.build-run';
export const ACTION_LABEL_MAIX_CMAKE_BUILD_RUN = localize('and', '{0} and {1}', ACTION_LABEL_MAIX_CMAKE_BUILD, ACTION_LABEL_MAIX_CMAKE_RUN);

export const ACTION_ID_MAIX_CMAKE_DEBUG = 'workbench.action.hyseim.debug';
export const ACTION_LABEL_MAIX_CMAKE_DEBUG = localize('debug', 'Debug');
export const ACTION_ID_MAIX_CMAKE_BUILD_DEBUG = 'workbench.action.hyseim.build-debug';
export const ACTION_LABEL_MAIX_CMAKE_BUILD_DEBUG = localize('and', '{0} and {1}', ACTION_LABEL_MAIX_CMAKE_BUILD, ACTION_LABEL_MAIX_CMAKE_DEBUG);

export const ACTION_LABEL_CMAKE_NO_ERROR = localize('no.error', 'CMake status OK!');
