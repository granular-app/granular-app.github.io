import { beforeEach, describe, expect, it } from 'vitest';
import { TaskManager } from './task-manager';

describe('Task', () => {
	let taskManager: TaskManager;

	beforeEach(() => {
		taskManager = new TaskManager();
	});

	it('creates a new subtask', () => {
		const goToShopTask = taskManager.createTask('Go to shop');
		expect(goToShopTask.subtasks).toHaveLength(0);
		const buyMilkTask = goToShopTask.createSubtask('Buy milk');
		expect(goToShopTask.subtasks).toHaveLength(1);
		expect(buyMilkTask).toBe(goToShopTask.subtasks[0]);
	});
});
