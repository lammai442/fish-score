import { ActionIcon, Flex, Stack, Text, Tooltip } from '@mantine/core';
import { FishCatch } from '../../../core/interfaces/fishcatchdata/data';
import { IconClockHour5, IconFish, IconPencil } from '@tabler/icons-react';
import { dateFormatter } from '../../../core/formatters/data';
import { BaseModal } from '@fishScore/basemodal';
import { useDisclosure } from '@mantine/hooks';
import { EditCatch } from '../../editcatch/ui';

type Props = {
	fishCatch: FishCatch;
	userId?: string;
	eventStatus: string;
};

export const ActivityCatch = ({ fishCatch, userId, eventStatus }: Props) => {
	const [opened, { open, close }] = useDisclosure();
	const catchDate = dateFormatter(fishCatch.createdAt);
	const catchedByUser = fishCatch.catchedBy === userId;
	let modifiedCatchDate: string | null = null;
	if (fishCatch.modifiedAt) {
		modifiedCatchDate = dateFormatter(fishCatch.modifiedAt);
	}

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
				bd={
					catchedByUser
						? '1px solid var(--color-primary)'
						: '1px solid var(--border-default)'
				}
				bdrs={'15px'}
				p={'20px'}
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
							{eventStatus === 'ongoing' && catchedByUser && (
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
						<Text>Caught {fishCatch.catchWeight} kg</Text>
						{/* Datum */}
						<Flex gap={'xs'}>
							<IconClockHour5></IconClockHour5>
							<Text>
								{fishCatch.modifiedAt ? (
									<>
										<Text span fw={700}>
											Updated:
										</Text>{' '}
										{modifiedCatchDate}{' '}
									</>
								) : (
									catchDate
								)}
							</Text>
						</Flex>
					</Stack>
				</Flex>
			</Stack>
		</>
	);
};
