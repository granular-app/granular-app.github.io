import {
	mainBoardState,
	viewMainBoardController,
} from '../../main-board/setup';
import { viewedTaskState, viewTaskController } from '../../task/setup';
import { UIDependencies } from '../ui-dependencies';

export const uiDependencies: UIDependencies = {
	mainBoardState,
	viewMainBoardController,
	viewedTaskState,
	viewTaskController,
};
