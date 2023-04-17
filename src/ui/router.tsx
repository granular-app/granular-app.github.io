import { createBrowserRouter, redirect } from 'react-router-dom';
import { App } from './App';
import { NotFoundPage } from './NotFoundPage';
import { TaskPage } from './TaskPage';

export const router = createBrowserRouter([
	{
		path: '/',
		ErrorBoundary: NotFoundPage,
		loader: () => redirect('/main-board'),
	},
	{
		path: '/settings',
		ErrorBoundary: NotFoundPage,
		loader: () => redirect('/settings/export'),
	},
	{
		element: <App />,
		ErrorBoundary: NotFoundPage,

		children: [
			{
				path: 'main-board',
				Component: TaskPage,
			},
			{
				path: 'settings/export',
				element: <div>Export</div>,
			},
			{
				path: 'settings/import',
				element: <div>Import</div>,
			},
		],
	},
]);
