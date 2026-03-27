import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@fishScore/useAuthStore';
import { useEffect } from 'react';
import { BaseModal } from '@fishScore/basemodal';
import { useDisclosure } from '@mantine/hooks';
import { Button, Stack, Text } from '@mantine/core';
import { fetchMe, refreshAccessToken } from '@fishScore/apiauth';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useUserStore } from '@fishScore/useUserStore';
export const ProtectedRoute = () => {
	const { authStatus, setAuthStatus } = useAuthStore();
	const { setUser } = useUserStore();
	const [loginModalOpened, loginModalHandlers] = useDisclosure();
	const navigate = useNavigate();

	const handleRetryLogin = async () => {
		const response = await refreshAccessToken();
		console.log('response: ', response);
		if (response.success) {
			const meResponse = await fetchMe();

			if (meResponse.success) {
				setUser(meResponse.data.user);
				setAuthStatus('authenticated');
				loginModalHandlers.close();

				showNotification({
					title: 'Welcome back',
					message: 'You are logged in again.',
					color: 'var(--color-primary)',
					icon: <IconCheck />,
					position: 'top-center',
				});
				return;
			}
		} else if (!response.success) {
			showNotification({
				title: "Couldn't log in",
				message: "We couldn't log you in. Please try and login again.",
				color: 'var(--color-danger)',
				icon: <IconX />,
				position: 'top-center',
			});
		}
	};

	useEffect(() => {
		if (authStatus !== 'authenticated' && authStatus !== 'checking') {
			loginModalHandlers.open();
		}
	}, [authStatus]);

	if (authStatus === 'checking') {
		return null;
	}
	if (authStatus !== 'authenticated') {
		return (
			<BaseModal
				title='Your session has expired'
				opened={loginModalOpened}
				close={loginModalHandlers.close}>
				<Stack>
					<Text>
						Your session has expired. Would you like to log in
						again?
					</Text>
					<Button
						color='var(--color-primary)'
						onClick={handleRetryLogin}>
						Try again
					</Button>
					<Button
						color='var(--color-black)'
						onClick={() => navigate('/auth')}>
						Go to login page
					</Button>
				</Stack>
			</BaseModal>
		);
	}

	return <Outlet />;
};
