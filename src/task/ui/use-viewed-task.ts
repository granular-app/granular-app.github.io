import { useUIDependencies } from '../../ui/ui-dependencies';

export function useViewedTask() {
	const { viewedTaskState } = useUIDependencies();

	return viewedTaskState.value
		.ifNothing(() => {
			throw new Error('Task not found.');
		})
		.extract()!;
}
