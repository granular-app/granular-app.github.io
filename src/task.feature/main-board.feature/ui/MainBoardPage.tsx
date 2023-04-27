import { SparklesIcon } from '@heroicons/react/24/solid';
import { useEffect } from 'react';
import { TaskKanban } from 'src/task.feature/ui/TaskKanban';
import { useAdapters } from 'src/ui/adapaters';
import { ProgressBar } from 'src/ui/ProgressBar';
import { Sidebar } from 'src/ui/Sidebar';
import { setDocumentTitle } from 'src/utils/ui/set-document-title';
import { useMainBoard } from './use-main-board-state';

export function MainBoardPage() {
	const mainBoard = useMainBoard();
	const {
		addMainBoardTaskController,
		editMainBoardTaskController,
		deleteMainBoardTaskController,
	} = useAdapters();

	useEffect(() => {
		setDocumentTitle('Main Board');
	}, []);

	return (
		<>
			<MainBoardSidebar />
			<TaskKanban
				columns={mainBoard.tasksByStatus}
				addTask={addMainBoardTaskController.run}
				editTask={editMainBoardTaskController.run}
				deleteTask={deleteMainBoardTaskController.run}
			/>
		</>
	);
}

function MainBoardSidebar() {
	const mainBoard = useMainBoard();

	return (
		<Sidebar>
			<h1 className="text-lg">Main Board</h1>
			<h3 className="mt-5 mb-1 text-sm font-bold text-gray-500">Status</h3>
			<div className="flex items-center justify-between">
				<span className="font-bold text-gray-700">{mainBoard.status}</span>
				<SparklesIcon className="icon ml-2" />
			</div>
			<ProgressBar progress={mainBoard.progress} className="mb-2 h-1" />
			<dl className="divide-y divide-gray-100 text-sm text-gray-600">
				<div className="grid grid-cols-2 py-px">
					<dt>Main Board tasks</dt>
					<dd>
						{mainBoard.mainBoardCompletedTasksCount} /{' '}
						{mainBoard.mainBoardTasksCount}
					</dd>
				</div>
				<div className="grid grid-cols-2 py-px">
					<dt>All tasks</dt>
					<dd>
						{mainBoard.allCompletedTasksCount} / {mainBoard.allTasksCount}
					</dd>
				</div>
			</dl>
		</Sidebar>
	);
}
