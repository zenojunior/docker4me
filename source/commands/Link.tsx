import React, { useEffect, useState } from 'react';
import {Alert, Select, TextInput, Spinner} from '@inkjs/ui';
import { verifyFileExists, createLinkToCurrentPath } from '../utils/symbolLinks.js'
import type { Group } from '../db.json.js';
import { findGroup, retrieveGroups } from '../utils/groups.js';
import { Box, Text, useInput } from 'ink';
import LoadingBar from '../components/LoadingBar.js'
import { WIDTH, FILE } from '../utils/constants.js';
import { exit } from 'process';
import Add from './Add.js';

export default function Link() {
	const [selectedGroup, setSelectedGroup] = useState<Group>()
	const [groupToLink, setGroupToLink] = useState<Group>()
	const [groups, setGroups] = useState<Group[]>([])
	const [groupName, setGroupName] = useState<string>()
	const [doesFileExist, setDoesFileExist] = useState<boolean>(true)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [doesFileAlreadyExist, setDoesFileAlreadyExist] = useState<boolean>(false)

	useInput((input) => {
		if (input === 'q') exit()
	});

	useEffect(() => {
		verifyFileExists(FILE)
			.then(() => setDoesFileExist(true))
			.catch(() => {
				setDoesFileExist(false)
				exit()
			})
	}, [])

	useEffect(() => {
		retrieveGroups().then(setGroups).finally(() => setIsLoading(false))
	}, [])

	useEffect(() => {
		if (!selectedGroup) return
		setTimeout(() => exit(), 50)
	}, [selectedGroup])

	if (!doesFileExist || doesFileAlreadyExist) return (
		<Box width={WIDTH} flexDirection="column">
			{
				doesFileAlreadyExist
					? <Alert variant="error">Oops! The file already exists in the group</Alert>
					: <Alert variant="error">The <Text color="green">{ FILE }</Text> file doesn't exist here</Alert>
			}
		</Box>
	)

	if (isLoading) return <Spinner />

	if (!groups.length) {
		if (groupName) return (
			<Add
				args={[groupName]}
				onGroupCreation={(group) => {
					if (!group) return setGroupName(undefined)
					findGroup(group.name)
						.then(setGroupToLink)
						.finally(() => setGroups((currentGroups = []) => [...currentGroups, group]))
				}}
			/>
		)
		return (
			<Box width={WIDTH} flexDirection="column">
				<Alert variant="info">Create a group</Alert>
				<Box paddingX={2}>
					<TextInput
						placeholder="Enter the group name..."
						onSubmit={(name) => setGroupName(name)}
					/>
				</Box>
			</Box>
		)
	}

	if (selectedGroup) return (
		<Box width={WIDTH} flexDirection="column">
			<Alert variant="success">
				Linked successfully
			</Alert>
		</Box>
	)

	if (groupToLink) return (
		<Box width={WIDTH} flexDirection="column">
			<Alert variant="info">
				Linking <Text color="green">{ FILE }</Text> with a group
			</Alert>
			<LoadingBar
				onFinish={() => {
					createLinkToCurrentPath(groupToLink)
						.then(() => setSelectedGroup(groupToLink))
						.catch(() => {
							setDoesFileAlreadyExist(true)
							exit()
						})
				}}
			/>
		</Box>
	)

	return (
		<Box width={WIDTH} flexDirection="column">
			<Alert variant="info">
				You're linking <Text color="green">{ FILE }</Text> with a group
			</Alert>
			<Box paddingX={2}>
				<Select
					options={groups.map(({ name }) => ({ label: name, value: name })).concat([{ label: '(Add group)', value: 'new' }])}
					onChange={(name) => {
						if (name === 'new') setGroups([])
						else findGroup(name).then(setGroupToLink)
					}}
				/>
			</Box>
		</Box>
	);
}
