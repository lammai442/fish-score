import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { AppShell, Box, Container } from '@mantine/core';
import { Header } from '@fishScore/header';
import { useWebSocketHook } from '@fishScore/usewebsockethook';
import { useEffect } from 'react';
import { fetchAllEvents } from '@fishScore/apievents';
import { useWebSocketStore } from '@fishScore/usewebsocketstore';
import { useAuthStore } from '@fishScore/useAuthStore';
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
	const { authStatus, setAuthStatus } = useAuthStore();
	const { setUser, clearUser } = useUserStore();
	const navigate = useNavigate();

	useEffect(() => {
		// Hämtar inloggad användare om det finns giltig token
		const initAuth = async () => {
			const response = await fetchMe();
			if (response.success) {
				setUser(response.data.user);
				setAuthStatus('authenticated');
				return;
			} else {
				clearUser();
				setAuthStatus('unauthenticated');
				navigate('/auth');
			}
		};

		// Hämtar alla events och lägger den i Websocketsstore
		const getAllEvents = async () => {
			const response = await fetchAllEvents();
			if (response.success && response.data.events.length > 0) {
				const events: FishEvent[] = response.data.events;

				setEvents(events);
			}
		};

		initAuth();
		getAllEvents();
	}, []);

	useWebSocketHook();

	if (authStatus === 'checking') {
		return <Loading visible={true} text='Checking session'></Loading>;
	}

	return (
		<AppShell header={{ height: 102 }}>
			<AppShell.Header>
				<Header></Header>
			</AppShell.Header>
			<AppShell.Main>
				<Container size='lg' pb={'3rem'}>
					{/* <Box> */}
					{/* Sidoanimering*/}
					<AnimatePresence initial={false} mode='wait'>
						<motion.div
							key={location.pathname}
							initial={{ x: '100%', opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ duration: 0.4 }}
							style={{ width: '100%' }}>
							{outlet}
						</motion.div>
					</AnimatePresence>
					{/* </Box> */}
				</Container>
			</AppShell.Main>
		</AppShell>
	);
};
