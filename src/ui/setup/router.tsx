import { createBrowserRouter, redirect } from 'react-router-dom';
import { MainBoardPage } from '../../main-board/ui/MainBoardPage';
import { AppLayout } from '../AppLayout';
import { NotFoundPage } from '../NotFoundPage';
import { uiDependencies } from './ui-dependencies';

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
		element: <AppLayout />,
		ErrorBoundary: NotFoundPage,

		children: [
			{
				path: TaskmapRoute.MainBoard,
				loader: () => {
					uiDependencies.viewMainBoardController.run();
					return uiDependencies.mainBoardState.value.extract()!;
				},
				Component: MainBoardPage,
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
