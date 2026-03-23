import type { EventMessage } from '@fishScore/eventsdata';
import { Flex, Stack, Text, Title } from '@mantine/core';
import { timeAgo } from '@fishScore/formatters';

type Props = {
	eventMessage: EventMessage;
	userId: string | undefined;
};

export const EventsMessage = ({ eventMessage, userId }: Props) => {
	const messageByUser = eventMessage.createdBy === userId;
	const formattedDate = timeAgo(eventMessage.createdAt);

	return (
		<Flex gap={'sm'}>
			<Stack gap={'0.1rem'}>
				<Title order={6}>
					{eventMessage.createdByName}{' '}
					<Text
						span
						c={'var(--text-muted)'}
						fz={'sm'}
						style={{ textDecoration: 'bullet' }}>
						{' - '}
						{formattedDate}
					</Text>
				</Title>
				<Text fs={'italic'} style={{ whiteSpace: 'pre-line' }}>
					{eventMessage.message}
				</Text>
			</Stack>
		</Flex>
	);
};
