import { Task } from './task.entity';

export class Subtasks {
	private orderedSubtaskIDs: string[];

	constructor(private subtasks: Task[] = []) {
		this.orderedSubtaskIDs = subtasks.map(({ id }) => id);
	}

	addSubtask(newSubtask: Task, position?: number): void {
		this.subtasks.push(newSubtask);
		if (position !== undefined) {
			this.orderedSubtaskIDs.splice(position, 0, newSubtask.id);
		} else {
			this.orderedSubtaskIDs.push(newSubtask.id);
		}
	}

	removeSubtask(subtaskID: string): void {
		const index = this.subtasks.findIndex((t) => t.id === subtaskID);
		if (index > -1) {
			this.subtasks.splice(index, 1);
			const orderIndex = this.orderedSubtaskIDs.indexOf(subtaskID);
			this.orderedSubtaskIDs.splice(orderIndex, 1);
		}
	}

	changeSubtaskOrder(subtaskID: string, newPosition: number): void {
		const oldPosition = this.orderedSubtaskIDs.indexOf(subtaskID);
		if (oldPosition > -1) {
			this.orderedSubtaskIDs.splice(oldPosition, 1);
			this.orderedSubtaskIDs.splice(newPosition, 0, subtaskID);
		}
	}

	get(): Task[] {
		const taskMap: Map<string, Task> = new Map(
			this.subtasks.map((t) => [t.id, t]),
		);
		return this.orderedSubtaskIDs
			.map((id) => taskMap.get(id))
			.filter((task) => task !== undefined) as Task[];
	}

	deepSet(): Set<Task> {
		return new Set(
			this.subtasks.flatMap((subtask) => {
				return [subtask, ...subtask.subtasks.deepSet()];
			}),
		);
	}

	deepList() {
		return [...this.deepSet()];
	}
}
