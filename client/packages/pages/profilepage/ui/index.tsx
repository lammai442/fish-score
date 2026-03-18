import { fetchLogout } from '@fishScore/apiauth';
import { Button, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@fishScore/pageheader';
import { useEffect, useState } from 'react';
import { fetchUserMe, fetchUserStats } from '@fishScore/apiuser';
import { Loading } from '@fishScore/loading';
import { ProfileOverview } from '../../../base/profileoverview/ui';

export const ProfilePage = () => {
	const [loading, setLoading] = useState(false);
	const [userStat, setUserStat] = useState(null);
	useEffect(() => {
		const getUser = async () => {
			setLoading(true);
			const response = await fetchUserStats();
			setLoading(false);
			if (response.success) {
				setUserStat(response.data.userStats);
			}
		};

		getUser();
	}, []);

	return (
		<Stack>
			<Loading visible={loading} text='Getting profile'></Loading>
			<PageHeader title='Profile' />
			<ProfileOverview></ProfileOverview>
		</Stack>
	);
};
