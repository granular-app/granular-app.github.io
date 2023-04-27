import { viewMainBoardUseCase } from 'src/task.feature/main-board.feature/setup';
import { taskManager } from 'src/task.feature/setup';
import { ImportDataController } from './import-data.controller';
import { ImportDataUseCase } from './import-data.use-case';

export const importDataController = new ImportDataController(
	new ImportDataUseCase(taskManager),
	viewMainBoardUseCase,
);
