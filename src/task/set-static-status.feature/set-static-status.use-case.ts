import { TasksRepository } from '../application/tasks-repository';
import { TaskManager } from '../core/task-manager';
import { TaskStatus } from '../core/task-status';

export class SetStaticStatusUseCase {
	constructor(
		private taskManager: TaskManager,
		private tasksRepo: TasksRepository,
	) {}

	run = (taskID: string, newStaticStatus: TaskStatus) => {
		this.taskManager.getTask(taskID).staticStatus = newStaticStatus;
		this.tasksRepo.save(this.taskManager.allTasks);
	};
}
