import { Signal } from '@preact/signals-react';
import { Just, Maybe } from 'purify-ts';
import { TaskStatus, taskStatuses } from 'src/task.feature/core/task-status';
import { presentTaskStatus } from 'src/task.feature/presenters/present-task-status';
import {
	KanbanColumnsUIModel,
	KanbanTaskUIModel,
	presentKanbanColumn,
} from 'src/task.feature/ui-models/kanban-task';
import { ViewMainBoardUseCaseOutputPort } from './view-main-board.use-case';

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
			tasksByStatus: Object.fromEntries(
				taskStatuses.map((status) => [
					status,
					presentKanbanColumn(mainBoard.tasks, status),
				]),
			) as Record<TaskStatus, KanbanTaskUIModel[]>,
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
	tasksByStatus: KanbanColumnsUIModel;
};
