import { Task } from '../core/task';
import { TaskStatus } from '../core/task-status';

export type KanbanColumnsUIModel = Record<TaskStatus, KanbanTaskUIModel[]>;

export const emptyKanbanColumns: KanbanColumnsUIModel = {
	[TaskStatus.ToDo]: [],
	[TaskStatus.InProgress]: [],
	[TaskStatus.Completed]: [],
};

export type KanbanTaskUIModel = {
	id: string;
	text: string;
};

export const KanbanTaskUIModel = {
	fromTask(task: Task): KanbanTaskUIModel {
		return {
			id: task.id,
			text: task.text,
		};
	},
} as const;

export function presentKanbanColumn(subtasks: Task[], status: TaskStatus) {
	return subtasks
		.filter((task) => task.status === status)
		.map(KanbanTaskUIModel.fromTask);
}
