import { useDroppable } from '@dnd-kit/core';
import classNames from 'classnames';
import { TaskStatus } from '../../core/task-status.entity';
import { DeleteTaskController } from '../../delete-task.feature/delete-task.controller';
import { EditTaskController } from '../../edit-task.feature/edit-task.controller';
import { TaskStatusUIModel } from '../../presenters/present-task-status';
import { KanbanTaskUIModel } from '../../ui-models/kanban-task';
import { AddTaskButton } from './AddTaskButton';
import { TaskKanbanTile } from './TaskKanbanTile';

export function TaskKanbanColumn(props: {
	status: TaskStatusUIModel;
	column: KanbanTaskUIModel[];
	addTask: (params: { text: string; status: TaskStatus }) => void;
	editTask: EditTaskController['run'];
	deleteTask: DeleteTaskController['run'];
}) {
	const droppable = useDroppable({
		id: props.status.value,
	});

	return (
		<div
			key={props.status.value}
			ref={droppable.setNodeRef}
			className={classNames(
				'mr-3 w-4/5 flex-shrink-0 snap-center rounded sm:w-64',
				droppable.isOver && 'ring-2 ring-zinc-500 ring-offset-4',
			)}
		>
			<h3 className="mt-1 mb-2 text-sm font-bold text-gray-500">
				{props.status.label}
			</h3>
			<TaskTiles
				column={props.column}
				editTask={props.editTask}
				deleteTask={props.deleteTask}
			/>
			<AddTaskButton
				onSubmit={(text) => props.addTask({ text, status: props.status.value })}
			/>
		</div>
	);
}
function TaskTiles(props: {
	column: KanbanTaskUIModel[];
	editTask: (taskID: string, newText: string) => void;
	deleteTask: (taskID: string) => void;
}) {
	return (
		<ul>
			{props.column.map((task, index) => (
				<TaskKanbanTile
					key={index}
					task={task}
					editTask={props.editTask}
					deleteTask={props.deleteTask}
				/>
			))}
		</ul>
	);
}
