import { signal } from '@preact/signals-react';
import { Maybe, Nothing } from 'purify-ts';
import { AppRoute, router } from 'src/ui/setup/router';
import { AttachSubtaskUseCase } from '../attach-subtask.feature/attach-subtask.use-case';
import { CreateSubtaskUseCase } from '../create-subtask.feature/create-subtask.use-case';
import { DeleteTaskUseCase } from '../delete-task.feature/delete-task.use-case';
import { DetachSubtaskUseCase } from '../detach-subtask.feature/detach-subtask.use-case';
import { EditTaskController } from '../edit-task.feature/edit-task.controller';
import { EditTaskUseCase } from '../edit-task.feature/edit-task.use-case';
import { PreferAsMainBoardTaskUseCase } from '../main-board.feature/prefer-as-main-board-task.feature/prefer-as-main-board-task.use-case';
import { SetStaticStatusUseCase } from '../set-static-status.feature/set-static-status.use-case';
import { taskManager, tasksRepository } from '../setup';
import { AttachViewedTaskController } from './attach-viewed-task.controller';
import { CreateViewedTaskSubtaskController } from './create-subtask.controller';
import { DeleteSubtaskController } from './delete-subtask.controller';
import { DeleteViewedTaskController } from './delete-viewed-task.controller';
import { DetachViewedTaskController } from './detach-viewed-task.controller';
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
	new CreateViewedTaskSubtaskController(
		new CreateSubtaskUseCase(
			taskManager,
			new AttachSubtaskUseCase(taskManager, tasksRepository),
			tasksRepository,
		),
		forceGetViewedTask,
		refreshViewedTaskController.run,
	);

export const editViewedTaskSubtaskController = new EditTaskController(
	new EditTaskUseCase(taskManager, tasksRepository),
	new AfterEditViewedTaskSubtaskObserver(refreshViewedTaskController),
);

export const editViewedTaskController = new EditViewedTaskController(
	new EditTaskUseCase(taskManager, tasksRepository),
	forceGetViewedTask,
	new AfterEditViewedTaskObserver(refreshViewedTaskController),
);

const setStaticStatusUseCase = new SetStaticStatusUseCase(
	taskManager,
	tasksRepository,
);
export const setViewedTaskStaticStatusController =
	new SetViewedTaskStaticStatusController(
		setStaticStatusUseCase,
		forceGetViewedTask,
		refreshViewedTaskController,
	);

export const deleteSubtaskController = new DeleteSubtaskController(
	new DeleteTaskUseCase(taskManager, tasksRepository),
	refreshViewedTaskController,
);

export const deleteViewedTaskController = new DeleteViewedTaskController(
	new DeleteTaskUseCase(taskManager, tasksRepository),
	forceGetViewedTask,
	() => router.navigate(AppRoute.MainBoard),
);

export const attachViewedTaskController = new AttachViewedTaskController(
	new AttachSubtaskUseCase(taskManager, tasksRepository),
	new PreferAsMainBoardTaskUseCase(taskManager, tasksRepository),
	forceGetViewedTask,
	refreshViewedTaskController,
);

export const detachViewedTaskController = new DetachViewedTaskController(
	new DetachSubtaskUseCase(taskManager, tasksRepository),
	new PreferAsMainBoardTaskUseCase(taskManager, tasksRepository),
	forceGetViewedTask,
	refreshViewedTaskController.run,
);
