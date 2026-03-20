import { BaseModal } from '@fishScore/basemodal';
import { Loading } from '@fishScore/loading';
import {
	ActionIcon,
	Button,
	Flex,
	Stack,
	Text,
	TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons-react';
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
	const [opened, { open, close }] = useDisclosure();

	const handleAddCatch = async () => {
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

	const handleDelete = async () => {
		console.log('här');
	};
	return (
		<>
			{loading && <Loading visible={loading} text={loadingText} />}
			{/* Modal för att öppna delete alternativ */}
			<BaseModal title='Delete catch' opened={opened} close={close}>
				<Stack>
					<Text>Do you want to delete this catch?</Text>
					<Flex gap={'sm'}>
						<Button
							color='var(--color-danger)'
							radius='md'
							onClick={handleDelete}>
							Yes
						</Button>
						<Button
							color='var(--color-black)'
							radius='md'
							onClick={() => close()}>
							No
						</Button>
					</Flex>
				</Stack>
			</BaseModal>
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
				<Flex gap={'xs'} align='stretch'>
					<Button
						flex={9}
						color='var(--color-black)'
						radius='md'
						onClick={handleAddCatch}>
						{submitLabel}
					</Button>
					<Button
						flex={1}
						color='var(--color-danger)'
						radius='md'
						onClick={() => open()}>
						<IconTrash></IconTrash>
					</Button>
				</Flex>
			</Stack>
		</>
	);
};
