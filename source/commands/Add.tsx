import React, { useEffect, useState } from 'react';
import { Text, Box, useApp } from 'ink';
import { ConfirmInput, Spinner, StatusMessage } from '@inkjs/ui';
import { addNewGroup, isGroupExisting } from '../utils/groups.js'
import { Group } from '../db.json.js';

type Props = {
	args?: string[];
	onGroupCreation: (group?: Group) => void;
};

export default function Add({ args, onGroupCreation = () => {} }: Props) {
	const { exit } = useApp();
	const [input, setInput] = useState<string>('')
	const [group, setGroup] = useState<string>('')
	const [error, setError] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(true)

	useEffect(() => {
		if (!args?.length) return
		const [groupName] = args
		if (!groupName) {
			setIsLoading(false)
			setError('Missing group name')
			return
		}

		isGroupExisting(groupName)
			.then((exist) => {
				if (exist) {
					setError('Group already exist')
					onGroupCreation();
				} else setInput(groupName)
				setIsLoading(false)
			})
	}, [args])

	if (isLoading) return <Spinner label="Preparing" />
	if (error) return <StatusMessage variant="error">{ error }</StatusMessage>
	if (group) return <StatusMessage variant="success">Group <Text color="green">{ group }</Text> has been created successfully</StatusMessage>

	return (
		<Box>
			<Text>
				Are you sure you want to create the <Text color="green">{ input }</Text> group?
				 (<ConfirmInput
					onConfirm={async () => {
						setIsLoading(true)
						try {
							const group = await addNewGroup(input)
							onGroupCreation(group);
							setGroup(input)
						} catch(err: any) {
							console.log(err)
							setError(err.code === 'EEXIST' ? 'Group already exist' : 'Fail to create')
						} finally {
							setTimeout(() => setIsLoading(false), 400)
						}
					}}
					onCancel={() => exit()}
				/>)
			</Text>
		</Box>
	);
}
