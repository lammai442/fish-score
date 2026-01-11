import axios from 'axios';
import type { LoginData, RegisterData } from '@fishScore/authsdata';
import { useAuthStore } from '@fishScore/useAuthStore';

const apiUrl: string = import.meta.env.VITE_API_URL;

export const fetchAuthRegister = async (user: RegisterData) => {
	try {
		const response = await axios.post(`${apiUrl}/auth/register`, user);
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

export const fetchLogin = async (user: LoginData) => {
	try {
		const response = await axios.post(`${apiUrl}/auth/login`, user, {
			// här skickas cookies
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

export const fetchLogout = async () => {
	try {
		const response = await axios.post(`${apiUrl}/auth/logout`, null, {
			// här skickas cookies
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

export const fetchMe = async () => {
	try {
		const response = await axios.get(`${apiUrl}/auth/me`, {
			// här skickas cookies
			withCredentials: true,
		});

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
