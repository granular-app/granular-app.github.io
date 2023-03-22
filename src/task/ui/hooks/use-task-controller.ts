import { createContext, useContext } from 'react';
import { TaskControllerFactory } from '../../ui-controller/task-controller';
import { useTaskRouter } from './use-task-router';

const TaskControllerFactoryContext = createContext<
	TaskControllerFactory | undefined
>(undefined);

export function useTaskController(id: string) {
	const factory = useContext(TaskControllerFactoryContext);

	if (factory === undefined) {
		throw new Error(
			'useTaskController must be used within a TaskControllerFactoryProvider',
		);
	}

	return factory.create(id);
}

export function useCurrentTaskController() {
	const { taskId } = useTaskRouter();

	return useTaskController(taskId);
}

export const TaskControllerFactoryProvider =
	TaskControllerFactoryContext.Provider;
