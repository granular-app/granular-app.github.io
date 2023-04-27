import { emptyKanbanColumns } from 'src/task.feature/ui-models/kanban-task';
import { useAdapters } from 'src/ui/adapaters';
import { TaskKanban } from '../../ui/TaskKanban';
import { useViewedTask } from './use-viewed-task';

export function ViewedTaskSubtasksKanban() {
	const viewedTask = useViewedTask();
	const {
		addViewedTaskSubtaskController,
		editViewedTaskSubtaskController,
		deleteSubtaskController,
	} = useAdapters();

	return (
		<TaskKanban
			columns={viewedTask.maybeSubtasks
				.map((subtasks) => subtasks.byStatus)
				.orDefault(emptyKanbanColumns)}
			addTask={addViewedTaskSubtaskController.run}
			editTask={editViewedTaskSubtaskController.run}
			deleteTask={deleteSubtaskController.run}
		/>
	);
}
