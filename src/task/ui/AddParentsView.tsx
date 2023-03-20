import { taskRouter } from '../ui-state/task-router';

export function AddParentsView() {
	const { task } = taskRouter;
	const candidates = task.findParentCandidates();

	if (candidates.length === 0) return <></>;

	const addParentButtons = candidates.map((candidate) => (
		<button
			key={candidate.base.id}
			onClick={() => task.base.addParent(candidate.base.id)}
			className="ml-2 rounded bg-blue-600 py-1 px-3 text-xs text-white shadow-md hover:bg-blue-700"
		>
			{candidate.base.text}
		</button>
	));

	return (
		<div>
			<p className="mb-1 font-semibold">Add this task to:</p>
			<div className="space-x-2">{addParentButtons}</div>
		</div>
	);
}
