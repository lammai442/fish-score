import { Stack } from '@mantine/core';
import { PageHeader } from '@fishScore/pageheader';
import { ProfileOverview } from '../../../base/profileoverview/ui';

export const ProfilePage = () => {
	return (
		<Stack gap={0}>
			<PageHeader title='Profile' />
			<ProfileOverview></ProfileOverview>
		</Stack>
	);
};
