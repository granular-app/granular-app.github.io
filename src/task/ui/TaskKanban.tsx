import { TaskArray } from '../entity/task';
import { taskRouter } from '../ui-state/task-router';
import { TaskColumn } from './TaskColumn';

export function TaskKanban() {
	const { task } = taskRouter;
	const childrenByStatus = new TaskArray(task.children).splitByStatus();

	return (
		<div className="flex snap-x snap-mandatory overflow-x-auto rounded bg-white py-3 sm:snap-none">
			{childrenByStatus.map(([status, children]) => (
				<div
					key={status}
					className="mx-3 w-[80%] flex-shrink-0 snap-center sm:w-72"
				>
					<TaskColumn status={status} tasks={children} />
				</div>
			))}
		</div>
	);
}
