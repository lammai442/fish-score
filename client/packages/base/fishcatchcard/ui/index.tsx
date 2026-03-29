import {
	ActionIcon,
	Badge,
	Divider,
	Flex,
	Image,
	Stack,
	Text,
	Tooltip,
} from '@mantine/core';
import { IconClockHour5, IconFish, IconPencil } from '@tabler/icons-react';
import { dateFormatter } from '@fishScore/formatters';
import { BaseModal } from '@fishScore/basemodal';
import { useDisclosure } from '@mantine/hooks';
import { EditCatch } from '@fishScore/editcatch';
import { capitilizeFirstLetter } from '@fishScore/helpfunctions/';
import type { FishCatch } from '@fishScore/fishcatchdata';

type Props = {
	fishCatch: FishCatch;
	userId?: string;
	eventStatus?: string;
};

export const FishCatchCard = ({ fishCatch, userId, eventStatus }: Props) => {
	const [opened, { open, close }] = useDisclosure();
	const catchDate = dateFormatter(fishCatch.createdAt);

	const catchedByUser = fishCatch.createdBy === userId;

	const canEditCatch =
		catchedByUser &&
		(eventStatus === 'ongoing' || fishCatch.eventStatus === 'ongoing');

	return (
		<>
			{/* Modal för att öppna redigera en catch */}
			<BaseModal title='Edit catch' opened={opened} close={close}>
				<EditCatch
					close={close}
					catchId={fishCatch.catchId}
					initialWeight={Number(fishCatch.catchWeight)}
					eventId={fishCatch.eventId}
					currentFishType={fishCatch.fishType}></EditCatch>
			</BaseModal>
			<Stack
				bd={
					catchedByUser
						? '1px solid var(--color-primary)'
						: '1px solid var(--border-default)'
				}
				bdrs={'15px'}
				p={'md'}
				bg={
					catchedByUser
						? 'var(--bg-primary-light)'
						: 'var(--bg-surface)'
				}>
				<Flex gap={'sm'}>
					<Flex
						align={'center'}
						justify={'center'}
						bg={
							catchedByUser
								? 'var(--bg-primary)'
								: 'var(--color-black)'
						}
						bdrs={50}
						w={50}
						h={50}
						p={'sm'}>
						<IconFish
							size={40}
							color='var(--color-white)'></IconFish>
					</Flex>
					<Stack>
						<Stack gap={0}>
							<Flex gap={'xs'}>
								<Text>
									<span style={{ fontStyle: 'italic' }}>
										{fishCatch.catchersFullName}
									</span>{' '}
									from{' '}
									<span style={{ fontWeight: 700 }}>
										{fishCatch.teamName}
									</span>
								</Text>
								{/* Redigeraknapp */}
								{canEditCatch && (
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
							{/* Datum */}
							<Flex gap={'.2rem'}>
								<IconClockHour5></IconClockHour5>
								<Text c={'var(--text-muted)'}>
									{catchDate}
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
						</Stack>
						<Flex align={'center'} gap={'sm'}>
							<Stack align='center' gap={'0.2rem'}>
								<Text fw={700}>
									{capitilizeFirstLetter(fishCatch.fishType)}
								</Text>
								<Badge
									p={'0.8rem'}
									bg={'var(--bg-primary)'}
									c={'var(--text-inverse)'}
									bdrs={'sm'}
									size='lg'>
									{fishCatch.catchWeight} kg
								</Badge>
							</Stack>
							<Divider
								orientation='vertical'
								size={'xs'}
								color={'var(--color-black)'}></Divider>
							<Image
								src={`/fishtypes/${fishCatch.fishType}.png`}
								w={90}
								h={35}
								fit='contain'></Image>
						</Flex>
					</Stack>
				</Flex>
			</Stack>
		</>
	);
};
