import './index.css';
import type { FishEvent } from '@fishScore/eventsdata';
import { capitilizeFirstLetter } from '@fishScore/helpfunctions';
import { PageHeader } from '@fishScore/pageheader';
import {
	ActionIcon,
	Button,
	Flex,
	Stack,
	Tabs,
	Text,
	Title,
} from '@mantine/core';
import { useState, useEffect, act } from 'react';
import { useParams } from 'react-router-dom';
import { useWebSocketStore } from '@fishScore/usewebsocketstore';
import { BaseModal } from '@fishScore/basemodal';
import { CreateItemModal } from '@fishScore/createitemmodal';
import { useDisclosure } from '@mantine/hooks';
import { Teams } from '../../../base/teams/ui';
import { useUserStore } from '@fishScore/useUserStore';
import { IconUsers } from '@tabler/icons-react';
import type { Team } from '../../../core/interfaces/teamsdata/data';
import { fetchEventView } from '@fishScore/apievents';
import { Loading } from '@fishScore/loading';
import { FishCatch } from '../../../core/interfaces/fishcatchdata/data';
import { ActivityCatch } from '../../../base/activitycatch/ui';
import { AddCatch } from '../../../base/addcatch/ui';

export const EventPage = () => {
	const { eventId } = useParams();
	const { events } = useWebSocketStore();
	const [currentEvent, setCurrentEvent] = useState<FishEvent | null>(null);
	const [mode, setMode] = useState<string | null>('leaderboard');
	const [createTeamOpened, createTeamHandlers] = useDisclosure(false);
	const [addCatchOpened, addCatchHandlers] = useDisclosure(false);
	const [leaderboard, setLeaderboard] = useState<Team[]>([]);
	const [activity, setActivity] = useState<FishCatch[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
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

	// Synka liveuppdateringar från websocket
	// useEffect(() => {
	// 	const updatedEvent = events.find((e) => e.eventId === eventId);
	// 	console.log('updatedEvent: ', updatedEvent);
	// 	if (!updatedEvent) {
	// 		return;
	// 	}
	// 	setCurrentEvent(updatedEvent);

	// 	const sortedLeaderboard: Team[] = updatedEvent.teams.sort(
	// 		(a: Team, b: Team) => b.totalCatchWeight - a.totalCatchWeight,
	// 	);

	// 	if (sortedLeaderboard) {
	// 		setLeaderboard(sortedLeaderboard);
	// 	}
	// }, [events]);

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

			{/* Skapa nytt team button genom öppna modal */}
			{eventCreatedByUser && currentEvent && (
				<>
					<BaseModal
						title='Create team'
						opened={createTeamOpened}
						close={createTeamHandlers.close}>
						<CreateItemModal
							close={createTeamHandlers.close}
							type='team'></CreateItemModal>
					</BaseModal>
					<Button
						color='var(--color-black)'
						size='lg'
						radius='md'
						onClick={createTeamHandlers.open}>
						+ Create team
					</Button>
				</>
			)}
			{/* Add catch knapp*/}
			<>
				<BaseModal
					title='Add new catch'
					opened={addCatchOpened}
					close={addCatchHandlers.close}>
					<AddCatch
						close={addCatchHandlers.close}
						eventId={eventId}
						teamId={usersTeam?.teamId}></AddCatch>
				</BaseModal>
				<ActionIcon
					radius={'xl'}
					size={'50px'}
					fz={'xl'}
					pos={'fixed'}
					right={'1.5rem'}
					bottom={'1.5rem'}
					color='var(--color-black)'
					disabled={!usersTeam ? true : false}
					style={{ zIndex: 1000 }}
					onClick={addCatchHandlers.open}>
					+
				</ActionIcon>
			</>

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
											eventId={eventId}></Teams>
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
										<ActivityCatch
											key={fishCatch.catchId}
											fishCatch={fishCatch}
											userId={
												user?.userId
											}></ActivityCatch>
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
				</Tabs>
			)}
		</>
	);
};
