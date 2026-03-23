import './index.css';
import type { EventMessage, FishEvent } from '@fishScore/eventsdata';
import { capitilizeFirstLetter } from '@fishScore/helpfunctions';
import { PageHeader } from '@fishScore/pageheader';
import {
	ActionIcon,
	Button,
	Divider,
	Flex,
	Stack,
	Tabs,
	Text,
	Textarea,
	Title,
	Tooltip,
	TooltipGroup,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWebSocketStore } from '@fishScore/usewebsocketstore';
import { BaseModal } from '@fishScore/basemodal';
import { CreateItemModal } from '@fishScore/createitemmodal';
import { useDisclosure } from '@mantine/hooks';
import { Teams } from '../../../base/teams/ui';
import { useUserStore } from '@fishScore/useUserStore';
import { IconCheck, IconTrophy, IconUsers } from '@tabler/icons-react';
import { fetchEventStatus, fetchEventView } from '@fishScore/apievents';
import { Loading } from '@fishScore/loading';
import type { Team } from '../../../core/interfaces/teamsdata/data';
import type { FishCatch } from '@fishScore/fishcatchdata';
import { FishCatchCard } from '@fishScore/fishcatchcard';
import { AddCatch } from '@fishScore/addcatch';
import { showNotification } from '@mantine/notifications';
import { EventsMessage } from '@fishScore/eventsmessage';
import { fetchAddMessage } from '../../../core/api/apimessages/data';

export const EventPage = () => {
	const { eventId } = useParams();
	const { events } = useWebSocketStore();
	const [currentEvent, setCurrentEvent] = useState<FishEvent | null>(null);
	const [mode, setMode] = useState<string | null>('leaderboard');
	const [createTeamOpened, createTeamHandlers] = useDisclosure(false);
	const [addCatchOpened, addCatchHandlers] = useDisclosure(false);
	const [endEventOpened, endEventHandlers] = useDisclosure(false);
	const [leaderboard, setLeaderboard] = useState<Team[]>([]);
	const [activity, setActivity] = useState<FishCatch[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [message, setMessage] = useState<string>('');
	const { user } = useUserStore();

	// Kontroll om user finns i team
	const usersTeam = currentEvent?.teams?.find((team) =>
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

	const handleSendMsg = async () => {
		try {
			setLoading(true);

			const response = await fetchAddMessage(
				currentEvent?.eventId,
				message,
			);
			console.log('response: ', response);
			if (response.success) {
				setMessage('');
				showNotification({
					title: 'Message',
					message: 'Your new message has been published!',
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
			{!loading && currentEvent && !usersTeam && (
				<Flex
					bdrs={'lg'}
					p={'md'}
					bg={'var(--bg-orange-light)'}
					bd={'1px solid var(--border-warning)'}>
					<IconUsers size={50} />
					<Stack>
						<Title order={4}>Join a team to participate</Title>
						<Text>
							You need to join or create a team before you can
							register catches for this event.
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
			<Flex m='1rem 0' gap={'sm'}>
				{/* Skapa nytt team button genom öppna modal */}
				<Tooltip
					label={
						currentEvent?.status === 'completed'
							? 'Event has ended'
							: 'Only the event admin can create new teams'
					}
					disabled={currentEvent?.status !== 'completed'}>
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
				{eventCreatedByUser && (
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
			<BaseModal
				title='Add new catch'
				opened={addCatchOpened}
				close={addCatchHandlers.close}>
				<AddCatch
					close={addCatchHandlers.close}
					eventId={eventId}
					teamId={usersTeam?.teamId}></AddCatch>
			</BaseModal>
			{/* Lägg till en ny catch */}
			<Tooltip
				label='Event has ended'
				disabled={currentEvent?.status === 'ongoing'}>
				<ActionIcon
					radius={'xl'}
					size={'50px'}
					fz={'xl'}
					pos={'fixed'}
					right={'1.5rem'}
					bottom={'1.5rem'}
					color='var(--color-black)'
					disabled={
						currentEvent?.status !== 'ongoing' || !usersTeam
							? true
							: false
					}
					style={{ zIndex: 1000 }}
					onClick={addCatchHandlers.open}>
					+
				</ActionIcon>
			</Tooltip>

			{/* Leaderboard/Activity tab  */}
			{!loading && currentEvent && (
				<Tabs
					variant='pills'
					value={mode}
					onChange={setMode}
					classNames={{
						tab: 'scoreboard__tab',
						list: 'scoreboard__list',
					}}>
					<Tabs.List
						grow
						justify='center'
						p={'0.2rem'}
						bg={'var(--bg-muted)'}
						bdrs={15}>
						<Tabs.Tab value='leaderboard'>Leaderboard</Tabs.Tab>
						<Tabs.Tab value='activity'>Activity</Tabs.Tab>
						<Tabs.Tab value='messages'>Messages</Tabs.Tab>
					</Tabs.List>
					{/* Leaderboard tab */}
					<Tabs.Panel value='leaderboard' pt='md'>
						<Stack>
							{currentEvent &&
								leaderboard.map((team: Team, index) => {
									return (
										<Teams
											key={team.teamId}
											team={team}
											userId={user?.userId}
											rankNr={index + 1}
											userIsInAnyTeam={!!usersTeam}
											eventId={eventId}
											createdBy={
												currentEvent.createdBy
											}></Teams>
									);
								})}
						</Stack>
					</Tabs.Panel>
					{/* Activity tab */}
					<Tabs.Panel value='activity' pt='md'>
						<Stack>
							{activity.length > 0 ? (
								activity.map((fishCatch) => {
									return (
										<FishCatchCard
											key={fishCatch.catchId}
											fishCatch={fishCatch}
											eventStatus={currentEvent.status}
											userId={user?.userId}
											variant='activityCatch'></FishCatchCard>
									);
								})
							) : (
								<Text ta={'center'}>
									No fish has been caught! Who will be the
									first one?
								</Text>
							)}
						</Stack>
					</Tabs.Panel>
					{/* Messages tab */}
					<Tabs.Panel value='messages' pt='md'>
						<Stack>
							<Flex gap={'sm'}>
								<Textarea
									placeholder='New message'
									autosize
									maxRows={4}
									flex={9}
									value={message}
									onChange={(event) =>
										setMessage(event.currentTarget.value)
									}
									styles={{
										input: {
											'--input-bd-focus':
												'var(--color-black)',
										},
									}}></Textarea>
								<Button
									flex={1}
									bg={
										!message.trim()
											? 'var(--color-grey)'
											: 'var(--color-black)'
									}
									fz={'0.68rem'}
									disabled={!message.trim()}
									onClick={handleSendMsg}>
									Send
								</Button>
							</Flex>

							{currentEvent.messages.length > 0 && (
								<Stack
									gap={'sm'}
									bd={'1px solid var(--color-grey-dark)'}
									p={'sm'}
									bdrs={'lg'}>
									{currentEvent.messages.map(
										(message, index) => {
											const isLast =
												index ===
												currentEvent.messages.length -
													1;
											const hasMultiple =
												currentEvent.messages.length >
												1;

											return (
												<Stack
													gap={'sm'}
													key={message.messageId}>
													<EventsMessage
														eventMessage={message}
														userId={
															user?.userId
														}></EventsMessage>
													{hasMultiple && !isLast && (
														<Divider
															key={index}
															size={'sm'}
														/>
													)}
												</Stack>
											);
										},
									)}
								</Stack>
							)}
						</Stack>
					</Tabs.Panel>
				</Tabs>
			)}
		</>
	);
};
