import { useAdapters } from 'src/ui/adapaters';

export function useMainBoard() {
	const { forceGetMainBoard } = useAdapters();

	return forceGetMainBoard();
}
