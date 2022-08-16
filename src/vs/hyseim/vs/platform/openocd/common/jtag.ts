import { CONFIG_CATEGORY, CONFIG_DESCRIPTION_JTAG_ID, CONFIG_DESCRIPTION_JTAG_SPEED, CONFIG_KEY_JTAG_ID, CONFIG_KEY_JTAG_SPEED } from 'vs/hyseim/vs/base/common/configKeys';
import { registerConfiguration } from 'vs/hyseim/vs/platform/config/common/registry';

export interface JTagConfigExtra {
	speed: number;
	serialNumber: number;
}

const defaultValue: JTagConfigExtra = {
	speed: 30000,
	serialNumber: 0,
};

registerConfiguration({
	id: 'jtag',
	category: CONFIG_CATEGORY.DEBUG_JTAG.id,
	properties: {
		[CONFIG_KEY_JTAG_ID]: {
			description: CONFIG_DESCRIPTION_JTAG_ID,
			type: 'number',
			default: defaultValue.serialNumber,
			minimum: 0,
		},
		[CONFIG_KEY_JTAG_SPEED]: {
			description: CONFIG_DESCRIPTION_JTAG_SPEED,
			type: 'number',
			default: defaultValue.speed,
			minimum: 1,
		},
	},
});

// export async function createDefaultJTagConfig(port: number, options: JTagConfigExtra) {
// 	return `# debug adapter
// interface jlink
// ${options.serialNumber > 0 ? '' : '# '}jlink serial ${options.serialNumber}
// transport select jtag
// adapter_khz ${options.speed}
// gdb_port ${port}
// tcl_port ${port + 1}
// telnet_port ${port + 2}
// set _CHIPNAME riscv
// jtag newtap $_CHIPNAME cpu -irlen 5 -expected-id 0x04e4796b
// set _TARGETNAME $_CHIPNAME.cpu
// target create $_TARGETNAME riscv -chain-position $_TARGETNAME
// init
// halt
// `.trim() + '\n';
// }

export async function createDefaultJTagConfig(port: number, options: JTagConfigExtra) {
	return `# Example OpenOCD configuration file for im100 connected via builtin USB-JTAG adapter.
	#
	# For example, OpenOCD can be started for im100 debugging on
	#
	#   openocd -f ./jtag/im100-builtin.cfg
	#

	#
	# builtin USB-JTAG adapter
	#

	adapter driver im100_usb_jtag

	im100usbjtag vid_pid 0x303a 0x1001
	im100usbjtag caps_descriptor 0x2000

	#max speed
	adapter speed 40000


	transport select jtag
	reset_config none

	adapter speed  200
	adapter srst delay 100

	set _CHIPNAME riscv

	jtag newtap $_CHIPNAME unknown0 -irlen 5 -expected-id 0x10102001
	jtag newtap $_CHIPNAME cpu -irlen 5 -expected-id 0x249511C3

	echo "Newtap done."

	set _TARGETNAME $_CHIPNAME.cpu
	target create $_TARGETNAME riscv -chain-position $_TARGETNAME -coreid 0x3e0

	gdb_report_data_abort enable
	gdb_report_register_access_error enable

	riscv set_reset_timeout_sec 120
	riscv set_command_timeout_sec 120

	# prefer to use sba for system bus access
	riscv set_prefer_sba on
	echo "Start to scan chain."
	# dump jtag chain
	scan_chain

	init
	halt
	echo "Ready for Remote Connections."
`.trim() + '\n';
}
