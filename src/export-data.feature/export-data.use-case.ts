import { TaskManager } from 'src/task.feature/core/task-manager.entity';
import { Task } from 'src/task.feature/core/task.entity';

export class ExportDataUseCase {
	constructor(
		private taskManager: TaskManager,
		private output: ExportDataUseCaseOutputPort,
	) {}

	run = () => {
		this.output(this.taskManager.allTasks);
	};
}

export type ExportDataUseCaseOutputPort = (allTasks: Task[]) => void;
