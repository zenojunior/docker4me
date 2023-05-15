#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(`Usage
docker4me

Commands

docker4me up \t\t\t Starts all linked containers in the correct order.
docker4me down \t\t Stops all linked containers in the correct order.

docker4me create [<group>] \t Creates a new group.
docker4me delete [<group>] \t Deletes the specified group.

docker4me ls \t\t\t Lists all existing groups.
docker4me link  \t\t Creates a symbolic link to the docker-compose.yml file in the current directory.
docker4me unlink \t\t Unlinks the selected Docker Compose files.

Flags

docker4me --version
docker4me --help`,
	{
		importMeta: import.meta,
		flags: {
			name: {
				type: 'string',
			},
		},
	},
);

render(<App input={cli.input} help={cli.help} />);
