import React, { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import {UnorderedList, MultiSelect, Select, OrderedList, Alert, ConfirmInput} from '@inkjs/ui';
import { findGroup, retrieveGroups } from '../utils/groups.js'
import type { Group } from '../db.json.js';
import { WIDTH } from '../utils/constants.js';
import { exit } from 'process';
import { unlinkPathsFromGroup } from '../utils/symbolLinks.js';

export default function Unlink() {
	const [group, setGroup] = useState<Group>()
	const [groups, setGroups] = useState<Group[]>([])
	const [symlinks, setSymlinks] = useState<string[]>([])
	const [canDelete, setAskDeletion] = useState<boolean>(false)
	const [success, setSuccess] = useState<boolean>(false)

	useInput((input, key) => {
		if (input === 'q') exit()
		if (key.delete) {
			if (canDelete) setAskDeletion(false)
			else if (group) setGroup(undefined)
		}
	});

	useEffect(() => {
		retrieveGroups().then((items) => {
			setGroups(items)
			if (items.length === 1) setGroup(items[0])
		})
	}, [])

	useEffect(() => {
		if (success) exit()
	}, [success])

	useEffect(() => {
		if (!symlinks.length) return
		setAskDeletion(true)
	}, [symlinks])

	if (success) return (
		<Box width={WIDTH} flexDirection="column">
			<Alert variant="success">Unlinked successful</Alert>
		</Box>
	)

	if (canDelete) return (
		<Box width={WIDTH} flexDirection="column">
			<Alert variant="warning">
				Are you sure you want to delete these links?
				(<ConfirmInput
						onConfirm={async () => {
							if (group) await unlinkPathsFromGroup(group, symlinks)
							setSuccess(true)
						}}
						onCancel={() => exit()}/>)
			</Alert>
			<Box borderStyle="round" borderColor="gray" flexDirection="column" paddingX={2}>
				{ group?.files.filter(file => symlinks.includes(file.path)).map((file, fileIndex) => <Text key={fileIndex} wrap="truncate" color="yellow">{ file.label }</Text>) }
			</Box>
		</Box>
	)

	return (
		<Box width={WIDTH} flexDirection="column">
			<UnorderedList>
				<Alert variant="info">Select the symlinks to delete</Alert>

				<Box borderStyle="round" borderColor="gray" flexDirection="column">
					{
						group && (
							<OrderedList.Item>
								<Text bold color="cyan">{ group.name }</Text>
							</OrderedList.Item>
						)
					}

					<Box paddingLeft={group ? 2 : 0}>
						{
							group ? (
								<MultiSelect
									options={group.files.map(file => ({ label: file.label, value: file.path }))}
									onSubmit={setSymlinks}
								/>
							) : (
								<Select
									options={groups.map(({ name }) => ({ label: name, value: name }))}
									onChange={(name) => {
										findGroup(name).then(setGroup)
									}}
								/>
							)
						}
					</Box>
				</Box>

				<Box paddingX={2} flexDirection="column">
						{ Boolean(group) && <Text color="grey">⌫ (Backspace) to go back</Text> }
						{ Boolean(group && group.files.length) && (
							<>
								<Text color="grey">Use ↑/↓ to navigate</Text>
								<Text color="grey">Space to select</Text>
								<Text color="grey">⏎ (Enter) to confirm.</Text>
							</>
						) }
						{ !group && (
							<>
								<Text color="grey">⏎ (Enter) to join.</Text>
								<Text color="grey">Use ↑/↓ to navigate</Text>
							</>
						) }
					</Box>
			</UnorderedList>
		</Box>
	);
}
