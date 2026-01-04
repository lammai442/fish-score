import { useState } from 'react';
import { useForm } from '@mantine/form';
import type { LoginData, RegisterData } from '@fishScore/interfaces';

export const useAuthFormLogic = () => {
	const [mode, setMode] = useState('login');

	const form = useForm<LoginData | RegisterData>({
		initialValues: {
			email: 'and@and.se',
			password: 'mamma1',
			firstName: 'Anders',
			lastName: 'Karlsson',
		},

		validate: {
			email: (value) =>
				value.includes('@') ? null : 'Ogiltig e-postadress',

			password: (value) =>
				value.length >= 6 ? null : 'Minst 6 tecken krävs',

			firstName: (value) =>
				mode === 'register' && value.length === 0
					? 'Förnamn krävs'
					: null,

			lastName: (value) =>
				mode === 'register' && value.length === 0
					? 'Efternamn krävs'
					: null,
		},
	});

	return {
		mode,
		setMode,
		form,
	};
};
