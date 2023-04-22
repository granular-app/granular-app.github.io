import { useAdapters } from '../../../ui/adapaters';

export function useViewedTask() {
	const { viewedTaskState } = useAdapters();

	return viewedTaskState.value
		.ifNothing(() => {
			throw new Error('Task not found.');
		})
		.extract()!;
}
