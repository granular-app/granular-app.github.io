import { Signal } from '@preact/signals-react';
import { Just, Maybe, Nothing } from 'purify-ts';
import { Task } from '../core/task';
import { TaskStatus } from '../core/task-status';
import { presentTaskStatus } from '../presenters/present-task-status';
import {
	KanbanColumnsUIModel,
	KanbanTaskUIModel,
} from '../ui-models/kanban-task';

export class ViewedTaskPresenter {
	constructor(private state: Signal<Maybe<ViewedTaskUIModel>>) {}

	present(viewedTask: Maybe<Task>) {
		this.state.value = viewedTask.map((task) => {
			const directSubtasksCount = task.subtasks.length;
			const directCompletedSubtasksCount = task.subtasks.filter(
				(subtask) => subtask.status === TaskStatus.Completed,
			).length;

			const allSubtasks = task.listAllSubtasks();
			const allSubtasksCount = allSubtasks.length;
			const allCompletedSubtasksCount = allSubtasks.filter(
				(subtask) => subtask.status === TaskStatus.Completed,
			).length;

			return {
				text: task.text,
				status: presentTaskStatus(task.status),
				directSubtasksCount,
				directCompletedSubtasksCount,
				allSubtasksCount,
				allCompletedSubtasksCount,
				progress: allCompletedSubtasksCount / allSubtasksCount,
				subtasks: {
					toDo: task.subtasks
						.filter((task) => task.status === TaskStatus.ToDo)
						.map(KanbanTaskUIModel.fromTask),
					inProgress: task.subtasks
						.filter((task) => task.status === TaskStatus.InProgress)
						.map(KanbanTaskUIModel.fromTask),
					completed: task.subtasks
						.filter((task) => task.status === TaskStatus.Completed)
						.map(KanbanTaskUIModel.fromTask),
				},
				maybeParentTasks:
					task.parentTasks.length > 0 ? Just(task.parentTasks) : Nothing,
			};
		});
	}
}

export type ViewedTaskUIModel = {
	text: string;
	status: string;
	directCompletedSubtasksCount: number;
	directSubtasksCount: number;
	allCompletedSubtasksCount: number;
	allSubtasksCount: number;
	progress: number;
	subtasks: KanbanColumnsUIModel;
	maybeParentTasks: Maybe<ParentTaskUIModel[]>;
};

export type ParentTaskUIModel = {
	id: string;
	text: string;
};
