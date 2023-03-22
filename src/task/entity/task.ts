import { computed, ReadonlySignal, signal } from '@preact/signals-react';
import { TaskBase } from './base';
import { TaskContext } from './context';
import { pickParentStatus, TaskStatus } from './status';

export const rootTaskId = 'root';

export class Task {
	constructor({ base, context }: { base: TaskBase; context: TaskContext }) {
		this.base = base;
		this.context = context;
	}

	base: TaskBase;
	context: TaskContext;
	get tasks() {
		return this.context.tasks;
	}

	get isRoot() {
		return this.base.id === rootTaskId;
	}

	get isChildOfRoot() {
		if (this.isRoot) return false;
		return this.base.parentIds.size === 0;
	}

	private parentsState: ReadonlySignal<Task[]> = computed(() => {
		if (this.isRoot) return [];
		if (this.isChildOfRoot) return [this.context.rootTask];

		return this.tasks.filter((task) => this.base.parentIds.has(task.base.id));
	});
	get parents() {
		return this.parentsState.value;
	}

	private childrenState: ReadonlySignal<Task[]> = computed(() =>
		this.isRoot
			? this.tasks.filter((task) => task.isChildOfRoot)
			: this.tasks.filter((task) => task.base.parentIds.has(this.base.id)),
	);
	get children() {
		return this.childrenState.value;
	}
	get hasChildren() {
		return this.children.length > 0;
	}

	listDescendants(): Set<Task> {
		if (this.isRoot) {
			return new Set(this.context.tasks);
		}

		return new Set(
			this.children.flatMap((child) => {
				return [child, ...child.listDescendants()];
			}),
		);
	}

	private dynamicStatusState: ReadonlySignal<TaskStatus | null> = computed(
		() => {
			if (!this.hasDynamicStatus) return null;

			const childStatuses = this.children.map((child) => child.status);

			return pickParentStatus(childStatuses);
		},
	);
	private get dynamicStatus() {
		return this.dynamicStatusState.value;
	}
	get hasDynamicStatus() {
		return !this.isRoot && this.children.length > 0;
	}
	get usesDynamicStatus() {
		return this.hasDynamicStatus && !this.base.prefersStaticStatus;
	}

	statusState: ReadonlySignal<TaskStatus> = computed(() => {
		return this.usesDynamicStatus
			? (this.dynamicStatus as TaskStatus)
			: this.base.staticStatus;
	});
	get status() {
		return this.statusState.value;
	}

	findParentCandidates(): Task[] {
		if (this.isRoot) return [];

		const descendantIds = [...this.listDescendants()].map(
			({ base: task }) => task.id,
		);
		const canBeParent = (other: Task): boolean => {
			const otherId = other.base.id;
			const isItself = this.base.id === otherId;
			const isAlreadyParent = this.base.parentIds.has(otherId);
			const isDescendant = descendantIds.includes(otherId);

			return !isItself && !isAlreadyParent && !isDescendant;
		};

		return this.tasks.filter(canBeParent);
	}

	addChildTask({ text, status }: { text: string; status: TaskStatus }) {
		const childTaskBase = new TaskBase({
			text,
			parentIds: signal(new Set(this.isRoot ? [] : [this.base.id])),
			staticStatus: signal(status),
		});
		this.context.add(childTaskBase);
	}

	delete() {
		this.context.delete(this.base.id);
	}
}

export class TaskArray {
	constructor(array: Task[]) {
		this.array = array;
	}

	array: Task[];

	get(id: string): Task {
		return this.array.find(({ base }) => base.id === id)!;
	}
}
