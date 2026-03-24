import { useEffect, useRef } from 'react';
import { useWebSocketStore } from '@fishScore/usewebsocketstore';
import { useUserStore } from '@fishScore/useUserStore';
import { useUpdateStore } from '@fishScore/useupdatesstore';
import { User } from '@fishScore/usersdata';

const webSocketUrl: string = import.meta.env.VITE_WEBSOCKET_URL;

export const useWebSocketHook = () => {
	const {
		ws,
		setWebSocket,
		setConnectionStatus,
		updateUser,
		closeConnection,
	} = useWebSocketStore();
	const { user } = useUserStore();
	const { addUpdate } = useUpdateStore();

	const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);

	useEffect(() => {
		// Skapa WebSocket om det inte finns någon eller om den är stängd
		if (!ws || ws.readyState === WebSocket.CLOSED) {
			const websocket = new WebSocket(webSocketUrl);
			const date = new Date().toISOString().slice(0, -5);
			console.log('Websocket connecting: ', date);

			websocket.onopen = () => {
				setWebSocket(websocket);
				setConnectionStatus(true);
				console.log('Websocket connected: ', date);
			};

			websocket.onmessage = (event) => {
				try {
					if (!user) {
						return;
					}
					const message = JSON.parse(event.data);
					console.log('WebSocket message received:', message);

					if (message.type === 'userUpdate' && message.user) {
						updateUser(message.user as User);
					}

					// Uppdatera frontend om det är en eventUpdate
					if (message.type === 'eventUpdate' && message.data) {
						// Här kan du t.ex. lägga till eventet i en state-array eller uppdatera ett valt event
						console.log('Ny event-uppdatering:', message.data);
						const { updateEvent } = useWebSocketStore.getState();
						updateEvent(message.data);
					}

					// Om det är user som har skapat nya ändringen så körs return och ingen fortsättning till addUpdates
					if (message.changedBy === user.userId) {
						return;
					}

					const isNewCatchUpdate =
						message.type === 'eventUpdate' &&
						message.entityType === 'CATCH' &&
						message.action === 'INSERT';

					if (!isNewCatchUpdate) return;

					addUpdate(user?.userId, {
						type: 'catch',
						eventId: message.eventId,
						entity: message.entity,
						changedBy: message.changedBy,
					});
				} catch (error) {
					console.error('Error parsing WebSocket message:', error);
				}
			};

			// När WebSocket upptäcker att anslutningen är avbruten så sätts en timeot för att försöka återansluta användaren
			websocket.onclose = () => {
				setConnectionStatus(false);

				reconnectTimeoutRef.current = setTimeout(() => {
					setWebSocket(null as any);
				}, 3000);
			};

			// När det blir en error
			websocket.onerror = (error) => {
				console.error('WebSocket error:', error);
				setConnectionStatus(false);
			};
		}

		// Rensa timeout om komponenten tas bort
		return () => {
			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current);
			}
		};
	}, [ws, setWebSocket, setConnectionStatus, updateUser, user?.userId]);

	useEffect(() => {
		return () => {
			closeConnection();
		};
	}, [closeConnection]);

	return {
		isConnected: ws?.readyState === WebSocket.OPEN,
		ws,
	};
};
