import { useUserStore } from '@fishScore/useUserStore';
import { fetchAddCatch } from '@fishScore/apievents';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
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

		if (response.status) {
			showNotification({
				title: 'New catch added',
				message: 'Nice catch! It has been added to your team',
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
				title='Add a new fish catch'
				submitLabel='Add catch'
				loadingText='Adding new catch'
				onSubmit={handleAddCatch}></CatchForm>
		</>
	);
};
