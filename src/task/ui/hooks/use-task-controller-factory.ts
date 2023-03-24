import { createContext, useContext } from 'react';
import { TaskControllerFactory } from '../../ui-controller/task-controller';

const TaskControllerFactoryContext = createContext<
	TaskControllerFactory | undefined
>(undefined);

export function useTaskControllerFactory() {
	const factory = useContext(TaskControllerFactoryContext);

	if (factory === undefined) {
		throw new Error(
			'useTaskControllerFactory must be used within a TaskControllerFactoryProvider',
		);
	}

	return factory;
}

export const TaskControllerFactoryProvider =
	TaskControllerFactoryContext.Provider;
