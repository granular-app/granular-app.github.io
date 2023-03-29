import { useCurrentTask } from './hooks/use-current-task';
import { useCurrentTaskController } from './hooks/use-task-controller';

export function AddParentsView() {
	const currentTask = useCurrentTask();
	const currentTaskController = useCurrentTaskController();
	const candidates = currentTask.findParentCandidates();

	if (candidates.length === 0) return <></>;

	const addParentButtons = candidates.map((candidate) => (
		<button
			key={candidate.id}
			onClick={() => currentTaskController.addParent(candidate.id)}
			className="ml-2 rounded bg-blue-600 py-1 px-3 text-xs text-white shadow-md hover:bg-blue-700"
		>
			{candidate.text}
		</button>
	));

	return (
		<div>
			<p className="mb-1 font-semibold">Add this task to:</p>
			<div className="space-x-2">{addParentButtons}</div>
		</div>
	);
}
