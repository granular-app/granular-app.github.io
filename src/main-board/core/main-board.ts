import { TaskManager } from '../../task/core/task-manager';
import { deriveTaskStatus, TaskStatus } from '../../task/core/task-status';

export class MainBoard {
	constructor(private taskManager: TaskManager) {}

	get tasks() {
		return this.taskManager.allTasks.filter((task) => !task.hasParentTasks);
	}

	get status(): TaskStatus {
		return deriveTaskStatus(this.tasks.map((task) => task.status)).orDefault(
			TaskStatus.Completed,
		);
	}
}
