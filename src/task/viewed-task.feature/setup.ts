import { signal } from '@preact/signals-react';
import { Maybe, Nothing } from 'purify-ts';
import { AddTaskUseCase } from '../add-task.feature/add-task.use-case';
import { EditTaskController } from '../edit-task.feature/edit-task.controller';
import { EditTaskUseCase } from '../edit-task.feature/edit-task.use-case';
import { SetStaticStatusUseCase } from '../set-static-status.feature/set-static-status.use-case';
import { taskManager } from '../setup';
import {
	AddViewedTaskSubtaskController,
	AfterAddViewedTaskSubtaskObserver,
} from './add-subtask.controller';
import { AfterEditViewedTaskSubtaskObserver } from './edit-subtask.controller';
import {
	AfterEditViewedTaskObserver,
	EditViewedTaskController,
} from './edit-viewed-task.controller';
import { RefreshViewedTaskController } from './refresh-viewed-task.controller';
import { SetViewedTaskStaticStatusController } from './set-viewed-task-static-status.controller';
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
const refreshViewedTaskController = new RefreshViewedTaskController(
	viewedTaskState,
	viewTaskController,
);

const addTaskUseCase = new AddTaskUseCase(taskManager);
export const addViewedTaskSubtaskController =
	new AddViewedTaskSubtaskController(
		addTaskUseCase,
		viewedTaskState,
		new AfterAddViewedTaskSubtaskObserver(refreshViewedTaskController),
	);

const editTaskUseCase = new EditTaskUseCase(taskManager);
export const editViewedTaskSubtaskController = new EditTaskController(
	editTaskUseCase,
	new AfterEditViewedTaskSubtaskObserver(refreshViewedTaskController),
);

export const editViewedTaskController = new EditViewedTaskController(
	editTaskUseCase,
	viewedTaskState,
	new AfterEditViewedTaskObserver(refreshViewedTaskController),
);

const setStaticStatusUseCase = new SetStaticStatusUseCase(taskManager);
export const setViewedTaskStaticStatusController =
	new SetViewedTaskStaticStatusController(
		setStaticStatusUseCase,
		viewedTaskState,
		refreshViewedTaskController,
	);
