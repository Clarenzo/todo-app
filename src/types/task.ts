export type Priority = 'low' | 'medium' | 'high'

export type Task = {
    id: string
    title: string
    description: string
    dueDate: string
    priority: Priority
    completed: boolean
}