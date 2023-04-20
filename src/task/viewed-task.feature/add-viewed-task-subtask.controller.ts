import { Signal } from '@preact/signals-react';
import { Maybe } from 'purify-ts';
import { AddTaskUseCase } from '../add-task.feature/add-task.use-case';
import { TaskStatus } from '../core/task-status';
import { ViewTaskController } from './view-task.controller';
import { ViewedTaskUIModel } from './viewed-task.presenter';

export class AddViewedTaskSubtaskController {
	constructor(
		private addTaskUseCase: AddTaskUseCase,
		private viewedTaskState: Signal<Maybe<ViewedTaskUIModel>>,
		private viewTaskController: ViewTaskController,
	) {}

	run = (text: string, options: { status: TaskStatus }) => {
		const viewedTask = this.viewedTaskState.value
			.ifNothing(() => {
				throw new Error('Must have a viewed task to run this controller.');
			})
			.extract()!;

		this.addTaskUseCase.run(text, {
			status: options.status,
			parentTaskIDs: [viewedTask.id],
		});
		this.viewTaskController.run(viewedTask.id);
	};
}
