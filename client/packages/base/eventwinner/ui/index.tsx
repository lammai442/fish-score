import { BaseModal } from '@fishScore/basemodal';
import { LeaderboardTeam, Team } from '@fishScore/teamsdata';
import { Flex, Stack, Text, Title } from '@mantine/core';
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
					src='https://lottie.host/495c2d7d-37f5-49ae-944f-ff4b36af3e1a/YcXgLWKtTo.lottie'
					loop
					autoplay
					speed={0.75}
					style={{ width: 200, height: 200 }}
				/>
				{winner && (
					<Stack ta={'center'}>
						<Title>
							{winner.teams.length > 1 ? 'WINNERS' : 'WINNER'}
						</Title>
						<Flex>
							<Text>Winning total weight: </Text>
							<Text span>{winner.totalCatchWeight} kg</Text>
						</Flex>
						{winner.teams.length > 1 && (
							<Title order={5}>Shared winners</Title>
						)}
						<Flex>
							<Text>
								{winner.teams.length > 1 ? 'Teams: ' : 'Team: '}
							</Text>
							{winner.teams.map((team: Team) => (
								<Text
									key={team.teamName}
									className='fade-in'
									span>
									{team.teamName}{' '}
								</Text>
							))}
						</Flex>
					</Stack>
				)}
			</Stack>
		</BaseModal>
	);
};
