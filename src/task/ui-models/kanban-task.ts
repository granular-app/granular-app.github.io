import { Task } from '../core/task';

export type KanbanColumnsUIModel = {
	toDo: KanbanTaskUIModel[];
	inProgress: KanbanTaskUIModel[];
	completed: KanbanTaskUIModel[];
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