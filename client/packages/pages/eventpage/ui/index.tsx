import './index.css';
import type { FishEvent, Team } from '@fishScore/eventsdata';
import { capitilizeFirstLetter } from '@fishScore/helpfunctions';
import { PageHeader } from '@fishScore/pageheader';
import { Button, Stack, Tabs } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWebSocketStore } from '@fishScore/usewebsocketstore';
import { Loading } from '@fishScore/loading';
import { BaseModal } from '@fishScore/basemodal';
import { CreateItemModal } from '@fishScore/createitemmodal';
import { useDisclosure } from '@mantine/hooks';
import { Teams } from '../../../base/teams/ui';
import { useUserStore } from '@fishScore/useUserStore';

export const EventPage = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const { id } = useParams();
	const { events } = useWebSocketStore();
	const [currentEvent, setCurrentEvent] = useState<FishEvent | null>(null);
	const [mode, setMode] = useState<string | null>('leaderboard');
	const [opened, { open, close }] = useDisclosure(false);
	const [leaderboard, setLeaderboard] = useState<Team[]>([]);
	const { user } = useUserStore();

	// useEffect(() => {
	// 	if (!id) {
	// 		return;
	// 	}

	// 	const getEvent = async (id: string) => {
	// 		setLoading(true);
	// 		const result = await fetchEvent(id);

	// 		setLoading(false);
	// 		if (result.success) {
	// 			let event = result.data.event;

	// 			setCurrentEvent(event);

	// 			const sortedLeaderboard = event.teams.sort(
	// 				(a: Team, b: Team) =>
	// 					b.totalCatchWeight - a.totalCatchWeight,
	// 			);
	// 			setLeaderboard(sortedLeaderboard);
	// 		}
	// 	};

	// 	getEvent(id);
	// }, []);

	// Synka liveuppdateringar från websocket
	useEffect(() => {
		setLoading(true);
		const updatedEvent = events.find((e) => e.id === id);

		setCurrentEvent(updatedEvent);

		const sortedLeaderboard: Team[] = updatedEvent.teams.sort(
			(a: Team, b: Team) => b.totalCatchWeight - a.totalCatchWeight,
		);

		if (sortedLeaderboard) {
			setLeaderboard(sortedLeaderboard);
		}
		setLoading(false);
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

			{loading && (
				<Loading visible={loading} text='Loading events'></Loading>
			)}

			{/* Rendera teams */}

			{/* Skapa nytt team button genom öppna modal */}
			{leaderboard.length === 0 && (
				<>
					<BaseModal
						title='Create team'
						opened={opened}
						close={close}>
						<CreateItemModal
							close={close}
							type='team'></CreateItemModal>
					</BaseModal>
					<Button
						color='var(--bg-black-color)'
						size='lg'
						radius='md'
						onClick={open}>
						+ Create team
					</Button>
				</>
			)}

			<>
				<BaseModal title='Create team' opened={opened} close={close}>
					<CreateItemModal
						close={close}
						type='team'></CreateItemModal>
				</BaseModal>
				<Button
					color='var(--bg-black-color)'
					size='lg'
					radius='md'
					onClick={open}>
					+ Create team
				</Button>
			</>

			<Tabs
				variant='pills'
				value={mode}
				onChange={setMode}
				classNames={{
					tab: 'scoreboard__tab',
					list: 'scoreboard__list',
				}}>
				{/* Tab  */}
				<Tabs.List grow justify='center'>
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
										rankNr={index + 1}></Teams>
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
