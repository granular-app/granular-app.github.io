import {
	addMainBoardTaskController,
	deleteMainBoardTaskController,
	editMainBoardTaskController,
	forceGetMainBoard,
	mainBoardState,
	viewMainBoardController,
} from 'src/task/main-board.feature/setup';
import {
	addViewedTaskSubtaskController,
	attachViewedTaskController,
	deleteSubtaskController,
	deleteViewedTaskController,
	detachViewedTaskController,
	editViewedTaskController,
	editViewedTaskSubtaskController,
	forceGetViewedTask,
	setViewedTaskStaticStatusController,
	viewedTaskState,
	viewTaskController,
} from 'src/task/viewed-task.feature/setup';
import { Adapters } from '../adapaters';

export const adapters: Adapters = {
	mainBoardState,
	viewMainBoardController,
	viewedTaskState,
	viewTaskController,
	addMainBoardTaskController,
	addViewedTaskSubtaskController,
	editMainBoardTaskController,
	editViewedTaskSubtaskController,
	editViewedTaskController,
	setViewedTaskStaticStatusController,
	deleteSubtaskController,
	deleteMainBoardTaskController,
	deleteViewedTaskController,
	attachViewedTaskController,
	forceGetMainBoard,
	forceGetViewedTask,
	detachViewedTaskController,
};
