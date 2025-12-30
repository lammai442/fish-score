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

// Exporterar komponenten
export const AuthForm = () => {
	const { mode, setMode, form } = useAuthFormLogic();

	return (
		// Box används för layout och maxbredd
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
			}}>
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
					// Loggar alla formulärvärden
					console.log(values);
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
