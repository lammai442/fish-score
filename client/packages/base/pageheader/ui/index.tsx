import {
	ActionIcon,
	Avatar,
	Box,
	Flex,
	Stack,
	Text,
	Title,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

type Props = {
	title: string;
	subTitle?: string;
	subTitleStatus?: string;
};

export const PageHeader = ({ title, subTitle, subTitleStatus }: Props) => {
	const navigate = useNavigate();

	return (
		<Box
			style={{
				display: 'grid',
				gridTemplateColumns: 'auto 1fr auto',
				alignItems: 'center',
			}}>
			<ActionIcon onClick={() => navigate(-1)}>
				<IconArrowLeft />
			</ActionIcon>
			<Stack>
				<Title order={1}>{title}</Title>
				{subTitle && <Text>{subTitle}</Text>}
			</Stack>
		</Box>
	);
};
