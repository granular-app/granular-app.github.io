import classNames from 'classnames';
import { TaskUIModelArray } from '../../ui-model/task';
import { useCurrentTask } from '../hooks/use-current-task';
import { TaskKanbanColumn } from './TaskKanbanColumn';
import { TaskKanbanDragAndDrop } from './TaskKanbanDragAndDrop';

export function TaskKanban({ extraClassName }: { extraClassName?: string }) {
	return (
		<TaskKanbanDragAndDrop>
			<div
				className={classNames(
					'flex h-full snap-x snap-mandatory overflow-x-auto rounded bg-white py-3 sm:snap-none tall:overflow-y-hidden',
					extraClassName,
				)}
			>
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
					className="mx-3 h-full w-[80%] flex-shrink-0 snap-center sm:w-72"
				>
					<TaskKanbanColumn status={status} tasks={children} />
				</div>
			))}
		</>
	);
}
