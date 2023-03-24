import { useDraggable } from '@dnd-kit/core';
import { ElementType, ReactNode } from 'react';

export function Draggable(props: {
	id: string;
	element?: ElementType;
	children: ReactNode;
}) {
	const Element = props.element ?? 'div';
	const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
		id: props.id,
	});

	return (
		<Element ref={setNodeRef} {...listeners} {...attributes}>
			{!isDragging && props.children}
		</Element>
	);
}
