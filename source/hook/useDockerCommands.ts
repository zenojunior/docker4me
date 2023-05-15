import { useState, useEffect, useRef } from 'react';
import DockerCommandExecutor from '../utils/docker.js';
import type { Symlink } from '../db.json.js';

export function useDockerCommands(symlinks: Symlink[], command: string[]) {
  const [status, setStatus] = useState('stopped');
  const [containers, setContainers] = useState<Record<string, Record<string, string>>>({});
  const executorRef = useRef<DockerCommandExecutor | null>();

  useEffect(() => {
    executorRef.current = new DockerCommandExecutor();
    executorRef.current.on('containerUpdate', (container) => {
      setContainers((prevContainers) => {
        const newContainers = {...prevContainers};

				if (!newContainers[container.type]) {
          newContainers[container.type] = {};
        }

				// @ts-ignore
        newContainers[container.type][container.name] = container.status;

        return newContainers;
      });
    });

    return () => {
      executorRef.current = null;
    };
  }, []);

  const startExecution = async () => {
    setStatus('running');
    const files: Symlink[] = symlinks.sort((a: Symlink,b: Symlink) => b.order - a.order)
    try {
      if (!executorRef.current) return
      await executorRef.current.executeCommandOnAllFiles(command, files.map(symlink => symlink.path));
      setStatus('completed');
    } catch (error) {
      setStatus('error');
    }
  };

  return { status, startExecution, containers };
}
