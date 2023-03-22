import { createContext, useContext } from 'react';
import { GetTask } from '../../ui-getter/get-task';

const GetTaskContext = createContext<GetTask | undefined>(undefined);

export function useGetTask() {
	const getTask = useContext(GetTaskContext);

	if (getTask === undefined) {
		throw new Error('useGetTask must be used within a GetTaskProvider');
	}

	return getTask;
}

export const GetTaskProvider = GetTaskContext.Provider;
