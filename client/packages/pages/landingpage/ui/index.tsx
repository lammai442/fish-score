import { fetchLogout } from '@fishScore/apiauth';
import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
	const navigate = useNavigate();
	const handleLogout = async () => {
		const response = await fetchLogout();
		navigate('/auth', { replace: true });
	};

	return (
		<div>
			<Button onClick={() => handleLogout()}>Log out</Button>
		</div>
	);
};
