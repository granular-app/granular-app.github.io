import { TaskStatus } from '../core/task-status.entity';
import { SetStaticStatusController } from '../set-static-status.feature/set-static-status.controller';
import { SetStaticStatusUseCase } from '../set-static-status.feature/set-static-status.use-case';
import { RefreshViewedTaskController } from './refresh-viewed-task.controller';
import { ViewedTaskUIModel } from './viewed-task.presenter';

export class SetViewedTaskStaticStatusController {
	constructor(
		setStaticStatusUseCase: SetStaticStatusUseCase,
		private getViewedTask: () => ViewedTaskUIModel,
		refreshViewedTaskController: RefreshViewedTaskController,
	) {
		this.setStaticStatusController = new SetStaticStatusController(
			setStaticStatusUseCase,
			refreshViewedTaskController.run,
		);
	}

	private setStaticStatusController: SetStaticStatusController;

	run = (newStaticStatus: TaskStatus) => {
		const viewedTask = this.getViewedTask();

		this.setStaticStatusController.run(viewedTask.id, newStaticStatus);
	};
}
