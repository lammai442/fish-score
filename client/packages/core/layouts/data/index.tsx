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
import { FishEvent } from '@fishScore/eventsdata';

export const AuthLayout = () => {
	return <Outlet />;
};

export const AppLayout = () => {
	const { setEvents } = useWebSocketStore();
	const { showLoginModal, closeLoginModal } = useAuthStore();
	const { setUser } = useUserStore();

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
			}
		};
		initAuth();
		getAllEvents();
	}, []);

	useWebSocketHook();

	return (
		<AppShell>
			<BaseModal
				title='Your session has expired'
				opened={showLoginModal}
				close={closeLoginModal}>
				<Stack>
					<Text>You must log in</Text>
					<Button color='var(--color-black)'>To login</Button>
				</Stack>
			</BaseModal>
			<Header></Header>
			<AppShell.Main>
				<Container size='lg'>
					<Outlet />
				</Container>
			</AppShell.Main>
		</AppShell>
	);
};
