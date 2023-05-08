import { exportDataController } from 'src/export-data.feature/setup';
import { importDataController } from 'src/import-data.feature/setup';
import {
	addMainBoardTaskController,
	deleteMainBoardTaskController,
	editMainBoardTaskController,
	forceGetMainBoard,
	mainBoardState,
	setMainBoardTaskStaticStatusController,
	viewMainBoardController,
} from 'src/task.feature/main-board.feature/setup';
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
	setViewedTaskSubtaskStaticStatusController,
	viewedTaskState,
	viewTaskController,
} from 'src/task.feature/viewed-task.feature/setup';
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
	exportDataController,
	importDataController,
	setMainBoardTaskStaticStatusController,
	setViewedTaskSubtaskStaticStatusController,
};
