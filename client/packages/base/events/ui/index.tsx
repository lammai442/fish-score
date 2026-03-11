import { FishEvent } from '@fishScore/eventsdata';
import { Text, Title, Flex } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

type Props = {
	events: FishEvent[];
};

export const Events = ({ events = [] }: Props) => {
	const navigate = useNavigate();
	const handleToEvent = (event: FishEvent) => {
		navigate(`/event/${event.id}`);
	};

	return (
		<>
			<Title order={3}>Events</Title>
			<Flex wrap={'wrap'} gap={'md'} style={{ cursor: 'pointer' }}>
				{events.length > 0 ? (
					events.map((event, index) => {
						return (
							<Flex
								direction='column'
								w='100%'
								maw={{ sm: '330px' }}
								bd={'1px solid var(--br-grey)'}
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
													? 'var(--bg-black-color)'
													: 'var(--bg-grey-color)',
											color:
												event.status === 'ongoing'
													? 'var(--text-white)'
													: 'var(--text-black)',
											borderRadius: '10px',
										}}>
										{event.status}
									</Text>
								</Flex>
								<Flex direction={'column'}>
									{[
										{
											label: 'Teams',
											value: event.teams?.length,
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
								</Flex>
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
