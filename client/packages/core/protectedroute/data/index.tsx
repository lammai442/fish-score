import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@fishScore/useAuthStore';

export const ProtectedRoute = () => {
	const { authStatus } = useAuthStore();

	if (authStatus === 'checking') {
		return null;
	}

	if (authStatus !== 'authenticated') {
		return <Navigate to='/auth' replace />;
	}

	return <Outlet />;
};
