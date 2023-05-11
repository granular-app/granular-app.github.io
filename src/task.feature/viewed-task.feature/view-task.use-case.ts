import { Maybe } from 'purify-ts';
import { TaskManager } from '../core/task-manager.entity';
import { Task } from '../core/task.entity';

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
