import axios from 'axios';

const apiUrl: string = import.meta.env.VITE_API_URL;

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
		return {
			success: false,
			data: error.response?.data || { message: error.message },
			status: error.response?.status || 500,
		};
	}
};
