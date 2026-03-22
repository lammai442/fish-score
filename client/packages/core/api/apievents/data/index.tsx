import type { NewFishEvent } from '@fishScore/eventsdata';
import axios from 'axios';
import { useAuthStore } from '@fishScore/useAuthStore';
import type { createNewTeam, TeamUserData } from '@fishScore/teamsdata';

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
// Hämtar ett event
export const fetchEvent = async (id: string) => {
	try {
		const response = await axios.get(`${apiUrl}/events/${id}`, {
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
export const fetchCreateEvent = async (createEventDesc: NewFishEvent) => {
	try {
		const response = await axios.post(
			`${apiUrl}/events/newevent`,
			createEventDesc,
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

// Skapar ett nytt team
export const fetchCreateTeam = async (createTeamDesc: createNewTeam) => {
	try {
		const response = await axios.post(
			`${apiUrl}/teams/newteam`,
			createTeamDesc,
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

// Joinar ett nytt team
export const fetchJoinTeam = async (teamUserData: TeamUserData) => {
	try {
		const response = await axios.post(
			`${apiUrl}/events/${teamUserData.eventId}/teams/${teamUserData.teamId}/join`,
			{ userId: teamUserData.userId },
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

// Uppdatererar eventnamn
export const fetchUpdateEvent = async (
	eventId: string | undefined,
	newEventname: string,
) => {
	try {
		const response = await axios.put(
			`${apiUrl}/events/${eventId}`,
			{ newEventName: newEventname },
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

// Hämta hem eventobjekt för eventpage
export const fetchEventView = async (eventId: string | undefined) => {
	try {
		const response = await axios.get(`${apiUrl}/events/${eventId}`, {
			withCredentials: true,
		});

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

// Edit event status
export const fetchEventStatus = async (
	eventId: string | undefined,
	eventStatus: string | undefined,
) => {
	try {
		const response = await axios.put(
			`${apiUrl}/events/${eventId}/edit`,
			{ eventStatus: eventStatus },
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
