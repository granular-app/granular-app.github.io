import { TaskStatus } from '../entity/status';
import { TaskUIModel } from '../ui-model/task';
import { useTaskRouter } from './hooks/use-task-router';
import { TaskForm } from './TaskForm';

export function TaskColumn({
	status,
	tasks,
}: {
	status: TaskStatus;
	tasks: TaskUIModel[];
}) {
	const heading = <h3 className="mb-4 pl-2 text-lg font-semibold">{status}</h3>;
	const taskList = (
		<ul>
			{tasks.map((task) => (
				<TaskColumnItem key={task.id} task={task} />
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
function TaskColumnItem({ task }: { task: TaskUIModel }) {
	const taskRouter = useTaskRouter();

	return (
		<li className="mb-2 rounded bg-white py-1 px-4">
			<button
				onClick={() => taskRouter.push(task.id)}
				className="font-semibold text-blue-600 hover:underline"
			>
				{task.text}
			</button>
		</li>
	);
}
