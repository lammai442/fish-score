import { Flex, Loader, LoadingOverlay, Text } from '@mantine/core';

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
					<Flex direction='column' align='center' justify='center'>
						<Loader />
						<Text mt='sm'>{text}</Text>
					</Flex>
				),
			}}
			overlayProps={{ radius: 'sm', blur: 2 }}
		/>
	);
};
