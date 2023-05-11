import { Signal } from '@preact/signals-react';
import { Just, Maybe, Nothing } from 'purify-ts';
import { TaskStatus, taskStatuses } from '../core/task-status.entity';
import { Task } from '../core/task.entity';
import {
	DeepSubtasksUIModel,
	presentDeepSubtasks,
} from '../presenters/present-deep-subtasks';
import { presentTaskStatus } from '../presenters/present-task-status';
import {
	KanbanColumnsUIModel,
	KanbanTaskUIModel,
	presentKanbanColumn,
} from '../ui-models/kanban-task';

export class ViewedTaskPresenter {
	constructor(private state: Signal<Maybe<ViewedTaskUIModel>>) {}

	present = (viewedTask: Maybe<Task>) => {
		this.state.value = viewedTask.map((task): ViewedTaskUIModel => {
			const parentTasks = presentParentTasks(task);
			const parentTaskCandidates = presentParentTaskCandidates(task);

			return {
				id: task.id,
				text: task.text,
				status: task.status,
				staticStatus: task.staticStatus,
				statusLabel: presentTaskStatus(task.status),
				maybeSubtasks: presentSubtasks(task),
				isMainBoardTask: task.isMainBoardTask,
				parentTasks,
				parentTaskCandidates,
				canDetachFromParentTasks: parentTasks.length > 1,
			};
		});
	};
}

function presentParentTasks(task: Task) {
	const parentTasks: ParentTaskUIModel[] = task.parentTasks;

	if (task.isMainBoardTask) {
		parentTasks.unshift({
			id: 'main-board',
			text: 'Main Board',
		});
	}
	return parentTasks;
}

function presentParentTaskCandidates(task: Task) {
	const parentTaskCandidates: ParentTaskCandidateUIModel[] =
		task.findParentTaskCandidates();

	if (!task.isMainBoardTask) {
		parentTaskCandidates.unshift({ id: 'main-board', text: 'Main Board' });
	}

	return parentTaskCandidates;
}

function presentSubtasks(task: Task): ViewedTaskUIModel['maybeSubtasks'] {
	if (!task.hasSubtasks) return Nothing;

	const subtasks = task.subtasks.get();
	const directSubtasksCount = subtasks.length;
	const directSubtasksCompletedCount = subtasks.filter(
		(subtask) => subtask.status === TaskStatus.Completed,
	).length;

	const deepSubtasks = presentDeepSubtasks(task.subtasks);

	return Just({
		directSubtasksCount,
		directSubtasksCompletedCount,
		deepSubtasks,
		byStatus: Object.fromEntries(
			taskStatuses.map((status) => [
				status,
				presentKanbanColumn(subtasks, status),
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
	isMainBoardTask: boolean;
	parentTasks: ParentTaskUIModel[];
	maybeSubtasks: Maybe<ViewedTaskSubtasksUIModel>;
	parentTaskCandidates: ParentTaskCandidateUIModel[];
	canDetachFromParentTasks: boolean;
};

export type ParentTaskCandidateUIModel = { id: string; text: string };

export type ViewedTaskSubtasksUIModel = {
	byStatus: KanbanColumnsUIModel;
	directSubtasksCompletedCount: number;
	directSubtasksCount: number;
	deepSubtasks: DeepSubtasksUIModel;
};

export type ParentTaskUIModel = {
	id: string;
	text: string;
};
