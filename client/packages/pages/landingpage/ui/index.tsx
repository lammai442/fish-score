import { Stack, Button, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BaseModal } from '@fishScore/basemodal';
import { useState } from 'react';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useUserStore } from '@fishScore/useUserStore';
import { useWebSocketStore } from '@fishScore/usewebsocketstore';
import { CreateEvent } from '@fishScore/interfaces/eventsdata/data';

export const LandingPage = () => {
	const [opened, { open, close }] = useDisclosure(false);
	const [errorInput, setErrorInput] = useState<string>('');
	const [inputValue, setInputValue] = useState<string>('');
	const { events } = useWebSocketStore();
	const { user } = useUserStore();

	const handleCreateEvent = () => {
		const emojiRegex = /[\p{Extended_Pictographic}]/u;

		// Rensa tidigare fel
		setErrorInput('');

		const value = inputValue.trim();

		if (value.length === 0) {
			setErrorInput('You need to fill in an event name');
			return;
		}

		if (value.length > 10) {
			setErrorInput('Max 10 characters');
			return;
		}

		if (emojiRegex.test(value)) {
			setErrorInput('Emojis are not allowed');
			return;
		}

		showNotification({
			title: 'New event created',
			message: `The event: ${inputValue} has created`,
			color: 'var(--bg-primary-color)',
			icon: <IconCheck />,
			position: 'top-center',
		});

		const createEventDesc: CreateEvent = {
			eventName: value,
			userId: user?.userId,
		};

		close();
	};

	return (
		<>
			<Stack>
				<Button
					color='var(--bg-black-color)'
					size='lg'
					radius='md'
					onClick={open}>
					+ Create Event
				</Button>
				{/* Modal för att skapa ett nytt event */}
				<BaseModal title='Create Event' opened={opened} close={close}>
					<Stack>
						<Text>Add a new fishing event</Text>
						<TextInput
							label='Event name'
							value={inputValue}
							onChange={(event) => {
								setInputValue(event.currentTarget.value);
								setErrorInput('');
							}}
							error={errorInput}></TextInput>
						<Button
							color='var(--bg-black-color)'
							radius={'md'}
							size='md'
							onClick={handleCreateEvent}>
							Create
						</Button>
					</Stack>
				</BaseModal>
			</Stack>
			{events.length > 0 &&
				events.map((event, index) => {
					console.log(event);
					return <div key={index}>{event.eventName}</div>;
				})}
		</>
	);
};
