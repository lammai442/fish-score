import { useState } from 'react';
import { useForm } from '@mantine/form';
import type { LoginData, RegisterData } from '@fishScore/authsdata';

export const useAuthFormLogic = () => {
	const [mode, setMode] = useState('login');

	const form = useForm<LoginData | RegisterData>({
		initialValues: {
			email: 'moa@kalle.se',
			password: 'mamma1',
			firstName: 'Anders',
			lastName: 'Karlsson',
		},

		validate: {
			email: (value: string) =>
				value.includes('@') ? null : 'Invalid email address',

			password: (value: string) =>
				value.length >= 6 ? null : 'Minimum of 6 charaters is required',

			firstName: (value: string) =>
				mode === 'register' && value.length === 0
					? 'First name is required'
					: null,

			lastName: (value: string) =>
				mode === 'register' && value.length === 0
					? 'Last name is required'
					: null,
		},
	});

	return {
		mode,
		setMode,
		form,
	};
};
