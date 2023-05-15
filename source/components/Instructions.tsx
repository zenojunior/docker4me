import React from 'react';
import { Box, Text } from 'ink';
import type { Group } from '../db.json.js';

type Props = {
	group?: Group;
	groups: Group[];
}

export default function Instructions({ group, groups }: Props) {
	return (
		<Box paddingX={2} flexDirection="column">
			{ group && <Text color="grey">Space to select</Text> }
			{ Boolean(group && groups.length > 1) && <Text color="grey">⌫ (Backspace) to go back</Text> }
			{ Boolean(group && group.files.length > 1) && (
				<>
					<Text color="grey">Use ↑/↓ to navigate</Text>
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
	);
}
