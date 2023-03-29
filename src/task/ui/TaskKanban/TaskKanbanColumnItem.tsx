import classNames from 'classnames';
import { ElementType } from 'react';
import { Draggable } from '../../../ui/drag-and-drop/Draggable';
import { TaskUIModel } from '../../ui-model/task';
import { useTaskRouter } from '../hooks/use-task-router';

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

	return (
		<Element
			className={classNames(
				'mb-2 flex items-center rounded bg-white py-1 px-4',
				props.task.usesDynamicStatus && 'border-l-4 border-cyan-400',
				props.extraClassName,
			)}
		>
			<button
				onClick={() => taskRouter.push(props.task.id)}
				className="flex-grow text-left font-semibold text-blue-600 hover:underline"
			>
				{props.task.text}
			</button>
		</Element>
	);
}
