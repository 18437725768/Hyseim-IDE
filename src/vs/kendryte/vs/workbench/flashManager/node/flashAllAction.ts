import { Action } from 'vs/base/common/actions';
import { ACTION_ID_FLASH_MANGER_FLASH_ALL, ACTION_LABEL_FLASH_MANGER_FLASH_ALL } from 'vs/kendryte/vs/workbench/flashManager/common/type';
import { IChannelLogger, IChannelLogService } from 'vs/kendryte/vs/services/channelLogger/common/type';
import { KFLASH_CHANNEL, KFLASH_CHANNEL_TITLE } from 'vs/kendryte/vs/base/common/messages';
import { IProgress, IProgressStep, ProgressLocation, IProgressService } from 'vs/platform/progress/common/progress';
import { SubProgress } from 'vs/kendryte/vs/platform/config/common/progress';
import { parseMemoryAddress } from 'vs/kendryte/vs/platform/serialPort/flasher/common/memoryAllocationCalculator';
import { IFlashManagerService } from 'vs/kendryte/vs/workbench/flashManager/common/flashManagerService';
import { IKendryteWorkspaceService } from 'vs/kendryte/vs/services/workspace/common/type';
import { IDisposable } from 'vs/base/common/lifecycle';
import { CancellationToken, CancellationTokenSource } from 'vs/base/common/cancellation';
import * as cp from 'child_process';
import { copyFile } from 'fs';
//获取用户安装路径
// import { INodePathService } from 'vs/kendryte/vs/services/path/common/type';


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
		@IKendryteWorkspaceService private readonly kendryteWorkspaceService: IKendryteWorkspaceService,
		// @INodePathService private readonly nodePathService: INodePathService
	) {
		super(id, label);
		this.logger = channelLogService.createChannel(KFLASH_CHANNEL_TITLE, KFLASH_CHANNEL);
	}

	async real_run(path: string | any, report: IProgress<IProgressStep>, token: CancellationToken, currentFolder: string | any) {

		let rootPath = '';
		if (typeof path === 'string') {
			rootPath = path;
		} else {
			rootPath = this.kendryteWorkspaceService.requireCurrentWorkspaceFile();
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

		sections.forEach((item) => {
			this.logger.log(' ');
			this.logger.log('> ' + item.name + ':');
			this.logger.info(`    ${item.filepath}`);
			this.logger.info(`flashing ${item.name} to ${item.startHex}...`);
			copyFile(item.filepath, currentFolder + '/tools/jtag/flash.bin', (error) => {
				if (error) {
					this.logger.log(error.toString());
				}
			})

		});


	}

	async run(path: string | any): Promise<void> {
		this.channelLogService.createChannel(this.logger.id);
		// const currentFolder = this.nodePathService.getSelfControllingRoot();
		const currentFolder = this.kendryteWorkspaceService.getCurrentWorkspace();
		function formatDate(datetime: any) {
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
			this.logger.info('---Start Flashing    --' + formatDate(new Date()));
			this.logger.info('==================================');
			this.logger.info('await...');
			this.channelLogService.show(this.logger.id);
		}, (e) => {
			this.logger.error('==================================');
			this.logger.error('Flash failed with error: ' + e);
			this.channelLogService.show(this.logger.id);
		});


		cp.execFile('ideflash.bat', { cwd: currentFolder + '/tools/jtag', encoding: 'utf8', shell: true } as cp.ExecFileOptions, (error, stdout, stderr) => {
			if (error) {
				this.logger.info('Bat file execution error' + error);
				return;
			}
			if (stdout.includes('Write flash finished!')) {
				this.logger.info('---Write flash finished!---' + formatDate(new Date()));
			} else {
				this.logger.log(stdout);
			}
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
