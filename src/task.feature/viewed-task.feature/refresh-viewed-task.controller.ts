import { ViewTaskController } from './view-task.controller';
import { ViewedTaskUIModel } from './viewed-task.presenter';

export class RefreshViewedTaskController {
	constructor(
		private getViewedTask: () => ViewedTaskUIModel,
		private viewTaskController: ViewTaskController,
	) {}

	run = () => {
		const viewedTask = this.getViewedTask();

		this.viewTaskController.run(viewedTask.id);
	};
}
