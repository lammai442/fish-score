import type { FishEvent } from '@fishScore/eventsdata';
import type { User } from '@fishScore/usersdata';
import { create } from 'zustand';

type WebSocketState = {
	ws: WebSocket | null;
	isConnected: boolean;
	userFromWs: User | null;
	events: FishEvent[];
	setWebSocket: (websocket: WebSocket) => void;
	setConnectionStatus: (status: boolean) => void;
	updateUser: (updatedUser: User) => void;
	setEvents: (events: FishEvent[]) => void;
	updateEvent: (updatedEvent: FishEvent) => void;
	closeConnection: () => void;
	reset: () => void;
	removeEvent: (eventId: string) => void;
};

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
	ws: null,
	isConnected: false,
	userFromWs: null,
	events: [],
	// Lagrar websockets när den är connected
	setWebSocket: (websocket) => {
		set({ ws: websocket, isConnected: true });
	},

	// Uppdaterar variabeln userFromWs
	updateUser: (updatedUser: User): void => {
		set({ userFromWs: updatedUser });
	},

	setEvents: (events) => set({ events }),

	// Uppdaterar eller lägger till ett event
	updateEvent: (updatedEvent: FishEvent): void => {
		set((state) => {
			const existingIndex = state.events.findIndex(
				(e) => e.eventId === updatedEvent.eventId,
			);
			if (existingIndex >= 0) {
				// Uppdatera befintligt event
				const newEvents = [...state.events];
				newEvents[existingIndex] = updatedEvent;
				return { events: newEvents };
			} else {
				// Lägg till nytt event
				return { events: [...state.events, updatedEvent] };
			}
		});
	},
	removeEvent: (eventId: string) =>
		set((state) => ({
			events: state.events.filter((event) => event.eventId !== eventId),
		})),

	setConnectionStatus: (status) => {
		set({ isConnected: status });
	},

	// Manuell close av connection.
	closeConnection: () => {
		const { ws } = get();
		if (ws) {
			ws.close();
		}
	},

	reset: () => {
		set({
			ws: null,
			isConnected: false,
			userFromWs: null,
		});
	},
}));
