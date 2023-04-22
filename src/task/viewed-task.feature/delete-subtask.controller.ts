import {
	AfterDeleteTaskObserver,
	DeleteTaskController,
} from '../delete-task.feature/delete-task.controller';
import { DeleteTaskUseCase } from '../delete-task.feature/delete-task.use-case';
import { RefreshViewedTaskController } from './refresh-viewed-task.controller';

export class DeleteSubtaskController {
	constructor(
		deleteTaskUseCase: DeleteTaskUseCase,
		refreshViewedTaskController: RefreshViewedTaskController,
	) {
		this.deleteTaskController = new DeleteTaskController(
			deleteTaskUseCase,
			new AfterDeleteSubtaskObserver(refreshViewedTaskController),
		);
	}

	private deleteTaskController: DeleteTaskController;

	run = (taskID: string) => {
		this.deleteTaskController.run(taskID);
	};
}

export class AfterDeleteSubtaskObserver implements AfterDeleteTaskObserver {
	constructor(
		private refreshViewedTaskController: RefreshViewedTaskController,
	) {}

	afterDelete(): void {
		this.refreshViewedTaskController.run();
	}
}
