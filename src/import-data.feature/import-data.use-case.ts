import { TasksRepository } from 'src/task.feature/application/tasks-repository';
import { TaskManager } from 'src/task.feature/core/task-manager.entity';
import { TaskTemplate } from 'src/task.feature/utils/task-template';

export class ImportDataUseCase {
	constructor(
		private taskManager: TaskManager,
		private tasksRepo: TasksRepository,
	) {}

	run = (taskTemplates: TaskTemplate[]) => {
		const existingTaskIDs = new Set(
			this.taskManager.allTasks.map((task) => task.id),
		);
		const filteredTaskTemplates: TaskTemplate[] = [];

		taskTemplates.forEach((template) => {
			const taskWithSuchIDAlreadyExists = existingTaskIDs.has(template.id);
			const taskIsAlreadyImported = filteredTaskTemplates
				.map(({ id }) => id)
				.includes(template.id);
			const isDuplicate = taskWithSuchIDAlreadyExists || taskIsAlreadyImported;
			const isOrphan =
				!template.userPrefersAsMainBoardTask &&
				taskTemplates.every(
					(otherTemplate) => !otherTemplate.subtaskIDs.includes(template.id),
				);

			if (!isDuplicate && !isOrphan) {
				filteredTaskTemplates.push(template);
				return;
			}
		});

		this.taskManager.importTasks(filteredTaskTemplates);
		this.tasksRepo.save();
	};
}
