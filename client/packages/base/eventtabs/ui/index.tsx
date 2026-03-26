import {
	Button,
	Divider,
	Flex,
	Stack,
	Tabs,
	Text,
	Textarea,
} from '@mantine/core';
import { FishEvent } from '@fishScore/eventsdata';
import type { Team } from '@fishScore/teamsdata';
import { useState } from 'react';
import { Teams } from '../../teams/ui';
import { User } from '@fishScore/usersdata';
import { FishCatch } from '@fishScore/fishcatchdata';
import { FishCatchCard } from '@fishScore/fishcatchcard';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { fetchAddMessage } from '../../../core/api/apimessages/data';
import { EventsMessage } from '@fishScore/eventsmessage';

type Props = {
	currentEvent: FishEvent | undefined;
	leaderboard: Team[];
	user: User | null;
	usersTeam: Team | undefined;
	activity: FishCatch[];
	setLoading: (value: boolean) => void;
	setMode: (value: string | null) => void;
	mode: string | null;
};

export const EventTabs = ({
	currentEvent,
	leaderboard,
	user,
	usersTeam,
	activity,
	setLoading,
	mode,
	setMode,
}: Props) => {
	const [message, setMessage] = useState<string>('');

	const handleSendMsg = async () => {
		try {
			setLoading(true);

			const response = await fetchAddMessage(
				currentEvent?.eventId,
				message,
			);
			if (response.success) {
				setMessage('');
				showNotification({
					title: 'Message',
					message: 'Your new message has been published!',
					color: 'var(--bg-primary)',
					icon: <IconCheck />,
					position: 'top-center',
				});
			}
		} finally {
			setLoading(false);
		}
	};
	return (
		<Tabs
			variant='pills'
			value={mode}
			onChange={setMode}
			classNames={{
				tab: 'scoreboard__tab',
				list: 'scoreboard__list',
			}}>
			<Tabs.List
				grow
				justify='center'
				p={'0.2rem'}
				bg={'var(--bg-muted)'}
				bdrs={15}>
				<Tabs.Tab value='leaderboard'>Leaderboard</Tabs.Tab>
				<Tabs.Tab value='activity'>Activity</Tabs.Tab>
				<Tabs.Tab value='messages'>Messages</Tabs.Tab>
			</Tabs.List>
			{/* Leaderboard tab */}
			<Tabs.Panel value='leaderboard' pt='md'>
				<Stack
					style={{
						maxHeight: '550px',
						overflow: 'auto',
						scrollbarWidth: 'thin',
					}}>
					{currentEvent && leaderboard.length > 0 ? (
						leaderboard.map((team: Team, index) => {
							return (
								<Teams
									eventStatus={currentEvent.status}
									key={team.teamId}
									team={team}
									userId={user?.userId}
									rankNr={index + 1}
									userIsInAnyTeam={!!usersTeam}
									eventId={currentEvent.eventId}
									createdBy={currentEvent.createdBy}></Teams>
							);
						})
					) : (
						<Text ta={'center'}>No teams has been created</Text>
					)}
				</Stack>
			</Tabs.Panel>
			{/* Activity tab */}
			<Tabs.Panel value='activity' pt='md'>
				<Stack
					style={{
						maxHeight: '550px',
						overflow: 'auto',
						scrollbarWidth: 'thin',
					}}>
					{activity.length > 0 ? (
						activity.map((fishCatch) => {
							return (
								<FishCatchCard
									key={fishCatch.catchId}
									fishCatch={fishCatch}
									eventStatus={currentEvent?.status}
									userId={user?.userId}
									variant='activityCatch'></FishCatchCard>
							);
						})
					) : (
						<Text ta={'center'}>
							{currentEvent?.status === 'ongoing'
								? 'No fish has been caught! Who will be the first one?'
								: 'Event has ended and no fish has been caught'}
						</Text>
					)}
				</Stack>
			</Tabs.Panel>
			{/* Messages tab */}
			<Tabs.Panel value='messages' pt='md'>
				<Stack>
					<Flex gap={'sm'}>
						<Textarea
							placeholder='New message'
							autosize
							maxRows={4}
							flex={9}
							value={message}
							onChange={(event) =>
								setMessage(event.currentTarget.value)
							}
							styles={{
								input: {
									'--input-bd-focus': 'var(--color-black)',
								},
							}}></Textarea>
						<Button
							flex={1}
							bg={
								!message.trim()
									? 'var(--color-grey)'
									: 'var(--color-black)'
							}
							fz={'0.68rem'}
							disabled={!message.trim()}
							onClick={handleSendMsg}>
							Send
						</Button>
					</Flex>

					{currentEvent && currentEvent.messages.length > 0 && (
						<Stack
							gap={'sm'}
							bd={'1px solid var(--color-grey-dark)'}
							p={'sm'}
							bdrs={'lg'}
							style={{
								maxHeight: '550px',
								overflow: 'auto',
								scrollbarWidth: 'thin',
							}}>
							{currentEvent.messages.map((message, index) => {
								const isLast =
									index === currentEvent.messages.length - 1;
								const hasMultiple =
									currentEvent.messages.length > 1;

								return (
									<Stack gap={'sm'} key={message.messageId}>
										<EventsMessage
											eventMessage={
												message
											}></EventsMessage>
										{hasMultiple && !isLast && (
											<Divider key={index} size={'sm'} />
										)}
									</Stack>
								);
							})}
						</Stack>
					)}
				</Stack>
			</Tabs.Panel>
		</Tabs>
	);
};
