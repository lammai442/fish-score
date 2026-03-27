import './index.css';
import type { FishEvent } from '@fishScore/eventsdata';
import {
	capitilizeFirstLetter,
	generateLeaderboard,
} from '@fishScore/helpfunctions';
import { PageHeader } from '@fishScore/pageheader';
import {
	Button,
	Divider,
	Flex,
	Stack,
	Text,
	Title,
	Tooltip,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWebSocketStore } from '@fishScore/usewebsocketstore';
import { BaseModal } from '@fishScore/basemodal';
import { CreateItemModal } from '@fishScore/createitemmodal';
import { useDisclosure } from '@mantine/hooks';
import { useUserStore } from '@fishScore/useUserStore';
import { fetchEventView } from '@fishScore/apievents';
import { Loading } from '@fishScore/loading';
import type { LeaderboardTeam, Team } from '@fishScore/teamsdata';
import type { FishCatch } from '@fishScore/fishcatchdata';
import { AddCatch } from '@fishScore/addcatch';
import { EventTabs } from '@fishScore/eventtabs';
import { ResultEvent } from '../../../base/resultevent/ui';
import { IconTrophy, IconUsers } from '@tabler/icons-react';
import { useLocalStorage } from '@mantine/hooks';
import { EventWinner } from '../../../base/eventwinner/ui';

