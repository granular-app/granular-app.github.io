import { useMemo } from 'react';
import { TaskUIModel } from '../../ui-model/task';
import { useTaskRouter } from './use-task-router';

export function useCurrentTask() {
	const { currentTask } = useTaskRouter();

	return useMemo(() => new TaskUIModel(currentTask), [currentTask]);
}
