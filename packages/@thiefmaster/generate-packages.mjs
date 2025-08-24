import * as fs from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format } from 'node:util';

const CUSTOM_PACKAGES_ROOT = resolve(fileURLToPath(import.meta.url), '..');
const REPO_ROOT = resolve(CUSTOM_PACKAGES_ROOT, '../..');

function getName(platform, arch, prefix = 'biome-cli') {
	return format(`${prefix}-${platform}`, arch);
}

function copyBinaryToNativePackage(platform, arch) {
	const os = platform.split('-')[0];
	const buildName = getName(platform, arch);
	const packageRoot = resolve(CUSTOM_PACKAGES_ROOT, buildName);
	const packageName = `@thiefmaster/${buildName}`;

	// Copy the CLI binary
	const binarySource = resolve(
		REPO_ROOT,
		getName(platform, arch, 'biome'),
	);
	const binaryTarget = resolve(packageRoot, 'biome');

	if (!fs.existsSync(binarySource)) {
		console.error(
			`Source for binary for ${buildName} not found at: ${binarySource}`,
		);
		process.exit(1);
	}

	console.info(`Copy binary ${binaryTarget}`);
	fs.copyFileSync(binarySource, binaryTarget);
	fs.chmodSync(binaryTarget, 0o755);
}

const PLATFORMS = ['darwin-%s', 'linux-%s'];
const ARCHITECTURES = ['x64', 'arm64'];

for (const platform of PLATFORMS) {
	for (const arch of ARCHITECTURES) {
		copyBinaryToNativePackage(platform, arch);
	}
}