export const EventPage = () => {
	const { eventId } = useParams();
	const { events } = useWebSocketStore();
	const [currentEvent, setCurrentEvent] = useState<FishEvent | null>(null);
	const [mode, setMode] = useState<string | null>('leaderboard');
	const [createTeamOpened, createTeamHandlers] = useDisclosure(false);
	const [endEventOpened, endEventHandlers] = useDisclosure(false);
	const [leaderboard, setLeaderboard] = useState<LeaderboardTeam[]>([]);
	const [activity, setActivity] = useState<FishCatch[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [loadingText, setLoadingText] = useState<string>('Loading event');
	const [shownWinnersOpened, showWinnersHandlers] = useDisclosure(false);
	const [shownWinners, setShownWinners] = useLocalStorage<string[]>({
		key: 'winner-popup-events',
		defaultValue: [],
	});
	const [winner, setWinner] = useState<LeaderboardTeam | null>(null);

	const { user } = useUserStore();

	// Kontroll om user finns i team
	const usersTeam: Team | undefined = currentEvent?.teams?.find((team) =>
		team.members.some((member) => member.userId === user?.userId),
	);
	const eventCreatedByUser = currentEvent?.createdBy === user?.userId;

	const loadEvent = async () => {
		if (!eventId) return;
		setLoading(true);
		setLoadingText('Loading event');
		try {
			const response = await fetchEventView(eventId);

			if (!response.success) {
				setCurrentEvent(null);
				setLeaderboard([]);
				setActivity([]);
				return;
			}

			const event = response.data.event;

			setCurrentEvent(event);
			const sortedLeaderboard = [...event.teams].sort(
				(a: Team, b: Team) => b.totalCatchWeight - a.totalCatchWeight,
			);

			setActivity(event.activity);
			const leaderboard = generateLeaderboard(sortedLeaderboard);
			setLeaderboard(leaderboard);

			if (event.status === 'ongoing') {
				if (shownWinnersOpened) {
					showWinnersHandlers.close();
				}
				setShownWinners((prev) => prev.filter((id) => id !== eventId));
				setWinner(null);
			} else if (event.status === 'completed') {
				setWinner(leaderboard[0]);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!eventId) {
			return;
		}

		loadEvent();
	}, [events, eventId]);

	useEffect(() => {
		if (!winner || !currentEvent?.eventId) return;

		const eventId = currentEvent.eventId;

		if (shownWinners.includes(eventId)) return;

		showWinnersHandlers.open();

		setShownWinners((prev) => [...prev, eventId]);
	}, [winner, eventId, shownWinners]);

	return (
		<>
			<Loading visible={loading} text={loadingText}></Loading>

			{/* Pageheader */}
			{!loading && currentEvent && (
				<Stack>
					<PageHeader
						title={currentEvent.eventName}
						subTitle={capitilizeFirstLetter(
							currentEvent.status,
						)}></PageHeader>
				</Stack>
			)}

			{/* Join a team message */}
			{!loading &&
				currentEvent &&
				currentEvent.status === 'ongoing' &&
				!usersTeam && (
					<Flex
						gap={'xs'}
						bdrs={'lg'}
						p={'md'}
						bg={'var(--bg-orange-light)'}
						bd={'1px solid var(--border-warning)'}>
						<IconUsers size={50} />
						<Divider
							color={'var(--color-black)'}
							size={'sm'}
							orientation='vertical'></Divider>
						<Stack gap={0}>
							<Title order={5}>Join a team to participate</Title>
							<Text fz={'sm'}>
								You need to join a team before you can register
								catches for this event.
							</Text>
						</Stack>
					</Flex>
				)}

			{/* Admin actions*/}
			<Flex m='1rem 0' gap={'sm'}>
				{/* Skapa nytt lag */}
				<BaseModal
					title='Create team'
					opened={createTeamOpened}
					close={createTeamHandlers.close}>
					<CreateItemModal
						close={createTeamHandlers.close}
						type='team'></CreateItemModal>
				</BaseModal>

				<Tooltip
					label={
						currentEvent?.status === 'completed'
							? 'Event has ended'
							: 'Only the event admin can create new teams'
					}
					disabled={
						currentEvent?.status !== 'completed' &&
						eventCreatedByUser
					}>
					<Button
						color='var(--color-black)'
						size='sm'
						radius='md'
						disabled={
							!eventCreatedByUser ||
							currentEvent?.status === 'completed'
						}
						onClick={createTeamHandlers.open}>
						+ Create team
					</Button>
				</Tooltip>

				{/* Avsluta tävling*/}
				{endEventOpened && (
					<ResultEvent
						eventStatus={currentEvent?.status}
						endEventOpened={endEventOpened}
						endEventHandlers={endEventHandlers}
						setLoading={setLoading}
						eventId={currentEvent?.eventId}
						leaderboard={leaderboard}
						setWinner={setWinner}
						showWinnersHandlers={showWinnersHandlers}
						setShownWinners={setShownWinners}></ResultEvent>
				)}

				{eventCreatedByUser &&
					currentEvent?.teams &&
					currentEvent?.teams?.length > 0 && (
						<Button
							radius='md'
							bg={
								currentEvent?.status === 'ongoing'
									? 'var(--color-gold)'
									: 'var(--bg-primary)'
							}
							c={
								currentEvent?.status === 'ongoing'
									? 'var(--text-primary)'
									: 'var(--text-inverse)'
							}
							onClick={endEventHandlers.open}>
							<IconTrophy></IconTrophy>{' '}
							{currentEvent?.status === 'ongoing'
								? 'End event'
								: 'Open event'}
						</Button>
					)}
			</Flex>
			{/* Popup vid end event */}
			{shownWinnersOpened && (
				<EventWinner
					shownWinnersOpened={shownWinnersOpened}
					showWinnersHandlers={showWinnersHandlers}
					winner={winner}></EventWinner>
			)}

			{/* Lägg till Catch */}
			<AddCatch
				currentEvent={currentEvent}
				usersTeam={usersTeam}></AddCatch>

			{/* Leaderboard/Activity/Messages tab  */}
			{!loading && currentEvent && (
				<EventTabs
					mode={mode}
					setMode={setMode}
					currentEvent={currentEvent}
					leaderboard={leaderboard}
					user={user}
					usersTeam={usersTeam}
					activity={activity}
					setLoading={setLoading}></EventTabs>
			)}
		</>
	);
};
