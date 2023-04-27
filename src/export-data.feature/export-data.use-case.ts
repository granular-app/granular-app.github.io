import { Task } from 'src/task/core/task';
import { TaskManager } from 'src/task/core/task-manager';

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
