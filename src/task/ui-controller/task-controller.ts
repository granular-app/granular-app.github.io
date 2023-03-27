import { computed } from '@preact/signals-react';
import { batch } from 'react-redux';
import { TaskContext } from '../entity/context';
import { TaskStatus } from '../entity/status';
import { Task } from '../entity/task';
import { TaskRouter } from '../ui-state/task-router';
import { TaskUseCases } from '../use-case/task-use-cases';

export class TaskControllerFactory {
	constructor(params: { taskContext: TaskContext; taskRouter: TaskRouter }) {
		this.taskContext = params.taskContext;
		this.deleteTaskFactory = new DeleteTaskFactory({
			taskRouter: params.taskRouter,
		});
	}

	private taskContext: TaskContext;
	private deleteTaskFactory: DeleteTaskFactory;

	create(id: string) {
		const task = this.taskContext.get(id);
		return new TaskController({
			task,
			deleteTask: this.deleteTaskFactory.create(task),
		});
	}
}

export class TaskController {
	constructor(params: { task: Task; deleteTask: DeleteTask }) {
		this.useCases = new TaskUseCases({ task: params.task });
		this.deleteTask = params.deleteTask;
	}

	useCases: TaskUseCases;
	deleteTask: DeleteTask;

	addChildTask(params: { text: string; status: TaskStatus }) {
		this.useCases.addChildTask(params);
	}

	setStaticStatus(newStatus: TaskStatus) {
		this.useCases.setStaticStatus(newStatus);
	}

	togglePrefersStaticStatus() {
		this.useCases.togglePrefersStaticStatus();
	}

	setPrefersStaticStatus() {
		this.useCases.setPrefersStaticStatus();
	}

	setPrefersDynamicStatus() {
		this.useCases.setPrefersDynamicStatus();
	}
}

type DeleteTask = () => void;
class DeleteTaskFactory {
	constructor({ taskRouter }: { taskRouter: TaskRouter }) {
		this.taskRouter = taskRouter;
	}

	private taskRouter: TaskRouter;

	create(task: Task): DeleteTask {
		const useCases = new TaskUseCases({ task });
		const deleteTask = () => useCases.deleteTask();

		const deleteTaskState = computed<DeleteTask>(() => {
			const isCurrentTask = task.base.id === this.taskRouter.taskId;

			if (isCurrentTask) {
				const deleteCurrentTask = () => {
					batch(() => {
						this.taskRouter.pop();
						deleteTask();
					});
				};

				return deleteCurrentTask;
			}

			return deleteTask;
		});

		return () => deleteTaskState.value();
	}
}
