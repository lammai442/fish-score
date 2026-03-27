import { Center, Image, Loader, Stack, Title } from '@mantine/core';

type Props = {
	visible: boolean;
	text: string;
};

export const Loading = ({ visible, text }: Props) => {
	if (!visible) return null;

	return (
		<Center
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				zIndex: 1001,
				backgroundColor: 'var(--color-white)',
				padding: '1rem',
				textAlign: 'center',
			}}>
			<Stack align='center' gap='sm'>
				<Image w={150} fit='contain' src='/transparent-logo.png' />
				<Loader color='var(--color-primary)' />
				<Title order={4}>{text}</Title>
			</Stack>
		</Center>
	);
};
