import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Button, Stack, Text, Title } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';

export const ErrorPage = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const message =
		location.state?.message ||
		"Oh no, it seems that the page you are looking for doesn't exist.";
	return (
		<Stack align='center' ta={'center'}>
			<DotLottieReact
				src='https://lottie.host/c0a7b5a7-235f-43a3-9cc5-cdf84fb97c6f/VL3CVXiNfi.lottie'
				loop
				autoplay
				speed={0.75}
				style={{ width: 200, height: 200 }}
			/>
			<Title order={1}>404</Title>
			<Text>{message}</Text>
			<Button
				bg={'var(--btn-primary-bg)'}
				c={'var(--text-inverse'}
				onClick={() => navigate('/', { replace: true })}>
				To home
			</Button>
		</Stack>
	);
};
