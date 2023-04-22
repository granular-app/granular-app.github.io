import { useAdapters } from 'src/ui/adapaters';

export function useMainBoard() {
	const { mainBoardState } = useAdapters();

	return mainBoardState.value
		.ifNothing(() => {
			throw new Error(
				'Main board UI model is absent. Please, call ViewMainBoardUseCase before using this hook.',
			);
		})
		.extract()!;
}
