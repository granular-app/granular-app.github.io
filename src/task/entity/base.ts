import { signal, Signal } from '@preact/signals-react';
import produce from 'immer';
import { nanoid } from 'nanoid';
import { RequireBy } from '../../utils/types/partial-by';
import { TaskStatus } from './status';

export type StatefulTaskBaseTemplate = {
	id: string;
	textState: Signal<string>;
	parentIdsState: Signal<Set<string>>;
	staticStatusState: Signal<TaskStatus>;
	prefersStaticStatusState: Signal<boolean>;
};
export type PartialStatefulTaskBaseTemplate = RequireBy<
	StatefulTaskBaseTemplate,
	'textState'
>;

export type StatelessTaskBaseTemplate = {
	id: string;
	text: string;
	parentIds: Set<string>;
	staticStatus: TaskStatus;
	prefersStaticStatus: boolean;
};
export type PartialStatelessTaskBaseTemplate = RequireBy<
	StatelessTaskBaseTemplate,
	'text'
>;

export const StatelessTaskBaseTemplate = {
	generateId: nanoid,
} as const;
export const PartialStatelessTaskBaseTemplate = {
	addDefaultValues(
		template: PartialStatelessTaskBaseTemplate,
	): StatelessTaskBaseTemplate {
		return {
			id: template.id ?? StatelessTaskBaseTemplate.generateId(),
			text: template.text,
			parentIds: template.parentIds ?? new Set(),
			staticStatus: template.staticStatus ?? TaskStatus.ToDo,
			prefersStaticStatus: template.prefersStaticStatus ?? false,
		};
	},
} as const;

export const StatefulTaskBaseTemplate = {
	fromStateless(
		partialStatelessTemplate: PartialStatelessTaskBaseTemplate,
	): StatefulTaskBaseTemplate {
		const statelessTemplate = PartialStatelessTaskBaseTemplate.addDefaultValues(
			partialStatelessTemplate,
		);

		return {
			id: statelessTemplate.id,
			textState: signal(statelessTemplate.text),
			parentIdsState: signal(statelessTemplate.parentIds),
			staticStatusState: signal(statelessTemplate.staticStatus),
			prefersStaticStatusState: signal(statelessTemplate.prefersStaticStatus),
		};
	},
	toStateless(
		statefullTemplate: StatefulTaskBaseTemplate,
	): StatelessTaskBaseTemplate {
		return {
			id: statefullTemplate.id,
			text: statefullTemplate.textState.value,
			parentIds: statefullTemplate.parentIdsState.value,
			staticStatus: statefullTemplate.staticStatusState.value,
			prefersStaticStatus: statefullTemplate.prefersStaticStatusState.value,
		};
	},
} as const;

export const PartialStatefulTaskBaseTemplate = {
	addDefaultValues(
		template: PartialStatefulTaskBaseTemplate,
	): StatefulTaskBaseTemplate {
		const defaults = StatefulTaskBaseTemplate.fromStateless(
			PartialStatelessTaskBaseTemplate.addDefaultValues(
				PartialStatefulTaskBaseTemplate.toStateless(template),
			),
		);

		return {
			id: template.id ?? defaults.id,
			textState: template.textState ?? defaults.textState,
			parentIdsState: template.parentIdsState ?? defaults.parentIdsState,
			prefersStaticStatusState:
				template.prefersStaticStatusState ?? defaults.prefersStaticStatusState,
			staticStatusState:
				template.staticStatusState ?? defaults.staticStatusState,
		};
	},
	toStateless(
		statefullTemplate: PartialStatefulTaskBaseTemplate,
	): PartialStatelessTaskBaseTemplate {
		return {
			id: statefullTemplate.id,
			text: statefullTemplate.textState.value,
			parentIds: statefullTemplate?.parentIdsState?.value,
			staticStatus: statefullTemplate?.staticStatusState?.value,
			prefersStaticStatus: statefullTemplate?.prefersStaticStatusState?.value,
		};
	},
} as const;

export class TaskBase implements StatefulTaskBaseTemplate {
	private constructor(template: StatefulTaskBaseTemplate) {
		this.id = template.id;
		this.textState = template.textState;
		this.parentIdsState = template.parentIdsState;
		this.staticStatusState = template.staticStatusState;
		this.prefersStaticStatusState = template.prefersStaticStatusState;
	}

	static fromStatefulTemplate(
		template: PartialStatefulTaskBaseTemplate,
	): TaskBase {
		return new TaskBase(
			PartialStatefulTaskBaseTemplate.addDefaultValues(template),
		);
	}

	static fromStatelessTemplate(
		template: PartialStatelessTaskBaseTemplate,
	): TaskBase {
		return new TaskBase(StatefulTaskBaseTemplate.fromStateless(template));
	}

	id: string;

	textState: Signal<string>;
	get text() {
		return this.textState.value;
	}
	set text(value: string) {
		this.textState.value = value;
	}

	/* Parents */

	parentIdsState: Signal<Set<string>>;
	get parentIds() {
		return this.parentIdsState.value;
	}
	private updateParentIds(update: (draft: Set<string>) => Set<string> | void) {
		this.parentIdsState.value = produce(this.parentIds, update);
	}

	addParent(parentId: string) {
		if (parentId === this.id) throw Error();

		this.updateParentIds((draft) => {
			draft.add(parentId);
		});
	}

	removeParent(parentId: string) {
		this.updateParentIds((draft) => {
			draft.delete(parentId);
		});
	}

	/* Status */

	staticStatusState: Signal<TaskStatus>;
	get staticStatus() {
		return this.staticStatusState.value;
	}
	set staticStatus(newValue: TaskStatus) {
		this.staticStatusState.value = newValue;
	}

	prefersStaticStatusState: Signal<boolean>;
	get prefersStaticStatus() {
		return this.prefersStaticStatusState.value;
	}
	set prefersStaticStatus(newValue: boolean) {
		this.prefersStaticStatusState.value = newValue;
	}
	togglePrefersStaticStatus() {
		this.prefersStaticStatus = !this.prefersStaticStatus;
	}
}
