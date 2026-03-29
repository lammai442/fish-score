import type { EventMessage } from '@fishScore/messagesdata';
import type { FishCatch } from '../../fishcatchdata/data';

type CatchUpdate = {
	updateId: string;
	type: 'catch';
	eventId: string;
	entity: FishCatch;
	changedBy: string;
	read: boolean;
	action: 'INSERT' | 'MODIFY' | 'REMOVE';
};

type MessageUpdate = {
	updateId: string;
	type: 'message';
	eventId: string;
	entity: EventMessage;
	changedBy: string;
	read: boolean;
	action: 'INSERT' | 'MODIFY' | 'REMOVE';
};
type EventUpdate = {
	updateId: string;
	type: 'event';
	eventId: string;
	entity: EventMessage;
	changedBy: string;
	read: boolean;
	action: 'INSERT' | 'MODIFY' | 'REMOVE';
	updateKind: string | null;
};

export type Update = CatchUpdate | MessageUpdate | EventUpdate;
