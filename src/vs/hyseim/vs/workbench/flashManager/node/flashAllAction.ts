import { Action } from 'vs/base/common/actions';
import { ACTION_ID_FLASH_MANGER_FLASH_ALL, ACTION_LABEL_FLASH_MANGER_FLASH_ALL } from 'vs/hyseim/vs/workbench/flashManager/common/type';
import { IChannelLogger, IChannelLogService } from 'vs/hyseim/vs/services/channelLogger/common/type';
import { KFLASH_CHANNEL, KFLASH_CHANNEL_TITLE } from 'vs/hyseim/vs/base/common/messages';
import { IProgress, IProgressStep, ProgressLocation, IProgressService } from 'vs/platform/progress/common/progress';
import { SubProgress } from 'vs/hyseim/vs/platform/config/common/progress';
import { parseMemoryAddress } from 'vs/hyseim/vs/platform/serialPort/flasher/common/memoryAllocationCalculator';
import { IFlashManagerService } from 'vs/hyseim/vs/workbench/flashManager/common/flashManagerService';
import { IHyseimWorkspaceService } from 'vs/hyseim/vs/services/workspace/common/type';
import { IDisposable } from 'vs/base/common/lifecycle';
import { CancellationToken, CancellationTokenSource } from 'vs/base/common/cancellation';
import * as cp from 'child_process';
import { copyFile } from 'fs';


interface IMySection {
	name: string;
	filepath: string;
	startHex: string;
	start: number;
	swapBytes: boolean;
	size: number;
}

export class FlashAllAction extends Action {
	static readonly ID = ACTION_ID_FLASH_MANGER_FLASH_ALL;
	static readonly LABEL = ACTION_LABEL_FLASH_MANGER_FLASH_ALL;
	private readonly logger: IChannelLogger;
	private model: IDisposable;

	constructor(
		id = FlashAllAction.ID, label = FlashAllAction.LABEL,
		@IChannelLogService private readonly channelLogService: IChannelLogService,
		@IFlashManagerService private readonly flashManagerService: IFlashManagerService,
		@IProgressService private readonly progressService: IProgressService,
		@IHyseimWorkspaceService private readonly hyseimWorkspaceService: IHyseimWorkspaceService,
	) {
		super(id, label);
		this.logger = channelLogService.createChannel(KFLASH_CHANNEL_TITLE, KFLASH_CHANNEL);
	}

	async real_run(path: string | any, report: IProgress<IProgressStep>, token: CancellationToken, currentFolder: string | any) {

		let rootPath = '';
		if (typeof path === 'string') {
			rootPath = path;
		} else {
			rootPath = this.hyseimWorkspaceService.requireCurrentWorkspaceFile();
		}
		const model = this.model = await this.flashManagerService.getFlashManagerModel(rootPath);

		const sections: IMySection[] = (await model.createSections()).map((item) => {
			return {
				name: item.varName,
				filepath: item.filepath,
				startHex: item.startHex,
				start: parseMemoryAddress(item.startHex),
				size: item.size,
				swapBytes: item.swapBytes,
			};
		});
		let size;
		let filepath: string = '';
		sections.forEach((item) => {
			this.logger.log(' ');
			this.logger.log('> ' + item.name + ':');
			this.logger.info('---Start Flashing    --' + this.formatDate(new Date()));
			this.logger.info(`    ${item.filepath}`);
			this.logger.info(`    ${item.size} bytes`);
			this.logger.info(`flashing ${item.name} to ${item.startHex}...`);
			size = item.size;
			filepath = item.filepath;
		});
		if (size == 0) {
			const message = 'The file is not available with 0 bytes.';
			this.logger.error(message);
			throw new Error(message);
		} else {
			copyFile(filepath, currentFolder + '/tools/jtag/flash.bin', (error) => {
				if (error) {
					this.logger.error(error.toString());
					throw new Error(error.toString());
				}
			});
			try {
				await this.execFile(currentFolder);
			} catch (e) {
				this.logger.error(e);
				throw new Error(e);
			}


		}

	}
	formatDate(datetime: any) {
		var date = new Date(datetime);
		var year = date.getFullYear();
		var month = ('0' + (date.getMonth() + 1)).slice(-2);
		var sdate = ('0' + (date.getDate())).slice(-2);
		var hour = ('0' + (date.getHours())).slice(-2);
		var minute = ('0' + (date.getMinutes())).slice(-2);
		var second = ('0' + (date.getSeconds())).slice(-2);
		var result = year + '-' + month + '-' + sdate + ' ' + hour + ':' + minute + ':' + second;
		return result;
	}

	execFile(currentFolder: string | any) {
		cp.execFile('ideflash.bat', { cwd: currentFolder + '/tools/jtag', encoding: 'utf8', shell: true } as cp.ExecFileOptions, (error, stdout, stderr) => {
			if (stdout.includes('Write flash finished!')) {
				this.logger.info('---Write flash finished!---' + this.formatDate(new Date()));
			} else if (stdout.includes('LIBUSB_ERROR_TIMEOUT')) {
				this.logger.error('Error: Trying to use configured scan chain anyway...');
				this.logger.error('Error: libusb_bulk_write error: LIBUSB_ERROR_TIMEOUT');
				this.logger.error('Error: missing data from bitq interface');
				throw new Error('Please reconnect libusb.');
			} else {
				this.logger.error(stdout);
				throw new Error(stdout);
			}
			if (error) {
				this.logger.error('Bat file execution error :' + error);
				throw new Error(error.toString());
			}

		});

	}


	async run(path: string | any): Promise<void> {
		this.channelLogService.createChannel(this.logger.id);
		const currentFolder = this.hyseimWorkspaceService.getCurrentWorkspace();
		const cancel = new CancellationTokenSource();

		await this.progressService.withProgress(
			{
				location: ProgressLocation.Notification,
				title: `Flash program`,
				total: 100,
				cancellable: true,
				source: 'kflash.js',
			},
			(report) => {
				return this.real_run(path, report, cancel.token, currentFolder);
			},
			() => {
				cancel.cancel();
			},
		).then(() => {
			this.logger.info('==================================');
			this.logger.info('await...');
			this.channelLogService.show(this.logger.id);
		}, (e) => {
			this.logger.error('==================================');
			this.logger.error('Flash failed with error: ' + e.message);
			this.channelLogService.show(this.logger.id);
		});
	}
	// flasher: FastLoader,
	async fastFlashProgress(sections: IMySection[], report: SubProgress, abortedPromise: Promise<never>) {
		report.splitWith([
			0, // greeting
			...sections.map(item => item.size),
		]);

		report.message('greeting...');

		for (const item of sections) {
			report.next();
			this.logger.log(' ');
			this.logger.log('> ' + item.name + ':');
			report.message(`flashing ${item.name} to ${item.startHex}...`);
		}

		return true;
	}
	//flasher: SerialLoader,   bootLoaderSize: number,
	async flashProgress(sections: IMySection[], report: SubProgress, abortedPromise: Promise<never>) {
		report.splitWith([
			0, // greeting
			0, // boot
			...sections.map(item => item.size),
		]);

		report.message('greeting...');
		report.next();

		report.message('flashing bootloader...');
		report.next();

		report.message('booting up bootloader...');

		for (const item of sections) {
			report.next();
			this.logger.log(' ');
			this.logger.log('> ' + item.name + ':');
			report.message(`flashing ${item.name} to ${item.startHex}...`);
		}


	}

	public dispose() {
		super.dispose();
		if (this.model) {
			this.model.dispose();
		}
	}
}
