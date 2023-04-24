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
		private getViewedTask: () => ViewedTaskUIModel,
		afterAddViewedTaskSubtaskObserver: AfterAddViewedTaskSubtaskObserver,
	) {
		this.addTaskController = new AddTaskController(
			addTaskUseCase,
			afterAddViewedTaskSubtaskObserver,
		);
	}

	private addTaskController: AddTaskController;

	run = (text: string, options: { status: TaskStatus }) => {
		const viewedTask = this.getViewedTask();

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
