import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import { PROJECT_DIR } from './utils/symbolLinks.js'

export type Symlink = {
	id: string;
	path: string;
	label: string;
	order: number;
	originalPath?: string;
}

export type Group = {
	name: string;
	files: Symlink[];
}

type Data = {
  groups: Group[];
}

const defaultData: Data = { groups: [] }
const adapter = new JSONFile<Data>(path.join(PROJECT_DIR, 'db.json'))

export const db = new Low<Data>(adapter, defaultData)
