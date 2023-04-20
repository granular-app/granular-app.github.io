import { signal } from '@preact/signals-react';
import { Maybe, Nothing } from 'purify-ts';
import { AddTaskUseCase } from '../add-task.feature/add-task.use-case';
import { taskManager } from '../setup';
import { AddViewedTaskSubtaskController } from './add-viewed-task-subtask.controller';
import { ViewTaskController } from './view-task.controller';
import { ViewTaskUseCase } from './view-task.use-case';
import {
	ViewedTaskPresenter,
	ViewedTaskUIModel,
} from './viewed-task.presenter';

export const viewedTaskState = signal<Maybe<ViewedTaskUIModel>>(Nothing);
const viewedTaskPresenter = new ViewedTaskPresenter(viewedTaskState);
const viewTaskUseCase = new ViewTaskUseCase(taskManager, (viewedTask) =>
	viewedTaskPresenter.present(viewedTask),
);
export const viewTaskController = new ViewTaskController(viewTaskUseCase);

const addTaskUseCase = new AddTaskUseCase(taskManager);
export const addViewedTaskSubtaskController =
	new AddViewedTaskSubtaskController(
		addTaskUseCase,
		viewedTaskState,
		viewTaskController,
	);
