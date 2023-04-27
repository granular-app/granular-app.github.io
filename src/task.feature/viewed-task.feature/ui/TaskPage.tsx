import { useEffect } from 'react';
import { Sidebar } from 'src/ui/Sidebar';
import { setDocumentTitle } from 'src/utils/ui/set-document-title';
import { ParentTasksView } from './ParentTasksView';
import { StatusView } from './StatusView';
import { TaskTextView } from './TaskTextView';
import { useViewedTask } from './use-viewed-task';
import { ViewedTaskSubtasksKanban } from './ViewedTaskSubtasksKanban';

export function TaskPage() {
	const viewedTask = useViewedTask();

	useEffect(() => {
		setDocumentTitle(viewedTask.text);
	}, []);

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
