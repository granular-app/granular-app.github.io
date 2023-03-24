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
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { TaskStatus } from '../../entity/status';
import { useTaskControllerFactory } from '../hooks/use-task-controller-factory';
import { useGetTask } from '../hooks/use-task-getter';
import { TaskKanbanColumnItemPresentation } from './TaskKanbanColumnItem';

export function TaskKanbanDragAndDrop({ children }: { children: ReactNode }) {
	const { handleDragStart, handleDragEnd, dndSensors, draggedTask } =
		useTaskDragAndDrop();

	return (
		<DndContext
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			sensors={dndSensors}
		>
			{children}
			{createPortal(
				<DragOverlay>
					{draggedTask.value && (
						<TaskKanbanColumnItemPresentation
							task={draggedTask.value}
							extraClassName="shadow-lg"
						/>
					)}
				</DragOverlay>,
				document.body,
			)}
		</DndContext>
	);
}
function useTaskDragAndDrop() {
	const getTask = useGetTask();
	const draggedTaskId = useSignal<string | null>(null);
	const draggedTask = useComputed(() =>
		draggedTaskId.value === null ? null : getTask(draggedTaskId.value),
	);
	const dndSensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);
	const taskControllerFactory = useTaskControllerFactory();

	return {
		handleDragStart,
		handleDragEnd,
		draggedTask,
		dndSensors,
	};

	function handleDragStart(event: DragStartEvent) {
		draggedTaskId.value = event.active.id.toString();
	}

	function handleDragEnd(event: DragEndEvent) {
		draggedTaskId.value = null;

		if (event.over === null) return;

		const status = event.over.id as TaskStatus;
		const taskId = event.active.id as string;
		const taskController = taskControllerFactory.create(taskId);

		taskController.setStaticStatus(status);
	}
}
