import { fetchMe } from '@fishScore/apiauth';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Flex, Image, Loader, Text } from '@mantine/core';

export const ProtectedRoute = () => {
	const [authenticated, setAuthenticated] = useState<boolean | null>(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const checkAuth = async () => {
			const response = await fetchMe();
			setLoading(false);

			setAuthenticated(response.success);
		};

		checkAuth();
	}, []);

	// if (loading)
	// 	return (
	// 		<Flex direction='column' justify='center' align='center' h='100vh'>
	// 			<Image
	// 				src='/transparent-logo.png'
	// 				alt='Logo'
	// 				width={100}
	// 				height={100}
	// 				fit='contain'
	// 			/>
	// 			<Loader mt='md' />
	// 			<Text mt='sm'>Checking signed in</Text>
	// 		</Flex>
	// 	);
	// vänta på auth-kollen
	if (authenticated === null) return null;

	if (!authenticated) return <Navigate to='/auth' replace />;
	// Om token finns, rendera de child routes som ligger under denna route
	return <Outlet />;
};
