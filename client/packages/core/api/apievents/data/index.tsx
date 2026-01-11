import { FishEvent } from '@fishScore/eventsdata';
import axios from 'axios';
import { useAuthStore } from '@fishScore/useAuthStore';

const apiUrl: string = import.meta.env.VITE_API_URL;

// Hämtar alla events
export const fetchAllEvents = async () => {
	try {
		const response = await axios.get(`${apiUrl}/events`, {
			withCredentials: true,
		});

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

// Skapar ett nytt event
export const fetchCreateEvent = async (createEventDesc: FishEvent) => {
	try {
		const response = await axios.post(
			`${apiUrl}/events/newevent`,
			createEventDesc,
			{
				withCredentials: true,
			}
		);

		// Om backend svarar 401 (No token)
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
