import { Task } from 'src/task/core/task';
import {
	serializeTaskTemplates,
	tasksToTaskTemplates,
} from 'src/task/utils/task-template';

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
