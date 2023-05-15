import os from 'os';
import fs from 'fs/promises'
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Group, db } from '../db.json.js';
import { FILE, HIDDEN_FOLDER } from '../utils/constants.js';

export const PROJECT_DIR = path.join(os.homedir(), HIDDEN_FOLDER);

export async function createLinkToCurrentPath(group: Group) {
	if (!group) throw new Error('Group not found');

	const currentDir = process.cwd();
	const dockerComposeFilePath = path.join(currentDir, FILE);

	const id = uuidv4()
	const groupIndex = db.data.groups.findIndex(item => item.name === group.name)
	const symLinkPath = path.join(PROJECT_DIR, id);
	const label = extractLastFolderName(dockerComposeFilePath)
	const doesLinkExist = db.data.groups[groupIndex]?.files.some(file => file.label === label)
	if (doesLinkExist) {
		throw new Error('Link already exists')
	}

	await db.read()
	db.data.groups[groupIndex]?.files.push({
		id: id,
		order: (group.files.length + 1),
		path: symLinkPath,
		label,
	})
	await db.write()

	try {
		await fs.symlink(dockerComposeFilePath, symLinkPath);
	} catch (err) {
		process.exit();
	}
}

export async function removeSymbolicLinks(symlinkPaths: string[]) {
	for (const symlinkPath of symlinkPaths) {
		try {
			await fs.rm(symlinkPath);
		} catch (err) {
		}
	}
}

export async function unlinkPathsFromGroup(group: Group, paths: string[]) {
	await db.read()
	const { groups } = db.data

	group.files = group.files.filter(file => !paths.includes(file.path))

	const groupIndex = groups.findIndex(g => g.name === group.name)
	groups[groupIndex] = group

	await removeSymbolicLinks(paths)
	await db.write()
}

export function extractLastFolderName(fullPath: string) {
	fullPath = path.normalize(fullPath).replace(/\/$/, '');
	let parts = fullPath.split(path.sep);
	let lastPart: any = parts[parts.length - 1];
	if (path.extname(lastPart) !== '') {
		return parts[parts.length - 2];
	} else {
		return lastPart;
	}
}

export async function verifyFileExists(filename: string) {
	const currentDir = process.cwd();
	const filenameDir = path.join(currentDir, filename)
	try {
		await fs.access(filenameDir);
	} catch (error) {
		throw new Error(`${filename} file does not exist in the current directory.`);
	}
}

