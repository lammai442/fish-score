import { Center } from '@mantine/core';
import { AuthForm } from '@fishScore/authform';
import { useState } from 'react';
import { SplashScreen } from '@fishScore/splashscreen';

export const AuthPage = () => {
	const [showSplash, setShowSplash] = useState<boolean>(false);

	return (
		<>
			{showSplash ? (
				<SplashScreen></SplashScreen>
			) : (
				<Center
					style={{
						minHeight: '100vh',
						background:
							'linear-gradient(var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%)',
					}}>
					<AuthForm setShowSplash={setShowSplash} />
				</Center>
			)}
		</>
	);
};
