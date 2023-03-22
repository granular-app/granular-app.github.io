import { TaskUIModel } from '../ui-model/task';
import { useGetTask } from './hooks/use-task-getter';
import { useTaskRouter } from './hooks/use-task-router';

export function Breadcrumbs() {
	const getTask = useGetTask();
	const taskRouter = useTaskRouter();
	const { path } = taskRouter;
	const pathWithoutTip = path.slice(0, -1);
	const breadcrumbTasks = pathWithoutTip.map(getTask);

	return (
		<div className="text-sm">
			{breadcrumbTasks.map((task, depth) => (
				<Breadcrumb key={task.id} depth={depth} task={task} />
			))}
		</div>
	);
}
function Breadcrumb({ task, depth }: { task: TaskUIModel; depth: number }) {
	const taskRouter = useTaskRouter();
	const delimiter = '/';

	return (
		<div className="inline">
			<button
				onClick={() => taskRouter.setDepth(depth)}
				className="text-blue-600 hover:text-blue-800 focus:outline-none"
			>
				{task.text}
			</button>
			<span className="mx-2 text-zinc-400">{delimiter}</span>
		</div>
	);
}
