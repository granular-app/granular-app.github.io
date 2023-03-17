import { signal } from '@preact/signals-react';
import { useState } from 'react';
import { TaskBase } from './task/base';
import { taskContext } from './task/context';
import { getOtherStatuses, TaskStatus } from './task/status';
import { Task, TaskArray } from './task/task';
import { taskRouter } from './ui-state/task-router';

export function App() {
    return (
        <>
            <Breadcrumbs />
            <TaskParentListView />
            <AddParentsView />
            <TaskKanban />
        </>
    );
}

function Breadcrumbs() {
    const { path } = taskRouter;
    const tasks = path.map((id) => taskContext.get(id));

    return (
        <>
            {tasks.map((task, depth) => (
                <Breadcrumb key={task.base.id} depth={depth} task={task} />
            ))}
        </>
    );
}

function Breadcrumb({ task, depth }: { task: Task; depth: number }) {
    const delimiter = '>>';
    const taskIsViewedNow = task === taskRouter.task;

    return (
        <span>
            {!task.isRoot && delimiter}
            {taskIsViewedNow ? (
                <TaskHeading />
            ) : (
                <button onClick={() => taskRouter.setDepth(depth)}>
                    {task.base.text}
                </button>
            )}
        </span>
    );
}

function TaskHeading() {
    const { task } = taskRouter;

    return (
        <h1>
            {task.base.text} <span className="font-bold">({task.status})</span>
            <TaskActions task={task} />
        </h1>
    );
}

function TaskParentListView() {
    const { task } = taskRouter;

    if (task.isChildOfRoot) return <></>;

    const listItems = task.parents.map((parent) => (
        <TaskParentListViewItem key={parent.base.id} parent={parent} />
    ));

    return (
        <>
            Parents:
            <ul>{listItems}</ul>
        </>
    );
}

function TaskParentListViewItem({ parent }: { parent: Task }) {
    const { task, viewTask } = taskRouter;
    const removeParentButton = (
        <button onClick={() => task.base.removeParent(parent.base.id)}>
            Remove parent
        </button>
    );

    return (
        <li>
            <button onClick={() => viewTask(parent.base.id)}>
                {parent.base.text}
            </button>
            {removeParentButton}
        </li>
    );
}

function AddParentsView() {
    const { task } = taskRouter;
    const candidates = task.findParentCandidates();

    if (candidates.length === 0) return <></>;

    const addParentButtons = candidates.map((candidate) => (
        <button
            key={candidate.base.id}
            onClick={() => task.base.addParent(candidate.base.id)}
        >
            {candidate.base.text}
        </button>
    ));

    return (
        <p>
            Add parents:
            {addParentButtons}
        </p>
    );
}

function TaskKanban() {
    const { task } = taskRouter;
    const childrenByStatus = new TaskArray(task.children).splitByStatus();

    return (
        <>
            {childrenByStatus.map(([status, children]) => (
                <TaskColumn key={status} status={status} tasks={children} />
            ))}
        </>
    );
}

function TaskColumn({ status, tasks }: { status: TaskStatus; tasks: Task[] }) {
    const heading = <h3>{status}</h3>;
    const taskList = (
        <ul>
            {tasks.map((task) => (
                <TaskColumnItem key={task.base.id} task={task} />
            ))}
        </ul>
    );

    return (
        <section>
            {heading}
            {taskList}
            <TaskForm status={status} />
        </section>
    );
}

function TaskForm({ status }: { status: TaskStatus }) {
    const [text, setText] = useState('');

    return (
        <div role="form">
            <textarea
                value={text}
                onInput={(e) => setText(e.currentTarget.value)}
                onKeyDown={triggerTextInputKeybindings}
            />
            <button onClick={addTask}>Add task</button>
        </div>
    );

    function triggerTextInputKeybindings(
        e: React.KeyboardEvent<HTMLTextAreaElement>,
    ) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    }

    function addTask() {
        const parent = taskRouter.task;
        const childTaskBase = new TaskBase({
            text,
            parentIds: signal(new Set(parent.isRoot ? [] : [parent.base.id])),
            staticStatus: signal(status),
        });

        taskContext.add(childTaskBase);
        setText('');
    }
}

function TaskColumnItem({ task }: { task: Task }) {
    return (
        <li>
            <button onClick={() => taskRouter.push(task.base.id)}>
                {task.base.text}
            </button>
            <TaskActions task={task} />
        </li>
    );
}

function TaskActions({ task }: { task: Task }) {
    const taskIsViewedNow = task.base.id === taskRouter.taskId;

    const showsStaticStatusToggle = taskIsViewedNow && task.hasDynamicStatus;
    const staticStatusToggle = (
        <button onClick={() => task.base.togglePrefersStatisStatus()}>
            Use {task.usesDynamicStatus ? 'static' : 'dynamic'} status
        </button>
    );

    const otherStatuses = getOtherStatuses(task.status);
    const setStatusButtons = otherStatuses.map((otherStatus) => (
        <button onClick={() => (task.base.staticStatus = otherStatus)}>
            {otherStatus}
        </button>
    ));

    const deleteTaskButton = <button onClick={deleteTask}>Delete</button>;
    function deleteTask() {
        if (taskIsViewedNow) taskRouter.pop();
        taskContext.delete(task.base.id);
    }

    return (
        <div className="ml-3 inline-flex space-x-2">
            {showsStaticStatusToggle && staticStatusToggle}
            {!task.isRoot && (
                <>
                    {!task.usesDynamicStatus && setStatusButtons}
                    {deleteTaskButton}
                </>
            )}
        </div>
    );
}
