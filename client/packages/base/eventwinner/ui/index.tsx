import { BaseModal } from '@fishScore/basemodal';
import { LeaderboardTeam, Team } from '@fishScore/teamsdata';
import { Badge, Flex, Stack, Text, Title } from '@mantine/core';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

type Props = {
	shownWinnersOpened: boolean;
	showWinnersHandlers: { open: () => void; close: () => void };
	winner: LeaderboardTeam | null;
};

export const EventWinner = ({
	shownWinnersOpened,
	showWinnersHandlers,
	winner,
}: Props) => {
	return (
		<BaseModal
			title='Results'
			opened={shownWinnersOpened}
			close={() => {
				showWinnersHandlers.close();
			}}>
			<Stack align='center'>
				<DotLottieReact
					src='https://lottie.host/f5bebc8e-de72-4f3b-8d17-519c5b90e7bc/g5SeNxnMJN.lottie'
					loop
					autoplay
					speed={0.75}
					style={{ width: 200, height: 200 }}
				/>
				{winner && (
					<Stack align={'center'}>
						<Title order={1}>
							{winner.teams.length > 1
								? 'WINNING TEAMS'
								: 'WINNER TEAM'}
						</Title>
						<Flex gap={'sm'}>
							{winner.teams.map((team: Team) => (
								<Text
									bdrs={'sm'}
									w={'fit-content'}
									key={team.teamName}
									p={'xs'}
									bg={'var(--rank-gold)'}
									c={'var(--text-primary)'}
									fw={600}
									className='fade-in'
									span>
									{team.teamName}{' '}
								</Text>
							))}
						</Flex>

						<Stack align='center'>
							<Title order={4}>Winning total weight: </Title>
							<Badge
								p={'0.8rem'}
								bg={'var(--bg-primary)'}
								c={'var(--text-inverse)'}
								size='xl'
								bdrs={'sm'}>
								{winner.totalCatchWeight} kg
							</Badge>
						</Stack>
					</Stack>
				)}
			</Stack>
		</BaseModal>
	);
};
