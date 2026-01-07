import { Outlet } from 'react-router-dom';
import { AppShell, Container } from '@mantine/core';
import { Header } from '@fishScore/header';
import { useWebSocketHook } from '@fishScore/usewebsockethook';

export const AuthLayout = () => {
	return <Outlet />;
};

export const AppLayout = () => {
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
