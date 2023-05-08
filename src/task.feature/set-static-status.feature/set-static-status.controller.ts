import { SetStaticStatusUseCase } from './set-static-status.use-case';

export class SetStaticStatusController {
	constructor(
		private setStaticStatusUseCase: SetStaticStatusUseCase,
		private afterSetStaticStatus: () => void,
	) {}

	run: SetStaticStatusUseCase['run'] = (taskID, newStaticStatus) => {
		this.setStaticStatusUseCase.run(taskID, newStaticStatus);
		this.afterSetStaticStatus();
	};
}
