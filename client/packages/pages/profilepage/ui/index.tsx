import { fetchLogout } from '@fishScore/apiauth';
import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@fishScore/pageheader';

export const ProfilePage = () => {
	const navigate = useNavigate();
	const handleLogout = async () => {
		const response = await fetchLogout();
		navigate('/auth', { replace: true });
	};

	return (
		<div>
			<PageHeader
				title='Profile'
				subTitle='Ongoing'
				subTitleStatus='ongoing'
			/>
			<Button onClick={() => handleLogout()}>Log out</Button>
		</div>
	);
};
