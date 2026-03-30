import { useEffect, useRef } from 'react';
import { useWebSocketStore } from '@fishScore/usewebsocketstore';
import { useUserStore } from '@fishScore/useUserStore';
import { useUpdateStore } from '@fishScore/useupdatestore';
import type { User } from '@fishScore/usersdata';
import { useNavigate } from 'react-router-dom';

const webSocketUrl: string = import.meta.env.VITE_WEBSOCKET_URL;

export const useWebSocketHook = () => {
	const {
		ws,
		setWebSocket,
		setConnectionStatus,
		updateUser,
		closeConnection,
		removeEvent,
		updateEvent,
	} = useWebSocketStore();
	const { user } = useUserStore();
	const { addUpdate } = useUpdateStore();
	const navigate = useNavigate();

	const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);
	// Förhindrar att flera WebSocket-anslutningar samtidigt.
	const isConnectingRef = useRef(false);

	// Stoppar reconnect vid en manuell stängning av connectionen
	const shouldReconnectRef = useRef(true);

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
					const message = JSON.parse(event.data);
					console.log('WebSocket message received:', message);

					if (message.type === 'userUpdate' && message.user) {
						updateUser(message.user as User);
					}

					// Uppdatera frontend om det är en eventUpdate
					if (message.type === 'eventUpdate') {
						if (
							message.entityType === 'EVENT' &&
							message.action === 'REMOVE'
						) {
							removeEvent(message.eventId);
							navigate('/', { replace: true });
						} else if (message.data) {
							console.log('Ny event-uppdatering:', message.data);
							updateEvent(message.data);
						}
					}

					const currentUser = useUserStore.getState().user;
					if (!currentUser) {
						return;
					}

					if (message.updateKind === 'subscribers') {
						return;
					}

					// Om det är user som har skapat nya ändringen så körs return och ingen fortsättning till addUpdates
					if (message.changedBy === currentUser.userId) {
						return;
					}
					// Om det är en catch
					const isCatchInsertModifyOrDelete =
						message.type === 'eventUpdate' &&
						message.entityType === 'CATCH' &&
						(message.action === 'INSERT' ||
							message.action === 'MODIFY' ||
							message.action === 'REMOVE');

					// Om det är ett meddelande
					const isMessageInsert =
						message.type === 'eventUpdate' &&
						message.entityType === 'MESSAGE' &&
						message.action === 'INSERT';

					// Om det är ett event
					const isEventStatusModify =
						message.type === 'eventUpdate' &&
						message.entityType === 'EVENT' &&
						message.action === 'MODIFY' &&
						message.updateKind === 'eventStatus';

					const isEventRemove =
						message.type === 'eventUpdate' &&
						message.entityType === 'EVENT' &&
						message.action === 'REMOVE';

					const isSubscriber =
						Array.isArray(message.subscribers) &&
						message.subscribers.includes(currentUser.userId);

					const isRelevantUpdate =
						isSubscriber &&
						(isCatchInsertModifyOrDelete ||
							isMessageInsert ||
							isEventStatusModify ||
							isEventRemove);

					// Om något av villkoren är falska så körs ingen addUpdate
					if (!isRelevantUpdate) return;

					let updateId: string | null = null;
					let type: 'catch' | 'message' | 'event' | null = null;

					if (isCatchInsertModifyOrDelete) {
						updateId = message.entity.catchId;
						type = 'catch';
					} else if (isMessageInsert) {
						updateId = message.entity.messageId;
						type = 'message';
					} else if (isEventStatusModify || isEventRemove) {
						updateId = message.entity.eventId;
						type = 'event';
					}
					if (!updateId || !type) return;

					addUpdate(currentUser.userId, {
						updateId,
						type,
						eventId: message.eventId,
						entity: message.entity,
						changedBy: message.changedBy,
						read: false,
						action: message.action,
						updateKind: message.updateKind ?? null,
					});
				} catch (error) {
					console.error('Error parsing WebSocket message:', error);
				}
			};

			// När WebSocket upptäcker att anslutningen är avbruten så sätts en timeot för att försöka återansluta användaren
			websocket.onclose = () => {
				setConnectionStatus(false);
				isConnectingRef.current = false;
				setWebSocket(null as any);

				if (!shouldReconnectRef.current) {
					return;
				}

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
		shouldReconnectRef.current = true;
		return () => {
			shouldReconnectRef.current = false;
			closeConnection();
		};
	}, [closeConnection]);

	return {
		isConnected: ws?.readyState === WebSocket.OPEN,
		ws,
	};
};
