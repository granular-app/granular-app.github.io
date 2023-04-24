import { signal } from '@preact/signals-react';
import { Maybe, Nothing } from 'purify-ts';
import { router, TaskmapRoute } from 'src/ui/setup/router';
import { AddSubtaskUseCase } from '../add-subtask.feature/add-subtask.use-case';
import { CreateSubtaskUseCase } from '../create-subtask.feature/create-subtask.use-case';
import { DeleteTaskUseCase } from '../delete-task.feature/delete-task.use-case';
import { EditTaskController } from '../edit-task.feature/edit-task.controller';
import { EditTaskUseCase } from '../edit-task.feature/edit-task.use-case';
import { PreferAsMainBoardTaskUseCase } from '../main-board.feature/prefer-as-main-board-task.feature/prefer-as-main-board-task.use-case';
import { SetStaticStatusUseCase } from '../set-static-status.feature/set-static-status.use-case';
import { taskManager } from '../setup';
import { AddViewedTaskSubtaskController } from './add-subtask.controller';
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
export const forceGetViewedTask = () => {
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
	forceGetViewedTask,
	viewTaskController,
);

export const addViewedTaskSubtaskController =
	new AddViewedTaskSubtaskController(
		new CreateSubtaskUseCase(taskManager, new AddSubtaskUseCase(taskManager)),
		forceGetViewedTask,
		refreshViewedTaskController.run,
	);

export const editViewedTaskSubtaskController = new EditTaskController(
	new EditTaskUseCase(taskManager),
	new AfterEditViewedTaskSubtaskObserver(refreshViewedTaskController),
);

export const editViewedTaskController = new EditViewedTaskController(
	new EditTaskUseCase(taskManager),
	forceGetViewedTask,
	new AfterEditViewedTaskObserver(refreshViewedTaskController),
);

const setStaticStatusUseCase = new SetStaticStatusUseCase(taskManager);
export const setViewedTaskStaticStatusController =
	new SetViewedTaskStaticStatusController(
		setStaticStatusUseCase,
		forceGetViewedTask,
		refreshViewedTaskController,
	);

export const deleteSubtaskController = new DeleteSubtaskController(
	new DeleteTaskUseCase(taskManager),
	refreshViewedTaskController,
);

export const deleteViewedTaskController = new DeleteViewedTaskController(
	new DeleteTaskUseCase(taskManager),
	forceGetViewedTask,
	() => router.navigate(TaskmapRoute.MainBoard),
);

export const addViewedTaskParentTaskController =
	new AddViewedTaskParentTaskController(
		new AddSubtaskUseCase(taskManager),
		new PreferAsMainBoardTaskUseCase(taskManager),

		forceGetViewedTask,
		refreshViewedTaskController,
	);
