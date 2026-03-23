import axios from 'axios';
import { useAuthStore } from '@fishScore/useAuthStore';

const apiUrl: string = import.meta.env.VITE_API_URL;

// Registrera ny fångst
export const fetchAddMessage = async (
	eventId: string | undefined,
	message: number,
	userId: string | undefined,
) => {
	try {
		const response = await axios.post(
			`${apiUrl}/events/${eventId}/messages/add-message`,
			{ message: message, userId: userId },
			{
				withCredentials: true,
			},
		);

		// Open loginModal if response is 401 (No token)
		if (response.status === 401) {
			useAuthStore.getState().openLoginModal();
			return { success: false, error: response.data.error };
		}

		return {
			success: true,
			data: response.data,
			status: response.status,
		};
	} catch (error: any) {
		return {
			success: false,
			data: error.response?.data || { message: error.message },
			status: error.response?.status || 500,
		};
	}
};
