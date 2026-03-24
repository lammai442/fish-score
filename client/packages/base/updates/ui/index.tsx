import { shortDateFormatter } from '@fishScore/formatters';
import { useUpdateStore } from '@fishScore/useupdatesstore';
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

export const Updates = ({ updates, close }: any) => {
	const navigate = useNavigate();
	const { clearUpdates, markAllAsRead } = useUpdateStore();

	const handleNavigation = (event_id: string) => {
		console.log('event_id: ', event_id);
		markAllAsRead();
		navigate(`/event/${event_id}`);
		close();
	};

	const handleDeleteUpdates = () => {
		clearUpdates();
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
								bdrs='md'
								p='sm'>
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
												<Title order={4}>
													Event:{' '}
													{update.entity.teamName}
												</Title>

												<Text>
													Team:{' '}
													{update.entity.teamName}
												</Text>

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
														{shortDateFormatter(
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
												<Title order={4}>
													Event:{' '}
													{update.entity.teamName}
												</Title>
												<Text>
													Message:{' '}
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
														{shortDateFormatter(
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

					<Button
						bg='var(--btn-danger-bg)'
						onClick={handleDeleteUpdates}>
						Delete all updates
					</Button>
				</>
			) : (
				<Text>There are no new updates from your events</Text>
			)}
		</Stack>
	);
};
