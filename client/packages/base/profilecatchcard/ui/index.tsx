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
import {
	dateFormatter,
	shortDateFormatter,
} from '../../../core/formatters/data';
import { BaseModal } from '@fishScore/basemodal';
import { useDisclosure } from '@mantine/hooks';
import { EditCatch } from '../../editcatch/ui';
import { useNavigate } from 'react-router-dom';

type Props = {
	fishCatch: FishCatch;
	userId?: string;
	variant: 'activityCatch' | 'profileCatch';
};

export const ProfileCatchCard = ({ fishCatch, userId, variant }: Props) => {
	const [opened, { open, close }] = useDisclosure();
	const catchDate = shortDateFormatter(fishCatch.createdAt);
	const catchedByUser = fishCatch.catchedBy === userId;
	const navigate = useNavigate();

	const handleNavigation = (eventId: string) => {
		navigate(`/event/${eventId}`);
	};
	console.log('fishCatch: ', fishCatch);
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
						<Title order={4}>{fishCatch.eventName}</Title>

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
					<Text c={'var(--text-muted)'}> {fishCatch.teamName}</Text>
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
					<Text>
						{catchDate}{' '}
						{fishCatch.modifiedAt && <Text span>(edited)</Text>}
					</Text>
				</Flex>
				<Flex>
					<Button
						w='fit-content'
						bg={'var(--color-black)'}
						onClick={() => handleNavigation(fishCatch.eventId)}>
						To event
					</Button>
					{/* <Button
						w='fit-content'
						c={'var(--text-primary)'}
						bg={'var(--color-grey)'}
						onClick={() => handleNavigation(fishCatch.eventId)}>
						Edit
					</Button> */}
				</Flex>
			</Stack>
		</>
	);
};
