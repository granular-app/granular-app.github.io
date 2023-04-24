import { TaskStatus } from '../core/task-status';
import { CreateSubtaskUseCase } from '../create-subtask.feature/create-subtask.use-case';
import { ViewedTaskUIModel } from './viewed-task.presenter';

export class AddViewedTaskSubtaskController {
	constructor(
		private addSubtaskUseCase: CreateSubtaskUseCase,
		private getViewedTask: () => ViewedTaskUIModel,
		private afterRun: () => void,
	) {}

	run = (subtaskParams: { text: string; status: TaskStatus }) => {
		const viewedTask = this.getViewedTask();

		this.addSubtaskUseCase.run(subtaskParams, viewedTask.id);
		this.afterRun();
	};
}
