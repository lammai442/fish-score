import {
	TextInput,
	PasswordInput,
	Button,
	Box,
	Title,
	Center,
	Image,
	Text,
	SegmentedControl,
} from '@mantine/core';
import { useAuthFormLogic } from './useAuthFormLogic';
import type { LoginData, RegisterData } from '@fishScore/interfaces';
import {
	fetchAuthRegister,
	fetchLogin,
	fetchLogout,
	fetchMe,
} from '@fishScore/apiauth';
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { Loading } from '@fishScore/loading';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@fishScore/useUserStore';

export const AuthForm = () => {
	const { mode, setMode, form } = useAuthFormLogic();
	const { setUser } = useUserStore();
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async (values: LoginData) => {
		setLoading(true);
		const response = await fetchLogin(values as LoginData);

		setLoading(false);
		if (!response.success) {
			showNotification({
				title: 'Unable to login',
				message: response.data.error,
				color: 'red',
				icon: <IconX />,
				position: 'top-center',
			});
		} else {
			const res = await fetchMe();
			// Sparar inloggade användaren i store
			setUser(res.data.user);
			navigate('/');
		}
	};

	const handleRegister = async (values: RegisterData) => {
		setLoading(true);
		const response = await fetchAuthRegister(values as RegisterData);
		setLoading(false);
		if (!response.success) {
			showNotification({
				title: 'Unable to register',
				message: response.data.error,
				color: 'red',
				icon: <IconX />,
				position: 'top-center',
			});
		}
	};

	return (
		<Box
			maw={400}
			mx='auto'
			mt={50}
			bg='white'
			p={16}
			style={{
				borderRadius: '10px',
				boxShadow:
					'0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
				position: 'relative',
			}}>
			<Loading
				visible={loading}
				text={
					mode === 'login' ? 'Signing in...' : 'Register new user...'
				}
			/>

			<Center mb='md'>
				<Image src='/transparent-logo.png' w={80} h={80} />
			</Center>
			<Title order={2} ta='center' mb='lg'>
				FishScore
			</Title>
			<Text>Track your fishing competition with ease</Text>
			<SegmentedControl
				value={mode}
				onChange={(value) => setMode(value as 'login' | 'register')}
				data={[
					{ label: 'Logga in', value: 'login' },
					{ label: 'Registera', value: 'register' },
				]}
				fullWidth
				styles={{
					label: {
						fontWeight: '700',
					},
					root: {
						padding: '0.4rem',
						borderRadius: '1rem',
					},
					control: {
						borderRadius: '1rem',
						overflow: 'hidden',
					},
					indicator: {
						borderRadius: '1rem',
					},
				}}
			/>
			<form
				onSubmit={form.onSubmit((values) => {
					if (mode === 'register') {
						handleRegister(values as RegisterData);
					} else {
						const loginData: LoginData = {
							email: values.email,
							password: values.password,
						};
						handleLogin(loginData);
					}
				})}>
				<TextInput
					label='Email'
					placeholder='din@email.se'
					{...form.getInputProps('email')}
					styles={{
						label: {
							fontWeight: 700, // fet stil
						},
					}}
				/>

				{mode === 'register' && (
					<>
						<TextInput
							label='Förnamn'
							mt='md'
							{...form.getInputProps('firstName')}
							styles={{
								label: {
									fontWeight: 700, // fet stil
								},
							}}
						/>
						<TextInput
							label='Efternamn'
							mt='md'
							{...form.getInputProps('lastName')}
						/>
					</>
				)}

				<PasswordInput
					label='Lösenord'
					placeholder='Ditt lösenord'
					mt='md'
					{...form.getInputProps('password')}
				/>

				<Button type='submit' fullWidth mt='xl'>
					{mode === 'login' ? 'Logga in' : 'Registrera'}
				</Button>
			</form>
		</Box>
	);
};
