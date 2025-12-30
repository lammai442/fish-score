import { Outlet } from 'react-router-dom';
import { AppShell, Container } from '@mantine/core';

export const AuthLayout = () => {
	return <Outlet />;
};

export const AppLayout = () => {
	return (
		<AppShell header={{ height: 60 }} padding='md'>
			{/* <AppShell.Header>
			</AppShell.Header> */}

			{/* <AppShell.Navbar></AppShell.Navbar> */}

			<AppShell.Main>
				<Container size='lg'>
					<Outlet />
				</Container>
			</AppShell.Main>
		</AppShell>
	);
};
