export interface EventMessage {
	createdAt: string;
	createdBy: string;
	eventId: string;
	eventName: string;
	message: string;
	messageId: string;
	messageUserFullName: string;
	modifiedAt: string | null;
}
