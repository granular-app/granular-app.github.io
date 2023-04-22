import { createBrowserRouter, redirect } from 'react-router-dom';
import { MainBoardPage } from 'src/task/main-board.feature/ui/MainBoardPage';
import { TaskPage } from '../../task/viewed-task.feature/ui/TaskPage';
import { AppLayout } from '../AppLayout';
import { ErrorPage } from '../ErrorPage';

export const TaskmapRoute = {
	MainBoard: '/main-board',
	Task: {
		URLTemplate: `/task/:taskID`,
		URL: (taskID: string) => `/task/${taskID}`,
	},
	Settings: '/settings',
	SettingsExport: '/settings/export',
	SettingsImport: '/settings/import',
} as const;

export const router = createBrowserRouter([
	{
		path: '/',
		ErrorBoundary: ErrorPage,
		loader: () => redirect(TaskmapRoute.MainBoard),
	},
	{
		path: TaskmapRoute.Settings,
		ErrorBoundary: ErrorPage,
		loader: () => redirect(TaskmapRoute.SettingsExport),
	},
	{
		element: <AppLayout />,
		ErrorBoundary: ErrorPage,
		children: [
			{
				path: TaskmapRoute.MainBoard,
				loader: async () => {
					const { adapters } = await import('./adapters');

					adapters.viewMainBoardController.run();
					return null;
				},
				Component: MainBoardPage,
			},
			{
				path: TaskmapRoute.Task.URLTemplate,
				loader: async ({ params }) => {
					const { adapters } = await import('./adapters');

					adapters.viewTaskController.run(params.taskID!);
					return null;
				},
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
