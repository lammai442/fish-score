import { fetchJoinTeam } from '@fishScore/apievents';
import { Button, Flex, Stack, Text, Title } from '@mantine/core';
import { IconTrophy } from '@tabler/icons-react';
import type {
	Team,
	TeamUserData,
} from '../../../core/interfaces/teamsdata/data';
import { useState } from 'react';
import { Loading } from '@fishScore/loading';
type Props = {
	team: Team;
	userId: string | undefined;
	rankNr: number;
	eventId: string | undefined;
	userIsInAnyTeam: boolean | undefined;
	createdBy: string | undefined;
};

export const Teams = ({
	team,
	userId,
	rankNr,
	eventId,
	userIsInAnyTeam,
	createdBy,
}: Props) => {
	const [loading, setLoading] = useState<boolean>(false);
	const userExistInTeam = team.members.some(
		(member) => member.userId === userId,
	);

	let trophyColor = '';

	switch (rankNr) {
		case 1:
			trophyColor = 'var(--rank-gold)';
			break;
		case 2:
			trophyColor = 'var(--rank-silver)';
			break;
		case 3:
			trophyColor = 'var(--rank-bronze)';
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
					rankNr <= 3
						? `2px solid ${trophyColor}`
						: '1px solid var(--border-default)'
				}
				style={{
					borderLeft:
						rankNr <= 3
							? `6px solid ${trophyColor}`
							: '1px solid var(--border-default)',
				}}
				p={'20px'}>
				<Flex justify={'space-between'} align={'center'}>
					<Flex gap={'0.5rem'}>
						<Text
							span
							fw={700}
							bg={
								rankNr <= 3
									? `${trophyColor}`
									: 'var(--bg-muted)'
							}
							w={30}
							h={30}
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								justifyContent: 'center',
								borderRadius: '50%',
								flexShrink: 0,
							}}>
							{rankNr}
						</Text>
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
					{rankNr <= 3 && (
						<IconTrophy color={trophyColor}></IconTrophy>
					)}
				</Flex>
				<Text>
					Members:{' '}
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
				<Text fz={'xl'}>Totalt: {team.totalCatchWeight} kg</Text>

				{!userIsInAnyTeam && (
					<Button bg={'var(--color-black)'} onClick={handleJoinTeam}>
						Join team
					</Button>
				)}
			</Stack>
		</>
	);
};
