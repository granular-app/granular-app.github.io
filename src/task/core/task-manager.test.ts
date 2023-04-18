import { beforeEach, describe, expect, it } from 'vitest';
import { TaskManager } from './task-manager';

describe('Task Manager', () => {
	let taskManager: TaskManager;

	beforeEach(() => {
		taskManager = new TaskManager();
	});

	it('creates task', () => {
		expect(taskManager.allTasks).toHaveLength(0);
		const createdTask = taskManager.createTask('Test task');
		expect(taskManager.allTasks).toHaveLength(1);
		expect(createdTask).toBe(taskManager.allTasks[0]);
		expect(taskManager.allTasks[0].text).toBe('Test task');
	});
});
