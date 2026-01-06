import {
	Flex,
	Image,
	Avatar,
	Box,
	Indicator,
	ActionIcon,
	Button,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconBell } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

export const Header = () => {
	const navigate = useNavigate();
	const [visible, { toggle }] = useDisclosure();

	return (
		<Flex justify='space-between' p='md'>
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
					style={{ cursor: 'pointer' }}>
					{' '}
					SL
				</Avatar>
			</Flex>
		</Flex>
	);
};
