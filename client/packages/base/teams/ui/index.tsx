import { fetchJoinTeam } from '@fishScore/apievents';
import type { Team } from '@fishScore/eventsdata';
import { Button, Flex, Stack, Text, Title } from '@mantine/core';
import { IconTrophy } from '@tabler/icons-react';
import { TeamUserData } from '../../../core/interfaces/teamsdata/data';
type Props = {
	team: Team;
	userId: string | undefined;
	rankNr: number;
	userExistInTeam: boolean | undefined;
	eventId: string | undefined;
};

export const Teams = ({
	team,
	userId,
	rankNr,
	userExistInTeam,
	eventId,
}: Props) => {
	let trophyColor = '';

	switch (rankNr) {
		case 1:
			trophyColor = 'var(--bg-gold-color)';
			break;
		case 2:
			trophyColor = 'var(--bg-silver-color)';
			break;
		case 3:
			trophyColor = 'var(--bg-bronze-color)';
			break;
	}

	const handleJoinTeam = async () => {
		const teamUserData: TeamUserData = {
			userId: userId,
			eventId: eventId,
			teamId: team.teamId,
		};
		console.log('teamUserData: ', teamUserData);

		const response = await fetchJoinTeam(teamUserData);
		console.log('response: ', response);
	};
	return (
		<>
			<Stack
				key={team.createdAt}
				bdrs={'15px'}
				bd={
					rankNr <= 3
						? `2px solid ${trophyColor}`
						: '1px solid var(--br-grey)'
				}
				style={{
					borderLeft:
						rankNr <= 3
							? `6px solid ${trophyColor}`
							: '1px solid var(--br-grey)',
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
									: 'var(--bg-medium-light-grey-color)'
							}
							w={30}
							h={30}
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								justifyContent: 'center',
								borderRadius: '50%',
							}}>
							{rankNr}
						</Text>
						<Flex gap={'0.5rem'}>
							<Title order={3}>{team.teamName}</Title>
							{userExistInTeam && (
								<Text
									bg={'var(--bg-medium-light-grey-color)'}
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
					Medlemmar:{' '}
					{team.members.map((member) => member.name).join(', ')}
				</Text>
				<Text fz={'xl'}>Totalt: {team.totalCatchWeight} kg</Text>

				{!userExistInTeam && (
					<Button
						bg={'var(--bg-black-color)'}
						onClick={handleJoinTeam}>
						Join team
					</Button>
				)}
			</Stack>
		</>
	);
};
