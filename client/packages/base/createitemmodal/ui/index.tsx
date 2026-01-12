import { Button, Stack, Text, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { useUserStore } from '@fishScore/useUserStore';
import type { FishEvent, Team } from '@fishScore/eventsdata';
import { fetchCreateEvent, fetchCreateTeam } from '@fishScore/apievents';
import { ApiResponse } from '../../../core/interfaces/apidata/data';

type Props = {
	close: () => void;
	type: string;
};

export const CreateItemModal = ({ close, type }: Props) => {
	const [errorInput, setErrorInput] = useState<string>('');
	const [inputValue, setInputValue] = useState<string>('');
	const { user } = useUserStore();

	const handleCreateItem = async () => {
		const emojiRegex = /[\p{Extended_Pictographic}]/u;

		// Rensa tidigare fel
		setErrorInput('');

		const value = inputValue.trim();

		if (value.length === 0) {
			setErrorInput(
				`You need to fill in ${
					type === 'event' ? 'an event' : 'a team'
				} name`
			);
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
		if (!user?.userId) {
			setErrorInput(`You must be logged in to create a ${type}`);
			return;
		}

		let response: ApiResponse<FishEvent | Team>;
		if (type === 'event') {
			const createTypeDesc: FishEvent = {
				eventName: value,
				createdBy: user?.userId,
			};
			response = await fetchCreateEvent(createTypeDesc);
		} else {
			const createTeamDesc: Team = {
				teamName: value,
				createdBy: user.userId,
				members: [user.userId],
				catches: [],
			};
			response = await fetchCreateTeam(createTeamDesc);
		}

		if (response.success) {
			showNotification({
				title: `New ${type} created`,
				message: `The ${type}: ${inputValue} has created`,
				color: 'var(--bg-primary-color)',
				icon: <IconCheck />,
				position: 'top-center',
			});
			setInputValue('');

			close();
		} else {
			setErrorInput(response.error ?? `Unable to create ${type}`);
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
				color='var(--bg-black-color)'
				radius={'md'}
				size='md'
				onClick={handleCreateItem}>
				Create
			</Button>
		</Stack>
	);
};
