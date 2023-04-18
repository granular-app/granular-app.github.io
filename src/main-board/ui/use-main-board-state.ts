import { useUIDependencies } from '../../ui/ui-dependencies';

export function useMainBoardState() {
	const { mainBoardState } = useUIDependencies();

	return mainBoardState.value
		.ifNothing(() => {
			throw new Error(
				'Main board UI model is absent. Please, call ViewMainBoardUseCase before using this hook.',
			);
		})
		.extract()!;
}
