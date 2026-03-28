import {
	fetchSubscribeToEvent,
	fetchUnsubscribeToEvent,
} from '@fishScore/apievents';
import { FishEvent } from '@fishScore/eventsdata';
import { ActionIcon, Tooltip } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import {
	IconCheck,
	IconStar,
	IconStarFilled,
	IconX,
} from '@tabler/icons-react';

type Props = {
	userId: string | undefined;
	currentEvent: FishEvent | null;
};

export const SubscribeBtn = ({ userId, currentEvent }: Props) => {
	if (!userId || !currentEvent) {
		return;
	}
	const isSubscriberToEvent = currentEvent.subscribers.includes(userId);

	const handleEventSubscription = async () => {
		let response = null;

		if (isSubscriberToEvent) {
			console.log('unsubscribe');

			response = await fetchUnsubscribeToEvent(currentEvent.eventId);
		} else {
			console.log('Subscribe');
			response = await fetchSubscribeToEvent(currentEvent.eventId);
		}
		console.log('Subscriberesponse: ', response);
		if (response.success) {
			showNotification({
				title: 'Subscription',
				message: isSubscriberToEvent
					? 'You have successfully unfollowed this event'
					: 'You are now following this event and will receive updates',
				color: 'var(--color-primary)',
				icon: <IconCheck />,
				position: 'top-center',
			});
		} else {
			showNotification({
				title: 'Subscription',
				message:
					'Something went wrong with manage subscription to this event',
				color: 'var(--color-danger)',
				icon: <IconX />,
				position: 'top-center',
			});
		}
	};

	return (
		<Tooltip
			label={
				isSubscriberToEvent
					? 'Unfollow this event'
					: 'Follow this event'
			}>
			<ActionIcon bg={'transparent'} onClick={handleEventSubscription}>
				{isSubscriberToEvent ? (
					<IconStarFilled color='var(--color-gold)'></IconStarFilled>
				) : (
					<IconStar color='var(--color-gold)'></IconStar>
				)}
			</ActionIcon>
		</Tooltip>
	);
};
