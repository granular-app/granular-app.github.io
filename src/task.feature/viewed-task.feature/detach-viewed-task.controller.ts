import { DetachSubtaskUseCase } from '../detach-subtask.feature/detach-subtask.use-case';
import { PreferAsMainBoardTaskUseCase } from '../main-board.feature/prefer-as-main-board-task.feature/prefer-as-main-board-task.use-case';
import { ViewedTaskUIModel } from './viewed-task.presenter';

export class DetachViewedTaskController {
	constructor(
		private detachSubtaskUseCase: DetachSubtaskUseCase,
		private preferAsMainBoardTaskUseCase: PreferAsMainBoardTaskUseCase,
		private forceGetViewedTask: () => ViewedTaskUIModel,
		private afterDetachViewedTask: () => void,
	) {}

	run = (parentTaskID: string) => {
		const viewedTask = this.forceGetViewedTask();

		if (parentTaskID === 'main-board') {
			this.preferAsMainBoardTaskUseCase.run(false, viewedTask.id);
		} else {
			this.detachSubtaskUseCase.run(viewedTask.id, parentTaskID);
		}

		this.afterDetachViewedTask();
	};
}
