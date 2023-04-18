import { TaskManager } from './core/task-manager';
import { TaskStatus } from './core/task-status';

export const taskManager = new TaskManager();
taskManager.createTask('Test task 1');
const testTask2 = taskManager.createTask('Test task 2');
testTask2.staticStatus = TaskStatus.Completed;
