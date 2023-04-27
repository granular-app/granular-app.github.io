import { beforeEach, describe, expect, test } from 'vitest';
import { TaskManager } from './core/task-manager';
import { TasksRepositoryImpl } from './tasks-repository';

// Mock localStorage
let localStorageMock: Record<string, string> = {};

beforeEach(() => {
	localStorageMock = {};
});

Object.defineProperty(global, 'localStorage', {
	value: {
		getItem: (key: string): string | null => {
			return localStorageMock[key] || null;
		},
		setItem: (key: string, value: string) => {
			localStorageMock[key] = value;
		},
	},
});

describe('TasksRepositoryImpl', () => {
	test('save and load tasks with subtasks', () => {
		const taskManager = new TaskManager();
		const tasksRepository = new TasksRepositoryImpl(taskManager);

		// Create tasks and subtasks
		const task1 = taskManager.createTask('Task 1');
		const task2 = taskManager.createTask('Task 2');
		const subtask1 = task1.createSubtask('Subtask 1');

		// Save tasks to the repository
		tasksRepository.save();

		// Load tasks from the repository
		tasksRepository.load();

		// Verify loaded tasks
		expect(taskManager.allTasks.length).toEqual(3);

		const loadedTask1 = taskManager.allTasks.find(
			(task) => task.id === task1.id,
		);
		const loadedTask2 = taskManager.allTasks.find(
			(task) => task.id === task2.id,
		);
		const loadedSubtask1 = taskManager.allTasks.find(
			(task) => task.id === subtask1.id,
		);

		expect(loadedTask1?.text).toEqual('Task 1');
		expect(loadedTask2?.text).toEqual('Task 2');
		expect(loadedSubtask1?.text).toEqual('Subtask 1');

		// Verify subtask relationships
		expect(loadedTask1?.subtasks.length).toEqual(1);
		expect(loadedTask1?.subtasks[0]?.id).toEqual(subtask1.id);
	});
});
