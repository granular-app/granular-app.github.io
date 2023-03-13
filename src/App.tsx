import { useState } from 'react';
import {
    currentTask,
    currentTaskChildren,
    currentTaskId,
    currentTaskParents,
} from './ui-state/current-task';
import { AllTasks } from './user-task/all-tasks';
import { TaskStatus, TaskStatuses } from './user-task/task-status';
import {
    ParentUserTask,
    splitTasksByStatus,
    UserTask,
} from './user-task/user-task';

export function App() {
    const parents = currentTaskParents.value;
    const potentialParents = [
        ...AllTasks.getPotentialParents(currentTaskId.value),
    ];

    return (
        <>
            <p>
                {currentTask.value.text}{' '}
                <span className="font-bold">({<>{currentTask.value.status}</>})</span>
            </p>
            {parents.length > 0 && (
                <p>
                    Parents:
                    {parents.map((task) => (
                        <button
                            key={`parents-${task.id}`}
                            onClick={() => (currentTaskId.value = task.id)}
                        >
                            {task.text}
                        </button>
                    ))}
                </p>
            )}
            {potentialParents.length > 0 && (
                <p>
                    Add parents:
                    {potentialParents.map((task) => (
                        <button
                            key={`add-parents-${task.id}`}
                            onClick={() =>
                                AllTasks.addParent(currentTaskId.value, task.id)
                            }
                        >
                            {task.text}
                        </button>
                    ))}
                </p>
            )}

            <TaskKanban tasks={currentTaskChildren.value} />
        </>
    );
}

function TaskKanban({ tasks }: { tasks: UserTask[] }) {
    return (
        <>
            {splitTasksByStatus(tasks).map(([status, tasks]) => (
                <TaskColumn key={status} status={status} tasks={tasks} />
            ))}
        </>
    );
}

function TaskColumn({
    status,
    tasks,
}: {
    status: TaskStatus;
    tasks: UserTask[];
}) {
    return (
        <section>
            <h3>{status}</h3>
            <ul>
                {tasks.map((task) => (
                    <TaskColumnItem key={task.id} task={task} />
                ))}
            </ul>
            <SubtaskForm status={status} />
        </section>
    );
}

function SubtaskForm({ status }: { status: TaskStatus }) {
    const [text, setText] = useState('');

    function addSubtask() {
        AllTasks.addSubtask(currentTaskId.value, { text: text, status });
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
                        addSubtask();
                    }
                }}
            />
            <button onClick={addSubtask}>Add subtask</button>
        </div>
    );
}

function TaskColumnItem({ task }: { task: UserTask }) {
    const alternativeStatuses = TaskStatuses.filter(
        (s) => s !== task.status.value,
    );

    return (
        <li key={task.id}>
            {task.text}
            <div className="ml-3 inline-flex space-x-2">
                {!(task instanceof ParentUserTask) &&
                    alternativeStatuses.map((buttonStatus) => (
                        <button
                            key={buttonStatus}
                            onClick={() =>
                                AllTasks.updateTaskStatus(task.id, buttonStatus)
                            }
                        >
                            {buttonStatus}
                        </button>
                    ))}
                <button onClick={() => (currentTaskId.value = task.id)}>View</button>
            </div>
        </li>
    );
}
