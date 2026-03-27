import axios from 'axios';
import { useAuthStore } from '@fishScore/useAuthStore';
import { useUserStore } from '@fishScore/useUserStore';

const apiUrl: string = import.meta.env.VITE_API_URL;

// Publicera ett nytt message
export const fetchAddMessage = async (
	eventId: string | undefined,
	message: string,
) => {
	try {
		const response = await axios.post(
			`${apiUrl}/events/${eventId}/messages/add-message`,
			{ message: message },
			{
				withCredentials: true,
			},
		);
		return {
			success: true,
			data: response.data,
			status: response.status,
		};
	} catch (error: any) {
		const status = error.response?.status || 500;

		// Sätter authstatus till 'unauthenticated' så att loginmodal öppnas
		if (status === 401) {
			useAuthStore.getState().setAuthStatus('unauthenticated');
			useUserStore.getState().clearUser();
		}

		return {
			success: false,
			data: error.response?.data || { message: error.message },
			status,
		};
	}
};
