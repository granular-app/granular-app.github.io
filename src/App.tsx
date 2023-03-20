import { TabGroup } from './task/ui/TabGroup';
import { TaskHeader } from './task/ui/TaskHeader';

export function App() {
	return (
		<div className="flex min-h-screen flex-col gap-2 bg-zinc-100 p-2">
			<TaskHeader />
			<TabGroup />
		</div>
	);
}
