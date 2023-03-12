import {
    currentTask,
    currentTaskChildren,
    currentTaskId,
    currentTaskParents,
} from './ui-state/current-task';
import { updateTaskStatus } from './user-task/all-tasks';
import { TaskStatuses } from './user-task/task-status';
import {
    ParentUserTask,
    splitTasksByStatus,
    UserTask,
} from './user-task/user-task';

export function App() {
    const parents = currentTaskParents.value;

    return (
        <>
            <p>
                {currentTask.value.text}{' '}
                <span className="font-bold">({<>{currentTask.value.status}</>})</span>
            </p>
            {parents.length > 0 && <>Parents: </>}
            {parents.map((task) => (
                <button key={task.id} onClick={() => (currentTaskId.value = task.id)}>
                    {task.text}
                </button>
            ))}

            <TaskKanban tasks={currentTaskChildren.value} />
        </>
    );
}

function TaskKanban({ tasks }: { tasks: UserTask[] }) {
    return (
        <>
            {splitTasksByStatus(tasks).map(([status, tasks]) => (
                <TaskColumn key={status} title={status} tasks={tasks} />
            ))}
        </>
    );
}

function TaskColumn({
    title,
    tasks,
}: {
    title: React.ReactNode;
    tasks: UserTask[];
}) {
    if (tasks.length === 0) return <></>;

    return (
        <section>
            <h3>{title}</h3>
            <ul>
                {tasks.map((task) => (
                    <TaskColumnItem key={task.id} task={task} />
                ))}
            </ul>
        </section>
    );
}

function TaskColumnItem({ task }: { task: UserTask }) {
    const alternativeStatuses = TaskStatuses.filter(
        (s) => s !== task.status.value,
    );

    return (
        <li key={task.id}>
            {task.text}
            {!(task instanceof ParentUserTask) &&
                alternativeStatuses.map((buttonStatus) => (
                    <button
                        key={buttonStatus}
                        onClick={() => updateTaskStatus(task.id, buttonStatus)}
                    >
                        {buttonStatus}
                    </button>
                ))}
            <button className="ml-2" onClick={() => (currentTaskId.value = task.id)}>
                View
            </button>
        </li>
    );
}
