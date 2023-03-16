import { signal } from '@preact/signals-react';
import { useState } from 'react';
import { environment } from './task/all-tasks';
import { TaskArray } from './task/array';
import { getAlternativeStatuses, TaskStatus } from './task/status';
import { Task } from './task/task';
import { taskRouter } from './ui-state/current-task';

export function App() {
    return (
        <>
            <Breadcrumbs />
            {!taskRouter.task.isRoot && <TaskParentListView />}
            <AddableParentsView />
            <TaskKanban />
        </>
    );
}

function Breadcrumbs() {
    const path = taskRouter.path;

    return (
        <>
            {path
                .map((id) => environment.getTask(id))
                .map((task, i) => (
                    <span key={task.id}>
                        {i > 0 && <>&gt;&gt;</>}
                        {i + 1 === taskRouter.depth ? (
                            <TaskHeading />
                        ) : (
                            <button onClick={() => taskRouter.setDepth(i + 1)}>
                                {task.text}
                            </button>
                        )}
                    </span>
                ))}
        </>
    );
}

function TaskHeading() {
    const task = taskRouter.task;

    return (
        <h1>
            {task.text} <span className="font-bold">({task.status})</span>
            <TaskActions task={task} />
        </h1>
    );
}

function TaskParentListView() {
    const { parents, hasExtraParents } = taskRouter.task;
    const path = taskRouter.path;
    const parentRouteId = path[path.length - 1];

    return (
        <>
            Other parents:
            <ul>
                {parents
                    .filter((p) => p.id !== parentRouteId)
                    .map((p) => (
                        <TaskParentListViewItem
                            key={p.id}
                            parent={p}
                            removeButtonEnabled={hasExtraParents}
                        />
                    ))}
            </ul>
        </>
    );
}

function TaskParentListViewItem({
    parent,
    removeButtonEnabled,
}: {
    parent: Task;
    removeButtonEnabled: boolean;
}) {
    return (
        <li>
            <button onClick={() => taskRouter.viewParent(parent.id)}>
                {parent.text}
            </button>
            {removeButtonEnabled && (
                <button onClick={() => taskRouter.task.removeParent(parent.id)}>
                    -
                </button>
            )}
        </li>
    );
}

function AddableParentsView() {
    const task = taskRouter.task;
    const addableParents = task.getAddableParents();

    if (addableParents.length === 0) return <></>;

    return (
        <p>
            Add parents:
            {addableParents.map((parent) => (
                <button key={parent.id} onClick={() => task.addParent(parent.id)}>
                    {parent.text}
                </button>
            ))}
        </p>
    );
}

function TaskKanban() {
    const task = taskRouter.task;
    const children = task.children.value;
    const childrenByStatus = new TaskArray(children).splitByStatus();

    return (
        <>
            {childrenByStatus.map(([status, ...children]) => (
                <TaskColumn key={status} status={status} tasks={children} />
            ))}
        </>
    );
}

function TaskColumn({ status, tasks }: { status: TaskStatus; tasks: Task[] }) {
    return (
        <section>
            <h3>{status}</h3>
            <ul>
                {tasks.map((task) => (
                    <TaskColumnItem key={task.id} task={task} />
                ))}
            </ul>
            <TaskForm status={status} />
        </section>
    );
}

function TaskForm({ status }: { status: TaskStatus }) {
    const [text, setText] = useState('');

    function addTask() {
        environment.addTask({
            parentIds: signal(new Set([taskRouter.taskId])),
            text,
            staticStatus: signal(status),
        });
        setText('');
    }

    return (
        <div role="form">
            <textarea
                value={text}
                onInput={(e) => setText(e.currentTarget.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        addTask();
                    }
                }}
            />
            <button onClick={addTask}>Add task</button>
        </div>
    );
}

function TaskColumnItem({ task }: { task: Task }) {
    return (
        <li>
            <button onClick={() => taskRouter.push(task.id)}>{task.text}</button>
            <TaskActions task={task} />
        </li>
    );
}

function TaskActions({ task }: { task: Task }) {
    const hasChildren = task.children.value.length > 0;
    const alternativeStatuses = getAlternativeStatuses(task.status);
    const setStatusButtons = alternativeStatuses.map((status) => (
        <SetStaticStatus key={status} status={status} task={task} />
    ));

    return (
        <div className="ml-3 inline-flex space-x-2">
            {hasChildren && (
                <button
                    onClick={() =>
                        (task.prefersStaticStatus.value = !task.prefersStaticStatus.value)
                    }
                >
                    Use {task.usesStaticStatus ? 'dynamic' : 'static'} status
                </button>
            )}
            {task.usesStaticStatus && setStatusButtons}
            {!task.isRoot && (
                <button
                    onClick={() => {
                        taskRouter.pop();
                        environment.deleteTask(task.id);
                    }}
                >
                    Delete
                </button>
            )}
        </div>
    );
}

function SetStaticStatus({ task, status }: { task: Task; status: TaskStatus }) {
    return (
        <button onClick={() => (task.staticStatus.value = status)}>{status}</button>
    );
}
