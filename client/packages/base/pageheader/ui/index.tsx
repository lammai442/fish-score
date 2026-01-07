import { ActionIcon, Box, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

type Props = {
	title: string;
	subTitle?: string;
	subTitleStatus?: string;
};

export const PageHeader = ({ title, subTitle, subTitleStatus }: Props) => {
	const navigate = useNavigate();

	return (
		<Box
			style={{
				display: 'grid',
				gridTemplateColumns: 'auto 1fr auto',
				alignItems: 'center',
			}}>
			<ActionIcon
				variant='transparent'
				aria-label='back icon'
				color='var(--bg-black-color)'
				onClick={() => navigate(-1)}>
				<IconArrowLeft />
			</ActionIcon>
			<Stack align='center' gap='0'>
				<Title order={1}>{title}</Title>
				{subTitle && (
					<Text
						style={{
							border: '1px solid black',
							padding: '0.5rem 0.75rem',
							borderRadius: '15px',
							backgroundColor: 'black',
							color: 'white',
						}}>
						{subTitle}
					</Text>
				)}
			</Stack>
		</Box>
	);
};
