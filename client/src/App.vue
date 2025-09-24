<template>
  <div class="task-manager">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="app-title">
            <span class="icon">📋</span>
            Task Manager
          </h1>
          <p class="app-subtitle">Stay organized and productive</p>
        </div>
        <div class="header-right">
          <button @click="showForm = true" class="btn btn-primary">
            <span class="icon">➕</span>
            Add Task
          </button>
        </div>
      </div>
    </header>

    <!-- Stats -->
    <div class="stats-section">
      <div class="stat-card">
        <h3>Total Tasks</h3>
        <span class="stat-number">{{ tasks.length }}</span>
      </div>
      <div class="stat-card">
        <h3>To Do</h3>
        <span class="stat-number">{{ tasks.filter(t => t.status === 'todo').length }}</span>
      </div>
      <div class="stat-card">
        <h3>In Progress</h3>
        <span class="stat-number">{{ tasks.filter(t => t.status === 'in-progress').length }}</span>
      </div>
      <div class="stat-card">
        <h3>Done</h3>
        <span class="stat-number">{{ tasks.filter(t => t.status === 'done').length }}</span>
      </div>
    </div>

    <!-- Main Content -->
    <main class="main-content">
      <div class="kanban-board">
        <!-- Todo Column -->
        <div class="column">
          <div class="column-header">
            <h3 class="column-title">
              <span class="status-icon todo">📝</span>
              To Do
              <span class="task-count">{{ tasks.filter(t => t.status === 'todo').length }}</span>
            </h3>
          </div>
          <div class="column-content">
            <div
              v-for="task in tasks.filter(t => t.status === 'todo')"
              :key="task.id"
              class="task-card"
            >
              <div class="task-header">
                <h4 class="task-title">{{ task.title }}</h4>
                <div class="task-actions">
                  <button @click="editTask(task)" class="action-btn edit-btn" title="Edit Task">
                    ✏️
                  </button>
                  <button @click="deleteTask(task.id)" class="action-btn delete-btn" title="Delete Task">
                    🗑️
                  </button>
                </div>
              </div>
              <p class="task-description">{{ task.description }}</p>
              <div class="task-meta">
                <span :class="['task-priority', `priority-${task.priority}`]">{{ task.priority }}</span>
                <span class="task-category">#{{ task.category }}</span>
              </div>
              <div class="task-footer">
                <div class="task-assignee">
                  Assigned to: <strong>{{ task.assignee }}</strong>
                </div>
                <div class="task-due-date">
                  Due: {{ task.dueDate || 'No due date' }}
                </div>
              </div>
              <div class="task-status-changer">
                <label>Status:</label>
                <select :value="task.status" @change="updateTaskStatus(task.id, $event.target.value)">
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
            <div v-if="tasks.filter(t => t.status === 'todo').length === 0" class="empty-state">
              <p>No tasks to do</p>
            </div>
          </div>
        </div>

        <!-- In Progress Column -->
        <div class="column">
          <div class="column-header">
            <h3 class="column-title">
              <span class="status-icon in-progress">⚡</span>
              In Progress
              <span class="task-count">{{ tasks.filter(t => t.status === 'in-progress').length }}</span>
            </h3>
          </div>
          <div class="column-content">
            <div
              v-for="task in tasks.filter(t => t.status === 'in-progress')"
              :key="task.id"
              class="task-card"
            >
              <div class="task-header">
                <h4 class="task-title">{{ task.title }}</h4>
                <div class="task-actions">
                  <button @click="editTask(task)" class="action-btn edit-btn" title="Edit Task">
                    ✏️
                  </button>
                  <button @click="deleteTask(task.id)" class="action-btn delete-btn" title="Delete Task">
                    🗑️
                  </button>
                </div>
              </div>
              <p class="task-description">{{ task.description }}</p>
              <div class="task-meta">
                <span :class="['task-priority', `priority-${task.priority}`]">{{ task.priority }}</span>
                <span class="task-category">#{{ task.category }}</span>
              </div>
              <div class="task-footer">
                <div class="task-assignee">
                  Assigned to: <strong>{{ task.assignee }}</strong>
                </div>
                <div class="task-due-date">
                  Due: {{ task.dueDate || 'No due date' }}
                </div>
              </div>
              <div class="task-status-changer">
                <label>Status:</label>
                <select :value="task.status" @change="updateTaskStatus(task.id, $event.target.value)">
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
            <div v-if="tasks.filter(t => t.status === 'in-progress').length === 0" class="empty-state">
              <p>No tasks in progress</p>
            </div>
          </div>
        </div>

        <!-- Done Column -->
        <div class="column">
          <div class="column-header">
            <h3 class="column-title">
              <span class="status-icon done">✅</span>
              Done
              <span class="task-count">{{ tasks.filter(t => t.status === 'done').length }}</span>
            </h3>
          </div>
          <div class="column-content">
            <div
              v-for="task in tasks.filter(t => t.status === 'done')"
              :key="task.id"
              class="task-card"
            >
              <div class="task-header">
                <h4 class="task-title">{{ task.title }}</h4>
                <div class="task-actions">
                  <button @click="editTask(task)" class="action-btn edit-btn" title="Edit Task">
                    ✏️
                  </button>
                  <button @click="deleteTask(task.id)" class="action-btn delete-btn" title="Delete Task">
                    🗑️
                  </button>
                </div>
              </div>
              <p class="task-description">{{ task.description }}</p>
              <div class="task-meta">
                <span :class="['task-priority', `priority-${task.priority}`]">{{ task.priority }}</span>
                <span class="task-category">#{{ task.category }}</span>
              </div>
              <div class="task-footer">
                <div class="task-assignee">
                  Assigned to: <strong>{{ task.assignee }}</strong>
                </div>
                <div class="task-due-date">
                  Due: {{ task.dueDate || 'No due date' }}
                </div>
              </div>
              <div class="task-status-changer">
                <label>Status:</label>
                <select :value="task.status" @change="updateTaskStatus(task.id, $event.target.value)">
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
            <div v-if="tasks.filter(t => t.status === 'done').length === 0" class="empty-state">
              <p>No completed tasks</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Task Form Modal -->
    <div v-if="showForm" class="modal-overlay" @click="closeForm">
      <div class="modal-content" @click.stop>
        <div class="task-form">
          <div class="form-header">
            <h2 class="form-title">
              {{ editingTask ? 'Edit Task' : 'Create New Task' }}
            </h2>
            <button @click="closeForm" class="close-btn">
              <span>✕</span>
            </button>
          </div>

          <form @submit.prevent="saveTask" class="form">
            <div class="form-group">
              <label for="title" class="form-label">Title *</label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                class="form-input"
                placeholder="Enter task title"
                required
              />
            </div>

            <div class="form-group">
              <label for="description" class="form-label">Description *</label>
              <textarea
                id="description"
                v-model="form.description"
                class="form-textarea"
                placeholder="Enter task description"
                rows="4"
                required
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="status" class="form-label">Status</label>
                <select id="status" v-model="form.status" class="form-select">
                  <option value="todo">📝 To Do</option>
                  <option value="in-progress">⚡ In Progress</option>
                  <option value="done">✅ Done</option>
                </select>
              </div>

              <div class="form-group">
                <label for="priority" class="form-label">Priority</label>
                <select id="priority" v-model="form.priority" class="form-select">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="category" class="form-label">Category</label>
                <select id="category" v-model="form.category" class="form-select">
                  <option value="design">Design</option>
                  <option value="development">Development</option>
                  <option value="documentation">Documentation</option>
                  <option value="devops">DevOps</option>
                  <option value="research">Research</option>
                  <option value="marketing">Marketing</option>
                  <option value="testing">Testing</option>
                </select>
              </div>

              <div class="form-group">
                <label for="dueDate" class="form-label">Due Date</label>
                <input
                  id="dueDate"
                  v-model="form.dueDate"
                  type="date"
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="assignee" class="form-label">Assignee *</label>
              <input
                id="assignee"
                v-model="form.assignee"
                type="text"
                class="form-input"
                placeholder="Enter assignee name"
                required
              />
            </div>

            <div class="form-actions">
              <button type="button" @click="closeForm" class="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                {{ editingTask ? 'Update Task' : 'Create Task' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// Reactive state
