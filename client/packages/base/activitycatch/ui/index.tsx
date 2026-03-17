import { Flex, Stack, Text } from '@mantine/core';
import { FishCatch } from '../../../core/interfaces/fishcatchdata/data';
import { IconClockHour5, IconFish } from '@tabler/icons-react';
import { dateFormatter } from '../../../core/formatters/data';

type Props = {
	fishCatch: FishCatch;
};

export const ActivityCatch = ({ fishCatch }: Props) => {
	const catchDate = dateFormatter(fishCatch.createdAt);

	return (
		<>
			<Stack p={2} bg={'red'}>
				<Flex>
					<IconFish size={50}></IconFish>
					<Stack>
						<Text>
							{fishCatch.catchersFullName} from team{' '}
							<Text span fw={700}>
								{fishCatch.teamName}
							</Text>
						</Text>
						<Text>Caught {fishCatch.catchWeight} kg</Text>
						<Flex>
							<IconClockHour5></IconClockHour5>
							<Text>{catchDate}</Text>
						</Flex>
					</Stack>
				</Flex>
			</Stack>
		</>
	);
};
