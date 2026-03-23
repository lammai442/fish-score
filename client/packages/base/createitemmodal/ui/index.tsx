import { Button, Stack, Text, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { useUserStore } from '@fishScore/useUserStore';
import type { FishEvent, NewFishEvent } from '@fishScore/eventsdata';
import { fetchCreateEvent, fetchCreateTeam } from '@fishScore/apievents';
import type { ApiResponse } from '../../../core/interfaces/apidata/data';
import { useParams } from 'react-router-dom';
import type {
	createNewTeam,
	Team,
} from '../../../core/interfaces/teamsdata/data';
import { Loading } from '@fishScore/loading';

type Props = {
	close: () => void;
	type: string;
};

export const CreateItemModal = ({ close, type }: Props) => {
	const [errorInput, setErrorInput] = useState<string>('');
	const [inputValue, setInputValue] = useState<string>('');
	const { user } = useUserStore();
	const { eventId } = useParams();
	const [loading, setLoading] = useState<boolean>(false);

	const handleCreateItem = async () => {
		const emojiRegex = /[\p{Extended_Pictographic}]/u;

		// Rensa tidigare fel
		setErrorInput('');

		const value = inputValue.trim();

		if (value.length === 0) {
			setErrorInput(
				`You need to fill in ${
					type === 'event' ? 'an event' : 'a team'
				} name`,
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
		try {
			setLoading(true);
			if (type === 'event') {
				const createEventDesc: NewFishEvent = {
					eventName: value,
					createdBy: user?.userId,
				};
				response = await fetchCreateEvent(createEventDesc);
			} else {
				const createTeamDesc: createNewTeam = {
					eventId: eventId,
					teamName: value,
					createdBy: user.userId,
				};
				response = await fetchCreateTeam(createTeamDesc);
			}

			if (response.success) {
				showNotification({
					title: `New ${type} created`,
					message: `The ${type}: ${inputValue} has created`,
					color: 'var(--bg-primary)',
					icon: <IconCheck />,
					position: 'top-center',
				});
				setInputValue('');

				close();
			} else if (!response.success) {
				if (response.data && 'error' in response.data) {
					setErrorInput(response.data.error);
				} else if (response.error) {
					setErrorInput(response.error);
				} else {
					setErrorInput('Something went wrong');
				}
			}
		} finally {
			setLoading(false);
		}
	};
	return (
		<>
			<Loading visible={loading} text='Creating new event'></Loading>
			<Stack>
				<Text>
					{type === 'event'
						? 'Add a new fishing event'
						: 'Add a new team'}
				</Text>
				<TextInput
					label={type === 'event' ? 'Event name' : 'Team name'}
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
					onClick={handleCreateItem}>
					Create
				</Button>
			</Stack>
		</>
	);
};
