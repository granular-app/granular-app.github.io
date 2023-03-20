import { taskRouter } from '../ui-state/task-router';
import { Breadcrumbs } from './Breadcrumbs';
import { TaskActions } from './TaskActions';

export function TaskHeader() {
	return (
		<header className="rounded bg-white p-4 pt-6 shadow-sm">
			<Breadcrumbs />
			<div className="flex">
				<h1 className="flex-grow text-2xl">{taskRouter.task.base.text}</h1>
				<TaskActions task={taskRouter.task} />
			</div>
		</header>
	);
}
