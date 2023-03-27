import { shift, useFloating } from '@floating-ui/react';
import { Listbox } from '@headlessui/react';
import classNames from 'classnames';
import { Fragment } from 'react';
import { taskStatuses } from '../entity/status';
import { TaskUIModel } from '../ui-model/task';
import { DynamicStatusToggle } from './DynamicStatusToggle';
import { useTaskController } from './hooks/use-task-controller';

export function TaskActions({ task }: { task: TaskUIModel }) {
	if (task.isRoot) return <></>;

	return (
		<div className="ml-3 inline-flex">
			<StatusPicker task={task} />
			<DeleteTaskButton task={task} />
		</div>
	);
}

function StatusPicker({ task }: { task: TaskUIModel }) {
	return (
		<div className="flex">
			<StatusPickerListbox task={task} />
			<StatusPickerDynamicStatusToggle task={task} />
		</div>
	);
}

function StatusPickerListbox({ task }: { task: TaskUIModel }) {
	const selectData = useFloating({
		placement: 'bottom-end',
		middleware: [shift()],
	});
	const refs = selectData.refs;
	const taskController = useTaskController(task.id);

	return (
		<Listbox
			value={task.status}
			onChange={(newStatus) => taskController.setStaticStatus(newStatus)}
			disabled={task.usesDynamicStatus}
		>
			<Listbox.Button
				ref={refs.setReference}
				className={classNames(
					'rounded border px-3 py-1',
					task.usesDynamicStatus && 'border-cyan-300 bg-cyan-50 text-cyan-700',
				)}
			>
				{task.status}
			</Listbox.Button>

			<Listbox.Options
				ref={refs.setFloating}
				style={{
					position: selectData.strategy,
					top: selectData.y ?? 0,
					left: selectData.x ?? 0,
				}}
				className="w-max rounded bg-white shadow"
			>
				{taskStatuses.map((status) => (
					<Listbox.Option key={status} value={status} as={Fragment}>
						{({ active, selected }) => (
							<li
								className={classNames(
									'cursor-pointer px-3 py-1',
									active && 'bg-blue-50',
									selected && 'font-bold',
								)}
							>
								{status}
							</li>
						)}
					</Listbox.Option>
				))}
			</Listbox.Options>
		</Listbox>
	);
}

function StatusPickerDynamicStatusToggle({ task }: { task: TaskUIModel }) {
	return (
		<div
			className={classNames(
				'flex items-center before:contents before:h-px before:w-2',
				task.usesDynamicStatus ? 'before:bg-cyan-300' : 'before:bg-zinc-300',
			)}
		>
			<DynamicStatusToggle task={task} />
		</div>
	);
}

function DeleteTaskButton({ task }: { task: TaskUIModel }) {
	const taskController = useTaskController(task.id);

	return (
		<button
			onClick={() => taskController.deleteTask()}
			className="ml-2 text-xs text-red-500"
		>
			<i className="ri-delete-bin-line"></i>
		</button>
	);
}
