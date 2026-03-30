import { BaseModal } from '@fishScore/basemodal';
import { CreateItemModal } from '@fishScore/createitemmodal';
import { Button, Flex, Stack, Text, TextInput, Tooltip } from '@mantine/core';
import {
	IconCheck,
	IconSettings,
	IconTrash,
	IconTrophy,
} from '@tabler/icons-react';
import type { UseDisclosureHandlers } from '@mantine/hooks';
import { useDisclosure } from '@mantine/hooks';
import type { FishEvent } from '@fishScore/eventsdata';
import { useState } from 'react';
import { validateInput } from './validateinput';
import { fetchDeleteEvent, fetchUpdateEvent } from '@fishScore/apievents';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

type Props = {
	currentEvent: FishEvent;
	eventCreatedByUser: boolean;
	endEventHandlers: UseDisclosureHandlers;
	editEventOpened: boolean;
	editEventHandlers: UseDisclosureHandlers;
};

export const AdminActions = ({
	currentEvent,
	eventCreatedByUser,
	endEventHandlers,
	editEventOpened,
	editEventHandlers,
}: Props) => {
	const [createTeamOpened, createTeamHandlers] = useDisclosure(false);
	const [deleteEventOpened, deleteEventHandlers] = useDisclosure(false);
	const [inputValue, setInputValue] = useState<string>(
		currentEvent.eventName,
	);
	const [errorInput, setErrorInput] = useState<string>('');
	const navigate = useNavigate();

	const handleChangeName = async () => {
		const inputValidated = validateInput(
			inputValue,
			setErrorInput,
			currentEvent.eventName,
		);

		if (inputValidated) {
			const response = await fetchUpdateEvent(
				currentEvent.eventId,
				inputValue,
			);
			if (response.success) {
				showNotification({
					title: 'Event name changed',
					message: `Your event name has changed to ${inputValue}`,
					color: 'var(--color-primary)',
					icon: <IconCheck />,
					position: 'top-center',
				});
			}
		}
	};

	const handleDeleteEvent = async () => {
		const response = await fetchDeleteEvent(currentEvent.eventId);
		if (response.success) {
			navigate('/', { replace: true });
			showNotification({
				title: 'Event deleted',
				message: `This event and all related teams and catches has been deleted`,
				color: 'var(--color-primary)',
				icon: <IconCheck />,
				position: 'top-center',
			});
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
					<>
						{/* Change name */}
						{currentEvent.status === 'ongoing' && (
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
							</>
						)}
						{/* End/Reopen event */}
						{currentEvent.teams &&
							currentEvent.teams.length > 0 && (
								<>
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
										}}>
										<Flex gap={'xs'}>
											<IconTrophy></IconTrophy>{' '}
											<Text>
												{currentEvent?.status ===
												'ongoing'
													? 'End event'
													: 'Open event'}
											</Text>
										</Flex>
									</Button>
								</>
							)}
					</>
					<Text>Do you wish to delete event?</Text>
					<Button
						w={'fit-content'}
						radius='md'
						p={'0.5rem'}
						bg='var(--btn-danger-bg)'
						onClick={() => deleteEventHandlers.open()}>
						<Flex gap={'xs'}>
							<IconTrash size={20}></IconTrash>
							<Text>Delete event</Text>
						</Flex>
					</Button>
				</Stack>
			</BaseModal>

			{/* Öppna modal för att delete event*/}
			<BaseModal
				title='Delete event'
				opened={deleteEventOpened}
				close={deleteEventHandlers.close}>
				<Stack>
					<Text c={'var(--text-danger)'}>
						This will permanently delete the event and all related
						teams and catches.
					</Text>
					<Text>Are you sure you want to delete this event?</Text>
					<Flex gap={'xs'}>
						<Button
							bg={'var(--btn-primary-bg)'}
							onClick={deleteEventHandlers.close}>
							No
						</Button>
						<Button
							bg={'var(--btn-danger-bg)'}
							onClick={handleDeleteEvent}>
							Yes
						</Button>
					</Flex>
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
