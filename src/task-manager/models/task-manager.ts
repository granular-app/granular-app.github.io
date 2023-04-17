type Task = {
	text: string;
};

export class TaskManager {
	tasks: Task[] = [];

	createTask(text: string) {
		const task: Task = { text };
		this.tasks.push(task);
		return task;
	}
}
