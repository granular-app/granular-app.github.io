import { TaskStatus } from '../../core/task-status';
import { DeleteTaskController } from '../../delete-task.feature/delete-task.controller';
import { EditTaskController } from '../../edit-task.feature/edit-task.controller';
import { SetStaticStatusController } from '../../set-static-status.feature/set-static-status.controller';
import { KanbanColumnsUIModel } from '../../ui-models/kanban-task';
import { TaskKanbanColumns } from './TaskKanbanColumns';
import { TaskKanbanDragAndDrop } from './TaskKanbanDragAndDrop';

export function TaskKanban(props: {
	columns: KanbanColumnsUIModel;
	addTask: (params: { text: string; status: TaskStatus }) => void;
	editTask: EditTaskController['run'];
	deleteTask: DeleteTaskController['run'];
	setStaticStatus: SetStaticStatusController['run'];
}) {
	return (
		<TaskKanbanDragAndDrop
			columns={props.columns}
			setStaticStatus={props.setStaticStatus}
		>
			<div className="w-full overflow-y-auto pl-80">
				<div className="flex w-full snap-x snap-mandatory items-start overflow-x-auto p-6 pb-12 sm:snap-none">
					<TaskKanbanColumns
						columns={props.columns}
						addTask={props.addTask}
						deleteTask={props.deleteTask}
						editTask={props.editTask}
					/>
				</div>
			</div>
		</TaskKanbanDragAndDrop>
	);
}
