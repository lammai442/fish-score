import { useUserStore } from '@fishScore/useUserStore';
import { fetchAddCatch } from '@fishScore/apicatches';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { CatchForm } from '../../catchform/ui';
import { useDisclosure } from '@mantine/hooks';
import { BaseModal } from '@fishScore/basemodal';
import { ActionIcon, Box, Tooltip } from '@mantine/core';
import type { FishEvent } from '@fishScore/eventsdata';
import type { Team } from '@fishScore/teamsdata';

type Props = {
	currentEvent: FishEvent | null;
	usersTeam: Team | undefined;
};

export const AddCatch = ({ currentEvent, usersTeam }: Props) => {
	const [addCatchOpened, addCatchHandlers] = useDisclosure(false);
	const { user } = useUserStore();

	const handleAddCatch = async (weight: number) => {
		if (!user?.userId) {
			throw new Error('You must be logged in to add a catch');
		}
		const response = await fetchAddCatch(
			currentEvent?.eventId,
			weight,
			usersTeam?.teamId,
		);

		if (response.success) {
			showNotification({
				title: 'New catch added',
				message: 'Nice catch! It has been added to your team',
				color: 'var(--color-primary)',
				icon: <IconCheck />,
				position: 'top-center',
			});

			addCatchHandlers.close();
		} else {
			showNotification({
				title: 'Could not add catch',
				message:
					'Something went wrong trying to add new catch. Try again later',
				color: 'var(--color-danger)',
				icon: <IconX />,
				position: 'top-center',
			});
		}
	};
	return (
		<>
			<BaseModal
				title='Add new catch'
				opened={addCatchOpened}
				close={addCatchHandlers.close}>
				<CatchForm
					title='Add a new fish catch'
					submitLabel='Add catch'
					loadingText='Adding new catch'
					onSubmit={handleAddCatch}></CatchForm>
			</BaseModal>
			{/* Lägg till en ny catch */}
			<Tooltip
				label={
					currentEvent?.status === 'ongoing' && !usersTeam
						? 'Join a team to add catch'
						: currentEvent?.status === 'ongoing'
							? 'Add a catch'
							: currentEvent?.status === 'completed'
								? 'Event has ended'
								: ''
				}>
				<ActionIcon
					radius={'xl'}
					size={'50px'}
					fz={'xl'}
					pos={'fixed'}
					right={'1.5rem'}
					bottom={'1.5rem'}
					color='var(--color-black)'
					disabled={
						currentEvent?.status !== 'ongoing' || !usersTeam
							? true
							: false
					}
					style={{ zIndex: 1000 }}
					onClick={addCatchHandlers.open}>
					+
				</ActionIcon>
			</Tooltip>
		</>
	);
};
