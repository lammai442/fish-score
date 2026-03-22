import type { FishEvent } from '@fishScore/eventsdata';
import { Text, Title, Flex, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { capitilizeFirstLetter } from '../../../core/utils/helpfunctions/data';

type Props = {
	events: FishEvent[];
};

export const Events = ({ events = [] }: Props) => {
	const navigate = useNavigate();
	const handleToEvent = (event: FishEvent) => {
		navigate(`/event/${event.eventId}`);
	};

	return (
		<>
			<Title order={3}>Events</Title>
			{/* Rendera events */}
			<Flex wrap={'wrap'} gap={'md'} style={{ cursor: 'pointer' }}>
				{events.length > 0 ? (
					events.map((event, index) => {
						return (
							<Flex
								direction='column'
								w='100%'
								maw={{ sm: '330px' }}
								bd={'1px solid var(--border-default)'}
								p={'1rem'}
								bdrs={'10px'}
								key={event.eventName}
								onClick={() => handleToEvent(event)}>
								<Flex
									justify={'space-between'}
									align={'center'}>
									<Title order={5}>{event.eventName}</Title>
									<Text
										fz={'sm'}
										style={{
											padding: '0.3rem 0.4rem',
											backgroundColor:
												event.status === 'ongoing'
													? 'var(--bg-primary)'
													: 'var(--color-black)',
											color: 'var(--text-inverse)',
											borderRadius: '10px',
										}}>
										{capitilizeFirstLetter(event.status)}
									</Text>
								</Flex>
								<Stack>
									{[
										{
											label:
												event.teamCount === '1'
													? 'Team'
													: 'Teams',
											value: event.teamCount,
										},
									].map((item) => (
										<Flex
											key={item.label}
											align='center'
											gap='0.3rem'>
											<Text>
												{item.value} {item.label}
											</Text>
										</Flex>
									))}
								</Stack>
							</Flex>
						);
					})
				) : (
					<Text>No current events has been created</Text>
				)}
			</Flex>
		</>
	);
};
