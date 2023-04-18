import { signal } from '@preact/signals-react';
import { Maybe, Nothing } from 'purify-ts';
import { ViewTaskUseCase } from './application/view-task-use-case';
import { ViewTaskController } from './controllers/view-task-controller';
import { TaskManager } from './core/task-manager';
import { TaskStatus } from './core/task-status';
import {
	ViewedTaskPresenter,
	ViewedTaskUIModel,
} from './presenters/viewed-task-presenter';

export const taskManager = new TaskManager();
const testTask1 = taskManager.createTask('Test task 1');
testTask1.createSubtask('Test task 1.1');
const testTask2 = taskManager.createTask('Test task 2');
testTask2.staticStatus = TaskStatus.Completed;

export const viewedTaskState = signal<Maybe<ViewedTaskUIModel>>(Nothing);
const viewedTaskPresenter = new ViewedTaskPresenter(viewedTaskState);
const viewTaskUseCase = new ViewTaskUseCase(taskManager, (viewedTask) =>
	viewedTaskPresenter.present(viewedTask),
);
export const viewTaskController = new ViewTaskController(viewTaskUseCase);
