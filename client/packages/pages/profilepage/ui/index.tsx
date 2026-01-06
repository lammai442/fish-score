import { fetchLogout } from '@fishScore/apiauth';
import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@fishScore/pageheader';
import { useEffect, useState } from 'react';
import { fetchUserMe } from '@fishScore/apiuser';
import { Loading } from '@fishScore/loading';

export const ProfilePage = () => {
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		const getUser = async () => {
			setLoading(true);
			const user = await fetchUserMe();
			setLoading(false);
		};

		getUser();
	}, []);

	const navigate = useNavigate();
	const handleLogout = async () => {
		const response = await fetchLogout();
		navigate('/auth', { replace: true });
	};

	return (
		<div>
			<PageHeader title='Profile' />
			<Loading visible={loading} text='Getting profile'></Loading>
			<Button onClick={() => handleLogout()}>Log out</Button>
		</div>
	);
};
