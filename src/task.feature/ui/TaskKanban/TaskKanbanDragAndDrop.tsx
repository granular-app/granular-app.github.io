import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { useComputed, useSignal } from '@preact/signals-react';
import { Just, Maybe, Nothing } from 'purify-ts';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { TaskStatus, taskStatuses } from '../../core/task-status';
import { SetStaticStatusController } from '../../set-static-status.feature/set-static-status.controller';
import {
	KanbanColumnsUIModel,
	KanbanTaskUIModel,
} from '../../ui-models/kanban-task';
import { TaskKanbanTile } from './TaskKanbanTile';

export function TaskKanbanDragAndDrop(props: {
	children: ReactNode;
	columns: KanbanColumnsUIModel;
	setStaticStatus: SetStaticStatusController['run'];
}) {
	const { handleDragStart, handleDragEnd, dndSensors, draggedTask } =
		useTaskDragAndDrop(props.columns, props.setStaticStatus);

	return (
		<DndContext
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			sensors={dndSensors}
		>
			{props.children}
			{createPortal(
				<DragOverlay>
					{draggedTask.value
						.map((task) => (
							<TaskKanbanTile
								task={task}
								extraClassName="shadow-lg"
								element="div"
								deleteTask={() => {}}
								editTask={() => {}}
							/>
						))
						.extract()}
				</DragOverlay>,
				document.body,
			)}
		</DndContext>
	);
}

function useTaskDragAndDrop(
	columns: KanbanColumnsUIModel,
	setStaticStatus: SetStaticStatusController['run'],
) {
	const subtasks = taskStatuses.flatMap((status) => columns[status]);
	const getTask = (id: string): KanbanTaskUIModel => {
		return subtasks.find((subtask) => subtask.id === id)!;
	};

	const draggedTaskID = useSignal<Maybe<string>>(Nothing);
	const draggedTask = useComputed(() => draggedTaskID.value.map(getTask));
	const dndSensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);

	return {
		handleDragStart,
		handleDragEnd,
		draggedTask,
		dndSensors,
	};

	function handleDragStart(event: DragStartEvent) {
		draggedTaskID.value = Just(event.active.id.toString());
	}

	function handleDragEnd(event: DragEndEvent) {
		draggedTaskID.value = Nothing;

		if (event.over === null) return;

		const status = event.over.id as TaskStatus;
		const taskID = event.active.id as string;

		setStaticStatus(taskID, status);
	}
}
