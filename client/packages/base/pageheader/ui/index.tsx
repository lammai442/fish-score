import {
	ActionIcon,
	Box,
	Center,
	Container,
	Stack,
	Title,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

type Props = {
	title: string | null;
	subTitle?: string | undefined;
	subTitleStatus?: string | null;
};

export const PageHeader = ({ title, subTitle }: Props) => {
	const navigate = useNavigate();

	return (
		<Box
			style={{
				width: '100vw',
				marginLeft: 'calc(50% - 50vw)',
				background: 'var(--bg-page)',
			}}>
			<Container
				size={'lg'}
				p={'lg'}
				style={{
					display: 'grid',
					gridTemplateColumns: 'auto 1fr auto',
					alignItems: 'center',
				}}>
				<ActionIcon
					variant='transparent'
					aria-label='back icon'
					color='var(--color-black)'
					onClick={() => navigate(-1)}>
					<IconArrowLeft />
				</ActionIcon>

				<Stack align='center' gap='xs'>
					<Title order={3}>{title}</Title>

					{subTitle && (
						<Title
							order={6}
							className='pulse'
							style={{
								padding: '0.5rem 0.75rem',
								borderRadius: '15px',
								backgroundColor:
									subTitle.toLowerCase() === 'ongoing'
										? 'var(--bg-primary)'
										: 'var(--color-black)',
								color: 'var(--text-inverse)',
							}}>
							{subTitle}
						</Title>
					)}
				</Stack>
			</Container>
		</Box>
	);
};
