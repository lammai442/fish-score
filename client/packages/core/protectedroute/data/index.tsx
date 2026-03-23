import { fetchMe } from '@fishScore/apiauth';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const ProtectedRoute = () => {
	const [authenticated, setAuthenticated] = useState<boolean | null>(null);
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetchMe();
				setAuthenticated(response.success);
			} catch (error) {
				console.error('Auth check failed:', error);
				setAuthenticated(false);
			}
		};

		checkAuth();
	}, []);

	// Vänta på auth-kollen
	if (authenticated === null) {
		return null;
	}

	// Om authenticated är null/false navigera till authsidan
	if (!authenticated) {
		return <Navigate to='/auth' replace />;
	}
	// Om token finns, rendera de child routes som ligger under denna route
	return <Outlet />;
};
