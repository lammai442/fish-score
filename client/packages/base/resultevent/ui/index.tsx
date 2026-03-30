import { fetchEditEventStatus } from '@fishScore/apievents';
import { BaseModal } from '@fishScore/basemodal';
import { Button, Flex, Stack, Text } from '@mantine/core';
import type { UseDisclosureHandlers } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import type { LeaderboardTeam } from '@fishScore/teamsdata';

type Props = {
	eventStatus: string | undefined;
	endEventOpened: boolean;
	endEventHandlers: UseDisclosureHandlers;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	eventId: string | undefined;
	leaderboard: LeaderboardTeam[];
	showWinnersHandlers: UseDisclosureHandlers;
	setWinner: React.Dispatch<React.SetStateAction<LeaderboardTeam | null>>;
	setShownWinners: React.Dispatch<React.SetStateAction<string[]>>;
};

export const ResultEvent = ({
	eventStatus,
	endEventOpened,
	endEventHandlers,
	setLoading,
	eventId,
	leaderboard,
	showWinnersHandlers,
	setWinner,
	setShownWinners,
}: Props) => {
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
				endEventHandlers.close();

				if (newEventStatus === 'completed') {
					setWinner(leaderboard[0]);
					showWinnersHandlers.open();
					if (eventId) {
						setShownWinners((prev) => [...prev, eventId]);
					}
				} else if (newEventStatus === 'ongoing') {
					setWinner(null);
					setShownWinners((prev) =>
						prev.filter((id) => id !== eventId),
					);
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
					<Flex gap={'xs'}>
						<Button
							bg={'var(--btn-primary-bg)'}
							c={'var(--text-inverse)'}
							onClick={endEventHandlers.close}>
							No
						</Button>
						<Button
							bg={'var(--btn-gold-bg)'}
							c={'var(--text-primary)'}
							onClick={handleEndEvent}>
							Yes
						</Button>
					</Flex>
				</Stack>
			</BaseModal>
		</>
	);
};
