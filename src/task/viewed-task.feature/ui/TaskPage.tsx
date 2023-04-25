import { Sidebar } from 'src/ui/Sidebar';
import { ParentTasksView } from './ParentTasksView';
import { StatusView } from './StatusView';
import { TaskTextView } from './TaskTextView';
import { ViewedTaskSubtasksKanban } from './ViewedTaskSubtasksKanban';

export function TaskPage() {
	return (
		<>
			<Sidebar>
				<TaskTextView />
				<StatusView />
				{/* <h3 className="mt-5 mb-1 text-sm font-bold text-gray-500">Note</h3>
			<button className="button">Add note</button> */}
				<ParentTasksView />
			</Sidebar>
			<ViewedTaskSubtasksKanban />
		</>
	);
}
