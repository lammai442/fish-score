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
export const Header = () => {
	const navigate = useNavigate();
	const [visible] = useDisclosure();
	const [opened, { open, close }] = useDisclosure();
	const { user } = useUserStore();

	const userFullName = `${user?.firstName} ${user?.lastName}`;

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
				{/* Öppnar upp Updates */}
				<BaseModal title='Updates' opened={opened} close={close}>
					<Updates></Updates>
				</BaseModal>
				<Flex gap='0.5rem'>
					<Tooltip label={'Updates'}>
						<Indicator
							size={10}
							color='red'
							disabled={!visible}
							offset={7}
							style={{ cursor: 'pointer' }}
							withBorder
							onClick={open}>
							<ActionIcon variant='transparent' size='lg'>
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
