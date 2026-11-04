import type { Task } from '../types/task'

const STORAGE_KEY = 'todo-app-tasks-v1'

function isTask(value: unknown): value is Task {
    if (typeof value !== 'object' || value === null) {
        return false
    }

    const task = value as Record<string, unknown>

    return (
        typeof task.id === 'string' &&
        task.id.length > 0 &&
        typeof task.title === 'string' &&
        task.title.trim().length > 0 &&
        typeof task.description === 'string' &&
        typeof task.dueDate === 'string' &&
        (task.priority === 'low' ||
            task.priority === 'medium' ||
            task.priority === 'high') &&
        typeof task.completed === 'boolean'
    )
}

export function loadTasks(): Task[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)

        if (!saved) {
            return []
        }

        const parsed: unknown = JSON.parse(saved)

        if (!Array.isArray(parsed)) {
            return []
        }

        return parsed.filter(isTask)
    } catch (error) {
        console.warn('Could not load saved tasks.', error)
        return []
    }
}

export function saveTasks(tasks: Task[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (error) {
        console.warn('Could not save tasks.', error)
    }
}