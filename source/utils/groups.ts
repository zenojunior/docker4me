import fs from 'fs/promises'
import { db, type Group } from '../db.json.js'
import { PROJECT_DIR, removeSymbolicLinks } from './symbolLinks.js'

export async function addNewGroup(name: string) {
	await createDirectoryIfNonExistent(PROJECT_DIR)

	await db.read()
	const exist = await isGroupExisting(name)
	if (exist) throw new Error('Group already exists')

	const newGroup = { name, files: [] }
	db.data.groups.push(newGroup)
	await db.write()
	return newGroup
}

export async function createDirectoryIfNonExistent(projectDir: string) {
	try {
    await fs.stat(projectDir);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      try {
        await fs.mkdir(projectDir);
      } catch (err) {
				process.exit();
      }
    }
  }
}

export async function removeGroup(name: string) {
	if (!await isGroupExisting(name)) throw new Error('Group does not exist')

	await db.read()
	const group = db.data.groups.find(group => group.name === name)
	if (group) {
		await removeSymbolicLinks(group.files.map(link => link.path))
		db.data.groups = db.data.groups.filter(group => group.name !== name)
		await db.write()
	}
}

export async function isGroupExisting(name: string) {
	await db.read()
	return db.data.groups.some(group => group.name === name)
}

export async function findGroup(name: string): Promise<Group | undefined> {
	await db.read()
	return db.data.groups.find(group => group.name === name)
}

export async function retrieveGroups(): Promise<Group[]> {
	await db.read()
	const groups = db.data.groups

	for (let group of groups) {
		group.files = await Promise.all(group.files.map(async file => {
			const originalPath = await fs.readlink(file.path);
			return {...file, originalPath };
		}));
	}

	return groups;
}
