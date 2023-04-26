import { Just, Maybe, Nothing } from 'purify-ts';
import { Task } from '../core/task';
import { TaskStatus } from '../core/task-status';
import { calculateTaskProgress } from '../presenters/calculate-task-progress';

export type KanbanColumnsUIModel = Record<TaskStatus, KanbanTaskUIModel[]>;

export const emptyKanbanColumns: KanbanColumnsUIModel = {
	[TaskStatus.ToDo]: [],
	[TaskStatus.InProgress]: [],
	[TaskStatus.Completed]: [],
};

export type KanbanTaskUIModel = {
	id: string;
	text: string;
	maybeProgress: Maybe<number>;
};

export const KanbanTaskUIModel = {
	fromTask(task: Task): KanbanTaskUIModel {
		return {
			id: task.id,
			text: task.text,
			maybeProgress: task.hasSubtasks
				? Just(calculateTaskProgress(task))
				: Nothing,
		};
	},
} as const;

export function presentKanbanColumn(subtasks: Task[], status: TaskStatus) {
	return subtasks
		.filter((task) => task.status === status)
		.map(KanbanTaskUIModel.fromTask);
}
