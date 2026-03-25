import { dateFormatter } from '@fishScore/formatters';
import { Update } from '@fishScore/updatesdata';
import { useUpdateStore } from '@fishScore/useupdatestore';
import {
	Badge,
	Button,
	Flex,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core';
import {
	IconCalendarWeekFilled,
	IconFish,
	IconMessage,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

type Props = {
	updates: Update[];
	close: () => void;
};

export const Updates = ({ updates, close }: Props) => {
	const navigate = useNavigate();
	const { clearUpdates, markAllAsRead } = useUpdateStore();

	const handleNavigation = (event_id: string) => {
		markAllAsRead();
		navigate(`/event/${event_id}`);
		close();
	};

	return (
		<Stack>
			{updates.length > 0 ? (
				<>
					<Stack style={{ maxHeight: '500px', overflowY: 'auto' }}>
						{updates.map((update: any, index: number) => (
							<Flex
								key={update.id ?? index}
								gap='sm'
								bd='1px solid var(--border-default)'
								bg={
									update.read
										? 'var(--bg-surface)'
										: 'var(--color-primary-medium)'
								}
								bdrs='md'
								p='sm'>
								{/* Catch */}
								{update.type === 'catch' && (
									<>
										<ThemeIcon
											size='lg'
											radius='xl'
											color='dark'>
											<IconFish size={18} />
										</ThemeIcon>

										<Stack flex={1} gap='0.5rem'>
											<Stack gap='0.2rem'>
												<Title order={5}>
													<Text span>Event: </Text>
													{
														update.entity.teamName
													}{' '}
													<Text span>
														(
														{update.entity.teamName}
														)
													</Text>
												</Title>
												<Text>
													Catched by:{' '}
													{
														update.entity
															.catchersFullName
													}
												</Text>

												<Flex
													gap='0.2rem'
													align={'center'}>
													<IconCalendarWeekFilled
														size={'1.3rem'}
													/>
													<Text
														c='var(--text-muted)'
														fz={'sm'}>
														{dateFormatter(
															update.entity
																.createdAt,
														)}
													</Text>
												</Flex>
											</Stack>

											<Badge
												p='0.8rem'
												bg='var(--bg-primary)'
												c='var(--text-inverse)'
												bdrs='sm'>
												{update.entity.catchWeight} kg
											</Badge>

											<Button
												c='var(--text-inverse)'
												bg='var(--color-black)'
												onClick={() => {
													handleNavigation(
														update.eventId,
													);
												}}>
												Go to event
											</Button>
										</Stack>
									</>
								)}
								{/* Message */}
								{update.type === 'message' && (
									<>
										<ThemeIcon
											size='lg'
											radius='xl'
											color='var(--color-black)'>
											<IconMessage size={18} />
										</ThemeIcon>

										<Stack flex={1} gap='0.5rem'>
											<Stack gap='0.2rem'>
												<Title order={5}>
													<Text span>Event: </Text>
													{update.entity.eventName}
												</Title>
												<Text
													c={'var(--text-muted)'}
													fs={'italic'}>
													{
														update.entity
															.messageUserFullName
													}
													:
												</Text>
												<Text>
													{update.entity.message}
												</Text>

												<Flex
													gap='0.2rem'
													align={'center'}>
													<IconCalendarWeekFilled
														size={'1.3rem'}
													/>
													<Text
														c='var(--text-muted)'
														fz={'sm'}>
														{dateFormatter(
															update.entity
																.createdAt,
														)}
													</Text>
												</Flex>
											</Stack>

											<Button
												c='var(--text-inverse)'
												bg='var(--color-black)'
												onClick={() => {
													handleNavigation(
														update.eventId,
													);
												}}>
												Go to event
											</Button>
										</Stack>
									</>
								)}
							</Flex>
						))}
					</Stack>

					<Button bg='var(--btn-danger-bg)' onClick={clearUpdates}>
						Delete all updates
					</Button>
				</>
			) : (
				<Text>There are no new updates from your events</Text>
			)}
		</Stack>
	);
};
