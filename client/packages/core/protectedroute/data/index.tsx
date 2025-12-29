import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
	const token = localStorage.getItem('token'); // eller annan auth-logik

	if (!token) {
		return <Navigate to='/auth' replace />;
	}

	// Om token finns, rendera de child routes som ligger under denna route
	return <Outlet />;
};
