import React, { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import {MultiSelect, Select, Alert} from '@inkjs/ui';
import { findGroup, retrieveGroups } from '../utils/groups.js'
import type { Group, Symlink } from '../db.json.js';
import { WIDTH } from '../utils/constants.js';
import { exit } from 'process';
import { useDockerCommands } from '../hook/useDockerCommands.js';
import Instructions from '../components/Instructions.js';

export default function Down() {
	const [group, setGroup] = useState<Group>()
	const [groups, setGroups] = useState<Group[]>([])
	const [symlinks, setSymlinks] = useState<Symlink[]>([])
	const { status, startExecution, containers } = useDockerCommands(symlinks, ['compose', 'down']);

	useInput((input, key) => {
		if (input === 'q') exit()
		if (key.delete && group && groups.length > 1) {
			setGroup(undefined)
		}
	});

	useEffect(() => {
		retrieveGroups().then((items) => {
			setGroups(items)
			if (items.length === 1) setGroup(items[0])
		})
	}, [])

	useEffect(() => {
		if (status === 'completed') exit()
	}, [status])

	useEffect(() => {
		if (!symlinks.length) return
		startExecution();
	}, [symlinks])

	return (
		<Box width={WIDTH} flexDirection="column">
			{ status === 'running' && <Alert variant="warning">Running</Alert> }
			{ status === 'error' && <Alert variant="error">Ops, error</Alert> }
			{ status === 'stopped' && <Alert variant="info">Select the symlinks to down</Alert> }
			{ status === 'completed' && <Alert variant="success">Sucessfull</Alert> }

			<Box borderStyle="round" borderColor="gray" flexDirection="column">
				{
					status === 'stopped' ? (
						<Box>
							{
								group ? group.files.length ? (
									<MultiSelect
										options={group.files.map(file => ({ label: file.label, value: file.path }))}
										onSubmit={(paths) => {
											const allSymlinks = group.files.filter(file => paths.includes(file.path))
											setSymlinks(allSymlinks)
										}}
									/>
								) : <Box marginY={1} paddingX={2}><Text color="gray">Empty links</Text></Box> : (
									<Select
										options={groups.map(({ name }) => ({ label: name, value: name }))}
										onChange={(name) => {
											findGroup(name).then(setGroup)
										}}
									/>
								)
							}
						</Box>
					) : (
						<Box paddingLeft={2} marginY={1}>
							<Text backgroundColor="black">{ JSON.stringify(containers, null, 2) }</Text>
						</Box>
					)
				}
			</Box>

			{ status === 'stopped' && <Instructions group={group} groups={groups} /> }
		</Box>
	);
}
