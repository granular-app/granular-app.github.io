import { Task } from '../core/task';

export interface TasksRepository {
	save(): void;
	load(): Task[];
}
