import { AddTaskUseCase } from '../add-task.feature/add-task.use-case';
import { TaskStatus } from '../core/task-status';
import { ViewMainBoardController } from './view-main-board.controller';

export class AddMainBoardTaskController {
	constructor(
		private addTaskUseCase: AddTaskUseCase,
		private viewMainBoardController: ViewMainBoardController,
	) {}

	run = (text: string, options: { status: TaskStatus }) => {
		this.addTaskUseCase.run(text, {
			status: options.status,
			parentTaskIDs: [],
		});
		this.viewMainBoardController.run();
	};
}
