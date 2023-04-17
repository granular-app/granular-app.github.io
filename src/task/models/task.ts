export class Task {
	constructor(public text: string) {}

	subtasks: Task[] = [];

	createSubtask(text: string) {
		const newSubtask = new Task(text);
		this.subtasks.push(newSubtask);
		return newSubtask;
	}
}
