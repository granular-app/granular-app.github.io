import { TaskManager } from '../core/task-manager';

export class EditTaskUseCase {
	constructor(private taskManager: TaskManager) {}

	run = (id: string, newText: string) => {
		this.taskManager.getTask(id).text = newText;
	};
}
