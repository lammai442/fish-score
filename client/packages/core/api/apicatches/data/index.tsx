import axios from 'axios';
import { useAuthStore } from '@fishScore/useAuthStore';

const apiUrl: string = import.meta.env.VITE_API_URL;

// Registrera ny fångst
export const fetchAddCatch = async (
	eventId: string | undefined,
	catchWeight: number,
	teamId: string | undefined,
) => {
	try {
		const response = await axios.post(
			`${apiUrl}/events/${eventId}/teams/${teamId}/add-catch`,
			{ catchWeight: catchWeight },
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
// Redigera en fångst
export const fetchEditCatch = async (
	catchId: string,
	catchWeight: number,
	eventId: string | undefined,
) => {
	try {
		const response = await axios.post(
			`${apiUrl}/events/${eventId}/catch/${catchId}/edit-catch`,
			{ catchWeight: catchWeight },
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
