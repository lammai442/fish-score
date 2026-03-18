import { useUserStore } from '@fishScore/useUserStore';
import { fetchAddCatch } from '@fishScore/apievents';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { CatchForm } from '../../catchform/ui';

type Props = {
	close: () => void;
	catchId: string;
	initialWeight: number;
};

export const EditCatch = ({ close, catchId, initialWeight }: Props) => {
	const handleEditCatch = async (weight: number) => {
		const response = await fetchEditCatch(catchId, weight);

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
				title='Edit your fish catch'
				submitLabel='Add catch'
				loadingText='Adding new catch'
				initialValue={String(initialWeight)}
				onSubmit={handleEditCatch}></CatchForm>
		</>
	);
};
