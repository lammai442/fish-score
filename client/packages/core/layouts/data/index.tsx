import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation, useOutlet } from 'react-router-dom';
import { AppShell, Box, Button, Container, Stack, Text } from '@mantine/core';
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
	const location = useLocation();
	const outlet = useOutlet();
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
					<Box style={{ position: 'relative', overflowX: 'hidden' }}>
						{/* Sidoanimering*/}
						<AnimatePresence initial={false} mode='wait'>
							<motion.div
								key={location.pathname}
								initial={{ x: '100%', opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								exit={{ x: '-100%', opacity: 0 }}
								transition={{ duration: 0.3 }}
								style={{ width: '100%' }}>
								{outlet}
							</motion.div>
						</AnimatePresence>
					</Box>
				</Container>
			</AppShell.Main>
		</AppShell>
	);
};
