import { TasksRepository } from 'src/task.feature/application/tasks-repository';
import { TaskManager } from 'src/task.feature/core/task-manager';
import { TaskTemplate } from 'src/task.feature/utils/task-template';

export class ImportDataUseCase {
	constructor(
		private taskManager: TaskManager,
		private tasksRepo: TasksRepository,
	) {}

	run = (taskTemplates: TaskTemplate[]) => {
		const existingTaskIds = new Set(
			this.taskManager.allTasks.map((task) => task.id),
		);
		const filteredTaskTemplates: TaskTemplate[] = [];

		taskTemplates.forEach((template) => {
			if (
				existingTaskIds.has(template.id) ||
				filteredTaskTemplates
					.map((template) => template.id)
					.includes(template.id)
			) {
				// Skip duplicate task
				// Process its subtasks
				template.subtaskIDs.forEach((subtaskID) => {
					const subtaskTemplate = taskTemplates.find((t) => t.id === subtaskID);

					if (
						subtaskTemplate &&
						!existingTaskIds.has(subtaskID) &&
						subtaskTemplate.userPrefersAsMainBoardTask
					) {
						// Remove reference to the parent task and add the subtask as a main board task
						filteredTaskTemplates.push(subtaskTemplate);
					}
				});
			} else {
				// Add non-duplicate task to the filtered list
				filteredTaskTemplates.push(template);
			}
		});

		this.taskManager.importTasks(filteredTaskTemplates);
		this.tasksRepo.save();
	};
}
