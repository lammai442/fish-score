import { Outlet } from 'react-router-dom';
import { AppShell, Container } from '@mantine/core';
import { Header } from '@fishScore/header';
import { useWebSocketHook } from '@fishScore/usewebsockethook';
import { useEffect } from 'react';
import { fetchAllEvents } from '@fishScore/apievents';
import { useWebSocketStore } from '@fishScore/usewebsocketstore';

export const AuthLayout = () => {
	return <Outlet />;
};

export const AppLayout = () => {
	const { setEvents } = useWebSocketStore();

	// Hämtar alla events och lägger den i Websocketsstore
	useEffect(() => {
		const getAllEvents = async () => {
			const response = await fetchAllEvents();
			if (response.success && response.data.events.length > 0) {
				const events = response.data.events;

				setEvents(events);
			}
		};

		getAllEvents();
	}, []);

	useWebSocketHook();

	return (
		<AppShell>
			<Header></Header>
			<AppShell.Main>
				<Container size='lg'>
					<Outlet />
				</Container>
			</AppShell.Main>
		</AppShell>
	);
};
