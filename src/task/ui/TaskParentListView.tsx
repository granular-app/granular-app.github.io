import { Task } from '../entity/task';
import { useTaskRouter } from './hooks/use-task-router';

export function TaskParentListView() {
	const { currentTask } = useTaskRouter();

	if (currentTask.isChildOfRoot) return <></>;

	const listItems = currentTask.parents.map((parent) => (
		<TaskParentListViewItem key={parent.base.id} parent={parent} />
	));

	return <ul className="list-disc pl-5">{listItems}</ul>;
}
function TaskParentListViewItem({ parent }: { parent: Task }) {
	const taskRouter = useTaskRouter();
	const { currentTask } = taskRouter;

	const removeParentButton = (
		<button
			onClick={() => currentTask.base.removeParent(parent.base.id)}
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
