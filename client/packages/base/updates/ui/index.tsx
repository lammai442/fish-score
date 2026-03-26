import { dateFormatter } from '@fishScore/formatters';
import type { Update } from '@fishScore/updatesdata';
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
	IconTrophy,
} from '@tabler/icons-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
	updates: Update[];
	close: () => void;
	setWiggle: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Updates = ({ updates, close, setWiggle }: Props) => {
	const navigate = useNavigate();
	const { clearUpdates, markAllAsRead } = useUpdateStore();

	const handleNavigation = (event_id: string) => {
		markAllAsRead();
		navigate(`/event/${event_id}`);
		close();
	};

	const handleClearAllUpdates = () => {
		setWiggle(false);
		clearUpdates();
	};

	return (
		<Stack>
			{updates.length > 0 ? (
				<>
					<Stack style={{ maxHeight: '500px', overflowY: 'auto' }}>
						{updates.map((update, index) => (
							<Flex
								key={update.updateId ?? index}
								gap='sm'
								bd='1px solid var(--border-default)'
								bg={
									update.read
										? 'var(--bg-surface)'
										: 'var(--color-primary-medium)'
								}
								bdrs='md'
								p='sm'>
								{update.type === 'catch' && (
									<ThemeIcon
										size='lg'
										radius='xl'
										color={
											update.action === 'INSERT' ||
											update.action === 'MODIFY'
												? 'var(--color-black)'
												: 'var(--color-danger)'
										}>
										<IconFish size={18} />
									</ThemeIcon>
								)}

								{update.type === 'message' && (
									<ThemeIcon
										size='lg'
										radius='xl'
										style={{
											backgroundColor:
												'var(--color-grey)',
											color: 'var(--text-black)',
										}}>
										<IconMessage size={18} />
									</ThemeIcon>
								)}

								{update.type === 'event' && (
									<ThemeIcon
										size='lg'
										radius='xl'
										style={{
											backgroundColor: 'var(--rank-gold)',
											color: 'var(--text-primary)',
										}}>
										<IconTrophy size={18} />
									</ThemeIcon>
								)}

								<Stack flex={1} gap='0.5rem'>
									{/* Catch */}
									{update.type === 'catch' && (
										<>
											<Stack gap='0'>
												<Title order={5}>
													<Text span>Event: </Text>
													{
														update.entity.eventName
													}{' '}
													<Text span>
														(
														{update.entity.teamName}
														)
													</Text>
												</Title>

												<Text
													fs='italic'
													c='var(--text-muted)'>
													{
														update.entity
															.catchersFullName
													}{' '}
													{(update.action ===
														'MODIFY' ||
														update.action ===
															'REMOVE') && (
														<Text
															span
															fs={'normal'}
															c={
																'var(--text-primary)'
															}>
															has made a change
														</Text>
													)}
												</Text>

												<Flex
													gap='0.2rem'
													align='center'>
													<IconCalendarWeekFilled size='1.3rem' />
													<Text
														c='var(--text-muted)'
														fz='sm'>
														{dateFormatter(
															update.entity
																.createdAt,
														)}
													</Text>

													{(update.action ===
														'MODIFY' ||
														update.action ===
															'REMOVE') && (
														<Text
															p='0.1rem 0.3rem'
															bdrs='sm'
															bg={
																update.action ===
																'MODIFY'
																	? 'var(--bg-muted)'
																	: 'var(--color-danger)'
															}
															c={
																update.action ===
																'MODIFY'
																	? 'var(--text-primary)'
																	: 'var(--text-inverse)'
															}
															span
															fz='sm'>
															{update.action ===
															'MODIFY'
																? 'Edited'
																: 'Removed'}
														</Text>
													)}
												</Flex>
											</Stack>

											<Badge
												p='0.8rem'
												bg='var(--bg-primary)'
												c='var(--text-inverse)'
												bdrs='sm'>
												{update.entity.catchWeight} kg
											</Badge>
										</>
									)}
									{/* Messages */}
									{update.type === 'message' && (
										<Stack gap='xs'>
											<Stack gap='0'>
												<Title order={5}>
													<Text span>Event: </Text>
													{update.entity.eventName}
												</Title>

												<Text
													c='var(--text-muted)'
													fs='italic'>
													{
														update.entity
															.messageUserFullName
													}
												</Text>

												<Flex
													gap='0.2rem'
													align='center'>
													<IconCalendarWeekFilled size='1.3rem' />
													<Text
														c='var(--text-muted)'
														fz='sm'>
														{dateFormatter(
															update.entity
																.createdAt,
														)}
													</Text>
												</Flex>
											</Stack>

											<Text>{update.entity.message}</Text>
										</Stack>
									)}
									{/* Event */}
									{update.type === 'event' && (
										<Stack gap='xs'>
											<Stack gap='0'>
												<Title order={5}>
													<Text span>Event: </Text>
													{update.entity.eventName}
												</Title>

												{update.entity.modifiedAt && (
													<Flex
														gap='0.2rem'
														align='center'>
														<IconCalendarWeekFilled size='1.3rem' />
														<Text
															c='var(--text-muted)'
															fz='sm'>
															{dateFormatter(
																update.entity
																	.modifiedAt,
															)}
														</Text>
													</Flex>
												)}

												<Text c='var(--text-primary)'>
													{update.entity.status ===
													'completed'
														? 'Event has ended, check out the winners!'
														: 'Fish on! The event has been reopened.'}
												</Text>
											</Stack>

											<Text>{update.entity.message}</Text>
										</Stack>
									)}

									<Button
										c='var(--text-inverse)'
										bg='var(--color-black)'
										onClick={() =>
											handleNavigation(update.eventId)
										}>
										Go to event
									</Button>
								</Stack>
							</Flex>
						))}
					</Stack>

					<Button
						bg='var(--btn-secondary-bg)'
						onClick={handleClearAllUpdates}>
						Clear all updates
					</Button>
				</>
			) : (
				<Text>There are no new updates from your events</Text>
			)}
		</Stack>
	);
};
