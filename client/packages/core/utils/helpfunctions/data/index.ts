import { Team } from '@fishScore/teamsdata';

export const calculateMembers = (teams: Team[]): number => {
	const totalMembers = teams.reduce(
		(sum, team) => sum + (team.members?.length || 0),
		0,
	);

	return totalMembers;
};

export const capitilizeFirstLetter = (str: string | undefined): string => {
	if (!str) {
		return '';
	}

	return str.charAt(0).toUpperCase() + str.slice(1);
};
