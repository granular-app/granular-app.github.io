import { Maybe } from 'purify-ts';
import { Task } from '../core/task';
import { TaskManager } from '../core/task-manager';

export class ViewTaskUseCase {
	constructor(
		private taskManager: TaskManager,
		private output: ViewTaskUseCaseOutputPort,
	) {}

	run(taskID: string) {
		this.output(this.taskManager.findTask(taskID));
	}
}

export type ViewTaskUseCaseOutputPort = (viewedTask: Maybe<Task>) => void;
