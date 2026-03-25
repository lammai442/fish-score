import { useUserStore } from '@fishScore/useUserStore';
import { fetchAddCatch } from '@fishScore/apicatches';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { CatchForm } from '../../catchform/ui';

type Props = {
	close: () => void;
	eventId: string | undefined;
	teamId: string | undefined;
};

export const AddCatch = ({ close, eventId, teamId }: Props) => {
	const { user } = useUserStore();

	const handleAddCatch = async (weight: number) => {
		if (!user?.userId) {
			throw new Error('You must be logged in to add a catch');
		}
		const response = await fetchAddCatch(eventId, weight, teamId);

		if (response.success) {
			showNotification({
				title: 'New catch added',
				message: 'Nice catch! It has been added to your team',
				color: 'var(--color-primary)',
				icon: <IconCheck />,
				position: 'top-center',
			});

			close();
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
		<CatchForm
			title='Add a new fish catch'
			submitLabel='Add catch'
			loadingText='Adding new catch'
			onSubmit={handleAddCatch}></CatchForm>
	);
};
