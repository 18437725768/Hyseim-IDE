import product from 'vs/platform/product/common/product';
import { symlink, unlink } from 'vs/base/node/pfs';
import { lstatExists } from 'vs/hyseim/vs/base/node/extrafs';

export async function createMacApplicationsLink(installPath: string): Promise<void> {
	const linkFile = `/Applications/${product.nameLong}.app`;
	const target = `${installPath}/Updater.app`;

	if (await lstatExists(linkFile)) {
		await unlink(linkFile);
	}

	await symlink(target, linkFile);
}
