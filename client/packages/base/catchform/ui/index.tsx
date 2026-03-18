import { Loading } from '@fishScore/loading';
import { Button, Stack, Text, TextInput } from '@mantine/core';
import { useState } from 'react';

type Props = {
	initialValue?: string;
	submitLabel: string;
	title: string;
	loadingText: string;
	onSubmit: (weight: number) => Promise<void>;
};

export const CatchForm = ({
	initialValue = '',
	submitLabel,
	title,
	loadingText,
	onSubmit,
}: Props) => {
	const [errorInput, setErrorInput] = useState<string>('');
	const [inputValue, setInputValue] = useState(initialValue);
	const [loading, setLoading] = useState<boolean>(false);

	const handleSubmit = async () => {
		setErrorInput('');

		const numberValue = Number(inputValue);

		if (inputValue.trim() === '' || Number.isNaN(numberValue)) {
			setErrorInput('You need to fill in a number');
			return;
		} else if (numberValue <= 0) {
			setErrorInput('Weight must be greater than 0');
			return;
		}

		// Avrundar till en decimal
		const roundedDownCatchWeight = Math.floor(numberValue * 10) / 10;

		try {
			setLoading(true);
			await onSubmit(roundedDownCatchWeight);
		} finally {
			setLoading(false);
		}
	};
	return (
		<>
			{loading && <Loading visible={loading} text={loadingText} />}
			<Stack>
				<Text>{title}</Text>

				<TextInput
					inputMode='decimal'
					type='number'
					label='Weight'
					value={inputValue}
					onChange={(event) => {
						const value = event.currentTarget.value.replace(
							',',
							'.',
						);
						setInputValue(value);
						setErrorInput('');
					}}
					error={errorInput}
				/>

				<Button
					color='var(--color-black)'
					radius='md'
					size='md'
					onClick={handleSubmit}>
					{submitLabel}
				</Button>
			</Stack>
		</>
	);
};
