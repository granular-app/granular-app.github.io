import { createBrowserRouter, redirect } from 'react-router-dom';
import { MainBoardPage } from 'src/task/main-board.feature/ui/MainBoardPage';
import { TaskPage } from '../../task/viewed-task.feature/ui/TaskPage';
import { AppLayout } from '../AppLayout';
import { NotFoundPage } from '../NotFoundPage';
import { adapters } from './adapters';

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
		ErrorBoundary: NotFoundPage,
		loader: () => redirect(TaskmapRoute.MainBoard),
	},
	{
		path: TaskmapRoute.Settings,
		ErrorBoundary: NotFoundPage,
		loader: () => redirect(TaskmapRoute.SettingsExport),
	},
	{
		element: <AppLayout />,
		ErrorBoundary: NotFoundPage,

		children: [
			{
				path: TaskmapRoute.MainBoard,
				loader: () => {
					adapters.viewMainBoardController.run();
					return adapters.mainBoardState.value.extract()!;
				},
				Component: MainBoardPage,
			},
			{
				path: TaskmapRoute.Task.URLTemplate,
				loader: ({ params }) => {
					adapters.viewTaskController.run(params.taskID!);
					return adapters.viewedTaskState.value.extract()!;
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
