import { taskManager } from 'src/task.feature/setup';
import { ExportDataController } from './export-data.controller';
import { ExportDataUseCase } from './export-data.use-case';
import { ExportFilePresenter } from './export-file.presenter';
import { downloadExportFile } from './ui/download-export-file';

export const exportDataController = new ExportDataController(
	new ExportDataUseCase(
		taskManager,
		new ExportFilePresenter(downloadExportFile).present,
	),
);
