import { Signal } from '@preact/signals-react';
import { Just, Maybe } from 'purify-ts';
import { TaskStatus } from '../../task/core/task-status';
import { presentTaskStatus } from '../../task/presenters/present-task-status';
import {
	KanbanColumnsUIModel,
	KanbanTaskUIModel,
} from '../../task/ui-models/kanban-task';
import { ViewMainBoardUseCaseOutputPort } from '../application/view-main-board-use-case';

export class MainBoardPresenter {
	constructor(private state: Signal<Maybe<MainBoardUIModel>>) {}

	present: ViewMainBoardUseCaseOutputPort = (mainBoard) => {
		const mainBoardTasksCount = mainBoard.tasks.length;
		const mainBoardCompletedTasksCount = mainBoard.tasks.filter(
			(task) => task.status === TaskStatus.Completed,
		).length;
		const allSubtasks = mainBoard.listAllSubtasks();
		const allTasksCount = allSubtasks.length;
		const allCompletedTasksCount = allSubtasks.filter(
			(task) => task.status === TaskStatus.Completed,
		).length;

		this.state.value = Just({
			status: presentTaskStatus(mainBoard.status),
			allTasksCount,
			allCompletedTasksCount,
			progress: allCompletedTasksCount / allTasksCount,
			mainBoardTasksCount,
			mainBoardCompletedTasksCount,
			tasks: {
				toDo: mainBoard.tasks
					.filter((task) => task.status === TaskStatus.ToDo)
					.map(KanbanTaskUIModel.fromTask),
				inProgress: mainBoard.tasks
					.filter((task) => task.status === TaskStatus.InProgress)
					.map(KanbanTaskUIModel.fromTask),
				completed: mainBoard.tasks
					.filter((task) => task.status === TaskStatus.Completed)
					.map(KanbanTaskUIModel.fromTask),
			},
		});
	};
}

export type MainBoardUIModel = {
	status: string;
	mainBoardCompletedTasksCount: number;
	mainBoardTasksCount: number;
	allCompletedTasksCount: number;
	allTasksCount: number;
	progress: number;
	tasks: KanbanColumnsUIModel;
};
