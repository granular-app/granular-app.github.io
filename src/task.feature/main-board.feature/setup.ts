import { signal } from '@preact/signals-react';
import { Maybe, Nothing } from 'purify-ts';
import { DeleteTaskUseCase } from '../delete-task.feature/delete-task.use-case';
import { EditTaskController } from '../edit-task.feature/edit-task.controller';
import { EditTaskUseCase } from '../edit-task.feature/edit-task.use-case';
import { taskManager, tasksRepository } from '../setup';

import { AddMainBoardTaskController } from './add-main-board-task.feature/add-main-board-task.controller';
import { AddMainBoardTaskUseCase } from './add-main-board-task.feature/add-main-board-task.use-case';
import { DeleteMainBoardTaskController } from './delete-main-board-task.controller';
import { AfterEditMainBoardTaskObserver } from './edit-main-board-task.controller';
import { MainBoard } from './main-board.entity';
import { MainBoardPresenter, MainBoardUIModel } from './main-board.presenter';
import { ViewMainBoardController } from './view-main-board.controller';
import { ViewMainBoardUseCase } from './view-main-board.use-case';

const mainBoard = new MainBoard(taskManager);

export const mainBoardState = signal<Maybe<MainBoardUIModel>>(Nothing);
export const forceGetMainBoard = () => {
	return mainBoardState.value
		.ifNothing(() => {
			throw new Error('Must view a main board to run this function.');
		})
		.extract()!;
};

const mainBoardPresenter = new MainBoardPresenter(mainBoardState);

const viewMainBoardUseCase = new ViewMainBoardUseCase(
	mainBoard,
	mainBoardPresenter.present,
);
export const viewMainBoardController = new ViewMainBoardController(
	viewMainBoardUseCase,
);

export const addMainBoardTaskController = new AddMainBoardTaskController(
	new AddMainBoardTaskUseCase(mainBoard, tasksRepository),
	viewMainBoardController.run,
);

const editTaskUseCase = new EditTaskUseCase(taskManager, tasksRepository);
export const editMainBoardTaskController = new EditTaskController(
	editTaskUseCase,
	new AfterEditMainBoardTaskObserver(viewMainBoardController),
);

const deleteTaskUseCase = new DeleteTaskUseCase(taskManager, tasksRepository);
export const deleteMainBoardTaskController = new DeleteMainBoardTaskController(
	deleteTaskUseCase,
	viewMainBoardController,
);
