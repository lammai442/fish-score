import { useWebSocketStore } from '@fishScore/usewebsocketstore';
import { Text } from '@mantine/core';

type Props = {};

export const Updates = ({}: Props) => {
	const { events } = useWebSocketStore();

	console.log('events: ', events);

	return <Text>Updates</Text>;
};
