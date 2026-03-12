import { Team } from '../../teamsdata/data';

export interface FishEvent {
	PK: string;
	SK: string;
	id: string;
	eventName: string;
	createdAt?: string;
	createdBy: string | undefined;
	entityType: string;
	lookupType: string;
	lookupValue: string;
	status: string;
	teams: Team[];
}

export interface NewFishEvent {
	eventName: string;
	createdBy: string;
}
export interface CreateEventDesc {
	eventName: string;
	createdBy: string | undefined;
	teams: Team[];
}
