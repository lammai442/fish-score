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
};

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
	ws: null,
	isConnected: false,
	userFromWs: null,
	events: [],
	// Stores the WebSocket when it connects.
	setWebSocket: (websocket) => {
		set({ ws: websocket, isConnected: true });
	},

	// Updates the variable that's used in Frontend
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

	setConnectionStatus: (status) => {
		set({ isConnected: status });
	},

	// Manuell close av connection.
	closeConnection: () => {
		const { ws } = get();
		if (ws) {
			ws.close();
			set({ ws: null, isConnected: false });
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
