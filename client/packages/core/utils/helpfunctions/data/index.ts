import { Team } from '@fishScore/eventsdata';

export const calculateMembers = (teams: Team[]): number => {
	const totalMembers = teams.reduce(
		(sum, team) => sum + (team.members?.length || 0),
		0
	);

	return totalMembers;
};
