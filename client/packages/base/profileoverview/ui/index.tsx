import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Flex, Paper, Stack, Text, Title } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconFish, IconMedal, IconScale, IconX } from '@tabler/icons-react';
import { fetchLogout } from '@fishScore/apiauth';
import { fetchUserProfile } from '@fishScore/apiuser';
import { Loading } from '@fishScore/loading';
import { shortDateFormatter } from '@fishScore/formatters';
import { useWebSocketStore } from '@fishScore/usewebsocketstore';
import { ProfileCatchCard } from '@fishScore/profilecatchcard';
import type { User, UserStats } from '@fishScore/usersdata';
import type { FishCatch } from '@fishScore/fishcatchdata';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
type Props = {};

export const ProfileOverview = ({}: Props) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);
	const [userStats, setUserStats] = useState<UserStats | null>(null);
	const [userCatches, setUserCatches] = useState<FishCatch[] | null>(null);
	const navigate = useNavigate();
	const { events } = useWebSocketStore();

	const getUserProfile = async () => {
		try {
			setLoading(true);
			const response = await fetchUserProfile();

			if (response.success) {
				setUser(response.data.userProfile.user);
				setUserStats(response.data.userProfile.stats);
				setUserCatches(response.data.userProfile.catches);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getUserProfile();
	}, []);

	useEffect(() => {
		getUserProfile();
	}, [events]);

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
			icon: <IconFish size={45} />,
			value: userStats?.totalCatches,
			text: 'Total catches',
		},
		{
			icon: <IconScale size={45} />,
			value: userStats?.totalCatchWeight,
			text: 'Total weight (kg)',
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
				style={
					{
						// width: '100vw',
						// marginLeft: 'calc(50% - 50vw)',
					}
				}>
				<Stack
					w={'100%'}
					p={'1.6rem 0 2.8rem 0'}
					bg={'var(--color-black)'}
					align='center'>
					<Avatar
						bd={'2px solid var(--color-primary)'}
						bg={'var(--bg-)'}
						color='var(--color-primary)'
						size={100}
						name={usersFullName}></Avatar>

					<Stack align='center'>
						<Title c={'var(--text-inverse)'} order={3}>
							{usersFullName}
						</Title>
						<Text c={'var(--text-inverse)'}>{user.email}</Text>
						<Text c={'var(--text-inverse)'}>
							Member since {shortDateFormatter(user.createdAt)}
						</Text>
					</Stack>
					<Button
						bdrs={'sm'}
						bg={'var(--bg-primary)'}
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
						p={'0 2rem 2rem 2rem'}
						maw={'100%'}
						gap={15}
						justify={'center'}
						flex={5}
						mt={'-2.5rem'}>
						{generateUserStats.map((s) => {
							return (
								<Paper
									key={s.text}
									shadow='md'
									p='md'
									bdrs={'lg'}>
									<Stack
										w={'100%'}
										align='center'
										bdrs={'sm'}
										p={'sm'}>
										{s.icon}
										<Title order={4}>{s.value}</Title>
										<Text ta={'center'}>{s.text}</Text>
									</Stack>
								</Paper>
							);
						})}
					</Flex>
				)}
				<Title order={3}>MY CATCHES</Title>
				{userCatches && userCatches.length > 0 ? (
					userCatches.map((c) => (
						<ProfileCatchCard
							key={c.catchId}
							fishCatch={c}
							userId={user.userId}
						/>
					))
				) : (
					<>
						<Text ta={'center'}>
							You have no catches yet. Join a team and start
							catching!
						</Text>
						<DotLottieReact
							src='https://lottie.host/2d6d9998-f277-4800-9a18-cdaa75fb4421/t2VbZoHzOn.lottie'
							loop
							autoplay
							speed={0.75}
							style={{ width: 200, height: 200 }}
						/>
					</>
				)}
			</Stack>
		</>
	);
};
