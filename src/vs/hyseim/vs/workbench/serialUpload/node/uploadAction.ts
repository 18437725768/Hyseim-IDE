import { Action } from 'vs/base/common/actions';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { KFLASH_CHANNEL, KFLASH_CHANNEL_TITLE } from 'vs/hyseim/vs/base/common/messages';
import { ICMakeService } from 'vs/hyseim/vs/workbench/cmake/common/type';
import { exists, lstat } from 'vs/base/node/pfs';
import { IProgress, IProgressService, IProgressStep, ProgressLocation } from 'vs/platform/progress/common/progress';
import { SubProgress } from 'vs/hyseim/vs/platform/config/common/progress';
import { resolvePath } from 'vs/hyseim/vs/base/common/resolvePath';
import { IChannelLogger, IChannelLogService } from 'vs/hyseim/vs/services/channelLogger/common/type';
import { ACTION_ID_MAIX_CMAKE_BUILD } from 'vs/hyseim/vs/base/common/menu/cmake';
import {
	ACTION_ID_MAIX_SERIAL_BUILD_UPLOAD,
	ACTION_ID_MAIX_SERIAL_UPLOAD,
	ACTION_LABEL_MAIX_SERIAL_BUILD_UPLOAD,
	ACTION_LABEL_MAIX_SERIAL_UPLOAD,
} from 'vs/hyseim/vs/base/common/menu/serialPort';
import { createRunDisposeAction } from 'vs/hyseim/vs/workbench/actionRegistry/common/registerAction';
import { CancellationToken, CancellationTokenSource } from 'vs/base/common/cancellation';
import { FastLoader } from 'vs/hyseim/vs/platform/serialPort/fastFlasher/node/fastLoader';
import { createReadStream, copyFile } from 'fs';
import { IHyseimWorkspaceService } from 'vs/hyseim/vs/services/workspace/common/type';
import { disposableStream } from 'vs/hyseim/vs/base/node/disposableStream';
import * as cp from 'child_process';
export class MaixSerialUploadAction extends Action {
	public static readonly ID = ACTION_ID_MAIX_SERIAL_UPLOAD;
	public static readonly LABEL = ACTION_LABEL_MAIX_SERIAL_UPLOAD;

	private readonly logger: IChannelLogger;

	constructor(
		id: string = MaixSerialUploadAction.ID, label: string = MaixSerialUploadAction.LABEL,
		@ICMakeService private cMakeService: ICMakeService,
		@IProgressService private progressService: IProgressService,
		@IChannelLogService private channelLogService: IChannelLogService,
		@IHyseimWorkspaceService private readonly hyseimWorkspaceService: IHyseimWorkspaceService,

	) {
		super(id, label);
		this.logger = channelLogService.createChannel(KFLASH_CHANNEL_TITLE, KFLASH_CHANNEL);
	}

	public dispose(): void {
		super.dispose();
		this.logger.debug('disposed');
	}

	async run(): Promise<void> {
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
				return this.real_run(report, cancel.token, currentFolder);
			},
			() => {
				debugger;
				cancel.cancel();
			},
		).then(() => {
			this.logger.info('==================================');
			this.logger.info('await...');
			this.channelLogService.show(this.logger.id);
		}, (e) => {
			this.logger.error('==================================');
			this.logger.error('Flash failed with error: ' + e.message + '\n\n');
			this.channelLogService.show(this.logger.id).catch();
		});


	}
	execFile(currentFolder: string | any) {
		cp.execFile('ideflash.bat', { cwd: currentFolder + '/tools/jtag', encoding: 'utf8', shell: true } as cp.ExecFileOptions, (error, stdout, stderr) => {
			this.channelLogService.show(this.logger.id);
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
			}

		});
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

	async real_run(report: IProgress<IProgressStep>, token: CancellationToken, currentFolder: string | any) {
		await this.cMakeService.ensureConfiguration();
		this.logger.log(' ');
		this.logger.info('---Start Flashing    --' + this.formatDate(new Date()));
		const app = resolvePath(await this.cMakeService.getOutputFile());
		this.logger.info(`\t${app}`);

		if (!await exists(app)) {
			const message = 'Application has not compiled.';
			this.logger.error(message);
			throw new Error(message);
		}

		this.logger.info(`\t${(await lstat(app)).size} bytes`);
		if ((await lstat(app)).size == 0) {
			const message = 'The file is not available with 0 bytes.';
			this.logger.error(message);
			throw new Error(message);

		} else {
			copyFile(app, currentFolder + '/tools/jtag/flash.bin', (error) => {
				if (error) {
					this.logger.log(error.toString());
				}
			});
			await this.execFile(currentFolder);
		}


	}


	async fastFlashProgress(flasher: FastLoader, filepath: string, report: SubProgress) {
		const appLength = (await lstat(filepath)).size;
		report.splitWith([
			0, // greeting
			appLength,
		]);

		report.message('greeting...');
		const ok: boolean = await flasher.rebootISPMode();
		if (!ok) {
			return false;
		}

		const appReadStream = this._register(disposableStream(createReadStream(filepath)));

		report.message(`flashing program to 0...`);

		return flasher.flashProgram(
			appReadStream,
			appLength,
			report,
		).then(() => {
			return true;
		}, () => {
			return false;
		});
	}

}

export class MaixSerialBuildUploadAction extends Action {
	public static readonly ID = ACTION_ID_MAIX_SERIAL_BUILD_UPLOAD;
	public static readonly LABEL = ACTION_LABEL_MAIX_SERIAL_BUILD_UPLOAD;

	constructor(
		id: string = MaixSerialUploadAction.ID, label: string = MaixSerialUploadAction.LABEL,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
	) {
		super(id, label);
	}

	async run() {
		await createRunDisposeAction(this.instantiationService, ACTION_ID_MAIX_CMAKE_BUILD, [false]);
		await createRunDisposeAction(this.instantiationService, ACTION_ID_MAIX_SERIAL_UPLOAD);
	}
}
