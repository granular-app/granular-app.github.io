import { TaskStatus } from '../entity/status';
import { Task } from '../entity/task';
import { taskRouter } from '../ui-state/task-router';
import { TaskForm } from './TaskForm';

export function TaskColumn({
	status,
	tasks,
}: {
	status: TaskStatus;
	tasks: Task[];
}) {
	const heading = <h3 className="mb-4 pl-2 text-lg font-semibold">{status}</h3>;
	const taskList = (
		<ul>
			{tasks.map((task) => (
				<TaskColumnItem key={task.base.id} task={task} />
			))}
		</ul>
	);

	return (
		<section className="rounded bg-zinc-100 p-2">
			{heading}
			{taskList}
			<TaskForm status={status} />
		</section>
	);
}
function TaskColumnItem({ task }: { task: Task }) {
	return (
		<li className="mb-2 rounded bg-white py-1 px-4">
			<button
				onClick={() => taskRouter.push(task.base.id)}
				className="font-semibold text-blue-600 hover:underline"
			>
				{task.base.text}
			</button>
		</li>
	);
}
