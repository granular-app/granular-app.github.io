import { useAdapters } from '../../../ui/adapaters';

export function useViewedTask() {
	const { forceGetViewedTask } = useAdapters();

	return forceGetViewedTask();
}
