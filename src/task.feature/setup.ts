import { TaskManager } from './core/task-manager';
import { TasksRepositoryImpl } from './tasks-repository';

export const taskManager = new TaskManager();
export const tasksRepository = new TasksRepositoryImpl(taskManager);

tasksRepository.load();
