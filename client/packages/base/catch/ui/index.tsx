import { Button, Stack, Text, TextInput } from '@mantine/core';
import { useState } from 'react';
import { useUserStore } from '@fishScore/useUserStore';
import { useParams } from 'react-router-dom';

type Props = {
	close: () => void;
};

export const Catch = ({ close }: Props) => {
	const [errorInput, setErrorInput] = useState<string>('');
	const [inputValue, setInputValue] = useState<string>('');
	const { user } = useUserStore();
	const { id } = useParams();

	const handleCreateItem = async () => {
		// Rensa tidigare fel
		setErrorInput('');

		const value = inputValue.trim();

		if (value.length === 0) {
			setErrorInput(`You need to fill in a number`);
			return;
		}

		if (!user?.userId) {
			setErrorInput(`You must be logged in to add a catch`);
			return;
		}
	};
	return (
		<Stack>
			<Text>Add a new fish catch</Text>
			<TextInput
				type='number'
				label={'Weight'}
				value={inputValue}
				onChange={(event) => {
					setInputValue(event.currentTarget.value);
					setErrorInput('');
				}}
				error={errorInput}></TextInput>
			<Button
				color='var(--bg-black-color)'
				radius={'md'}
				size='md'
				onClick={handleCreateItem}>
				Add catch
			</Button>
		</Stack>
	);
};
