import { BaseModal } from '@fishScore/basemodal';
import { CreateItemModal } from '@fishScore/createitemmodal';
import { Button, Flex, Tooltip } from '@mantine/core';
import { IconTrophy } from '@tabler/icons-react';
import { useDisclosure, UseDisclosureHandlers } from '@mantine/hooks';
import { FishEvent } from '@fishScore/eventsdata';

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
	return (
		<Flex m='1rem 0' gap={'sm'}>
			{/* Skapa nytt lag */}
			<BaseModal
				title='Create team'
				opened={createTeamOpened}
				close={createTeamHandlers.close}>
				<CreateItemModal
					close={createTeamHandlers.close}
					type='team'></CreateItemModal>
			</BaseModal>

			<Tooltip
				label={
					currentEvent?.status === 'completed'
						? 'Event has ended'
						: 'Only the event admin can create new teams'
				}
				disabled={
					currentEvent?.status !== 'completed' && eventCreatedByUser
				}>
				<Button
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

			{eventCreatedByUser &&
				currentEvent?.teams &&
				currentEvent?.teams?.length > 0 && (
					<Button
						radius='md'
						bg={
							currentEvent?.status === 'ongoing'
								? 'var(--color-gold)'
								: 'var(--bg-primary)'
						}
						c={
							currentEvent?.status === 'ongoing'
								? 'var(--text-primary)'
								: 'var(--text-inverse)'
						}
						onClick={endEventHandlers.open}>
						<IconTrophy></IconTrophy>{' '}
						{currentEvent?.status === 'ongoing'
							? 'End event'
							: 'Open event'}
					</Button>
				)}
		</Flex>
	);
};
