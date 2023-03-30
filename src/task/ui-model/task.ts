import { LocalizableLabel } from '../../localization/entity/localizable-label';
import { say } from '../../localization/ui-localization/localization';
import { TaskStatus, taskStatuses } from '../entity/status';
import { Task } from '../entity/task';

export class TaskUIModel {
	constructor(task: Task) {
		this.task = task;
	}

	private task: Task;

	get id() {
		return this.task.base.id;
	}
	get text() {
		if (this.isRoot) return say(this.task.base.text as LocalizableLabel);
		return this.task.base.text;
	}
	get status() {
		return this.task.status;
	}
	get hasDynamicStatus() {
		return this.task.hasDynamicStatus;
	}
	get usesDynamicStatus() {
		return this.task.usesDynamicStatus;
	}
	get parents() {
		return this.task.parents.map((parent) => new TaskUIModel(parent));
	}
	get children() {
		return this.task.children.map((child) => new TaskUIModel(child));
	}
	get isRoot() {
		return this.task.isRoot;
	}
	get isChildOfRoot() {
		return this.task.isChildOfRoot;
	}

	findParentCandidates() {
		return this.task
			.findParentCandidates()
			.map((candidate) => new TaskUIModel(candidate));
	}
}

export class TaskUIModelArray {
	constructor(array: TaskUIModel[]) {
		this.array = array;
	}

	array: TaskUIModel[];

	splitByStatus(): [TaskStatus, TaskUIModel[]][] {
		const result: [TaskStatus, TaskUIModel[]][] = [];

		taskStatuses.forEach((nextStatus) => {
			const tasksWithStatus = this.array.filter(
				({ status }) => status === nextStatus,
			);

			result.push([nextStatus, tasksWithStatus]);
		});

		return result;
	}
}
