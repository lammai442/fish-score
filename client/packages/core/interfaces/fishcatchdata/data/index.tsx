export interface FishCatch {
	catchId: string;
	catchWeight: string;
	createdBy: string;
	catchersFullName: string;
	createdAt: string;
	modifiedAt?: string;
	teamId: string;
	teamName: string;
	eventId: string;
	eventStatus?: string;
	eventName?: string;
	fishType: FishType;
}

export type FishType =
	| 'pike'
	| 'perch'
	| 'zander'
	| 'salmon'
	| 'trout'
	| 'char'
	| 'rainbow';
