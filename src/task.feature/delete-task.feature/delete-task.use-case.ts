import { TasksRepository } from '../application/tasks-repository';
import { TaskManager } from '../core/task-manager.entity';

export class DeleteTaskUseCase {
	constructor(
		private taskManager: TaskManager,
		private tasksRepo: TasksRepository,
	) {}

	run = (taskID: string) => {
		this.taskManager.getTask(taskID).delete();
		this.tasksRepo.save();
	};
}
