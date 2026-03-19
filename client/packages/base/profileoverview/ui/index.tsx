import { fetchLogout } from '@fishScore/apiauth';
import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { fetchUserProfile } from '@fishScore/apiuser';
import { Loading } from '@fishScore/loading';
import { User } from '@fishScore/usersdata/data';
type Props = {};

export const ProfileOverview = ({}: Props) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);
	const [userStats, setUserStats] = useState<null>(null);
	const [userCatches, setUserCatches] = useState<null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const getUserProfile = async () => {
			setLoading(true);
			const response = await fetchUserProfile();
			setLoading(false);
			if (response.success) {
				setUser(response.data.userProfile.user);
				setUserStats(response.data.userProfile.stats);
				setUserCatches(response.data.userProfile.catches);
			}
		};

		getUserProfile();
	}, []);
	console.log(userCatches);
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
			<Loading visible={loading} text='Getting profile'></Loading>
			<div>{user?.firstName}</div>
			<Button onClick={() => handleLogout()}>Log out</Button>
		</>
	);
};
