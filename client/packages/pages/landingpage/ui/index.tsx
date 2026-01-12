import { Stack, Button } from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';
import { useWebSocketStore } from '@fishScore/usewebsocketstore';
import { CreateEvent } from '@fishScore/createevent';
import { BaseModal } from '@fishScore/basemodal';
import { useUserStore } from '@fishScore/useUserStore';
import { Events } from '@fishScore/events';
import { CreateItemModal } from '@fishScore/createitemmodal';

export const LandingPage = () => {
	const { events } = useWebSocketStore();
	const [opened, { open, close }] = useDisclosure(false);
	const { user } = useUserStore();

	return (
		<>
			{/* Modal för att skapa ett nytt event */}
			<BaseModal title='Create Event' opened={opened} close={close}>
				{' '}
				<CreateItemModal close={close} type='event'></CreateItemModal>
				{/* <CreateEvent close={close}></CreateEvent> */}
			</BaseModal>
			<Stack>
				<Button
					color='var(--bg-black-color)'
					size='lg'
					radius='md'
					onClick={open}>
					+ Create Event
				</Button>
				<Events events={events}></Events>
			</Stack>
		</>
	);
};
