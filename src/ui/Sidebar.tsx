import { ReactNode } from 'react';

export function Sidebar({ children }: { children: ReactNode }) {
	return (
		<aside className="fixed top-10 bottom-0 z-10 w-80 flex-shrink-0 overflow-y-auto p-6 pb-12">
			{children}
		</aside>
	);
}
