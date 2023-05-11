import { TasksRepository } from '../application/tasks-repository';
import { TaskManager } from '../core/task-manager.entity';

export class EditTaskUseCase {
	constructor(
		private taskManager: TaskManager,
		private tasksRepo: TasksRepository,
	) {}

	run = (id: string, newText: string) => {
		this.taskManager.getTask(id).text = newText;
		this.tasksRepo.save();
	};
}
