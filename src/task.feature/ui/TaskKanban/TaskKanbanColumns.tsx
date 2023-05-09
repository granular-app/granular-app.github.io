import { TaskStatus } from '../../core/task-status';
import { DeleteTaskController } from '../../delete-task.feature/delete-task.controller';
import { EditTaskController } from '../../edit-task.feature/edit-task.controller';
import { taskStatusesUIModel } from '../../presenters/present-task-status';
import { KanbanColumnsUIModel } from '../../ui-models/kanban-task';
import { TaskKanbanColumn } from './TaskKanbanColumn';

export function TaskKanbanColumns(props: {
	columns: KanbanColumnsUIModel;
	addTask: (params: { text: string; status: TaskStatus }) => void;
	editTask: EditTaskController['run'];
	deleteTask: DeleteTaskController['run'];
}) {
	return (
		<>
			{taskStatusesUIModel.map((status) => (
				<TaskKanbanColumn
					key={status.value}
					status={status}
					column={props.columns[status.value]}
					addTask={props.addTask}
					deleteTask={props.deleteTask}
					editTask={props.editTask}
				/>
			))}
		</>
	);
}
