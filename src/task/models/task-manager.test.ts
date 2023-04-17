import { beforeEach, describe, expect, it } from 'vitest';
import { TaskManager } from './task-manager';

describe('Task Manager', () => {
	let taskManager: TaskManager;

	beforeEach(() => {
		taskManager = new TaskManager();
	});

	it('creates task', () => {
		expect(taskManager.tasks).toHaveLength(0);
		const createdTask = taskManager.createTask('Test task');
		expect(taskManager.tasks).toHaveLength(1);
		expect(createdTask).toBe(taskManager.tasks[0]);
		expect(taskManager.tasks[0].text).toBe('Test task');
	});
});
