import { createBrowserRouter, redirect } from 'react-router-dom';
import { MainBoardPage } from 'src/task.feature/main-board.feature/ui/MainBoardPage';
import { TaskPage } from 'src/task.feature/viewed-task.feature/ui/TaskPage';
import { AppLayout } from '../AppLayout';
import { ErrorPage } from '../ErrorPage';

export const AppRoute = {
	MainBoard: '/main-board',
	Task: {
		URLTemplate: `/task/:taskID`,
		URL: (taskID: string) => `/task/${taskID}`,
	},
} as const;

export const router = createBrowserRouter([
	{
		path: '/',
		ErrorBoundary: ErrorPage,
		loader: () => redirect(AppRoute.MainBoard),
	},
	{
		element: <AppLayout />,
		ErrorBoundary: ErrorPage,
		children: [
			{
				path: AppRoute.MainBoard,
				loader: async () => {
					const { adapters } = await import('./adapters');

					adapters.viewMainBoardController.run();
					return null;
				},
				Component: MainBoardPage,
			},
			{
				path: AppRoute.Task.URLTemplate,
				loader: async ({ params }) => {
					const { adapters } = await import('./adapters');

					adapters.viewTaskController.run(params.taskID!);
					return null;
				},
				Component: TaskPage,
			},
		],
	},
]);
