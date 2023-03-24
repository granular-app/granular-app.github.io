import { TaskUIModelArray } from '../../ui-model/task';
import { useCurrentTask } from '../hooks/use-current-task';
import { TaskKanbanColumn } from './TaskKanbanColumn';
import { TaskKanbanDragAndDrop } from './TaskKanbanDragAndDrop';

export function TaskKanban() {
	return (
		<TaskKanbanDragAndDrop>
			<div className="flex snap-x snap-mandatory overflow-x-auto rounded bg-white py-3 sm:snap-none">
				<TaskKanbanColumns />
			</div>
		</TaskKanbanDragAndDrop>
	);
}

function TaskKanbanColumns() {
	const childrenByStatus = new TaskUIModelArray(
		useCurrentTask().children,
	).splitByStatus();

	return (
		<>
			{childrenByStatus.map(([status, children]) => (
				<div
					key={status}
					className="mx-3 w-[80%] flex-shrink-0 snap-center sm:w-72"
				>
					<TaskKanbanColumn status={status} tasks={children} />
				</div>
			))}
		</>
	);
}
