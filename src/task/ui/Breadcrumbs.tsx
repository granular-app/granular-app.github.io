import { taskContext } from '../entity/context';
import { Task } from '../entity/task';
import { taskRouter } from '../ui-state/task-router';

export function Breadcrumbs() {
	const { path } = taskRouter;
	const tasks = path.slice(0, -1).map((id) => taskContext.get(id));

	return (
		<div className="text-sm">
			{tasks.map((task, depth) => (
				<Breadcrumb key={task.base.id} depth={depth} task={task} />
			))}
		</div>
	);
}
function Breadcrumb({ task, depth }: { task: Task; depth: number }) {
	const delimiter = '/';

	return (
		<div className="inline">
			<button
				onClick={() => taskRouter.setDepth(depth)}
				className="text-blue-600 hover:text-blue-800 focus:outline-none"
			>
				{task.base.text}
			</button>
			<span className="mx-2 text-zinc-400">{delimiter}</span>
		</div>
	);
}
