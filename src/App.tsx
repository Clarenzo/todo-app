import { useEffect, useState, type DragEvent, type FormEvent } from "react"
import type { Priority, Task } from "./types/task"
import { loadTasks, saveTasks } from "./lib/taskStorage"

type StatusFilter = 'all' | 'active' | 'completed'
type PriorityFilter = Priority | 'all'

const priorityColors: Record<Priority, string> = {
  low: 'bg-emerald-950 text-emerald-300',
  medium: 'bg-amber-950 text-amber-300',
  high: 'bg-rose-950 text-rose-300',
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [addError, setAddError] = useState("")

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editDueDate, setEditDueDate] = useState("")
  const [editPriority, setEditPriority] = useState<Priority>("medium")
  const [editError, setEditError] = useState("")

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all")

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)


  const canReorder = 
    statusFilter === 'all' && priorityFilter === 'all'

  const canDrag = canReorder && editingId === null
  
  const completedCount = tasks.filter((task) => task.completed).length

  const visibleTasks = tasks.filter((task) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' ? task.completed : !task.completed)

    const matchesPriority = 
      priorityFilter === 'all' || task.priority === priorityFilter

    return matchesStatus && matchesPriority
  })

  function handleAddTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      setAddError("Enter a task title.")
      return
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      description: description.trim(),
      dueDate,
      priority,
      completed: false,
    }

    setTasks((currentTasks) => [...currentTasks, newTask])
    setTitle("")
    setDescription("")
    setDueDate("")
    setPriority("medium")
    setAddError("")
  }

  function handleToggleTask(id: string) {
    setTasks((currentTasks) => 
      currentTasks.map((task) => 
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  function startEditing(task: Task) {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description)
    setEditDueDate(task.dueDate)
    setEditPriority(task.priority)
    setEditError("")
  }

  function cancelEditing() {
    setEditingId(null)
    setEditTitle("")
    setEditDescription("")
    setEditDueDate("")
    setEditPriority("medium")
    setEditError("")
  }

  function handleSaveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedTitle = editTitle.trim()

    if (!trimmedTitle) {
      setEditError("Enter a task title.")
      return
    }

    if (editingId === null) {
      return
    }

    setTasks((currentTasks) => 
      currentTasks.map((task) => 
        task.id === editingId
          ? { 
              ...task,
              title: trimmedTitle,
              description: editDescription.trim(),
              dueDate: editDueDate,
              priority: editPriority,
            }
          : task,
      ),
    )

    cancelEditing()
  }

  function handleDeleteTask(id: string) {
    setTasks((currentTasks) => 
      currentTasks.filter((task) => task.id !== id),
    )
  }

  function moveTask(sourceId: string, targetId: string) {
    if (sourceId === targetId) {
      return
    }

    setTasks((currentTasks) => {
      const sourceIndex = currentTasks.findIndex(
        (task) => task.id === sourceId,
      )
      const targetIndex = currentTasks.findIndex(
        (task) => task.id === targetId,
      )

      if (sourceIndex === -1 || targetIndex === -1) {
        return currentTasks
      }

      const reorderedTasks = [...currentTasks]
      const [movedTask] = reorderedTasks.splice(sourceIndex, 1)
      reorderedTasks.splice(targetIndex, 0, movedTask)

      return reorderedTasks
    })
  }

  function moveTaskByOffset(id: string, offset: number) {
    if (!canReorder) {
      return
    }

    const currentIndex = tasks.findIndex((task) => task.id === id)
    const neighbor = tasks[currentIndex + offset]

    if (neighbor) {
      moveTask(id, neighbor.id)
    }
  }

  function handleDragStart(event: DragEvent<HTMLSpanElement>, id: string) {
    if (!canDrag) {
      event.preventDefault()
      return
    }

    setDraggedTaskId(id)
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', id)
  }

  function handleDragOver(event: DragEvent<HTMLLIElement>, id: string) {
    if (!canDrag || draggedTaskId === null || draggedTaskId === id) {
      return
    }

    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'

    if (dropTargetId !== id) {
      setDropTargetId(id)
    }
  }

  function handleDrop(event: DragEvent<HTMLLIElement>, targetId: string) {
    if (!canDrag || draggedTaskId === null) {
      return
    }

    event.preventDefault()
    moveTask(draggedTaskId, targetId)
    handleDragEnd()
  }

  function handleDragEnd() {
    setDraggedTaskId(null)
    setDropTargetId(null)
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            My To-Do App
          </p>
          <h1 className="mt-2 text-3xl font-bold">Your tasks</h1>
          <p className="mt-2 text-slate-400">
            Add a task to start organizing your day.
          </p>
        </header>

        <form
          onSubmit = {handleAddTask}
          className="rounded-2xl border border-slate-700 bg-slate-900 p-5"
        >
          <label htmlFor="task-title" className="block font-medium">
            Task Title
          </label>

            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) => { 
                setTitle(event.target.value) 
                setAddError('') 
              }}
              aria-invalid = {Boolean(addError)}
              aria-describedby={addError ? "add-task-error" : undefined}
              placeholder="e.g. Finish my project outline"
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
            />

            {addError && (
              <p id="add-task-error" role="alert" className="mt-2 text-sm text-rose-400">
                {addError}
              </p>
            )}

            <label htmlFor="task-description" className="mt-4 block font-medium">
              Description <span className="text-slate-400">(optional)</span>
            </label>
            <textarea 
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={2}
              placeholder="Add more detail about this task"
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
            />

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="task-priority" className="block font-medium">
                  Priority
                </label>
                <select
                  id="task-priority"
                  value={priority}
                  onChange={(event) => setPriority(event.target.value as Priority)
                  }
                  className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="task-due-date" className="block font-medium">
                  Due date <span className="text-slate-400">(optional)</span>
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              Add task
            </button>
        </form>

        <section aria-labelledby="task-list-heading" className="mt-8">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 id="task-list-heading" className="text-xl font-semibold">
              Task list
            </h2>
            <span className="text-sm text-slate-400">
              {completedCount} of {tasks.length} completed
            </span>
          </div>

          <div className="mb-4 grid gap-3 rounded-xl border border-slate-700 bg-slate-900 p-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium"              
              >
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
                className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 focus:border-cyan-400 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="priority-filter"
                className="block text-sm font-medium"
              >
                Priority
              </label>
              <select
                id="priority-filter"
                value={priorityFilter}
                onChange={(event) => 
                  setPriorityFilter(event.target.value as PriorityFilter)
                }
                className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 focus:border-cyan-400 focus:outline-none"
              >
                <option value="all">All priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {!canReorder && tasks.length > 1 && (
            <p className="mb-4 text-sm text-slate-400">
              Set both filters to All to reorder tasks.
            </p>
          )}

          {tasks.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-slate-400">
              No tasks yet. Add your first one above.
            </p>
          ) : visibleTasks.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-slate-400">
              No tasks match these filters. Try changing a filter.
            </p>
          ) : (
            <ul className="space-y-3">
              {visibleTasks.map((task, index) => (
                <li
                  key={task.id}
                  onDragOver={(event) => handleDragOver(event, task.id)}
                  onDrop={(event) => handleDrop(event, task.id)}
                  className={`rounded-xl border bg-slate-900 px-5 py-4 ${
                    dropTargetId === task.id ? 'border-cyan-400' : 'border-slate-700'
                  } ${draggedTaskId === task.id ? 'opacity-50' : ''}`}
                >
                  {editingId === task.id ? (
                    <form onSubmit={handleSaveEdit}>
                      <label htmlFor={`edit-task-${task.id}`}
                        className="block text-sm font-medium"
                      >
                        Task title
                      </label>
                      <input
                        id={`edit-task-${task.id}`}
                        type="text"
                        value={editTitle}
                        onChange={(event) => {
                          setEditTitle(event.target.value)
                          setEditError("")
                        }}
                        aria-invalid={Boolean(editError)}
                        aria-describedby={
                          editError ? `edit-error-${task.id}` : undefined
                        }
                        autoFocus
                        className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100 focus:border-cyan-400 focus:outline-none"
                      />

                      {editError && (
                        <p
                          id={`edit-error-${task.id}`}
                          role="alert"
                          className="mt-2 text-sm text-rose-400"
                        >
                          {editError}
                        </p>
                      )}

                      <label
                        htmlFor={`edit-description-${task.id}`}
                        className="mt-4 block text-sm font-medium"
                      >
                        Description (optional)
                      </label>
                      <textarea
                        id={`edit-description-${task.id}`}
                        value={editDescription}
                        onChange={(event) => 
                          setEditDescription(event.target.value)
                        }
                        rows={2}
                        className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-100 focus:border-cyan-400 focus:outline-none"
                      />

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor={`edit-priority-${task.id}`}
                            className="block text-sm font-medium"
                          >
                            Priority
                          </label>
                          <select
                            id={`edit-priority-${task.id}`}
                            value={editPriority}
                            onChange={(event) => 
                              setEditPriority(event.target.value as Priority)
                            }
                            className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 focus:border-cyan-400 focus:outline-none"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor={`edit-due-date-${task.id}`}
                            className="block text-sm font-medium"
                          >
                            Due Date (optional)
                          </label>
                          <input
                            id={`edit-due-date-${task.id}`}
                            type="date"
                            value={editDueDate}
                            onChange={(event) => 
                              setEditDueDate(event.target.value)
                            }
                            className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 focus:border-cyan-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          type="submit"
                          className="rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-300"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="rounded-lg border border-slate-600 px-4 py-2 hover:bg-slate-800"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                      <div className="min-w-0 flex-1">
                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task.id)}
                          className="mt-0.5 h-5 w-5 shrink-0 accent-cyan-400"
                        />
                        <span
                          className={`min-w-0 wrap-break-word ${
                            task.completed
                              ? "text-slate-400 line-through"
                              : "text-slate-100"
                          }`}
                        >
                          {task.title}
                        </span>
                      </label>

                      {task.description && (
                        <p className="mt-2 wrap-break-word pl-8 text-sm text-slate-400">
                          {task.description}
                        </p>
                      )}

                        <div className="mt-3 flex flex-wrap gap-2 pl-8 text-xs">
                          <span className={`rounded-full px-2.5 py-1 ${priorityColors[task.priority]}`}>
                            {task.priority} priority
                          </span>
                          {task.dueDate && (
                            <span className="rounded-full bg-slate-800 px-2.5 py-1 text-slate-300">
                              Due: {task.dueDate}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex w-full flex-wrap justify-end gap-2 sm:w-auto">
                        {canDrag && (
                          <span
                            draggable
                            onDragStart={(event) => handleDragStart(event, task.id)}
                            onDragEnd={handleDragEnd}
                            aria-hidden="true"
                            title="Drag to reorder"
                            className="inline-flex cursor-grab select-none items-center rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-300 active:cursor-grabbing"
                          >
                            ⋮⋮
                          </span>
                        )}

                        {canReorder && (
                          <>
                            <button
                              type="button"
                              onClick={() => moveTaskByOffset(task.id, -1)}
                              disabled={index === 0}
                              aria-label={`Move ${task.title} up`}
                              className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => moveTaskByOffset(task.id, 1)}
                              disabled={index === tasks.length - 1}
                              aria-label={`Move ${task.title} down`}
                              className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              ↓
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => startEditing(task)}
                          className="rounded-lg border border-slate-600 px-3 py-2 text-sm hover:bg-slate-800"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                          className="rounded-lg border border-rose-500/50 px-3 py-2 text-sm text-rose-300 hover:bg-rose-950"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App