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

	const isConnectingRef = useRef(false);

	useEffect(() => {
		// Skapa WebSocket om det inte finns någon eller om den är stängd
		if (
			(!ws || ws.readyState === WebSocket.CLOSED) &&
			!isConnectingRef.current
		) {
			isConnectingRef.current = true;
			const websocket = new WebSocket(webSocketUrl);
			console.log(
				'Websocket connecting: ',
				new Date().toISOString().slice(0, -5),
			);

			websocket.onopen = () => {
				setWebSocket(websocket);
				setConnectionStatus(true);
				isConnectingRef.current = false;
				console.log(
					'Websocket connected: ',
					new Date().toISOString().slice(0, -5),
				);
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
						console.log('Ny event-uppdatering:', message.data);
						const { updateEvent } = useWebSocketStore.getState();
						updateEvent(message.data);
					}

					// Om det är user som har skapat nya ändringen så körs return och ingen fortsättning till addUpdates
					if (message.changedBy === user.userId) {
						return;
					}

					// Om det är en catch
					const isCatchInsert =
						message.type === 'eventUpdate' &&
						message.entityType === 'CATCH' &&
						message.action === 'INSERT';

					const isMessageInsert =
						message.type === 'eventUpdate' &&
						message.entityType === 'MESSAGE' &&
						message.action === 'INSERT';

					const isSubscriber =
						Array.isArray(message.subscribers) &&
						message.subscribers.includes(user?.userId);

					const isRelevantUpdate =
						isSubscriber && (isCatchInsert || isMessageInsert);

					if (!isRelevantUpdate) return;

					if (isCatchInsert) {
						addUpdate(user?.userId, {
							updateId: message.entity.catchId,
							type: 'catch',
							eventId: message.eventId,
							entity: message.entity,
							changedBy: message.changedBy,
							read: false,
						});
					}

					// Om det är en Message
					if (isMessageInsert) {
						addUpdate(user?.userId, {
							updateId: message.entity.messageId,
							type: 'message',
							eventId: message.eventId,
							entity: message.entity,
							changedBy: message.changedBy,
							read: false,
						});
					}
				} catch (error) {
					console.error('Error parsing WebSocket message:', error);
				}
			};

			// När WebSocket upptäcker att anslutningen är avbruten så sätts en timeot för att försöka återansluta användaren
			websocket.onclose = () => {
				setConnectionStatus(false);
				isConnectingRef.current = false;

				if (reconnectTimeoutRef.current) {
					console.log(
						'Websocket clear reconnecting',
						new Date().toISOString().slice(0, -5),
					);
					clearTimeout(reconnectTimeoutRef.current);
				}

				reconnectTimeoutRef.current = setTimeout(() => {
					console.log(
						'Websocket reconnecting',
						new Date().toISOString().slice(0, -5),
					);
					setWebSocket(null as any);
				}, 3000);
			};

			// När det blir en error
			websocket.onerror = (error) => {
				console.error('WebSocket error:', error);
				isConnectingRef.current = false;
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
