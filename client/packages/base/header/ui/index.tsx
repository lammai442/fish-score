import './index.css';
import {
	Flex,
	Image,
	Avatar,
	Box,
	Indicator,
	ActionIcon,
	Container,
	Tooltip,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconBell } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useUserStore } from '@fishScore/useUserStore';
import { BaseModal } from '@fishScore/basemodal';
import { Updates } from '@fishScore/updates';
import { useUpdateStore } from '@fishScore/useupdatestore';
import { useEffect, useState } from 'react';
export const Header = () => {
	const navigate = useNavigate();
	const [opened, { open, close }] = useDisclosure();
	const { user } = useUserStore();
	const { updates, markAllAsRead } = useUpdateStore();
	const [wiggle, setWiggle] = useState<boolean>(false);

	const userFullName = `${user?.firstName} ${user?.lastName}`;

	useEffect(() => {
		if (updates.length > 0 && updates.some((u) => u.read === false)) {
			setWiggle(true);
		}
	}, [updates]);

	const handleCloseUpdates = () => {
		setWiggle(false);
		markAllAsRead();
		close();
	};

	return (
		<Container size='lg'>
			<Flex justify='space-between' align='center' p='16px'>
				<Box onClick={() => navigate('/')}>
					<Tooltip label={'Home'}>
						<Image
							src='/transparent-logo.png'
							alt='Logo'
							width={70}
							height={70}
							style={{ cursor: 'pointer' }}
							fit='contain'></Image>
					</Tooltip>
				</Box>
				{/* Öppnar upp modal med Updates */}
				<BaseModal
					title='Updates'
					opened={opened}
					close={handleCloseUpdates}>
					<Updates
						updates={updates}
						close={close}
						setWiggle={setWiggle}></Updates>
				</BaseModal>
				<Flex gap='0.5rem'>
					<Tooltip label={'Updates'}>
						<Indicator
							size={10}
							color='red'
							disabled={!wiggle}
							offset={7}
							style={{ cursor: 'pointer' }}
							withBorder
							onClick={() => {
								setWiggle(false);
								open();
							}}>
							<ActionIcon
								variant='transparent'
								size='lg'
								className={wiggle ? 'notification-wiggle' : ''}>
								<IconBell size={20} color='black' />
							</ActionIcon>
						</Indicator>
					</Tooltip>

					<Tooltip label={'Show profile'}>
						<Avatar
							onClick={() => navigate('/profile')}
							color='var(--bg-primary)'
							radius='xl'
							style={{ cursor: 'pointer' }}
							name={userFullName}></Avatar>
					</Tooltip>
				</Flex>
			</Flex>
		</Container>
	);
};
