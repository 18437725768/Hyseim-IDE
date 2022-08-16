import { localize } from 'vs/nls';
import { RawContextKey } from 'vs/platform/contextkey/common/contextkey';

export const ConfigSerialPortActionId = 'ToggleMonitorAction';

export const SERIAL_PORT_HISTORY_STORAGE_KEY = 'storage.serial-port.history';

export const SERIAL_PANEL_ID = 'workbench.panel.hyseim.serial-port';
export const SERIAL_PANEL_OUTPUT_PANEL_ID = 'workbench.panel.hyseim.serial-port-output';

export const ACTION_ID_SERIAL_MONITOR_TOGGLE = 'workbench.action.hyseim.serial-port.toggle';
export const ACTION_LABEL_SERIAL_MONITOR_TOGGLE = localize('hyseim.serial.terminal.toggle', 'Toggle serial monitor visible');
export const SERIAL_MONITOR_ACTION_REPL_ENTER = 'serial-port.action.acceptInput';
export const SERIAL_MONITOR_ACTION_CLEAR = 'workbench.action.hyseim.serial-port.monitor.clear';
export const SERIAL_MONITOR_ACTION_COPY = 'workbench.action.hyseim.serial-port.monitor.copy';
export const SERIAL_MONITOR_ACTION_PASTE = 'workbench.action.hyseim.serial-port.monitor.paste';
export const SERIAL_MONITOR_ACTION_FOCUS_FIND_WIDGET = 'workbench.action.hyseim.serial-port.find.widget.focus';

export const CONTEXT_IN_SERIAL_PORT_REPL = new RawContextKey<boolean>('inSerialPortRepl', false);
export const CONTEXT_IN_SERIAL_PORT_OUTPUT = new RawContextKey<boolean>('inSerialPortReplOutput', false);
export const CONTEXT_SERIAL_PORT_FIND_WIDGET_INPUT_FOCUSED = new RawContextKey<boolean>('inSerialPortFindInput', false);
export const CONTEXT_SERIAL_PORT_FIND_WIDGET_FOCUSED = new RawContextKey<boolean>('inSerialPortFind', false);
export const CONTEXT_SERIAL_PORT_HAS_SELECT = new RawContextKey<boolean>('serialOutputTextSelected', undefined);

export const ACTION_ID_MONITOR_TOGGLE_LEFT = 'workbench.action.hyseim.serial-port.left-panel.open';
export const ACTION_LABEL_MONITOR_TOGGLE_LEFT = localize('hyseim.serial.terminal.toggle.left', 'Toggle device list visible');

export const ACTION_ID_MONITOR_TOGGLE_RIGHT = 'workbench.action.hyseim.serial-port.right-panel.open';
export const ACTION_LABEL_MONITOR_TOGGLE_RIGHT = localize('hyseim.serial.terminal.toggle.right', 'Toggle config visible');
