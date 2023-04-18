import { Signal } from '@preact/signals-react';
import { Just, Maybe } from 'purify-ts';
import { Task } from '../../task/core/task';
import { TaskStatus } from '../../task/core/task-status';
import { presentTaskStatus } from '../../task/presenters/present-task-status';
import { ViewMainBoardUseCaseOutputPort } from '../application/view-main-board-use-case';

export class MainBoardPresenter {
	constructor(private state: Signal<Maybe<MainBoardUIModel>>) {}

	present: ViewMainBoardUseCaseOutputPort = (mainBoard) => {
		const directSubtasksCount = mainBoard.tasks.length;
		const completedDirectSubtasksCount = mainBoard.tasks.filter(
			(task) => task.status === TaskStatus.Completed,
		).length;

		this.state.value = Just({
			status: presentTaskStatus(mainBoard.status),
			allSubtasksCount: 0,
			completedAllSubtasksCount: 0,
			completedDirectSubtasksCount,
			directSubtasksCount,
			progress: completedDirectSubtasksCount / directSubtasksCount,
			subtasks: {
				toDo: mainBoard.tasks
					.filter((task) => task.status === TaskStatus.ToDo)
					.map(presentSubtask),
				inProgress: mainBoard.tasks
					.filter((task) => task.status === TaskStatus.InProgress)
					.map(presentSubtask),
				completed: mainBoard.tasks
					.filter((task) => task.status === TaskStatus.Completed)
					.map(presentSubtask),
			},
		});
	};
}

export type MainBoardUIModel = {
	status: string;
	completedDirectSubtasksCount: number;
	directSubtasksCount: number;
	completedAllSubtasksCount: number;
	allSubtasksCount: number;
	progress: number;
	subtasks: {
		toDo: SubtaskUIModel[];
		inProgress: SubtaskUIModel[];
		completed: SubtaskUIModel[];
	};
};

export type SubtaskUIModel = {
	text: string;
};

export function presentSubtask(subtask: Task): SubtaskUIModel {
	return {
		text: subtask.text,
	};
}
