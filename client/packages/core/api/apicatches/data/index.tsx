import axios from 'axios';
import { useAuthStore } from '@fishScore/useAuthStore';
import { useUserStore } from '@fishScore/useUserStore';
import type { FishType } from '@fishScore/fishcatchdata';

const apiUrl: string = import.meta.env.VITE_API_URL;

// Registrera ny fångst
export const fetchAddCatch = async (
	eventId: string | undefined,
	catchWeight: number,
	teamId: string | undefined,
	fishType: FishType,
) => {
	try {
		const response = await axios.post(
			`${apiUrl}/events/${eventId}/teams/${teamId}/add-catch`,
			{ catchWeight: catchWeight, fishType: fishType },
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
// Redigera en fångst
export const fetchEditCatch = async (
	catchId: string,
	catchWeight: number,
	eventId: string | undefined,
	fishType: FishType,
) => {
	try {
		const response = await axios.post(
			`${apiUrl}/events/${eventId}/catch/edit-catch/${catchId}`,
			{ catchWeight: catchWeight, fishType: fishType },
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

// Radera en catch
export const fetchDeleteCatch = async (
	catchId: string | undefined,
	eventId: string | undefined,
) => {
	try {
		const response = await axios.delete(
			`${apiUrl}/events/${eventId}/catch/delete-catch/${catchId}`,
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
