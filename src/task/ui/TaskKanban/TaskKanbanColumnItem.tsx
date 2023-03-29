import { useSignal } from '@preact/signals-react';
import classNames from 'classnames';
import { ElementType } from 'react';
import { Draggable } from '../../../ui/drag-and-drop/Draggable';
import { TaskUIModel } from '../../ui-model/task';
import { useTaskRouter } from '../hooks/use-task-router';
import { EditTaskForm } from '../TaskForm';

export function TaskKanbanColumnItem(props: {
	task: TaskUIModel;
	extraClassName?: string;
	element?: ElementType;
}) {
	return props.task.usesDynamicStatus ? (
		<TaskKanbanColumnItemPresentation
			task={props.task}
			element={props.element}
		/>
	) : (
		<Draggable id={props.task.id} element={props.element}>
			<TaskKanbanColumnItemPresentation task={props.task} />
		</Draggable>
	);
}

export function TaskKanbanColumnItemPresentation(props: {
	task: TaskUIModel;
	extraClassName?: string;
	element?: ElementType;
}) {
	const Element = props.element ?? 'div';
	const taskRouter = useTaskRouter();
	const renameModeEnabled = useSignal(false);

	if (renameModeEnabled.value) {
		return (
			<EditTaskForm
				task={props.task}
				onCloseForm={() => (renameModeEnabled.value = false)}
			/>
		);
	}

	return (
		<Element
			className={classNames(
				'group relative mb-2 rounded border-l-4 bg-white',
				props.task.usesDynamicStatus && 'border-cyan-400',
				props.extraClassName,
			)}
		>
			<button
				onClick={() => taskRouter.push(props.task.id)}
				className="w-full rounded-r py-1 px-4 text-left hover:bg-zinc-200"
			>
				{props.task.text}
			</button>
			<button
				className="absolute top-0.5 right-0.5 hidden rounded bg-white p-1 leading-none text-zinc-500 hover:bg-zinc-200 group-focus-within:block group-hover:block"
				onClick={() => (renameModeEnabled.value = true)}
			>
				<i className="ri-pencil-line"></i>
			</button>
		</Element>
	);
}
