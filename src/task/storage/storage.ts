import { effect } from '@preact/signals-react';
import {
	StatefulTaskBaseTemplate,
	StatelessTaskBaseTemplate,
	TaskBase,
} from '../entity/base';
import { TaskContext } from '../entity/context';

export function saveTaskContextEffect(taskContext: TaskContext) {
	effect(() => {
		const taskList = taskContext.tasks;
		const taskBaseList = taskList.map((task) => task.base);
		const jsonTaskJSONList = JSON.stringify(
			taskBaseList
				.map(StatefulTaskBaseTemplate.toStateless)
				.map(JSONTask.fromStatelessTemplate),
		);

		localStorage.setItem('task-list', jsonTaskJSONList);

		taskBaseList.forEach((base) => {
			base.textState.value;
			base.parentIdsState.value;
			base.prefersStaticStatusState.value;
			base.staticStatusState.value;
		});
	});
}

export function initTaskLocalStorage(taskContext: TaskContext) {
	const jsonTaskJSONList = localStorage.getItem('task-list');

	if (jsonTaskJSONList !== null) {
		taskContext.clear();
		const jsonTaskList: JSONTask[] = JSON.parse(jsonTaskJSONList);
		const taskBaseList = jsonTaskList
			.map(JSONTask.toStatelessTemplate)
			.map(TaskBase.fromStatelessTemplate);

		taskBaseList.forEach((taskBase) => taskContext.add(taskBase));
	}

	saveTaskContextEffect(taskContext);
}

type JSONTask = Omit<StatelessTaskBaseTemplate, 'parentIds'> & {
	parentIds: string[];
};

const JSONTask = {
	fromStatelessTemplate(template: StatelessTaskBaseTemplate): JSONTask {
		return { ...template, parentIds: [...template.parentIds.values()] };
	},
	toStatelessTemplate(jsonTask: JSONTask): StatelessTaskBaseTemplate {
		return {
			...jsonTask,
			parentIds: new Set(jsonTask.parentIds),
		};
	},
} as const;
