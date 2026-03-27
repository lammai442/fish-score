import { Image, Loader, LoadingOverlay, Stack, Title } from '@mantine/core';

type Props = {
	visible: boolean;
	text: string;
};

export const Loading = ({ visible, text }: Props) => {
	return (
		<LoadingOverlay
			visible={visible}
			zIndex={1000}
			loaderProps={{
				children: (
					<Stack align='center' gap={'sm'}>
						<Image
							w={'150px'}
							fit='contain'
							src={'/transparent-logo.png'}></Image>
						<Loader color={'var(--color-primary)'} />
						<Title order={4}>{text}</Title>
					</Stack>
				),
			}}
			overlayProps={{ radius: 'sm', blur: 2 }}
		/>
	);
};
