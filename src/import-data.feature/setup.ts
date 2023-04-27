import { viewMainBoardUseCase } from 'src/task.feature/main-board.feature/setup';
import { taskManager } from 'src/task.feature/setup';
import { ImportDataUseCase } from './import-data.use-case';
import { ImportDataController } from './import-export-file.controller';

export const importDataController = new ImportDataController(
	new ImportDataUseCase(taskManager),
	viewMainBoardUseCase,
);
