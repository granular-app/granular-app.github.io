import {
	AfterEditTaskObserver,
	EditTaskController,
} from '../edit-task.feature/edit-task.controller';
import { EditTaskUseCase } from '../edit-task.feature/edit-task.use-case';
import { RefreshViewedTaskController } from './refresh-viewed-task.controller';
import { ViewedTaskUIModel } from './viewed-task.presenter';

export class EditViewedTaskController {
	constructor(
		editTaskUseCase: EditTaskUseCase,
		private getViewedTask: () => ViewedTaskUIModel,
		afterEditViewedTaskObserver: AfterEditViewedTaskObserver,
	) {
		this.editTaskController = new EditTaskController(
			editTaskUseCase,
			afterEditViewedTaskObserver,
		);
	}

	private editTaskController: EditTaskController;

	run = (newText: string) => {
		const viewedTask = this.getViewedTask();

		this.editTaskController.run(viewedTask.id, newText);
	};
}

export class AfterEditViewedTaskObserver implements AfterEditTaskObserver {
	constructor(
		private refreshViewedTaskController: RefreshViewedTaskController,
	) {}

	afterEdit() {
		this.refreshViewedTaskController.run();
	}
}
