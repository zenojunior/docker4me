import React from 'react';
import {Text} from 'ink';
import Add from './commands/Add.js'
import Remove from './commands/Remove.js'
import Links from './commands/Links.js'
import Link from './commands/Link.js'
import Unlink from './commands/Unlink.js'
import Up from './commands/Up.js'
import Down from './commands/Down.js'

type Props = {
	input: string[];
	help: string;
};

const commandMapping: any = {
	'create': Add,
	'delete': Remove,
	'rm': Remove,
	'ls': Links,
	'link': Link,
	'unlink': Unlink,
	'up': Up,
	'down': Down,
};

export default function App({input, help}: Props) {
	const [command, ...args] = input

	if (command) {
		const CommandComponent = commandMapping[command];
		if (CommandComponent) return <CommandComponent args={args} />;
	}

	return (
		<Text>{ help }</Text>
	);
}
