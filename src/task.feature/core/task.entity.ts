import { nanoid } from 'nanoid';
import { Maybe } from 'purify-ts';
import { Subtasks } from './subtasks.entity';
import { TaskManager } from './task-manager.entity';
import { deriveTaskStatus, TaskStatus } from './task-status.entity';

export class Task {
	constructor(
		public readonly id: string,
		public text: string,
		public taskManager: TaskManager,
		public subtasks: Subtasks,
	) {}

	static generateID = nanoid;

	userPrefersAsMainBoardTask: boolean = false;
	get isMainBoardTask() {
		return this.userPrefersAsMainBoardTask || !this.hasParentTasks;
	}

	get hasSubtasks() {
		return this.subtasks.get().length > 0;
	}

	createSubtask(text: string) {
		const newSubtask = this.taskManager.createTask(text);
		this.subtasks.addSubtask(newSubtask);
		return newSubtask;
	}

	staticStatus: TaskStatus = TaskStatus.ToDo;

	get status(): TaskStatus {
		return this.derivedStatus.orDefault(this.staticStatus);
	}

	get derivedStatus(): Maybe<TaskStatus> {
		return deriveTaskStatus(
			this.subtasks.get().map((subtask) => subtask.status),
		);
	}

	get parentTasks(): Task[] {
		return this.taskManager.allTasks.filter((task) =>
			task.subtasks.get().includes(this),
		);
	}

	get hasParentTasks() {
		return this.parentTasks.length > 0;
	}

	findParentTaskCandidates(): Task[] {
		const deepSubtasks = this.subtasks.deepList();
		const isValidParentCandidate = (other: Task): boolean => {
			const isThisTask = other === this;
			const isAlreadyParent = this.parentTasks.includes(other);
			const isSubtask = deepSubtasks.includes(other);

			return (
				!isThisTask && !isAlreadyParent && !isSubtask && other.hasUniqueText
				// I will figure out a way to present candidates with identical text in a distinguishable manner later (if ever)
			);
		};

		return this.taskManager.allTasks.filter(isValidParentCandidate);
	}

	get hasUniqueText() {
		return (
			this.taskManager.allTasks.filter((task) => task.text === this.text)
				.length === 1
		);
	}

	delete() {
		this.subtasks
			.get()
			.filter((subtask) => subtask.parentTasks.length === 1)
			.forEach((subtask) => subtask.delete());

		const index = this.taskManager.indexOf(this.id);
		this.taskManager.allTasks.splice(index, 1);
		this.parentTasks.forEach((parentTask) =>
			parentTask.subtasks.removeSubtask(this.id),
		);
	}
}
