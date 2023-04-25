import { AttachSubtaskUseCase } from '../attach-subtask.feature/attach-subtask.use-case';
import { PreferAsMainBoardTaskUseCase } from '../main-board.feature/prefer-as-main-board-task.feature/prefer-as-main-board-task.use-case';
import { RefreshViewedTaskController } from './refresh-viewed-task.controller';
import { ViewedTaskUIModel } from './viewed-task.presenter';

export class AddViewedTaskParentTaskController {
	constructor(
		private attachSubtaskUseCase: AttachSubtaskUseCase,
		private preferAsMainBoardTaskUseCase: PreferAsMainBoardTaskUseCase,
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

		if (parentTaskID === 'main-board') {
			this.preferAsMainBoardTaskUseCase.run(true, viewedTask.id);
		} else {
			this.attachSubtaskUseCase.run(viewedTask.id, parentTaskID);
		}

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
