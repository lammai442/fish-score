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
	members: [{ userId: string; name: string }];
}

export interface FishCatch {
	userId: string;
	weight: number;
	createdAt: number;
}

export interface CreateEventDesc {
	eventName: string;
	createdBy: string | undefined;
	teams: Team[];
}
