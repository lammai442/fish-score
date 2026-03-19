import { Stack } from '@mantine/core';
import { PageHeader } from '@fishScore/pageheader';
import { useEffect, useState } from 'react';
import { fetchUserProfile } from '@fishScore/apiuser';
import { Loading } from '@fishScore/loading';
import { ProfileOverview } from '../../../base/profileoverview/ui';

export const ProfilePage = () => {
	const [loading, setLoading] = useState(false);
	// const [userProfile, setUserProfile] = useState(null);
	// useEffect(() => {
	// 	const getUser = async () => {
	// 		setLoading(true);
	// 		const response = await fetchUserProfile();
	// 		setLoading(false);
	// 		if (response.success) {
	// 			setUserProfile(response.data.userProfile);
	// 		}
	// 	};

	// 	getUser();
	// }, []);

	return (
		<Stack>
			<Loading visible={loading} text='Getting profile'></Loading>
			<PageHeader title='Profile' />
			<ProfileOverview></ProfileOverview>
		</Stack>
	);
};
