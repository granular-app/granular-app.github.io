import { AddParentTaskUseCase } from '../add-parent-task.feature/add-parent-task.use-case';
import { RefreshViewedTaskController } from './refresh-viewed-task.controller';
import { ViewedTaskUIModel } from './viewed-task.presenter';

export class AddViewedTaskParentTaskController {
	constructor(
		private addParentTaskUseCase: AddParentTaskUseCase,
		private getViewedTask: () => ViewedTaskUIModel,
		refreshViewedTaskController: RefreshViewedTaskController,
	) {
		this.afterAddParentTaskObserver = new AfterAddViewedTaskParentTaskObserver(
			refreshViewedTaskController,
		);
	}

	private afterAddParentTaskObserver: AfterAddViewedTaskParentTaskObserver;

	run = (parentTaskID: string) => {
		const viewedTask = this.getViewedTask();

		this.addParentTaskUseCase.run(viewedTask.id, parentTaskID);
		this.afterAddParentTaskObserver.afterAddParentTask();
	};
}

class AfterAddViewedTaskParentTaskObserver {
	constructor(
		private refreshViewedTaskController: RefreshViewedTaskController,
	) {}

	afterAddParentTask() {
		this.refreshViewedTaskController.run();
	}
}
