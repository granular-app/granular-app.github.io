import {
	addMainBoardTaskController,
	editMainBoardTaskController,
	mainBoardState,
	viewMainBoardController,
} from 'src/task/main-board.feature/setup';
import {
	addViewedTaskSubtaskController,
	editViewedTaskController,
	editViewedTaskSubtaskController,
	setViewedTaskStaticStatusController,
	viewedTaskState,
	viewTaskController,
} from 'src/task/viewed-task.feature/setup';
import { UIDependencies } from '../ui-dependencies';

export const uiDependencies: UIDependencies = {
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
};