const tasks = ref([])
const showForm = ref(false)
const editingTask = ref(null)

const form = reactive({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  category: 'development',
  dueDate: '',
  assignee: ''
})

// Sample tasks for demo
const sampleTasks = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create a modern, responsive landing page for the new product launch',
    status: 'todo',
    priority: 'high',
    category: 'design',
    assignee: 'John Doe',
    dueDate: '2024-01-15',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Add login and registration functionality with JWT tokens',
    status: 'in-progress',
    priority: 'high',
    category: 'development',
    assignee: 'Jane Smith',
    dueDate: '2024-01-20',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all REST API endpoints with examples',
    status: 'done',
    priority: 'medium',
    category: 'documentation',
    assignee: 'Mike Johnson',
    dueDate: '2024-01-10',
    createdAt: new Date().toISOString()
  }
]

// Local storage methods
const saveTasksToStorage = () => {
  localStorage.setItem('taskManager_tasks', JSON.stringify(tasks.value))
}

const loadTasksFromStorage = () => {
  const stored = localStorage.getItem('taskManager_tasks')
  if (stored) {
    tasks.value = JSON.parse(stored)
  } else {
    tasks.value = [...sampleTasks]
    saveTasksToStorage()
  }
}

// Task management methods
const saveTask = () => {
  console.log('Saving task:', form)
  
  if (editingTask.value) {
    // Update existing task
    const index = tasks.value.findIndex(task => task.id === editingTask.value.id)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...form }
    }
  } else {
    // Create new task
    const newTask = {
      ...form,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    tasks.value.unshift(newTask)
  }
  
  saveTasksToStorage()
  closeForm()
  console.log('Task saved successfully')
}

