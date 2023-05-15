import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import {UnorderedList, OrderedList} from '@inkjs/ui';
import { retrieveGroups } from '../utils/groups.js'
import type { Group } from '../db.json.js';

export default function List() {
	const [groups, setGroups] = useState<Group[]>([])

	useEffect(() => {
		retrieveGroups().then(setGroups);
	}, [])

	return (
		<Box flexDirection="column" paddingTop={1}>
			<UnorderedList>
				{
					groups.map((group, groupIndex) => (
						<Box
							borderStyle="round"
							borderColor="gray"
							flexDirection="column"
							key={groupIndex}
							paddingX={1}
							gap={1}
						>
							<UnorderedList.Item>
								<Text bold color="cyan">{ group.name }</Text>
							</UnorderedList.Item>
							<OrderedList>
								{
									group.files.map((file, fileIndex) => (
										<OrderedList.Item key={`file_${fileIndex}`}>
											<Box gap={2} justifyContent="space-between">
												<Text wrap="truncate">{ file.label.padEnd(20) }</Text>
												<Text wrap="truncate-start" color="yellow">{ file.originalPath }</Text>
											</Box>
										</OrderedList.Item>
									))
								}
							</OrderedList>
						</Box>
					))
				}
			</UnorderedList>
		</Box>
	);
}
