import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from '@fishScore/router';
import { RouterProvider } from 'react-router-dom';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import './index.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<>
			{/* Hantera färgschema */}
			<ColorSchemeScript defaultColorScheme='light' />

			{/* MantineProvider */}
			<MantineProvider
				theme={{
					fontFamily: 'Verdana, sans-serif',
				}}>
				<Notifications />
				<RouterProvider router={router} />
			</MantineProvider>
		</>
	</StrictMode>
);
