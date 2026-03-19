import { fetchLogout } from '@fishScore/apiauth';
import {
	Avatar,
	Button,
	Flex,
	Grid,
	Paper,
	Stack,
	Text,
	Title,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { IconFish, IconMedal, IconScale, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { fetchUserProfile } from '@fishScore/apiuser';
import { Loading } from '@fishScore/loading';
import { User, UserStats } from '@fishScore/usersdata/data';
import { dateFormatter } from '../../../core/formatters/data';
import { ActivityCatch } from '../../activitycatch/ui';
import { FishCatch } from '../../../core/interfaces/fishcatchdata/data';
type Props = {};

export const ProfileOverview = ({}: Props) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);
	const [userStats, setUserStats] = useState<UserStats | null>(null);
	const [userCatches, setUserCatches] = useState<FishCatch[] | null>(null);
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

	if (loading) {
		return <Loading visible={loading} text='Getting profile' />;
	}

	if (!user) {
		return <Text>No user found</Text>;
	}
	const usersFullName = `${user.firstName} ${user.lastName}`;

	const generateUserStats = [
		{
			icon: <IconScale size={45} />,
			value: userStats?.totalCatchWeight,
			text: 'Total weight (kg)',
		},
		{
			icon: <IconFish size={45} />,
			value: userStats?.totalCatches,
			text: 'Total catches',
		},
		{
			icon: <IconMedal size={45} />,
			value: userStats?.highestCatchWeight,
			text: 'Best catch (kg)',
		},
	];

	return (
		<>
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
				{userStats && (
					<Flex
						maw={'100%'}
						gap={15}
						justify={'center'}
						flex={5}
						mt={'-xl'}>
						{generateUserStats.map((s) => {
							return (
								<Paper shadow='md' p='md' bdrs={'lg'}>
									<Stack
										w={'100%'}
										align='center'
										bdrs={'sm'}
										p={'sm'}>
										{s.icon}
										<Title order={4}>{s.value}</Title>
										<Text>{s.text}</Text>
									</Stack>
								</Paper>
							);
						})}
					</Flex>
				)}
				{userCatches &&
					userCatches.map((c) => {
						return (
							<ActivityCatch
								fishCatch={c}
								eventStatus='ongoing'
								userId={user.userId}></ActivityCatch>
						);
					})}
			</Stack>
		</>
	);
};
