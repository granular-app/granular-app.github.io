import { useDroppable } from '@dnd-kit/core';
import classNames from 'classnames';
import { TaskStatus } from '../../entity/status';
import { TaskUIModel } from '../../ui-model/task';
import { TaskForm } from '../TaskForm';
import { TaskKanbanColumnItem } from './TaskKanbanColumnItem';

export function TaskKanbanColumn({
	status,
	tasks,
}: {
	status: TaskStatus;
	tasks: TaskUIModel[];
}) {
	const droppable = useDroppable({
		id: status,
	});

	return (
		<section
			ref={droppable.setNodeRef}
			className={classNames('rounded bg-zinc-100 p-2', {
				'ring-2 ring-zinc-500': droppable.isOver,
			})}
		>
			<h3 className="mb-4 pl-2 text-lg font-semibold">{status}</h3>
			<ul>
				{tasks.map((task) => (
					<TaskKanbanColumnItem key={task.id} task={task} element="li" />
				))}
			</ul>
			<TaskForm status={status} />
		</section>
	);
}
