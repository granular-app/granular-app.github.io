import { Signal } from '@preact/signals-react';
import { Just, Maybe, Nothing } from 'purify-ts';
import { Task } from '../core/task';
import { TaskStatus, taskStatuses } from '../core/task-status';
import { presentTaskStatus } from '../presenters/present-task-status';
import {
	KanbanColumnsUIModel,
	KanbanTaskUIModel,
	presentKanbanColumn,
} from '../ui-models/kanban-task';

export class ViewedTaskPresenter {
	constructor(private state: Signal<Maybe<ViewedTaskUIModel>>) {}

	present(viewedTask: Maybe<Task>) {
		this.state.value = viewedTask.map((task) => {
			return {
				id: task.id,
				text: task.text,
				status: task.status,
				staticStatus: task.staticStatus,
				statusLabel: presentTaskStatus(task.status),
				maybeSubtasks: presentSubtasks(task),
				maybeParentTasks: task.hasParentTasks
					? Just(task.parentTasks)
					: Nothing,
				parentTaskCandidates: task.findParentTaskCandidates(),
			};
		});
	}
}

function presentSubtasks(task: Task): ViewedTaskUIModel['maybeSubtasks'] {
	if (!task.hasSubtasks) return Nothing;

	const directSubtasksCount = task.subtasks.length;
	const directCompletedSubtasksCount = task.subtasks.filter(
		(subtask) => subtask.status === TaskStatus.Completed,
	).length;

	const allSubtasks = task.listAllSubtasks();
	const allSubtasksCount = allSubtasks.length;
	const allCompletedSubtasksCount = allSubtasks.filter(
		(subtask) => subtask.status === TaskStatus.Completed,
	).length;

	const progress = allCompletedSubtasksCount / allSubtasksCount;

	return Just({
		directSubtasksCount,
		directCompletedSubtasksCount,
		allSubtasksCount,
		allCompletedSubtasksCount,
		progress,
		byStatus: Object.fromEntries(
			taskStatuses.map((status) => [
				status,
				presentKanbanColumn(task.subtasks, status),
			]),
		) as Record<TaskStatus, KanbanTaskUIModel[]>,
	});
}

export type ViewedTaskUIModel = {
	id: string;
	text: string;
	status: TaskStatus;
	staticStatus: TaskStatus;
	statusLabel: string;
	maybeParentTasks: Maybe<ParentTaskUIModel[]>;
	maybeSubtasks: Maybe<ViewedTaskSubtasksUIModel>;
	parentTaskCandidates: { id: string; text: string }[];
};

export type ViewedTaskSubtasksUIModel = {
	progress: number;
	byStatus: KanbanColumnsUIModel;
	directCompletedSubtasksCount: number;
	directSubtasksCount: number;
	allCompletedSubtasksCount: number;
	allSubtasksCount: number;
};

export type ParentTaskUIModel = {
	id: string;
	text: string;
};
