import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from '@fishScore/router';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<>
			{/* Hantera färgschema */}
			<ColorSchemeScript defaultColorScheme='light' />

			{/* MantineProvider */}
			<MantineProvider
				theme={{
					fontFamily: 'Verdana, sans-serif', // exempel på tema
				}}>
				<RouterProvider router={router} />
			</MantineProvider>
		</>
	</StrictMode>
);
