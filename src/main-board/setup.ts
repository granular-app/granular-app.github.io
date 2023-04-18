import { signal } from '@preact/signals-react';
import { Nothing } from 'purify-ts';
import { taskManager } from '../task/setup';
import { ViewMainBoardUseCase } from './application/view-main-board-use-case';
import { ViewMainBoardController } from './controllers/view-main-board-controller';
import { MainBoard } from './core/main-board';
import { MainBoardPresenter } from './presenters/main-board-presenter';

const mainBoard = new MainBoard(taskManager);

export const mainBoardState = signal(Nothing);
const mainBoardPresenter = new MainBoardPresenter(mainBoardState);

const viewMainBoardUseCase = new ViewMainBoardUseCase(mainBoard, (mainBoard) =>
	mainBoardPresenter.present(mainBoard),
);
export const viewMainBoardController = new ViewMainBoardController(
	viewMainBoardUseCase,
);
