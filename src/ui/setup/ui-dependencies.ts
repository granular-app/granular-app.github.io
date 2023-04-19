import {
	mainBoardState,
	viewMainBoardController,
} from 'src/task/main-board.feature/setup';
import {
	viewedTaskState,
	viewTaskController,
} from 'src/task/view-task.feature/setup';
import { UIDependencies } from '../ui-dependencies';

export const uiDependencies: UIDependencies = {
	mainBoardState,
	viewMainBoardController,
	viewedTaskState,
	viewTaskController,
};
