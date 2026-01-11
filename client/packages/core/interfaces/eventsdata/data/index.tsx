export interface FishEvent {
	PK?: string;
	SK?: string;
	id: string;
	eventName: string;
	createdAt?: string;
	createdBy: string | undefined;
	entityType?: string;
	lookupType?: string;
	lookupValue?: string;
	status?: string;
	teams?: Team[];
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

export interface CreateEventDesc {
	eventName: string;
	createdBy: string | undefined;
	teams: Team[];
}
