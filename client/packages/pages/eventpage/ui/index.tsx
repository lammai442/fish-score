import { FishEvent, Team } from '@fishScore/eventsdata';
import { capitilizeFirstLetter } from '@fishScore/helpfunctions';
import { PageHeader } from '@fishScore/pageheader';
import { Button, Stack, Tabs } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWebSocketStore } from '@fishScore/usewebsocketstore';
import { fetchEvent } from '@fishScore/apievents';
import { Loading } from '@fishScore/loading';
import { BaseModal } from '@fishScore/basemodal';
import { CreateItemModal } from '@fishScore/createitemmodal';
import { useDisclosure } from '@mantine/hooks';
export const EventPage = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const { id } = useParams();
	const { events } = useWebSocketStore();
	const [currentEvent, setCurrentEvent] = useState<FishEvent | null>(null);
	const [mode, setMode] = useState<string | null>('leaderboard');
	const [opened, { open, close }] = useDisclosure(false);

	useEffect(() => {
		if (!id) {
			return;
		}

		const getEvent = async (id: string) => {
			setLoading(true);
			const result = await fetchEvent(id);

			setLoading(false);
			if (result.success) {
				let event = result.data.event;

				setCurrentEvent(event);
				console.log(currentEvent);
			}
		};

		getEvent(id);
	}, [id]);

	// Synka liveuppdateringar från websocket
	useEffect(() => {
		console.log(events);
		const updatedEvent = events.find((e) => e.id === id);
		console.log('updatedEvent :', updatedEvent);
		setCurrentEvent(updatedEvent);
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
			{/* Skapa nytt team button genom öppna modal */}
			<BaseModal title='Create team' opened={opened} close={close}>
				<CreateItemModal close={close} type='team'></CreateItemModal>
			</BaseModal>
			<Button
				color='var(--bg-black-color)'
				size='lg'
				radius='md'
				onClick={open}>
				+ Create team
			</Button>
			{loading && (
				<Loading visible={loading} text='Loading events'></Loading>
			)}
			{/* Render teams */}
			<Tabs value={mode} onChange={setMode}>
				<Tabs.List>
					<Tabs.Tab value='leaderboard'>Leaderboard</Tabs.Tab>
					<Tabs.Tab value='activity'>Activity</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel value='leaderboard' pt='md'>
					<Stack>
						{currentEvent &&
							currentEvent.teams.map((team: Team) => {
								return (
									<Stack key={team.createdAt}>
										<p>{team.teamName}</p>
										{team.members.map((member, index) => {
											return (
												<p key={index}>{member.name}</p>
											);
										})}
									</Stack>
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
