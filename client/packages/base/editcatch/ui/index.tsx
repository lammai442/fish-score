import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { CatchForm } from '../../catchform/ui';
import { fetchEditCatch } from '../../../core/api/apicatches/data';

type Props = {
	close: () => void;
	catchId: string;
	initialWeight: number;
	eventId: string;
};

export const EditCatch = ({
	close,
	catchId,
	initialWeight,
	eventId,
}: Props) => {
	const handleEditCatch = async (weight: number) => {
		const response = await fetchEditCatch(catchId, weight, eventId);

		if (response.status) {
			showNotification({
				title: 'Catch updated',
				message: 'The catch has been updated',
				color: 'var(--color-primary)',
				icon: <IconCheck />,
				position: 'top-center',
			});

			close();
		} else {
			showNotification({
				title: 'Could not update catch',
				message:
					'Something went wrong to update catch, try again later',
				color: 'var(--color-danger)',
				icon: <IconX />,
				position: 'top-center',
			});
		}
	};

	return (
		<>
			<CatchForm
				variant='editCatch'
				title='Make change to your catch'
				submitLabel='Edit catch'
				loadingText='Adding new catch'
				initialValue={String(initialWeight)}
				onSubmit={handleEditCatch}
				catchId={catchId}
				eventId={eventId}></CatchForm>
		</>
	);
};
