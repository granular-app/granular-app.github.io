import { signal } from '@preact/signals-react';
import { Nothing } from 'purify-ts';
import { AddTaskUseCase } from '../add-task.feature/add-task.use-case';
import { EditTaskController } from '../edit-task.feature/edit-task.controller';
import { EditTaskUseCase } from '../edit-task.feature/edit-task.use-case';
import { taskManager } from '../setup';
import {
	AddMainBoardTaskController,
	AfterAddMainBoardTaskObserver,
} from './add-main-board-task.controller';
import { AfterEditMainBoardTaskObserver } from './edit-main-board-task.controller';
import { MainBoard } from './main-board.entity';
import { MainBoardPresenter } from './main-board.presenter';
import { ViewMainBoardController } from './view-main-board.controller';
import { ViewMainBoardUseCase } from './view-main-board.use-case';

const mainBoard = new MainBoard(taskManager);

export const mainBoardState = signal(Nothing);
const mainBoardPresenter = new MainBoardPresenter(mainBoardState);

const viewMainBoardUseCase = new ViewMainBoardUseCase(mainBoard, (mainBoard) =>
	mainBoardPresenter.present(mainBoard),
);
export const viewMainBoardController = new ViewMainBoardController(
	viewMainBoardUseCase,
);

const addTaskUseCase = new AddTaskUseCase(taskManager);
export const addMainBoardTaskController = new AddMainBoardTaskController(
	addTaskUseCase,
	new AfterAddMainBoardTaskObserver(viewMainBoardController),
);

const editTaskUseCase = new EditTaskUseCase(taskManager);
export const editMainBoardTaskController = new EditTaskController(
	editTaskUseCase,
	new AfterEditMainBoardTaskObserver(viewMainBoardController),
);
