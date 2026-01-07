export interface LoginData {
	email: string;
	password: string;
}

export interface RegisterData extends LoginData {
	firstName: string;
	lastName: string;
}

export interface User {
	userId: string;
	email: string;
	firstName: string;
	lastName: string;
	maxCatchWeight: number;
	totalCatchWeight: number;
	createdAt: string;
}

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
