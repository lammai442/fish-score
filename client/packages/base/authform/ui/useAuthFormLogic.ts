import { useState } from 'react';
import { useForm } from '@mantine/form';
import type { LoginData, RegisterData } from '@fishScore/authsdata';

export const useAuthFormLogic = () => {
	const [mode, setMode] = useState('login');

	const emojiRegex = /[\p{Extended_Pictographic}]/u;

	const noEmoji = (value: string) =>
		emojiRegex.test(value) ? 'Emojis are not allowed' : null;

	const form = useForm<LoginData | RegisterData>({
		initialValues: {
			email: '',
			password: '',
			firstName: '',
			lastName: '',
		},

		validate: {
			email: (value: string) => {
				return (
					noEmoji(value) ??
					(!value.includes('@') ? 'Invalid email address' : null)
				);
			},

			password: (value: string) => {
				return (
					noEmoji(value) ??
					(value.length < 6
						? 'Minimum of 6 characters is required'
						: null)
				);
			},

			firstName: (value: string) => {
				if (mode !== 'register') return null;

				return (
					noEmoji(value) ??
					(value.trim().length === 0
						? 'First name is required'
						: null)
				);
			},

			lastName: (value: string) => {
				if (mode !== 'register') return null;

				return (
					noEmoji(value) ??
					(value.trim().length === 0 ? 'Last name is required' : null)
				);
			},
		},
	});

	return {
		mode,
		setMode,
		form,
	};
};
