import { Modal, Text } from '@mantine/core';
import { ReactNode } from 'react';

type Props = {
	title: string;
	children?: ReactNode;
	opened: boolean;
	close: () => void;
};

export const BaseModal = ({ title, children, opened, close }: Props) => {
	return (
		<Modal
			opened={opened}
			onClose={close}
			centered
			zIndex={9999}
			title={
				<Text
					ta='center'
					style={{
						fontSize: '1.3rem',
						fontWeight: '700',
						textAlign: 'center',
					}}>
					{title}
				</Text>
			}>
			{children}
		</Modal>
	);
};
