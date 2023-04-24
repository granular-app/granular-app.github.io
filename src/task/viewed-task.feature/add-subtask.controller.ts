import { AddSubtaskUseCase } from '../add-subtask.feature/add-subtask.use-case';
import { TaskStatus } from '../core/task-status';
import { ViewedTaskUIModel } from './viewed-task.presenter';

export class AddViewedTaskSubtaskController {
	constructor(
		private addSubtaskUseCase: AddSubtaskUseCase,
		private getViewedTask: () => ViewedTaskUIModel,
		private afterRun: () => void,
	) {}

	run = (subtaskParams: { text: string; status: TaskStatus }) => {
		const viewedTask = this.getViewedTask();

		this.addSubtaskUseCase.run(subtaskParams, viewedTask.id);
		this.afterRun();
	};
}