const editTask = (task) => {
  console.log('Editing task:', task)
  editingTask.value = task
  Object.assign(form, task)
  showForm.value = true
}

const deleteTask = (taskId) => {
  console.log('Deleting task:', taskId)
  const index = tasks.value.findIndex(task => task.id === taskId)
  if (index !== -1) {
    tasks.value.splice(index, 1)
    saveTasksToStorage()
  }
}

const updateTaskStatus = (taskId, newStatus) => {
  console.log('Updating task status:', taskId, newStatus)
  const index = tasks.value.findIndex(task => task.id === taskId)
  if (index !== -1) {
    tasks.value[index].status = newStatus
    saveTasksToStorage()
  }
}

const closeForm = () => {
  showForm.value = false
  editingTask.value = null
  Object.assign(form, {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    category: 'development',
    dueDate: '',
    assignee: ''
  })
}

// Lifecycle
onMounted(() => {
  console.log('Task Manager mounted')
  loadTasksFromStorage()
})
</script>

<style scoped>
.task-manager {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.app-title {
  font-size: 2rem;
  font-weight: 800;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.app-subtitle {
  color: #718096;
  margin: 0;
  font-size: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.stats-section {
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-card h3 {
  margin: 0 0 0.5rem 0;
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 600;
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #2d3748;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.kanban-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.column {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.column-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.5);
}

.column-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.task-count {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.column-content {
  padding: 1.5rem;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.task-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.task-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  line-height: 1.4;
  flex-grow: 1;
  padding-right: 0.5rem;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
}

.action-btn:hover {
  background-color: #f0f4f8;
}

.task-description {
  font-size: 0.9rem;
  color: #4a5568;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.task-meta {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.task-priority {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  text-transform: capitalize;
}

.priority-high {
  background-color: #fee2e2;
  color: #ef4444;
}

.priority-medium {
  background-color: #fffbe0;
  color: #f59e0b;
}

.priority-low {
  background-color: #e0f2fe;
  color: #0ea5e9;
}

.task-category {
  font-size: 0.75rem;
  font-weight: 500;
  color: #4299e1;
  background-color: #ebf8ff;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #718096;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #edf2f7;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.task-status-changer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #edf2f7;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.task-status-changer select {
  flex-grow: 1;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #cbd5e0;
  background-color: #f7fafc;
  font-size: 0.9rem;
  color: #2d3748;
  cursor: pointer;
}

.task-status-changer select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.empty-state {
  text-align: center;
  color: #a0aec0;
  padding: 2rem;
  font-style: italic;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.task-form {
  padding: 2rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.form-input,
.form-textarea,
.form-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .kanban-board {
    grid-template-columns: 1fr;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
