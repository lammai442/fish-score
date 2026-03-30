import { BaseModal } from '@fishScore/basemodal';
import { CreateItemModal } from '@fishScore/createitemmodal';
import { Button, Flex, Stack, Text, TextInput, Tooltip } from '@mantine/core';
import { IconSettings, IconTrash, IconTrophy } from '@tabler/icons-react';
import { useDisclosure, UseDisclosureHandlers } from '@mantine/hooks';
import { FishEvent } from '@fishScore/eventsdata';
import { useState } from 'react';

type Props = {
	currentEvent: FishEvent;
	eventCreatedByUser: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	endEventHandlers: UseDisclosureHandlers;
};

export const AdminActions = ({
	currentEvent,
	eventCreatedByUser,
	setLoading,
	endEventHandlers,
}: Props) => {
	const [createTeamOpened, createTeamHandlers] = useDisclosure(false);
	const [editEventOpened, editEventHandlers] = useDisclosure(false);
	const [inputValue, setInputValue] = useState<string>(
		currentEvent.eventName,
	);
	const [errorInput, setErrorInput] = useState<string>('');

	const handleChangeName = () => {
		// Rensa tidigare fel
		setErrorInput('');

		const emojiRegex = /[\p{Extended_Pictographic}]/u;
		const value = inputValue.trim();

		if (value.length === 0) {
			setErrorInput('You need to fill in an event name');
			return;
		}
		if (value === currentEvent.eventName.toLowerCase()) {
			setErrorInput('New event name is the same as current event name');
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
	};

	return (
		<Flex m='1rem 0' gap={'sm'}>
			{/* Öppna modal för att skapa nytt lag */}
			<BaseModal
				title='Create team'
				opened={createTeamOpened}
				close={createTeamHandlers.close}>
				<CreateItemModal
					close={createTeamHandlers.close}
					type='team'></CreateItemModal>
			</BaseModal>
			{/* Öppna edit event modal */}
			<BaseModal
				title='Edit event'
				opened={editEventOpened}
				close={editEventHandlers.close}>
				<Stack gap={'xs'}>
					{currentEvent.teams && currentEvent.teams.length > 0 && (
						<>
							<Text>Change event name</Text>
							<Flex gap={'xs'}>
								<TextInput
									defaultValue={inputValue}
									flex={'9'}
									onChange={(event) => {
										setInputValue(
											event.currentTarget.value,
										);
										setErrorInput('');
									}}
									error={errorInput}></TextInput>
								<Button
									bg={'var(--btn-primary-bg)'}
									onClick={handleChangeName}>
									Change
								</Button>
							</Flex>
							<Text>
								{currentEvent?.status === 'ongoing'
									? 'Do you want to end event'
									: 'Do you want to Open event'}
							</Text>
							<Button
								w={'fit-content'}
								p={'0.5rem'}
								radius='md'
								bg={
									currentEvent.status === 'ongoing'
										? 'var(--color-gold)'
										: 'var(--bg-primary)'
								}
								c={
									currentEvent.status === 'ongoing'
										? 'var(--text-primary)'
										: 'var(--text-inverse)'
								}
								onClick={() => {
									endEventHandlers.open();
									editEventHandlers.close();
								}}>
								<Flex gap={'xs'}>
									<IconTrophy></IconTrophy>{' '}
									<Text>
										{currentEvent?.status === 'ongoing'
											? 'End event'
											: 'Open event'}
									</Text>
								</Flex>
							</Button>
						</>
					)}
					<Text>Do you wish to delete event?</Text>
					<Button
						w={'fit-content'}
						radius='md'
						p={'0.5rem'}
						bg='var(--btn-danger-bg)'>
						<Flex gap={'xs'}>
							<IconTrash size={20}></IconTrash>
							<Text>Delete event</Text>
						</Flex>
					</Button>
				</Stack>
			</BaseModal>

			{/* Create team btn */}
			<Tooltip
				label={
					currentEvent.status === 'completed'
						? 'Event has ended'
						: 'Only the event admin can create new teams'
				}
				disabled={
					currentEvent.status !== 'completed' && eventCreatedByUser
				}>
				<Button
					p={'0.6rem'}
					color='var(--color-black)'
					size='sm'
					radius='md'
					disabled={
						!eventCreatedByUser ||
						currentEvent?.status === 'completed'
					}
					onClick={createTeamHandlers.open}>
					+ Create team
				</Button>
			</Tooltip>
			<Tooltip label='Settings for this event'>
				<Button
					p={'0.1rem 0.6rem'}
					color='var(--color-grey)'
					c={'var(--text-primary)'}
					size='sm'
					radius='md'
					onClick={editEventHandlers.open}>
					<Flex gap={'0.3rem'}>
						<IconSettings></IconSettings> <Text>Edit event</Text>
					</Flex>
				</Button>
			</Tooltip>
		</Flex>
	);
};
