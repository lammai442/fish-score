import { Button, Stack, Text, TextInput } from '@mantine/core';
import { useState } from 'react';
import { useUserStore } from '@fishScore/useUserStore';
import { fetchAddCatch } from '@fishScore/apievents';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { Loading } from '@fishScore/loading';

type Props = {
	close: () => void;
	eventId: string | undefined;
	teamId: string | undefined;
};

export const Catch = ({ close, eventId, teamId }: Props) => {
	const [errorInput, setErrorInput] = useState<string>('');
	const [inputValue, setInputValue] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const { user } = useUserStore();

	const handleAddCatch = async () => {
		// Rensa tidigare fel
		setErrorInput('');

		const numberValue = Number(inputValue);

		if (!numberValue) {
			setErrorInput(`You need to fill in a number`);
			return;
		}

		if (!user?.userId) {
			setErrorInput(`You must be logged in to add a catch`);
			return;
		}

		const roundedDownCatchWeight = Math.floor(numberValue * 10) / 10;
		try {
			setLoading(false);
			const response = await fetchAddCatch(
				eventId,
				roundedDownCatchWeight,
				teamId,
			);
			if (response.status) {
				showNotification({
					title: `New catch added`,
					message: `Nice catch! It has been added to your team`,
					color: 'var(--bg-primary-color)',
					icon: <IconCheck />,
					position: 'top-center',
				});

				close();
			}
			console.log('response: ', response);
		} finally {
			setLoading(false);
		}
	};
	return (
		<>
			{loading && (
				<Loading visible={loading} text='Adding new catch'></Loading>
			)}
			<Stack>
				<Text>Add a new fish catch</Text>
				<TextInput
					inputMode='decimal'
					step={0.01}
					type='number'
					label={'Weight'}
					value={inputValue}
					onChange={(event) => {
						const value = event.currentTarget.value.replace(
							',',
							'.',
						);
						setInputValue(value);
						setErrorInput('');
					}}
					error={errorInput}></TextInput>
				<Button
					color='var(--bg-black-color)'
					radius={'md'}
					size='md'
					onClick={handleAddCatch}>
					Add catch
				</Button>
			</Stack>
		</>
	);
};
