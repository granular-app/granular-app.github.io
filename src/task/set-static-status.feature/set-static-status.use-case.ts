import { TaskManager } from '../core/task-manager';
import { TaskStatus } from '../core/task-status';

export class SetStaticStatusUseCase {
	constructor(private taskManager: TaskManager) {}

	run = (taskID: string, newStaticStatus: TaskStatus) => {
		this.taskManager.getTask(taskID).staticStatus = newStaticStatus;
	};
}
