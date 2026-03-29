import axios from 'axios';
import type { LoginData, RegisterData } from '@fishScore/authsdata';
import { useAuthStore } from '@fishScore/useAuthStore';
import { useUserStore } from '@fishScore/useUserStore';

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

export const fetchLogin = async (user: LoginData) => {
	try {
		const response = await axios.post(`${apiUrl}/auth/login`, user, {
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

export const fetchLogout = async () => {
	try {
		const response = await axios.post(`${apiUrl}/auth/logout`, null, {
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

export const fetchMe = async () => {
	try {
		const response = await axios.get(`${apiUrl}/auth/me`, {
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
			// Provar nytt anrop för att se ifall det finns en refreshToken som är längre tid
			const refreshResponse = await refreshAccessToken();

			if (refreshResponse.success) {
				try {
					const retryMeResponse = await axios.get(
						`${apiUrl}/auth/me`,
						{
							withCredentials: true,
						},
					);

					return {
						success: true,
						data: retryMeResponse.data,
						status: retryMeResponse.status,
					};
				} catch (retryError: any) {
					useAuthStore.getState().setAuthStatus('unauthenticated');
					useUserStore.getState().clearUser();

					return {
						success: false,
						data: retryError.response?.data || {
							message: retryError.message,
						},
						status: retryError.response?.status || 500,
					};
				}
			}
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

// Försöker skapa en ny accessToken om refresh token är giltig
export const refreshAccessToken = async () => {
	try {
		const response = await axios.post(
			`${apiUrl}/auth/refresh`,
			{},
			{ withCredentials: true },
		);

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
