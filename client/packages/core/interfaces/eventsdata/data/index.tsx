export interface FishEvent {
	PK: string;
	SK: string;
	eventName: string;
	createdAt: string;
	createdBy: string;
	entityType: string;
	lookupPK: string;
	lookupSK: string;
	status: string;
	teams: Team[];
}

export interface Team {
	teamId: string;
	name: string;
	members: string[];
	catches: FishCatch[];
}

export interface FishCatch {
	userId: string;
	weight: number;
	createdAt: number;
}

export interface CreateEvent {
	eventName: string;
	userId: string;
}
