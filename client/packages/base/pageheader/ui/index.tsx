import { ActionIcon, Box, Flex, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

type Props = {
	title: string | null;
	subTitle?: string | undefined;
	subTitleStatus?: string | null;
};

export const PageHeader = ({ title, subTitle, subTitleStatus }: Props) => {
	const navigate = useNavigate();

	return (
		<Box
			style={{
				width: '100vw',
				marginLeft: 'calc(50% - 50vw)',
				display: 'grid',
				gridTemplateColumns: 'auto 1fr auto',
				alignItems: 'center',
				background: 'var(--bg-light-grey-color)',
				padding: '1rem',
			}}>
			<ActionIcon
				variant='transparent'
				aria-label='back icon'
				color='var(--bg-black-color)'
				onClick={() => navigate(-1)}>
				<IconArrowLeft />
			</ActionIcon>
			<Stack align='center' gap='0'>
				<Title order={3}>{title}</Title>
				{subTitle && (
					<Title
						order={6}
						style={{
							padding: '0.5rem 0.75rem',
							borderRadius: '15px',
							backgroundColor:
								subTitle.toLowerCase() === 'ongoing'
									? 'var(--bg-black-color)'
									: 'var(--bg-grey-color)',
							color:
								subTitle.toLowerCase() === 'ongoing'
									? 'var(--text-white)'
									: 'var(--text-black)',
						}}>
						{subTitle}
					</Title>
				)}
			</Stack>
		</Box>
	);
};
