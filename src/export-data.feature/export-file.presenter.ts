import { Task } from 'src/task.feature/core/task.entity';
import {
	serializeTaskTemplates,
	tasksToTaskTemplates,
} from 'src/task.feature/utils/task-template';

export class ExportFilePresenter {
	constructor(private effect: (file: Blob) => void) {}

	present = (tasks: Task[]) => {
		const taskTemplates = tasksToTaskTemplates(tasks);
		const serializedTasks = serializeTaskTemplates(taskTemplates);

		this.effect(createExportDataFile(serializedTasks));
	};
}

function createExportDataFile(serializedData: string) {
	return new Blob([serializedData], {
		type: 'application/json',
	});
}
