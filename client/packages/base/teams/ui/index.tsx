import { showNotification } from '@mantine/notifications';
import { Button, Flex, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { fetchJoinTeam } from '@fishScore/apievents';
import { IconCheck, IconTrophy, IconX } from '@tabler/icons-react';
import { Loading } from '@fishScore/loading';
import { useState } from 'react';
import type { Team, TeamUserData } from '@fishScore/teamsdata';
type Props = {
	team: Team;
	userId: string | undefined;
	rankNr: number;
	eventId: string | undefined;
	userIsInAnyTeam: boolean | undefined;
	createdBy: string | undefined;
	eventStatus: string;
};

export const Teams = ({
	team,
	userId,
	rankNr,
	eventId,
	userIsInAnyTeam,
	createdBy,
	eventStatus,
}: Props) => {
	const [loading, setLoading] = useState<boolean>(false);
	const userExistInTeam = team.members.some(
		(member) => member.userId === userId,
	);

	let trophyColor = '';
	let trophyTextColor = '';

	switch (rankNr) {
		case 1:
			trophyColor = 'var(--rank-gold)';
			trophyTextColor = 'var(--text-primary)';
			break;
		case 2:
			trophyColor = 'var(--rank-silver)';
			trophyTextColor = 'var(--text-primary)';
			break;
		case 3:
			trophyColor = 'var(--rank-bronze)';
			trophyTextColor = 'var(--text-inverse)';
			break;
	}

	const handleJoinTeam = async () => {
		const teamUserData: TeamUserData = {
			userId: userId,
			eventId: eventId,
			teamId: team.teamId,
		};
		try {
			setLoading(true);
			const response = await fetchJoinTeam(teamUserData);
			if (response.success) {
				showNotification({
					title: 'Joined team',
					message: "You have joined a team! Let's catch some fish!",
					color: 'var(--color-primary)',
					icon: <IconCheck />,
					position: 'top-center',
				});
			} else {
				showNotification({
					title: 'Could not join team',
					message: 'Something went wrong, could not join team',
					color: 'var(--color-danger)',
					icon: <IconX />,
					position: 'top-center',
				});
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{loading && (
				<Loading visible={loading} text='Joining team'></Loading>
			)}
			<Stack
				key={team.createdAt}
				bdrs={'15px'}
				bd={
					eventStatus === 'completed' && rankNr <= 3
						? `2px solid ${trophyColor}`
						: '1px solid var(--border-primary)'
				}
				style={{
					borderLeft:
						eventStatus === 'completed' && rankNr <= 3
							? `6px solid ${trophyColor}`
							: '1px solid var(--border-default)',
				}}
				p={'md'}
				gap={'xs'}>
				<Stack gap={0}>
					<Flex justify={'space-between'} align={'center'}>
						<Flex gap={'0.5rem'}>
							{/* Ranknummer */}
							<ThemeIcon
								fw={700}
								bg={
									rankNr <= 3
										? `${trophyColor}`
										: 'var(--color-black)'
								}
								c={'var(--text-inverse)'}
								bdrs={'xl'}
								size={30}>
								{rankNr}
							</ThemeIcon>
							<Flex gap={'0.5rem'} wrap={'wrap'}>
								<Title order={3}>{team.teamName}</Title>
								{userExistInTeam && (
									<Text
										bg={'var(--bg-muted)'}
										p={'0.4rem'}
										fz={'sm'}
										bdrs={'0.5rem'}>
										Your team
									</Text>
								)}
							</Flex>
						</Flex>
						{eventStatus === 'completed' && rankNr <= 3 && (
							<IconTrophy color={trophyColor}></IconTrophy>
						)}
					</Flex>

					{team.members.length > 0 ? (
						<Text>
							Members:{' '}
							<Text span fs={'italic'}>
								{team.members
									.map((member) => {
										if (member.userId === createdBy) {
											return member.name + ' (Admin)';
										} else {
											return member.name;
										}
									})
									.join(', ')}
							</Text>
						</Text>
					) : (
						<Text>No members</Text>
					)}
				</Stack>

				<Text fz={'xl'}>
					Total catch:{' '}
					<Text span fw={700} fz={'xl'}>
						{team.totalCatchWeight} kg
					</Text>
				</Text>

				{!userIsInAnyTeam && eventStatus === 'ongoing' && (
					<Button bg={'var(--color-black)'} onClick={handleJoinTeam}>
						Join team
					</Button>
				)}
			</Stack>
		</>
	);
};
