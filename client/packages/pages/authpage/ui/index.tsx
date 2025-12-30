import { Center } from '@mantine/core';
import { AuthForm } from '@fishScore/authform';

export const AuthPage = () => {
	return (
		<Center
			style={{
				minHeight: '100vh',
				background:
					'linear-gradient(var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%)',
			}}>
			<AuthForm />;
		</Center>
	);
};
