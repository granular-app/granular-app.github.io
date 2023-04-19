import { Task } from 'src/task/core/task';
import { TaskManager } from 'src/task/core/task-manager';
import { deriveTaskStatus, TaskStatus } from 'src/task/core/task-status';

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

	listAllSubtasks(): Task[] {
		return this.taskManager.allTasks;
	}
}
