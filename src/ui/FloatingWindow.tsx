import * as FloatingUI from '@floating-ui/react';
import React from 'react';

export function FloatingWindow({
	isVisible,
	setIsVisible,
	children,
}: {
	isVisible: boolean;
	setIsVisible: (isVisible: boolean) => void;
	children: React.ReactNode;
}) {
	return (
		<>
			{isVisible && (
				<FloatingUI.FloatingOverlay onClick={() => setIsVisible(false)} />
			)}
			<FloatingUI.FloatingPortal>
				{isVisible && children}
			</FloatingUI.FloatingPortal>
		</>
	);
}
