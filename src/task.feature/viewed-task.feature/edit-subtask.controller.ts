import { AfterEditTaskObserver } from '../edit-task.feature/edit-task.controller';
import { RefreshViewedTaskController } from './refresh-viewed-task.controller';

export class AfterEditViewedTaskSubtaskObserver
	implements AfterEditTaskObserver
{
	constructor(
		private refreshViewedTaskController: RefreshViewedTaskController,
	) {}

	afterEdit() {
		this.refreshViewedTaskController.run();
	}
}
