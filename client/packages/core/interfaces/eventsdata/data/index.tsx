import { FishCatch } from '../../fishcatchdata/data';
import type { Team } from '../../teamsdata/data';

export interface FishEvent {
	eventId: string;
	eventName: string;
	createdAt: string;
	createdBy: string | undefined;
	status: string;
	teams?: Team[];
	teamCount: number;
	activity?: FishCatch[];
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

export interface EventMessage {
	messageId: string;
	eventId: string;
	createdBy: string;
	createdByName: string;
	message: string;
	createdAt: string;
	modifiedAt: string | null;
}
