import { Signal } from '@preact/signals-react';
import { Maybe } from 'purify-ts';
import {
	AfterDeleteTaskObserver,
	DeleteTaskController,
} from '../delete-task.feature/delete-task.controller';
import { DeleteTaskUseCase } from '../delete-task.feature/delete-task.use-case';
import { ViewedTaskUIModel } from './viewed-task.presenter';

export class DeleteViewedTaskController {
	constructor(
		deleteTaskUseCase: DeleteTaskUseCase,
		private viewedTaskState: Signal<Maybe<ViewedTaskUIModel>>,
		navigateToMainBoard: () => void,
	) {
		this.deleteTaskController = new DeleteTaskController(
			deleteTaskUseCase,
			new AfterDeleteViewedTaskObserver(navigateToMainBoard),
		);
	}

	private deleteTaskController: DeleteTaskController;

	run = () => {
		const viewedTask = this.viewedTaskState.value
			.ifNothing(() => {
				throw new Error('Must have a viewed task to run this controller.');
			})
			.extract()!;

		this.deleteTaskController.run(viewedTask.id);
	};
}

export class AfterDeleteViewedTaskObserver implements AfterDeleteTaskObserver {
	constructor(private navigateToMainBoard: () => void) {}

	afterDelete(): void {
		this.navigateToMainBoard();
	}
}
