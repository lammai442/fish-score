import './index.css';
import type { FishEvent } from '@fishScore/eventsdata';
import { capitilizeFirstLetter } from '@fishScore/helpfunctions';
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
import { IconCheck, IconTrophy, IconUsers } from '@tabler/icons-react';
import { fetchEventStatus, fetchEventView } from '@fishScore/apievents';
import { Loading } from '@fishScore/loading';
import type { Team } from '@fishScore/teamsdata';
import type { FishCatch } from '@fishScore/fishcatchdata';
import { AddCatch } from '@fishScore/addcatch';
import { showNotification } from '@mantine/notifications';
import { EventTabs } from '@fishScore/eventtabs';

export const EventPage = () => {
	const { eventId } = useParams();
	const { events } = useWebSocketStore();
	const [currentEvent, setCurrentEvent] = useState<FishEvent | null>(null);
	const [mode, setMode] = useState<string | null>('leaderboard');
	const [createTeamOpened, createTeamHandlers] = useDisclosure(false);
	const [resultEvent, resultEventHandlers] = useDisclosure(false);
	const [endEventOpened, endEventHandlers] = useDisclosure(false);
	const [leaderboard, setLeaderboard] = useState<Team[]>([]);
	const [activity, setActivity] = useState<FishCatch[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const { user } = useUserStore();

	// Kontroll om user finns i team
	const usersTeam: Team | undefined = currentEvent?.teams?.find((team) =>
		team.members.some((member) => member.userId === user?.userId),
	);
	const eventCreatedByUser = currentEvent?.createdBy === user?.userId;

	const loadEvent = async () => {
		if (!eventId) return;
		setLoading(true);

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

			setLeaderboard(sortedLeaderboard);
			setActivity(event.activity);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadEvent();
	}, [eventId]);

	useEffect(() => {
		const updatedEventSummary = events.find((e) => e.eventId === eventId);

		if (!updatedEventSummary) return;

		loadEvent();
	}, [events, eventId]);

	const handleEndEvent = async () => {
		try {
			setLoading(true);

			let newEventStatus: string = '';

			if (currentEvent?.status === 'ongoing') {
				newEventStatus = 'completed';
			} else {
				newEventStatus = 'ongoing';
			}

			const response = await fetchEventStatus(
				currentEvent?.eventId,
				newEventStatus,
			);
			if (response.success) {
				endEventHandlers.close();

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
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Loading visible={loading} text='Loading event'></Loading>
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

			{/* Rendera teams */}
			<BaseModal
				title='Create team'
				opened={createTeamOpened}
				close={createTeamHandlers.close}>
				<CreateItemModal
					close={createTeamHandlers.close}
					type='team'></CreateItemModal>
			</BaseModal>
			{/* Avsluta tävlingsmodal */}
			<BaseModal
				title={
					currentEvent?.status === 'ongoing'
						? 'End event'
						: 'Open event'
				}
				opened={endEventOpened}
				close={endEventHandlers.close}>
				<Stack>
					<Text>
						{currentEvent?.status === 'ongoing'
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
			<BaseModal
				title='Event has ended'
				opened={resultEvent}
				close={resultEventHandlers.close}>
				{/* <CreateItemModal
					close={resultEventHandlers.close}
					type='team'></CreateItemModal> */}
			</BaseModal>
			<Flex m='1rem 0' gap={'sm'}>
				{/* Skapa nytt team button genom öppna modal */}
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
				{/* Avsluta tävling */}
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
