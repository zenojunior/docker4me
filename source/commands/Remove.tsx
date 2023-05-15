import React, { useEffect, useState } from 'react';
import { Text, useApp, Box } from 'ink';
import { ConfirmInput, Spinner, StatusMessage } from '@inkjs/ui';
import { removeGroup, isGroupExisting } from '../utils/groups.js'

type Props = {
	args: string[];
};

export default function Add({ args }: Props) {
	const { exit } = useApp();
	const [groupToDelete, setGroupToDelete] = useState<string>('')
	const [group, setGroup] = useState<string>('')
	const [error, setError] = useState<string>('')
	const [loading, setLoading] = useState<string>('Preparing')

	useEffect(() => {
		const [groupName] = args
		if (!groupName) {
			setLoading('')
			setError('Group name is missing')
			return
		}

		isGroupExisting(groupName)
			.then((exist) => {
				if (exist) setGroupToDelete(groupName)
				else setError('Group does not exist')
				setLoading('')
			})
	}, [args])

	if (loading) return <Spinner label={loading} />
	if (error) return <StatusMessage variant="error">{ error }</StatusMessage>
	if (group) return <StatusMessage variant="success">Group <Text>{ group }</Text> has been deleted</StatusMessage>

	return (
		<Box flexDirection="column">
			<Text>
				Are you sure you want to delete the <Text color="green">{ groupToDelete }</Text> group?
				 (<ConfirmInput
					onConfirm={async () => {
						setLoading('Deleting group')
						try {
							await removeGroup(groupToDelete)
							setGroup(groupToDelete)
						} catch(err: any) {
							setError(err.code !== 'EEXIST' ? 'Group has already been deleted' : 'Failed to delete')
						} finally {
							setTimeout(() => setLoading(''), 400)
						}
					}}
					onCancel={() => exit()}
				/>)
			</Text>
		</Box>
	);
}
