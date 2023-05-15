import React, {useEffect, useState} from 'react';
import {Box} from 'ink';
import {ProgressBar} from '@inkjs/ui';
import { WIDTH } from '../utils/constants.js';

export default function LoadingBar({ onFinish = () => {} }: any) {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		if (progress === 100) {
			return onFinish();
		}

		const timer = setTimeout(() => {
			setProgress(progress + 1);
		}, 5);

		return () => {
			clearInterval(timer);
		};
	}, [progress]);

	return (
		<Box width={WIDTH}>
			<ProgressBar value={progress} />
		</Box>
	);
}
