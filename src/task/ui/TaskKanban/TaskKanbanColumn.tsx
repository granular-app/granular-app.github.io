import { useDroppable } from '@dnd-kit/core';
import { useSignal } from '@preact/signals-react';
import classNames from 'classnames';
import { TaskStatus } from '../../entity/status';
import { TaskUIModel } from '../../ui-model/task';
import { useCurrentTaskController } from '../hooks/use-task-controller';
import { TaskForm } from '../TaskForm';
import { TaskKanbanColumnItem } from './TaskKanbanColumnItem';

export function TaskKanbanColumn({
	status,
	tasks,
}: {
	status: TaskStatus;
	tasks: TaskUIModel[];
}) {
	const droppable = useDroppable({
		id: status,
	});

	return (
		<section
			ref={droppable.setNodeRef}
			className={classNames('rounded bg-zinc-100 p-2', {
				'ring-2 ring-zinc-500': droppable.isOver,
			})}
		>
			<h3 className="mb-4 pl-2 text-lg font-semibold">{status}</h3>
			<ul>
				{tasks.map((task) => (
					<TaskKanbanColumnItem key={task.id} task={task} element="li" />
				))}
			</ul>
			<AddChildTaskForm status={status} />
		</section>
	);
}

function AddChildTaskForm({ status }: { status: TaskStatus }) {
	const taskController = useCurrentTaskController();
	const showForm = useSignal(false);

	if (!showForm.value) {
		return (
			<button
				className="flex w-full justify-between rounded py-1 px-4 text-left text-zinc-700 hover:bg-zinc-50"
				onClick={() => (showForm.value = !showForm.value)}
			>
				<span>Add task</span>
				<i className="ri-add-line"></i>
			</button>
		);
	}

	return (
		<TaskForm
			submitLabel="Add task"
			onSubmit={addChildTask}
			onClose={() => (showForm.value = false)}
		/>
	);

	function addChildTask(text: string) {
		taskController.addChildTask({ text, status });
	}
}