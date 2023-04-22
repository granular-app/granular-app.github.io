import { TaskManager } from '../core/task-manager';

export class DeleteTaskUseCase {
	constructor(private taskManager: TaskManager) {}

	run = (taskID: string) => {
		this.taskManager.getTask(taskID).delete();
	};
}
