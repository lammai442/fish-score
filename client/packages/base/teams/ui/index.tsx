import type { Team } from '@fishScore/eventsdata';
import { Flex, Stack, Text, Title } from '@mantine/core';

type Props = {
	team: Team;
	userId: string | undefined;
	rankNr: number;
};

export const Teams = ({ team, userId, rankNr }: Props) => {
	const userExistInTeam = team.members.some(
		(member) => member.userId === userId,
	);

	return (
		<>
			<Stack
				key={team.createdAt}
				bdrs={'15px'}
				bd={
					userExistInTeam
						? '1px solid var(--br-blue)'
						: '1px solid var(--br-grey)'
				}
				bg={
					userExistInTeam
						? 'var(--bg-blue-color)'
						: 'var(--bg-white-color)'
				}
				p={'20px'}>
				<Flex gap={'0.5rem'}>
					<Text
						span
						fw={700}
						bg='var(--bg-medium-light-grey-color)'
						w={30}
						h={30}
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: '50%',
						}}>
						{rankNr}
					</Text>
					<Flex gap={'0.5rem'}>
						<Title order={3}>{team.teamName}</Title>
						{userExistInTeam && (
							<Text
								bg={'var(--bg-medium-light-grey-color)'}
								p={'0.4rem'}
								fz={'sm'}
								bdrs={'0.5rem'}>
								Your team
							</Text>
						)}
					</Flex>
				</Flex>
				<Text>
					Medlemmar:{' '}
					{team.members.map((member) => member.name).join(', ')}
				</Text>
				<Text fz={'h2'}>{team.totalCatchWeight} kg</Text>
			</Stack>
		</>
	);
};
