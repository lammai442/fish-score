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
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWebSocketStore } from '@fishScore/usewebsocketstore';
import { BaseModal } from '@fishScore/basemodal';
import { CreateItemModal } from '@fishScore/createitemmodal';
import { useDisclosure } from '@mantine/hooks';
import { Teams } from '../../../base/teams/ui';
import { useUserStore } from '@fishScore/useUserStore';
import { IconUsers } from '@tabler/icons-react';
import { Catch } from '../../../base/catch/ui';
import type { Team } from '../../../core/interfaces/teamsdata/data';

export const EventPage = () => {
	const { id } = useParams();
	const { events } = useWebSocketStore();
	const [currentEvent, setCurrentEvent] = useState<FishEvent | null>(null);
	const [mode, setMode] = useState<string | null>('leaderboard');
	const [createTeamOpened, createTeamHandlers] = useDisclosure(false);
	const [addCatchOpened, addCatchHandlers] = useDisclosure(false);
	const [leaderboard, setLeaderboard] = useState<Team[]>([]);
	const { user } = useUserStore();

	const usersTeam = currentEvent?.teams.find((team) =>
		team.members.some((member) => member.userId === user?.userId),
	);
	// Synka liveuppdateringar från websocket
	useEffect(() => {
		const updatedEvent = events.find((e) => e.id === id);

		setCurrentEvent(updatedEvent);

		const sortedLeaderboard: Team[] = updatedEvent.teams.sort(
			(a: Team, b: Team) => b.totalCatchWeight - a.totalCatchWeight,
		);

		if (sortedLeaderboard) {
			setLeaderboard(sortedLeaderboard);
		}
	}, [events]);

	return (
		<>
			<Stack>
				{currentEvent && (
					<PageHeader
						title={currentEvent.eventName}
						subTitle={capitilizeFirstLetter(
							currentEvent.status,
						)}></PageHeader>
				)}
			</Stack>

			{/* Join a team message */}
			{!usersTeam && (
				<Flex
					bdrs={'lg'}
					p={'md'}
					bg={'var(--bg-light-orange-color)'}
					bd={'1px solid var(--br-orange)'}>
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
			{leaderboard.length === 0 && (
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
						color='var(--bg-black-color)'
						size='lg'
						radius='md'
						onClick={createTeamHandlers.open}>
						+ Create team
					</Button>
				</>
			)}
			{/* Catch knapp*/}
			<>
				<BaseModal
					title='Add new catch'
					opened={addCatchOpened}
					close={addCatchHandlers.close}>
					<Catch
						close={addCatchHandlers.close}
						eventId={id}
						teamId={usersTeam?.teamId}></Catch>
				</BaseModal>
				<ActionIcon
					radius={'xl'}
					size={'50px'}
					fz={'xl'}
					pos={'fixed'}
					right={'1.5rem'}
					bottom={'1.5rem'}
					color='var(--bg-black-color)'
					disabled={!usersTeam ? true : false}
					style={{ zIndex: 1000 }}
					onClick={addCatchHandlers.open}>
					+
				</ActionIcon>
			</>

			{/* Leaderboard/Activity tab  */}
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
					bg={'var(--bg-medium-light-grey-color)'}
					bdrs={15}>
					<Tabs.Tab value='leaderboard'>Leaderboard</Tabs.Tab>
					<Tabs.Tab value='activity'>Activity</Tabs.Tab>
				</Tabs.List>
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
										eventId={id}></Teams>
								);
							})}
					</Stack>
				</Tabs.Panel>

				<Tabs.Panel value='activity' pt='md'>
					<p>Activity content</p>
				</Tabs.Panel>
			</Tabs>
		</>
	);
};
