import { fetchLogout } from '@fishScore/apiauth';
import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
type Props = {};

export const ProfileOverview = ({}: Props) => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		const response = await fetchLogout();
		if (response.success) {
			navigate('/auth', { replace: true });
		} else {
			showNotification({
				title: 'Unable to logout',
				message: response.data.error,
				color: 'red',
				icon: <IconX />,
				position: 'top-center',
			});
		}
	};
	return (
		<>
			<div>profileOverview</div>
			<Button onClick={() => handleLogout()}>Log out</Button>
		</>
	);
};
