import { TaskStatus } from 'src/task.feature/core/task-status';
import { AddMainBoardTaskUseCase } from './add-main-board-task.use-case';

export class AddMainBoardTaskController {
	constructor(
		private addMainBoardTaskUseCase: AddMainBoardTaskUseCase,
		private afterRun: () => void,
	) {}

	run = (params: { text: string; status: TaskStatus }) => {
		this.addMainBoardTaskUseCase.run(params);
		this.afterRun();
	};
}
