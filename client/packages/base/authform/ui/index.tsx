// Importerar useForm-hooken från Mantine för formulärhantering
import { useForm } from '@mantine/form';
import {
	TextInput,
	PasswordInput,
	Button,
	Box,
	Title,
	Center,
	Image,
} from '@mantine/core';
import { useState } from 'react';

// Exporterar komponenten
export const AuthForm = () => {
	const [mode, setMode] = useState('login');

	const form = useForm({
		initialValues: {
			email: '',
			password: '',
			firstName: '',
			lastName: '',
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

	return (
		// Box används för layout och maxbredd
		<Box maw={400} mx='auto' mt={50} bg='white'>
			<Center mb='md'>
				<Image src='/transparent-logo.png' w={80} h={80} />
			</Center>
			{/* Titel ändras beroende på mode */}
			<Title order={2} ta='center' mb='lg'>
				{mode === 'login' ? 'Logga in' : 'Registrera'}
			</Title>

			{/* Form-element med submit-hantering */}
			<form
				onSubmit={form.onSubmit((values) => {
					// Loggar alla formulärvärden
					console.log(values);

					// Här anropar du login eller register i backend
					// Du kan kontrollera mode här också
				})}>
				{/* Emailfält visas alltid */}
				<TextInput
					label='Email'
					placeholder='din@email.se'
					{...form.getInputProps('email')}
				/>

				{/* Förnamn visas endast vid register */}
				{mode === 'register' && (
					<TextInput
						label='Förnamn'
						mt='md'
						{...form.getInputProps('firstName')}
					/>
				)}

				{/* Efternamn visas endast vid register */}
				{mode === 'register' && (
					<TextInput
						label='Efternamn'
						mt='md'
						{...form.getInputProps('lastName')}
					/>
				)}

				{/* Lösenord visas alltid */}
				<PasswordInput
					label='Lösenord'
					placeholder='Ditt lösenord'
					mt='md'
					{...form.getInputProps('password')}
				/>

				{/* Submit-knapp med dynamisk text */}
				<Button type='submit' fullWidth mt='xl'>
					{mode === 'login' ? 'Logga in' : 'Registrera'}
				</Button>
			</form>
		</Box>
	);
};
