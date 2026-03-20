import { Stack } from '@mantine/core';
import { PageHeader } from '@fishScore/pageheader';
import { ProfileOverview } from '../../../base/profileoverview/ui';

export const ProfilePage = () => {
	return (
		<Stack>
			<PageHeader title='Profile' />
			<ProfileOverview></ProfileOverview>
		</Stack>
	);
};
