// Importerar useForm-hooken från Mantine för formulärhantering
import { useForm } from '@mantine/form';
import { AuthForm } from '@fishScore/authform';

// Importerar UI-komponenter från Mantine
import { TextInput, PasswordInput, Button, Box, Title } from '@mantine/core';

// Exporterar AuthPage-komponenten
export const AuthPage = () => {
	return <AuthForm mode='register'></AuthForm>;
};
