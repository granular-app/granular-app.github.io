import { Signal } from '@preact/signals-react';
import { Maybe } from 'purify-ts';
import { createContext, useContext } from 'react';
import { ExportDataController } from 'src/export-data.feature/export-data.controller';
import { ImportDataController } from 'src/import-data.feature/import-export-file.controller';
import { EditTaskController } from 'src/task.feature/edit-task.feature/edit-task.controller';
import { AddMainBoardTaskController } from 'src/task.feature/main-board.feature/add-main-board-task.feature/add-main-board-task.controller';
import { DeleteMainBoardTaskController } from 'src/task.feature/main-board.feature/delete-main-board-task.controller';
import { MainBoardUIModel } from 'src/task.feature/main-board.feature/main-board.presenter';
import { ViewMainBoardController } from 'src/task.feature/main-board.feature/view-main-board.controller';
import { AttachViewedTaskController } from 'src/task.feature/viewed-task.feature/attach-viewed-task.controller';
import { CreateViewedTaskSubtaskController } from 'src/task.feature/viewed-task.feature/create-subtask.controller';
import { DeleteSubtaskController } from 'src/task.feature/viewed-task.feature/delete-subtask.controller';
import { DeleteViewedTaskController } from 'src/task.feature/viewed-task.feature/delete-viewed-task.controller';
import { DetachViewedTaskController } from 'src/task.feature/viewed-task.feature/detach-viewed-task.controller';
import { EditViewedTaskController } from 'src/task.feature/viewed-task.feature/edit-viewed-task.controller';
import { SetViewedTaskStaticStatusController } from 'src/task.feature/viewed-task.feature/set-viewed-task-static-status.controller';
import { ViewTaskController } from 'src/task.feature/viewed-task.feature/view-task.controller';
import { ViewedTaskUIModel } from 'src/task.feature/viewed-task.feature/viewed-task.presenter';

const AdaptersContext = createContext<Adapters | null>(null);

export function useAdapters() {
	const adapters = useContext(AdaptersContext);

	if (adapters === null) {
		throw new Error(
			`The UI needs adapters to work, but they weren't provided.`,
		);
	} else {
		return adapters;
	}
}

export type Adapters = {
	mainBoardState: Signal<Maybe<MainBoardUIModel>>;
	forceGetMainBoard: () => MainBoardUIModel;
	viewMainBoardController: ViewMainBoardController;
	addMainBoardTaskController: AddMainBoardTaskController;
	editMainBoardTaskController: EditTaskController;
	deleteMainBoardTaskController: DeleteMainBoardTaskController;
	viewedTaskState: Signal<Maybe<ViewedTaskUIModel>>;
	forceGetViewedTask: () => ViewedTaskUIModel;
	viewTaskController: ViewTaskController;
	addViewedTaskSubtaskController: CreateViewedTaskSubtaskController;
	editViewedTaskSubtaskController: EditTaskController;
	editViewedTaskController: EditViewedTaskController;
	setViewedTaskStaticStatusController: SetViewedTaskStaticStatusController;
	deleteSubtaskController: DeleteSubtaskController;
	deleteViewedTaskController: DeleteViewedTaskController;
	attachViewedTaskController: AttachViewedTaskController;
	detachViewedTaskController: DetachViewedTaskController;
	exportDataController: ExportDataController;
	importDataController: ImportDataController;
};

export const AdaptersProvider = AdaptersContext.Provider;
