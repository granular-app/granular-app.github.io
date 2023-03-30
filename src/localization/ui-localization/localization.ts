import { computed, signal } from '@preact/signals-react';
import i18next from 'i18next';
import memoize from 'lodash.memoize';
import { LocalizableLabel } from '../entity/localizable-label';

const enDictionary: Record<LocalizableLabel, string> = {
	'all-tasks': 'All tasks',
	'to-do': 'To do',
	doing: 'Doing',
	done: 'Done',
	'child-tasks': 'Child tasks',
	'parent-tasks': 'Parent tasks',
	'add-task': 'Add task',
	save: 'Save',
	cancel: 'Cancel',
	delete: 'Delete',
	'add-parent-tasks': 'Add parent tasks',
};

const ruDictionary: Record<LocalizableLabel, string> = {
	'all-tasks': 'Все задачи',
	'to-do': 'Нужно сделать',
	doing: 'В процессе',
	done: 'Сделано',
	'child-tasks': 'Подзадачи',
	'parent-tasks': 'Родительские задачи',
	'add-task': 'Добавить задачу',
	save: 'Сохранить',
	cancel: 'Отмена',
	delete: 'Удалить',
	'add-parent-tasks': 'Добавить родительские задачи',
};

export const localization = i18next.createInstance({
	fallbackLng: 'en',
	resources: {
		en: {
			translation: enDictionary,
		},
		ru: {
			translation: ruDictionary,
		},
	},
});

const languageState = signal('en');

const getReactiveLabel = memoize((localizable: LocalizableLabel) => {
	return computed(() => {
		return localization.t(localizable, { lng: languageState.value });
	});
});

export const say = (localizable: LocalizableLabel) =>
	getReactiveLabel(localizable).value;
