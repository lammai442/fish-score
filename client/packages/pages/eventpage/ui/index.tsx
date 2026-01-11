import { FishEvent } from '@fishScore/eventsdata';
import { capitilizeFirstLetter } from '@fishScore/helpfunctions';
import { PageHeader } from '@fishScore/pageheader';
import { Stack } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useWebSocketStore } from '@fishScore/usewebsocketstore';
export const EventPage = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const { events } = useWebSocketStore();
	const [currentEvent, setCurrentEvent] = useState<FishEvent | null>(null);
	const location = useLocation();

	useEffect(() => {
		const eventId = location.state.eventId as string;
		const matchEvent = events.find((e) => e.id === eventId);

		setCurrentEvent(matchEvent);
	}, [events, location]);

	return (
		<Stack>
			{currentEvent && (
				<PageHeader
					title={currentEvent.eventName}
					subTitle={capitilizeFirstLetter(
						currentEvent.status
					)}></PageHeader>
			)}
		</Stack>
	);
};
