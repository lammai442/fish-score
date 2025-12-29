import { createBrowserRouter } from 'react-router-dom';
import App from '../../../../src/App';
import { ProtectedRoute } from '@fishScore/protectedroute';
import { AuthPage } from '@fishScore/authpage';
import { ErrorPage } from '@fishScore/errorpage';
import { LandingPage } from '@fishScore/landingpage';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: '/auth',
				element: <AuthPage />,
			},
			{
				element: <ProtectedRoute />, // alla andra routes skyddas
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
