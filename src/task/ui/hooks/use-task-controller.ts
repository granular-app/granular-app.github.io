import { useTaskControllerFactory } from './use-task-controller-factory';
import { useTaskRouter } from './use-task-router';

export function useTaskController(id: string) {
	const factory = useTaskControllerFactory();

	return factory.create(id);
}

export function useCurrentTaskController() {
	const { taskId } = useTaskRouter();

	return useTaskController(taskId);
}
