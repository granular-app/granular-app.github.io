import { TaskUIModel } from '../ui-model/task';
import { useCurrentTask } from './hooks/use-current-task';
import { useCurrentTaskController } from './hooks/use-task-controller';
import { useTaskRouter } from './hooks/use-task-router';

export function TaskParentListView() {
	const currentTask = useCurrentTask();

	if (currentTask.isChildOfRoot) return <></>;

	const listItems = currentTask.parents.map((parent) => (
		<TaskParentListViewItem key={parent.id} parent={parent} />
	));

	return <ul className="list-disc pl-5">{listItems}</ul>;
}
function TaskParentListViewItem({ parent }: { parent: TaskUIModel }) {
	const taskRouter = useTaskRouter();
	const currentTaskController = useCurrentTaskController();

	const removeParentButton = (
		<button
			onClick={() => currentTaskController.removeParent(parent.id)}
			className="text-red-600 hover:text-red-800 focus:outline-none"
		>
			Remove parent
		</button>
	);

	return (
		<li className="mb-1">
			<button
				onClick={() => taskRouter.viewTask(parent.id)}
				className="mr-3 text-blue-600 hover:text-blue-800 focus:outline-none"
			>
				{parent.text}
			</button>
			{removeParentButton}
		</li>
	);
}
