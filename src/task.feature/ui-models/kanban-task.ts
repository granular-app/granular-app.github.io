import { Just, Maybe, Nothing } from 'purify-ts';
import { TaskStatus } from '../core/task-status.entity';
import { Task } from '../core/task.entity';
import {
	DeepSubtasksUIModel,
	presentDeepSubtasks,
} from '../presenters/present-deep-subtasks';

export type KanbanColumnsUIModel = Record<TaskStatus, KanbanTaskUIModel[]>;

export const emptyKanbanColumns: KanbanColumnsUIModel = {
	[TaskStatus.ToDo]: [],
	[TaskStatus.InProgress]: [],
	[TaskStatus.Completed]: [],
};

export type KanbanTaskUIModel = {
	id: string;
	text: string;
	maybeDeepSubtasks: Maybe<DeepSubtasksUIModel>;
};

export const KanbanTaskUIModel = {
	fromTask(task: Task): KanbanTaskUIModel {
		return {
			id: task.id,
			text: task.text,
			maybeDeepSubtasks: task.hasSubtasks
				? Just(presentDeepSubtasks(task.subtasks))
				: Nothing,
		};
	},
} as const;

export function presentKanbanColumn(subtasks: Task[], status: TaskStatus) {
	return subtasks
		.filter((task) => task.status === status)
		.map(KanbanTaskUIModel.fromTask);
}
