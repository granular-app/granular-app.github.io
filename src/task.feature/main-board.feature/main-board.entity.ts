import { Task } from 'src/task.feature/core/task';
import { TaskManager } from 'src/task.feature/core/task-manager';
import {
	deriveTaskStatus,
	TaskStatus,
} from 'src/task.feature/core/task-status';

export class MainBoard {
	constructor(private taskManager: TaskManager) {}

	get tasks() {
		return this.taskManager.allTasks.filter((task) => task.isMainBoardTask);
	}

	get status(): TaskStatus {
		return deriveTaskStatus(this.tasks.map((task) => task.status)).orDefault(
			TaskStatus.Completed,
		);
	}

	listAllSubtasks(): Task[] {
		return this.taskManager.allTasks;
	}

	createTask(params: { text: string; status: TaskStatus }) {
		const mainBoardTask = this.taskManager.createTask(params.text);
		mainBoardTask.userPrefersAsMainBoardTask = true;
		mainBoardTask.staticStatus = params.status;
	}
}
