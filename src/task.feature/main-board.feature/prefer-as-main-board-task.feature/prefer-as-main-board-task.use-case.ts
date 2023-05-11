import { TasksRepository } from 'src/task.feature/application/tasks-repository';
import { TaskManager } from 'src/task.feature/core/task-manager.entity';

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
