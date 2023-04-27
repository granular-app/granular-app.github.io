import { ViewMainBoardUseCase } from 'src/task.feature/main-board.feature/view-main-board.use-case';
import { TaskTemplate } from 'src/task.feature/utils/task-template';
import { ImportDataUseCase } from './import-data.use-case';

export class ImportDataController {
	constructor(
		private importDataUseCase: ImportDataUseCase,
		private viewMainBoardUseCase: ViewMainBoardUseCase,
	) {}

	run = async (exportFileContents: string) => {
		const taskTemplates: TaskTemplate[] = JSON.parse(exportFileContents);

		this.importDataUseCase.run(taskTemplates);
		this.viewMainBoardUseCase.run();
	};
}
