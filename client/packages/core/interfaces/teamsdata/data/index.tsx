import { FishCatch } from '../../fishcatchdata/data';

export interface Team {
	teamId?: string;
	teamName: string;
	createdAt?: string;
	members: [{ userId: string; name: string }];
	catches: FishCatch[];
	totalCatchWeight: number;
	createdBy: string;
}
export interface createNewTeam {
	eventId?: string;
	teamName: string;
	createdBy: string;
}

export interface TeamUserData {
	userId?: string;
	eventId?: string;
	teamId?: string;
}
