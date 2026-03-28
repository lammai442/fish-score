import type { NewFishEvent } from '@fishScore/eventsdata';
import axios from 'axios';
import { useAuthStore } from '@fishScore/useAuthStore';
import type { createNewTeam, TeamUserData } from '@fishScore/teamsdata';
import { useUserStore } from '@fishScore/useUserStore';

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
		const status = error.response?.status || 500;

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
		const status = error.response?.status || 500;

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

		// Öppna loginModal om response är 401 (No token)
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
		const status = error.response?.status || 500;

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

		// Öppna loginModal om response är 401 (No token)
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
		const status = error.response?.status || 500;

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

		// Öppna loginModal om response är 401 (No token)
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
		const status = error.response?.status || 500;

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

		// Öppna loginModal om response är 401 (No token)
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
		const status = error.response?.status || 500;

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

// Hämta hem eventobjekt för eventpage
export const fetchEventView = async (eventId: string | undefined) => {
	try {
		const response = await axios.get(`${apiUrl}/events/${eventId}`, {
			withCredentials: true,
		});

		// Öppna loginModal om response är 401 (No token)
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
		const status = error.response?.status || 500;

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

// Edit event status
export const fetchEditEventStatus = async (
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

// Subscribe to event
export const fetchSubscribeToEvent = async (eventId: string | undefined) => {
	try {
		const response = await axios.post(
			`${apiUrl}/events/${eventId}/subscriptions`,
			{},
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
// Unsubscribe to event
export const fetchUnsubscribeToEvent = async (eventId: string | undefined) => {
	try {
		const response = await axios.delete(
			`${apiUrl}/events/${eventId}/subscriptions`,
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
