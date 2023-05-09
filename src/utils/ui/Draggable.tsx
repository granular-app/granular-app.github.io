import { useDraggable } from '@dnd-kit/core';
import { ElementType, ReactNode } from 'react';

export function Draggable(props: {
	id: string;
	element?: ElementType;
	children: ReactNode;
	className?: string;
	disabled?: boolean;
}) {
	const Element = props.element ?? 'div';
	const { attributes, listeners, setNodeRef, isDragging, transform } =
		useDraggable({
			id: props.id,
			disabled: props.disabled,
		});
	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
		  }
		: undefined;

	return (
		<Element
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className={props.className}
		>
			{!isDragging && props.children}
		</Element>
	);
}
