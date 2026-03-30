import { Button, Stack, Text, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { useUserStore } from '@fishScore/useUserStore';
import type { NewFishEvent } from '@fishScore/eventsdata';
import { fetchCreateEvent } from '@fishScore/apievents';

type Props = {
	close: () => void;
};

export const CreateEvent = ({ close }: Props) => {
	const [errorInput, setErrorInput] = useState<string>('');
	const [inputValue, setInputValue] = useState<string>('');
	const { user } = useUserStore();

	const handleCreateEvent = async () => {
		// Rensa tidigare fel
		setErrorInput('');

		const emojiRegex = /[\p{Extended_Pictographic}]/u;
		const value = inputValue.trim();

		if (value.length === 0) {
			setErrorInput('You need to fill in an event name');
			return;
		}

		if (value.length > 18) {
			setErrorInput('Max 18 characters');
			return;
		}

		if (emojiRegex.test(value)) {
			setErrorInput('Emojis are not allowed');
			return;
		}

		const createEventDesc: NewFishEvent = {
			eventName: value,
			createdBy: user?.userId,
		};

		const response = await fetchCreateEvent(createEventDesc);
		if (response.success) {
			showNotification({
				title: 'New event created',
				message: `The event: ${inputValue} has created`,
				color: 'var(--bg-primary)',
				icon: <IconCheck />,
				position: 'top-center',
			});
			setInputValue('');

			close();
		} else {
			setErrorInput(response.data.error);
		}
	};
	return (
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
				color='var(--color-black)'
				radius={'md'}
				size='md'
				onClick={handleCreateEvent}>
				Create
			</Button>
		</Stack>
	);
};
