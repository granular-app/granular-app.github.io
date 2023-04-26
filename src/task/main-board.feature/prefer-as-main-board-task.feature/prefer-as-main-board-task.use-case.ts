import { TasksRepository } from 'src/task/application/tasks-repository';
import { TaskManager } from 'src/task/core/task-manager';

export class PreferAsMainBoardTaskUseCase {
	constructor(
		private taskManager: TaskManager,
		private tasksRepo: TasksRepository,
	) {}

	run = (prefers: boolean, taskID: string) => {
		this.taskManager.getTask(taskID).userPrefersAsMainBoardTask = prefers;
		this.tasksRepo.save();
	};
}
