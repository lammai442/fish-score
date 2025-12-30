import axios from 'axios';

type Props = {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
};

export const ApiAuthRegister = async (user: Props) => {
	const apiUrl: string = import.meta.env.VITE_API_URL;

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
