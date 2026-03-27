import { useAuthStore } from '@fishScore/useAuthStore';
import { useUserStore } from '@fishScore/useUserStore';
import axios from 'axios';

const apiUrl: string = import.meta.env.VITE_API_URL;

// Hämtar hem Me
export const fetchUserMe = async () => {
	try {
		const response = await axios.get(`${apiUrl}/users/me`, {
			withCredentials: true,
		});
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

// Hämtar hem userProfile
export const fetchUserProfile = async () => {
	try {
		const response = await axios.get(`${apiUrl}/users/profile`, {
			withCredentials: true,
		});
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
