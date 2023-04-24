import { signal } from '@preact/signals-react';
import { Maybe, Nothing } from 'purify-ts';
import { router, TaskmapRoute } from 'src/ui/setup/router';
import { AddParentTaskUseCase } from '../add-parent-task.feature/add-parent-task.use-case';
import { AddTaskUseCase } from '../add-task.feature/add-task.use-case';
import { DeleteTaskUseCase } from '../delete-task.feature/delete-task.use-case';
import { EditTaskController } from '../edit-task.feature/edit-task.controller';
import { EditTaskUseCase } from '../edit-task.feature/edit-task.use-case';
import { SetStaticStatusUseCase } from '../set-static-status.feature/set-static-status.use-case';
import { taskManager } from '../setup';
import {
	AddViewedTaskSubtaskController,
	AfterAddViewedTaskSubtaskObserver,
} from './add-subtask.controller';
import { AddViewedTaskParentTaskController } from './add-viewed-task-parent-task.controller';
import { DeleteSubtaskController } from './delete-subtask.controller';
import { DeleteViewedTaskController } from './delete-viewed-task.controller';
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
const getViewedTask = () => {
	return viewedTaskState.value
		.ifNothing(() => {
			throw new Error('Must have a viewed task to run this function.');
		})
		.extract()!;
};

const viewedTaskPresenter = new ViewedTaskPresenter(viewedTaskState);
const viewTaskUseCase = new ViewTaskUseCase(taskManager, (viewedTask) =>
	viewedTaskPresenter.present(viewedTask),
);
export const viewTaskController = new ViewTaskController(viewTaskUseCase);
const refreshViewedTaskController = new RefreshViewedTaskController(
	getViewedTask,
	viewTaskController,
);

const addTaskUseCase = new AddTaskUseCase(taskManager);
export const addViewedTaskSubtaskController =
	new AddViewedTaskSubtaskController(
		addTaskUseCase,
		getViewedTask,
		new AfterAddViewedTaskSubtaskObserver(refreshViewedTaskController),
	);

const editTaskUseCase = new EditTaskUseCase(taskManager);
export const editViewedTaskSubtaskController = new EditTaskController(
	editTaskUseCase,
	new AfterEditViewedTaskSubtaskObserver(refreshViewedTaskController),
);

export const editViewedTaskController = new EditViewedTaskController(
	editTaskUseCase,
	getViewedTask,
	new AfterEditViewedTaskObserver(refreshViewedTaskController),
);

const setStaticStatusUseCase = new SetStaticStatusUseCase(taskManager);
export const setViewedTaskStaticStatusController =
	new SetViewedTaskStaticStatusController(
		setStaticStatusUseCase,
		getViewedTask,
		refreshViewedTaskController,
	);

const deleteTaskUseCase = new DeleteTaskUseCase(taskManager);
export const deleteSubtaskController = new DeleteSubtaskController(
	deleteTaskUseCase,
	refreshViewedTaskController,
);

export const deleteViewedTaskController = new DeleteViewedTaskController(
	deleteTaskUseCase,
	getViewedTask,
	() => router.navigate(TaskmapRoute.MainBoard),
);

export const addViewedTaskParentTaskController =
	new AddViewedTaskParentTaskController(
		new AddParentTaskUseCase(taskManager),
		getViewedTask,
		refreshViewedTaskController,
	);
