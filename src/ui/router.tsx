import { createBrowserRouter, redirect } from 'react-router-dom';
import { App } from './App';
import { NotFoundPage } from './NotFoundPage';
import { TaskPage } from './TaskPage';

export const TaskmapRoute = {
	MainBoard: '/main-board',
	Settings: '/settings',
	SettingsExport: '/settings/export',
	SettingsImport: '/settings/import',
} as const;

export const router = createBrowserRouter([
	{
		path: '/',
		ErrorBoundary: NotFoundPage,
		loader: () => redirect(TaskmapRoute.MainBoard),
	},
	{
		path: TaskmapRoute.Settings,
		ErrorBoundary: NotFoundPage,
		loader: () => redirect(TaskmapRoute.SettingsExport),
	},
	{
		element: <App />,
		ErrorBoundary: NotFoundPage,

		children: [
			{
				path: TaskmapRoute.MainBoard,
				Component: TaskPage,
			},
			{
				path: TaskmapRoute.SettingsExport,
				element: <div>Export</div>,
			},
			{
				path: TaskmapRoute.SettingsImport,
				element: <div>Import</div>,
			},
		],
	},
]);
