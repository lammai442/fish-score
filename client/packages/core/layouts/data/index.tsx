import { Outlet } from 'react-router-dom';
import { AppShell, Container } from '@mantine/core';
import { Header } from '@fishScore/header';

export const AuthLayout = () => {
	return <Outlet />;
};

export const AppLayout = () => {
	return (
		<AppShell>
			{/* <AppShell.Header>
			</AppShell.Header> */}

			{/* <AppShell.Navbar></AppShell.Navbar> */}
			<Header></Header>
			<AppShell.Main>
				<Container size='lg'>
					<Outlet />
				</Container>
			</AppShell.Main>
		</AppShell>
	);
};
