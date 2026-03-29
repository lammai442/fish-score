import { Stack, Button, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useWebSocketStore } from '@fishScore/usewebsocketstore';
import { BaseModal } from '@fishScore/basemodal';
import { Events } from '@fishScore/events';
import { CreateItemModal } from '@fishScore/createitemmodal';
import { useEffect } from 'react';
import { fetchAllEvents } from '@fishScore/apievents';

export const LandingPage = () => {
	const { events, setEvents } = useWebSocketStore();
	const [opened, { open, close }] = useDisclosure(false);

	useEffect(() => {
		const getAllEvents = async () => {
			const response = await fetchAllEvents();
			if (response.success) {
				setEvents(response.data.events);
			}
		};

		getAllEvents();
	}, []);

	const ongoingEvents = events.filter((e) => e.status === 'ongoing');
	const completedEvents = events.filter((e) => e.status === 'completed');

	return (
		<>
			{/* Modal för att skapa ett nytt event */}
			<BaseModal title='Create Event' opened={opened} close={close}>
				{' '}
				<CreateItemModal close={close} type='event'></CreateItemModal>
			</BaseModal>
			<Stack>
				<Button
					color='var(--color-black)'
					size='lg'
					radius='md'
					onClick={open}>
					+ Create Event
				</Button>
				{ongoingEvents && ongoingEvents.length > 0 && (
					<Events
						events={ongoingEvents}
						title='Ongoing events'></Events>
				)}
				{completedEvents && completedEvents.length > 0 && (
					<Events
						events={completedEvents}
						title='Completed events'></Events>
				)}
				{/* No events */}
				{events.length === 0 && (
					<Text ta={'center'}>
						No events yet. Set up a fishing event and see who
						catches the biggest one.
					</Text>
				)}
			</Stack>
		</>
	);
};
