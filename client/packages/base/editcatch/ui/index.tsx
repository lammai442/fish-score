import { showNotification } from '@mantine/notifications';
import { IconCheck, IconTrash } from '@tabler/icons-react';
import { CatchForm } from '../../catchform/ui';
import { fetchEditCatch } from '../../../core/api/apicatches/data';
import { ActionIcon, Button } from '@mantine/core';

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
				color: 'green',
				icon: <IconCheck />,
				position: 'top-center',
			});

			close();
		}
	};

	return (
		<>
			<CatchForm
				title='Make change to your catch'
				submitLabel='Add catch'
				loadingText='Adding new catch'
				initialValue={String(initialWeight)}
				onSubmit={handleEditCatch}></CatchForm>
		</>
	);
};
