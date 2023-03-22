import { Breadcrumbs } from './Breadcrumbs';
import { useCurrentTask } from './hooks/use-current-task';
import { useTaskRouter } from './hooks/use-task-router';
import { TaskActions } from './TaskActions';

export function TaskHeader() {
	const taskRouter = useTaskRouter();
	const currentTask = useCurrentTask();

	return (
		<header className="rounded bg-white p-4 pt-6 shadow-sm">
			<Breadcrumbs />
			<div className="flex">
				<h1 className="flex-grow text-2xl">
					{taskRouter.currentTask.base.text}
				</h1>
				<TaskActions task={currentTask} />
			</div>
		</header>
	);
}
