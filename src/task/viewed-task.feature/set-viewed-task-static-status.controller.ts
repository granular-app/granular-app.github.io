import { Signal } from '@preact/signals-react';
import { Maybe } from 'purify-ts';
import { TaskStatus } from '../core/task-status';
import {
	AfterSetStaticStatusObserver,
	SetStaticStatusController,
} from '../set-static-status.feature/set-static-status.controller';
import { SetStaticStatusUseCase } from '../set-static-status.feature/set-static-status.use-case';
import { RefreshViewedTaskController } from './refresh-viewed-task.controller';
import { ViewedTaskUIModel } from './viewed-task.presenter';

export class SetViewedTaskStaticStatusController {
	constructor(
		setStaticStatusUseCase: SetStaticStatusUseCase,
		private viewedTaskState: Signal<Maybe<ViewedTaskUIModel>>,
		refreshViewedTaskController: RefreshViewedTaskController,
	) {
		this.setStaticStatusController = new SetStaticStatusController(
			setStaticStatusUseCase,
			new AfterSetViewedTaskStaticStatusObserver(refreshViewedTaskController),
		);
	}

	private setStaticStatusController: SetStaticStatusController;

	run = (newStaticStatus: TaskStatus) => {
		const viewedTask = this.viewedTaskState.value
			.ifNothing(() => {
				throw new Error('Must have a viewed task to run this controller.');
			})
			.extract()!;

		this.setStaticStatusController.run(viewedTask.id, newStaticStatus);
	};
}

export class AfterSetViewedTaskStaticStatusObserver
	implements AfterSetStaticStatusObserver
{
	constructor(
		private refreshViewedTaskController: RefreshViewedTaskController,
	) {}

	afterSetStaticStatus(): void {
		this.refreshViewedTaskController.run();
	}
}
