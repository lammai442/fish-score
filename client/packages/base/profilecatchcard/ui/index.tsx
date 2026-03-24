import {
	ActionIcon,
	Badge,
	Button,
	Flex,
	Stack,
	Text,
	Title,
	Tooltip,
} from '@mantine/core';
import { FishCatch } from '../../../core/interfaces/fishcatchdata/data';
import { IconCalendarWeekFilled, IconPencil } from '@tabler/icons-react';
import { shortDateFormatter } from '../../../core/formatters/data';
import { BaseModal } from '@fishScore/basemodal';
import { useDisclosure } from '@mantine/hooks';
import { EditCatch } from '../../editcatch/ui';
import { useNavigate } from 'react-router-dom';

type Props = {
	fishCatch: FishCatch;
	userId?: string;
	variant: 'activityCatch' | 'profileCatch';
};

export const ProfileCatchCard = ({ fishCatch, userId }: Props) => {
	const [opened, { open, close }] = useDisclosure();
	const catchDate = shortDateFormatter(fishCatch.createdAt);
	const catchedByUser = fishCatch.createdBy === userId;
	const navigate = useNavigate();

	const handleNavigation = (eventId: string) => {
		navigate(`/event/${eventId}`);
	};
	return (
		<>
			{/* Modal för att öppna redigera en catch */}
			<BaseModal title='Edit catch' opened={opened} close={close}>
				<EditCatch
					close={close}
					catchId={fishCatch.catchId}
					initialWeight={Number(fishCatch.catchWeight)}
					eventId={fishCatch.eventId}></EditCatch>
			</BaseModal>
			<Stack
				miw={'350px'}
				bd={'1px solid var(--border-default)'}
				bdrs={'15px'}
				p={'20px'}
				bg={'var(--color-white)'}>
				<Stack gap={0}>
					<Flex gap={'sm'} justify={'space-between'}>
						{/* Eventsinfo */}
						<Title order={4}>
							<Text span>Event: </Text>
							{fishCatch.eventName}
						</Title>

						<Flex gap={'xs'}>
							{/* Redigeraknapp */}
							{fishCatch.eventStatus === 'ongoing' &&
								catchedByUser && (
									<Tooltip label={'Edit catch'}>
										<ActionIcon
											variant='filled'
											bg={'var(--color-grey)'}
											radius={'lg'}
											p={'5px'}
											onClick={open}>
											<IconPencil color='var(--color-black)'></IconPencil>
										</ActionIcon>
									</Tooltip>
								)}
						</Flex>
					</Flex>
					<Text c={'var(--text-muted)'}>
						<Text span>Team: </Text>
						{fishCatch.teamName}
					</Text>
				</Stack>
				<Badge
					p={'0.8rem'}
					bg={'var(--bg-primary)'}
					c={'var(--text-inverse)'}
					bdrs={'sm'}>
					{fishCatch.catchWeight} kg
				</Badge>
				{/* Datum */}
				<Flex gap={'xs'}>
					<IconCalendarWeekFilled></IconCalendarWeekFilled>
					<Text c={'var(--text-muted)'}>
						{catchDate}{' '}
						{fishCatch.modifiedAt && (
							<Text
								ml={'xs'}
								bdrs={'sm'}
								p={'0.2rem 0.3rem'}
								fw={500}
								span
								bg={'var(--bg-muted)'}
								c={'var(--text-primary)'}>
								Edited
							</Text>
						)}
					</Text>
				</Flex>
				<Flex>
					<Button
						w='fit-content'
						bg={'var(--color-black)'}
						onClick={() => handleNavigation(fishCatch.eventId)}>
						To event
					</Button>
				</Flex>
			</Stack>
		</>
	);
};
