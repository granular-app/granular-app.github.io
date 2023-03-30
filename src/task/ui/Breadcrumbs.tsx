import classNames from 'classnames';
import { TaskUIModel } from '../ui-model/task';
import { useGetTask } from './hooks/use-task-getter';
import { useTaskRouter } from './hooks/use-task-router';

export function Breadcrumbs() {
	const getTask = useGetTask();
	const taskRouter = useTaskRouter();
	const { path } = taskRouter;
	const breadcrumbTasks = path.map(getTask);

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
	const isCurrentTask = task.id === taskRouter.taskId;
	const delimiter = '/';

	return (
		<div className="inline">
			{depth > 0 && <span className="mx-2 text-zinc-400">{delimiter}</span>}
			<button
				onClick={() => taskRouter.setDepth(depth)}
				className={classNames(
					!isCurrentTask && 'text-blue-600 hover:text-blue-800',
				)}
				disabled={isCurrentTask}
			>
				{task.text}
			</button>
		</div>
	);
}
