import { spawn } from 'child_process';
import { chdir } from 'process';
import path from 'path'
import fs from 'fs/promises'

import { EventEmitter } from 'events';

export default class DockerCommandExecutor extends EventEmitter {
  async executeCommandOnAllFiles(command: string[], dockerComposeFiles: string[]) {
		if (command.includes('up')) dockerComposeFiles.reverse()

    for (const dockerComposeSymlink of dockerComposeFiles) {
      const dockerComposeFile = await fs.readlink(dockerComposeSymlink);
      const dockerComposePath = path.dirname(dockerComposeFile)

			chdir(dockerComposePath);

			await new Promise((resolve, reject) => {
        const child = spawn('docker', command);

        child.stderr.on('data', (data) => {
          const lines = data.toString().trim().split('\n')
          lines.forEach((line: any) => {
            const [type, name, status] = line?.split(/\s+/)
            if (type !== 'Network' && type !== 'Container') return
            if (!type || !name || !status || status === 'declared') return

            this.emit('containerUpdate', { type, name, status });
          });
        });

        child.on('error', (error) => {
          console.error(`Error in child process: ${error}`);
          reject(error);
        });

        child.on('exit', (code, _signal) => {
          if (code !== 0) {
            reject(new Error(`Process exited with code ${code}`));
          } else {
            resolve(true);
          }
        });
      });
    }
  }
}
