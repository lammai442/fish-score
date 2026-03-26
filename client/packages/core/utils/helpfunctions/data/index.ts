import type { Team } from '@fishScore/teamsdata';

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

export const generateLeaderboard = (sortedLeaderboard: Team[]) => {
	const groups: { totalCatchWeight: number; teams: Team[] }[] = [];

	for (const team of sortedLeaderboard) {
		const totalCatchWeight = team.totalCatchWeight;

		const existingGroup = groups.find(
			(g) => g.totalCatchWeight === totalCatchWeight,
		);
		if (existingGroup) {
			existingGroup.teams.push(team);
		} else {
			groups.push({
				totalCatchWeight,
				teams: [team],
			});
		}
	}
	groups.sort((a, b) => b.totalCatchWeight - a.totalCatchWeight);

	return groups;
};
