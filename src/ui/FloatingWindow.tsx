import * as FloatingUI from '@floating-ui/react';
import { Signal } from '@preact/signals-react';
import React from 'react';

export function FloatingWindow({
	isVisible,
	children,
}: {
	isVisible: Signal<boolean>;
	children: React.ReactNode;
}) {
	return (
		<>
			{isVisible.value && (
				<FloatingUI.FloatingOverlay onClick={() => (isVisible.value = false)} />
			)}
			<FloatingUI.FloatingPortal>
				{isVisible.value && children}
			</FloatingUI.FloatingPortal>
		</>
	);
}
