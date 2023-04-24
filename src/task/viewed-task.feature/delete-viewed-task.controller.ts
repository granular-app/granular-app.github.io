import {
	AfterDeleteTaskObserver,
	DeleteTaskController,
} from '../delete-task.feature/delete-task.controller';
import { DeleteTaskUseCase } from '../delete-task.feature/delete-task.use-case';
import { ViewedTaskUIModel } from './viewed-task.presenter';

export class DeleteViewedTaskController {
	constructor(
		deleteTaskUseCase: DeleteTaskUseCase,
		private getViewedTask: () => ViewedTaskUIModel,
		navigateToMainBoard: () => void,
	) {
		this.deleteTaskController = new DeleteTaskController(
			deleteTaskUseCase,
			new AfterDeleteViewedTaskObserver(navigateToMainBoard),
		);
	}

	private deleteTaskController: DeleteTaskController;

	run = () => {
		const viewedTask = this.getViewedTask();

		this.deleteTaskController.run(viewedTask.id);
	};
}

export class AfterDeleteViewedTaskObserver implements AfterDeleteTaskObserver {
	constructor(private navigateToMainBoard: () => void) {}

	afterDelete(): void {
		this.navigateToMainBoard();
	}
}
