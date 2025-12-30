import { createBrowserRouter } from 'react-router-dom';
// import App from '../../../../src/App';
import { AuthLayout, AppLayout } from '@fishScore/layouts';
import { ProtectedRoute } from '@fishScore/protectedroute';
import { AuthPage } from '@fishScore/authpage';
import { ErrorPage } from '@fishScore/errorpage';
import { LandingPage } from '@fishScore/landingpage';

export const router = createBrowserRouter([
	{
		element: <AuthLayout />,
		children: [
			{
				path: '/auth',
				element: <AuthPage />,
			},
		],
	},
	{
		element: <AppLayout />,
		children: [
			{
				element: <ProtectedRoute />,
				children: [
					{
						path: '/',
						element: <LandingPage />,
					},
					{
						path: '*',
						element: <ErrorPage />,
					},
				],
			},
		],
	},
]);
