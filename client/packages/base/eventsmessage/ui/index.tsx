import type { EventMessage } from '@fishScore/eventsdata';
import {
	Badge,
	Divider,
	Flex,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { dateFormatter } from '@fishScore/formatters';

type Props = {
	eventMessage: EventMessage;
	userId: string | undefined;
};

export const EventsMessage = ({ eventMessage, userId }: Props) => {
	const messageByUser = eventMessage.createdBy === userId;
	const formattedDate = dateFormatter(eventMessage.createdAt);

	return (
		<>
			<Stack
				bd={
					messageByUser
						? '1px solid var(--color-primary)'
						: '1px solid var(--border-default)'
				}
				bdrs={'15px'}
				p={'10px'}
				bg={
					messageByUser
						? 'var(--bg-primary-light)'
						: 'var(--bg-surface)'
				}>
				<Flex gap={'sm'}>
					<ThemeIcon
						size='xl'
						radius='xl'
						bg={
							messageByUser
								? 'var(--bg-primary)'
								: 'var(--color-black)'
						}>
						<IconUser color='var(--color-white)'></IconUser>
					</ThemeIcon>
					<Divider
						orientation='vertical'
						size={'sm'}
						color={'var(--color-primary)'}></Divider>
					<Stack gap={'0.3rem'}>
						<Title order={6}>{eventMessage.createdByName}</Title>
						<Text fs={'italic'}>{eventMessage.message}</Text>
						<Flex align={'center'} c={'var(--text-muted)'}>
							{formattedDate}
						</Flex>
					</Stack>
				</Flex>
			</Stack>
		</>
	);
};
