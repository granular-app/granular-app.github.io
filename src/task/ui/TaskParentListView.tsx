import { Task } from '../entity/task';
import { taskRouter } from '../ui-state/task-router';

export function TaskParentListView() {
	const { task } = taskRouter;

	if (task.isChildOfRoot) return <></>;

	const listItems = task.parents.map((parent) => (
		<TaskParentListViewItem key={parent.base.id} parent={parent} />
	));

	return <ul className="list-disc pl-5">{listItems}</ul>;
}
function TaskParentListViewItem({ parent }: { parent: Task }) {
	const { task } = taskRouter;
	const removeParentButton = (
		<button
			onClick={() => task.base.removeParent(parent.base.id)}
			className="text-red-600 hover:text-red-800 focus:outline-none"
		>
			Remove parent
		</button>
	);

	return (
		<li className="mb-1">
			<button
				onClick={() => taskRouter.viewTask(parent.base.id)}
				className="mr-3 text-blue-600 hover:text-blue-800 focus:outline-none"
			>
				{parent.base.text}
			</button>
			{removeParentButton}
		</li>
	);
}
