import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Center, Image, Stack, Title } from '@mantine/core';

type Props = {};

export const SplashScreen = ({}: Props) => {
	return (
		<Center style={{ height: '100vh' }}>
			<Stack align='center' mt={'-10rem'} gap={0}>
				<DotLottieReact
					src='https://lottie.host/0a410810-3825-4d4d-bd12-42a502bde616/zNEKuCxBtq.lottie'
					loop
					autoplay
					speed={1.75}
					style={{
						width: 200,
						height: 200,
					}}
				/>
				<Stack align='center'>
					<Title order={3}>Lets catch some fishes!</Title>
					<Image src='/transparent-logo.png' alt='Logo' w={150} />
				</Stack>
			</Stack>
		</Center>
	);
};
