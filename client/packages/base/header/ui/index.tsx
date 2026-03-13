import {
	Flex,
	Image,
	Avatar,
	Box,
	Indicator,
	ActionIcon,
	Container,
	Divider,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconBell } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useUserStore } from '@fishScore/useUserStore';

export const Header = () => {
	const navigate = useNavigate();
	const [visible, { toggle }] = useDisclosure();
	const { user } = useUserStore();

	const userFullName = `${user?.firstName} ${user?.lastName}`;

	return (
		<Container size='lg'>
			<Flex justify='space-between' align='center' p='16px'>
				<Box onClick={() => navigate('/')}>
					<Image
						src='/transparent-logo.png'
						alt='Logo'
						width={70}
						height={70}
						style={{ cursor: 'pointer' }}
						fit='contain'></Image>
				</Box>
				<Flex gap='0.5rem'>
					<Indicator
						size={10}
						color='red'
						disabled={!visible}
						offset={7}
						style={{ cursor: 'pointer' }}
						withBorder>
						<ActionIcon variant='transparent' size='lg'>
							<IconBell size={20} color='black' />
						</ActionIcon>
					</Indicator>

					<Avatar
						onClick={() => navigate('/profile')}
						color='var(--bg-primary-color)'
						radius='xl'
						style={{ cursor: 'pointer' }}
						name={userFullName}></Avatar>
				</Flex>
			</Flex>
			<Divider mb='0.5rem' />
		</Container>
	);
};
