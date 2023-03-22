import { TaskContext } from '../entity/context';
import { TaskUIModel } from '../ui-model/task';

export function createGetTask(taskContext: TaskContext) {
	return function getTask(id: string) {
		return new TaskUIModel(taskContext.get(id));
	};
}

export type GetTask = ReturnType<typeof createGetTask>;
