import { Signal } from '@preact/signals-react';
import { Maybe } from 'purify-ts';
import { ViewTaskController } from './view-task.controller';
import { ViewedTaskUIModel } from './viewed-task.presenter';

export class RefreshViewedTaskController {
	constructor(
		private viewedTaskState: Signal<Maybe<ViewedTaskUIModel>>,
		private viewTaskController: ViewTaskController,
	) {}

	run = () => {
		const viewedTask = this.viewedTaskState.value
			.ifNothing(() => {
				throw new Error('Must have a viewed task to run this controller.');
			})
			.extract()!;

		this.viewTaskController.run(viewedTask.id);
	};
}
