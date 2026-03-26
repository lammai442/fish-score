import { fetchEditEventStatus } from '@fishScore/apievents';
import { BaseModal } from '@fishScore/basemodal';
import { Button, Flex, Stack, Text } from '@mantine/core';
import { useDisclosure, UseDisclosureHandlers } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { LeaderboardTeam, Team } from '@fishScore/teamsdata';
import { useState } from 'react';

type Props = {
	eventStatus: string | undefined;
	endEventOpened: boolean;
	endEventHandlers: UseDisclosureHandlers;
	setLoading: (value: boolean) => void;
	eventId: string | undefined;
	leaderboard: LeaderboardTeam[];
};

export const ResultEvent = ({
	eventStatus,
	endEventOpened,
	endEventHandlers,
	setLoading,
	eventId,
	leaderboard,
}: Props) => {
	const [winnersOpened, winnersHandlers] = useDisclosure(false);
	const [winner, setWinner] = useState<LeaderboardTeam | null>(null);

	const handleEndEvent = async () => {
		try {
			setLoading(true);

			let newEventStatus: string = '';

			if (eventStatus === 'ongoing') {
				newEventStatus = 'completed';
			} else {
				newEventStatus = 'ongoing';
			}

			const response = await fetchEditEventStatus(
				eventId,
				newEventStatus,
			);
			if (response.success) {
				showNotification({
					title:
						response.data.eventStatus === 'completed'
							? 'Event ended'
							: "It's not over",
					message:
						response.data.eventStatus === 'completed'
							? "It's official, the event has ended!"
							: 'Event re opened, game on!',
					color: 'var(--bg-primary)',
					icon: <IconCheck />,
					position: 'top-center',
				});

				if (newEventStatus === 'completed') {
					console.log('leaderboard: ', leaderboard);
					setWinner(leaderboard[0]);
					winnersHandlers.open();
					console.log('winnersOpened: ', winnersOpened);
				} else if (newEventStatus === 'ongoing') {
					endEventHandlers.close();
				}
			}
		} finally {
			setLoading(false);
		}
	};
	return (
		<>
			<BaseModal
				title={eventStatus === 'ongoing' ? 'End event' : 'Open event'}
				opened={endEventOpened}
				close={endEventHandlers.close}>
				<Stack>
					<Text>
						{eventStatus === 'ongoing'
							? 'Do you want to end this event?'
							: 'Do you want to open this event?'}
					</Text>
					<Button
						bg={'var(--color-black)'}
						c={'var(--text-inverse)'}
						onClick={handleEndEvent}>
						Yes
					</Button>
				</Stack>
			</BaseModal>
			{winnersOpened && (
				<BaseModal
					title='Results'
					opened={winnersOpened}
					close={() => {
						winnersHandlers.close;
						endEventHandlers.close();
					}}>
					<Stack align='center'>
						<DotLottieReact
							src='https://lottie.host/495c2d7d-37f5-49ae-944f-ff4b36af3e1a/YcXgLWKtTo.lottie'
							loop
							autoplay
							speed={0.75}
							style={{ width: 200, height: 200 }}
						/>
						{winner && leaderboard[0] && (
							<Stack>
								<Flex>{winner.totalCatchWeight} kg</Flex>
								{winner.teams.map((team: any) => (
									<Text key={team.teamName}>
										{team.teamName}
									</Text>
								))}
							</Stack>
						)}
					</Stack>
				</BaseModal>
			)}
		</>
	);
};
