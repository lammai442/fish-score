import { createBrowserRouter } from 'react-router-dom';
import App from '../../../../src/App';
// import { ProtectedRoute } from '@fishScore/protectedrouter';
import { AuthPage } from '@fishScore/authpage';
import { ErrorPage } from '@fishScore/errorpage';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: '/',
				element: <AuthPage />,
			},
			{
				path: '*',
				element: <ErrorPage />,
			},
		],
	},
]);
