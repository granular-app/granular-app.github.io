import { Signal } from '@preact/signals-react';
import { Maybe } from 'purify-ts';
import {
	AfterEditTaskObserver,
	EditTaskController,
} from '../edit-task.feature/edit-task.controller';
import { EditTaskUseCase } from '../edit-task.feature/edit-task.use-case';
import { RefreshViewedTaskController } from './refresh-viewed-task.controller';
import { ViewedTaskUIModel } from './viewed-task.presenter';

export class EditViewedTaskController {
	constructor(
		editTaskUseCase: EditTaskUseCase,
		private viewedTaskState: Signal<Maybe<ViewedTaskUIModel>>,
		afterEditViewedTaskObserver: AfterEditViewedTaskObserver,
	) {
		this.editTaskController = new EditTaskController(
			editTaskUseCase,
			afterEditViewedTaskObserver,
		);
	}

	private editTaskController: EditTaskController;

	run = (newText: string) => {
		const viewedTask = this.viewedTaskState.value
			.ifNothing(() => {
				throw new Error('Must have a viewed task to run this controller.');
			})
			.extract()!;

		this.editTaskController.run(viewedTask.id, newText);
	};
}

export class AfterEditViewedTaskObserver implements AfterEditTaskObserver {
	constructor(
		private refreshViewedTaskController: RefreshViewedTaskController,
	) {}

	afterEdit() {
		this.refreshViewedTaskController.run();
	}
}
