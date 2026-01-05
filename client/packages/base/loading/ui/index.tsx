import { Flex, Loader, LoadingOverlay, Text } from '@mantine/core';

type Props = {
	visible: boolean;
};

export const Loading = ({ visible }: Props) => {
	return (
		<LoadingOverlay
			visible={visible}
			zIndex={1000}
			loaderProps={{
				children: (
					<Flex
						direction='column'
						align='center' // horisontell centrering
						justify='center' // vertikal centrering
					>
						<Loader />
						<Text mt='sm'>Loading...</Text>
					</Flex>
				),
			}}
			overlayProps={{ radius: 'sm', blur: 2 }}
		/>
	);
};
