import { Signal } from '@preact/signals-react';
import { Maybe } from 'purify-ts';
import {
	AddTaskController,
	AfterAddTaskObserver,
} from '../add-task.feature/add-task.controller';
import { AddTaskUseCase } from '../add-task.feature/add-task.use-case';
import { TaskStatus } from '../core/task-status';
import { RefreshViewedTaskController } from './refresh-viewed-task.controller';
import { ViewedTaskUIModel } from './viewed-task.presenter';

export class AddViewedTaskSubtaskController {
	constructor(
		addTaskUseCase: AddTaskUseCase,
		private viewedTaskState: Signal<Maybe<ViewedTaskUIModel>>,
		afterAddViewedTaskSubtaskObserver: AfterAddViewedTaskSubtaskObserver,
	) {
		this.addTaskController = new AddTaskController(
			addTaskUseCase,
			afterAddViewedTaskSubtaskObserver,
		);
	}

	private addTaskController: AddTaskController;

	run = (text: string, options: { status: TaskStatus }) => {
		const viewedTask = this.viewedTaskState.value
			.ifNothing(() => {
				throw new Error('Must have a viewed task to run this controller.');
			})
			.extract()!;

		this.addTaskController.run(text, {
			status: options.status,
			parentTaskIDs: [viewedTask.id],
		});
	};
}

export class AfterAddViewedTaskSubtaskObserver implements AfterAddTaskObserver {
	constructor(
		private refreshViewedTaskController: RefreshViewedTaskController,
	) {}

	afterAdd(): void {
		this.refreshViewedTaskController.run();
	}
}
