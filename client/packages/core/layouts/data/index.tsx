import { Outlet } from 'react-router-dom';
import { AppShell, Button, Container, Stack, Text } from '@mantine/core';
import { Header } from '@fishScore/header';
import { useWebSocketHook } from '@fishScore/usewebsockethook';
import { useEffect } from 'react';
import { fetchAllEvents } from '@fishScore/apievents';
import { useWebSocketStore } from '@fishScore/usewebsocketstore';
import { useAuthStore } from '@fishScore/useAuthStore';
import { BaseModal } from '@fishScore/basemodal';
import { useUserStore } from '@fishScore/useUserStore';
import { fetchMe } from '@fishScore/apiauth';
import type { FishEvent } from '@fishScore/eventsdata';
import { Loading } from '@fishScore/loading';

export const AuthLayout = () => {
	return <Outlet />;
};

export const AppLayout = () => {
	const { setEvents } = useWebSocketStore();
	const { showLoginModal, closeLoginModal, authStatus, setAuthStatus } =
		useAuthStore();
	const { setUser, clearUser } = useUserStore();

	useEffect(() => {
		// Hämtar alla events och lägger den i Websocketsstore
		const getAllEvents = async () => {
			const response = await fetchAllEvents();
			if (response.success && response.data.events.length > 0) {
				const events: FishEvent[] = response.data.events;

				setEvents(events);
			}
		};

		// Hämtar inloggad användare om det finns giltig token
		const initAuth = async () => {
			const response = await fetchMe();
			if (response.success) {
				setUser(response.data.user);
				setAuthStatus('authenticated');
				return;
			}

			clearUser();
			setAuthStatus('unauthenticated');
		};
		initAuth();
		getAllEvents();
	}, [clearUser, setAuthStatus, setEvents, setUser]);

	useWebSocketHook();

	if (authStatus === 'checking') {
		return <Loading visible={true} text='Checking session'></Loading>;
	}

	if (authStatus === 'unauthenticated') {
		return <Outlet />;
	}

	return (
		<AppShell header={{ height: 102 }}>
			{/* Modal för att session är utgången */}
			<BaseModal
				title='Your session has expired'
				opened={showLoginModal}
				close={closeLoginModal}>
				<Stack>
					<Text>You must log in</Text>
					<Button color='var(--color-black)'>To login</Button>
				</Stack>
			</BaseModal>
			<AppShell.Header>
				<Header></Header>
			</AppShell.Header>
			<AppShell.Main>
				<Container size='lg' pb={'3rem'}>
					<Outlet />
				</Container>
			</AppShell.Main>
		</AppShell>
	);
};
