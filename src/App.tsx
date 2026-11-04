import { useEffect, useState, type FormEvent } from "react"
import type { Priority, Task } from "./types/task"
import { loadTasks, saveTasks } from "./lib/taskStorage"

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
  const [editError, setEditError] = useState("")

  const completedCount = tasks.filter((task) => task.completed).length

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
    setEditError("")
  }

  function cancelEditing() {
    setEditingId(null)
    setEditTitle("")
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
        task.id === editingId ? { ...task, title: trimmedTitle } : task,
      ),
    )

    cancelEditing()
  }

  function handleDeleteTask(id: string) {
    setTasks((currentTasks) => 
      currentTasks.filter((task) => task.id !== id),
    )
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

          {tasks.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-slate-400">
              No tasks yet. Add your first one above.
            </p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-4"
                >
                  {editingId === task.id ? (
                    <form onSubmit={handleSaveEdit}>
                      <label htmlFor={`edit-task-${task.id}`}
                        className="block text-sm font-medium"
                      >
                        Edit task title
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

                      <div className="mt-3 flex gap-3">
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

                      <div className="flex gap-2 self-end sm:flex-auto">
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