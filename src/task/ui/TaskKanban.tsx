import { TaskUIModelArray } from '../ui-model/task';
import { useCurrentTask } from './hooks/use-current-task';
import { TaskColumn } from './TaskColumn';

export function TaskKanban() {
	const currentTask = useCurrentTask();
	const childrenByStatus = new TaskUIModelArray(
		currentTask.children,
	).splitByStatus();

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
