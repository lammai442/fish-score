import { fetchLogout } from '@fishScore/apiauth';
import { Avatar, Button, Stack, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { fetchUserProfile } from '@fishScore/apiuser';
import { Loading } from '@fishScore/loading';
import { User } from '@fishScore/usersdata/data';
import { dateFormatter } from '../../../core/formatters/data';
type Props = {};

export const ProfileOverview = ({}: Props) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);
	const [userStats, setUserStats] = useState<null>(null);
	const [userCatches, setUserCatches] = useState<null>(null);
	const navigate = useNavigate();

	if (!user) {
		return;
	}

	const usersFullName = `${user.firstName} ${user.lastName}`;

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
			<Stack
				align='center'
				style={{
					width: '100vw',
					marginLeft: 'calc(50% - 50vw)',
				}}>
				<Stack
					w={'100%'}
					p={'xl'}
					bg={'var(--color-primary-medium)'}
					align='center'>
					<Avatar
						bd={'2px solid var(--color-primary)'}
						color='var(--color-primary)'
						size={100}
						name={usersFullName}></Avatar>

					<Stack align='center'>
						<Title order={3}>{usersFullName}</Title>
						<Text>{user.email}</Text>
						<Text>
							Member since {dateFormatter(user.createdAt)}
						</Text>
					</Stack>
					<Button
						bdrs={'sm'}
						bg={'var(--color-black)'}
						color={'var(--text-inverse)'}
						style={{
							display: 'inline',
						}}
						onClick={() => handleLogout()}>
						Log out
					</Button>
				</Stack>
			</Stack>
		</>
	);
};
