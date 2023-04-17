import { beforeEach, describe, expect, it } from 'vitest';
import { TaskManager } from './task-manager';
import { TaskStatus } from './task-status';

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

	it('has a default status of to-do', () => {
		const goToShopTask = taskManager.createTask('Go to shop');
		expect(goToShopTask.status).toBe(TaskStatus.ToDo);
	});

	it('has a specified status', () => {
		const goToShopTask = taskManager.createTask('Go to shop', {
			status: TaskStatus.InProgress,
		});
		expect(goToShopTask.status).toBe(TaskStatus.InProgress);
	});

	it('derives status from subtasks', () => {
		const goToShopTask = taskManager.createTask('Go to shop');
		const buyMilkTask = goToShopTask.createSubtask('Buy milk', {
			status: TaskStatus.InProgress,
		});
		expect(goToShopTask.status).toBe(TaskStatus.InProgress);
		buyMilkTask.staticStatus = TaskStatus.Completed;
		expect(goToShopTask.status).toBe(TaskStatus.Completed);
	});
});
