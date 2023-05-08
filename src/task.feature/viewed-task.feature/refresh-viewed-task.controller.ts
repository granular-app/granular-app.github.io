import { ViewTaskController } from './view-task.controller';
import { ViewedTaskUIModel } from './viewed-task.presenter';

export class RefreshViewedTaskController {
	constructor(
		private forceGetViewedTask: () => ViewedTaskUIModel,
		private viewTaskController: ViewTaskController,
	) {}

	run = () => {
		const viewedTask = this.forceGetViewedTask();

		this.viewTaskController.run(viewedTask.id);
	};
}
