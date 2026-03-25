import type { EventMessage } from '@fishScore/messagesdata';
import { Flex, Stack, Text, Title } from '@mantine/core';
import { timeAgo } from '@fishScore/formatters';

type Props = {
	eventMessage: EventMessage;
};

export const EventsMessage = ({ eventMessage }: Props) => {
	const formattedDate = timeAgo(eventMessage.createdAt);

	return (
		<Flex gap={'sm'}>
			<Stack gap={'0.1rem'}>
				<Title order={6}>
					{eventMessage.messageUserFullName}{' '}
					<Text
						span
						c={'var(--text-muted)'}
						fz={'sm'}
						style={{ textDecoration: 'bullet' }}>
						{' - '}
						{formattedDate}
					</Text>
				</Title>
				<Text style={{ whiteSpace: 'pre-line' }}>
					{eventMessage.message}
				</Text>
			</Stack>
		</Flex>
	);
};
