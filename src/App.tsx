import { TaskControllerFactory } from './task/ui-controller/task-controller';
import { GetTask } from './task/ui-getter/get-task';
import { TaskRouter } from './task/ui-state/task-router';
import { TaskControllerFactoryProvider } from './task/ui/hooks/use-task-controller-factory';
import { GetTaskProvider } from './task/ui/hooks/use-task-getter';
import { TaskRouterProvider } from './task/ui/hooks/use-task-router';
import { TabGroup } from './task/ui/TabGroup';
import { TaskHeader } from './task/ui/TaskHeader';

export function App({
	taskRouter,
	getTask,
	taskControllerFactory,
}: {
	taskRouter: TaskRouter;
	getTask: GetTask;
	taskControllerFactory: TaskControllerFactory;
}) {
	return (
		<TaskRouterProvider value={taskRouter}>
			<TaskControllerFactoryProvider value={taskControllerFactory}>
				<GetTaskProvider value={getTask}>
					<div className="h-screen max-h-screen grid-rows-[auto_1fr] gap-2 bg-zinc-100 p-2 tall:grid">
						<TaskHeader />
						<TabGroup />
					</div>
				</GetTaskProvider>
			</TaskControllerFactoryProvider>
		</TaskRouterProvider>
	);
}
