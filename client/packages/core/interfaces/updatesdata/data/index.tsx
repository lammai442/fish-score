export type Update = {
	updateId: string;
	type: 'catch' | 'message';
	eventId: string;
	entity: 'CATCH' | 'MESSAGE';
	changedBy?: string;
	read: boolean;
};
