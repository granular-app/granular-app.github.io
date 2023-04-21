import { AddTaskUseCase } from '../add-task.feature/add-task.use-case';
import { TaskStatus } from '../core/task-status';

export class AddTaskController {
	constructor(
		private addTaskUseCase: AddTaskUseCase,
		private afterAddTaskObserver: AfterAddTaskObserver,
	) {}

	run = (
		text: string,
		options: { status: TaskStatus; parentTaskIDs: string[] },
	) => {
		this.addTaskUseCase.run(text, options);
		this.afterAddTaskObserver.afterAdd();
	};
}

export interface AfterAddTaskObserver {
	afterAdd(): void;
}
