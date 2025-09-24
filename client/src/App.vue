<script setup>
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import TaskCard from './components/TaskCard.vue'
import TaskForm from './components/TaskForm.vue'
import TaskFilter from './components/TaskFilter.vue'
import TaskStats from './components/TaskStats.vue'

// Reactive state
const tasks = ref([])
const showTaskForm = ref(false)
const editingTask = ref(null)
const loading = ref(false)
const error = ref(null)
const socket = ref(null)
const filter = reactive({
  status: 'all',
  priority: 'all',
  category: 'all',
  search: ''
})

// Computed properties
const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    const matchesStatus = filter.status === 'all' || task.status === filter.status
    const matchesPriority = filter.priority === 'all' || task.priority === filter.priority
    const matchesCategory = filter.category === 'all' || task.category === filter.category
    const matchesSearch = filter.search === '' || 
      task.title.toLowerCase().includes(filter.search.toLowerCase()) ||
      task.description.toLowerCase().includes(filter.search.toLowerCase()) ||
      task.assignee.toLowerCase().includes(filter.search.toLowerCase())
    
    return matchesStatus && matchesPriority && matchesCategory && matchesSearch
  })
})

const tasksByStatus = computed(() => {
  const grouped = {
    todo: [],
    'in-progress': [],
    done: []
  }
  
  filteredTasks.value.forEach(task => {
    grouped[task.status].push(task)
  })
  
  return grouped
})

// API Methods
const fetchTasks = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await fetch('/api/tasks')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    tasks.value = data
  } catch (err) {
    error.value = err.message
    console.error('Error fetching tasks:', err)
  } finally {
    loading.value = false
  }
}

const addTask = async (taskData) => {
  try {
    loading.value = true
    error.value = null
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const newTask = await response.json()
    tasks.value.unshift(newTask)
    showTaskForm.value = false
  } catch (err) {
    error.value = err.message
    console.error('Error creating task:', err)
  } finally {
    loading.value = false
  }
}

const updateTask = async (taskData) => {
  try {
    loading.value = true
    error.value = null
    const response = await fetch(`/api/tasks/${taskData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const updatedTask = await response.json()
    const index = tasks.value.findIndex(task => task.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }
    showTaskForm.value = false
    editingTask.value = null
  } catch (err) {
    error.value = err.message
    console.error('Error updating task:', err)
  } finally {
    loading.value = false
  }
}

const deleteTask = async (taskId) => {
  try {
    loading.value = true
    error.value = null
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const index = tasks.value.findIndex(task => task.id === taskId)
    if (index !== -1) {
      tasks.value.splice(index, 1)
    }
  } catch (err) {
    error.value = err.message
    console.error('Error deleting task:', err)
  } finally {
    loading.value = false
  }
}

const updateTaskStatus = async (taskId, newStatus) => {
  try {
    const response = await fetch(`/api/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const updatedTask = await response.json()
    const index = tasks.value.findIndex(task => task.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }
  } catch (err) {
    error.value = err.message
    console.error('Error updating task status:', err)
  }
}

// UI Methods
const editTask = (task) => {
  editingTask.value = task
  showTaskForm.value = true
}

const cancelEdit = () => {
  showTaskForm.value = false
  editingTask.value = null
}

// Socket.io setup
const setupSocket = () => {
  socket.value = io('http://localhost:4001')
  
  socket.value.on('connect', () => {
    console.log('Connected to server')
  })
  
  socket.value.on('disconnect', () => {
    console.log('Disconnected from server')
  })
  
  socket.value.on('task-created', (newTask) => {
    tasks.value.unshift(newTask)
  })
  
  socket.value.on('task-updated', (updatedTask) => {
    const index = tasks.value.findIndex(task => task.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }
  })
  
  socket.value.on('task-deleted', (deletedTask) => {
    const index = tasks.value.findIndex(task => task.id === deletedTask.id)
    if (index !== -1) {
      tasks.value.splice(index, 1)
    }
  })
  
  socket.value.on('task-status-updated', (updatedTask) => {
    const index = tasks.value.findIndex(task => task.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }
  })
  
  socket.value.on('tasks-updated', (allTasks) => {
    tasks.value = allTasks
  })
}

// Lifecycle
onMounted(async () => {
  await fetchTasks()
  setupSocket()
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect()
  }
})
</script>

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
          <button @click="showTaskForm = true" class="btn btn-primary">
            <span class="icon">➕</span>
            Add Task
          </button>
        </div>
      </div>
    </header>

    <!-- Stats -->
    <TaskStats :tasks="tasks" />

    <!-- Filters -->
    <TaskFilter v-model:filter="filter" />

    <!-- Loading State -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading tasks...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-banner">
      <div class="error-content">
        <span class="error-icon">⚠️</span>
        <span class="error-message">{{ error }}</span>
        <button @click="fetchTasks" class="retry-btn">Retry</button>
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
              <span class="task-count">{{ tasksByStatus.todo.length }}</span>
            </h3>
          </div>
          <div class="column-content">
            <TaskCard
              v-for="task in tasksByStatus.todo"
              :key="task.id"
              :task="task"
              @edit="editTask"
              @delete="deleteTask"
              @status-change="updateTaskStatus"
            />
            <div v-if="tasksByStatus.todo.length === 0" class="empty-state">
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
              <span class="task-count">{{ tasksByStatus['in-progress'].length }}</span>
            </h3>
          </div>
          <div class="column-content">
            <TaskCard
              v-for="task in tasksByStatus['in-progress']"
              :key="task.id"
              :task="task"
              @edit="editTask"
              @delete="deleteTask"
              @status-change="updateTaskStatus"
            />
            <div v-if="tasksByStatus['in-progress'].length === 0" class="empty-state">
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
              <span class="task-count">{{ tasksByStatus.done.length }}</span>
            </h3>
          </div>
          <div class="column-content">
            <TaskCard
              v-for="task in tasksByStatus.done"
              :key="task.id"
              :task="task"
              @edit="editTask"
              @delete="deleteTask"
              @status-change="updateTaskStatus"
            />
            <div v-if="tasksByStatus.done.length === 0" class="empty-state">
              <p>No completed tasks</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Task Form Modal -->
    <div v-if="showTaskForm" class="modal-overlay" @click="cancelEdit">
      <div class="modal-content" @click.stop>
        <TaskForm
          :task="editingTask"
          @save="editingTask ? updateTask : addTask"
          @cancel="cancelEdit"
        />
      </div>
    </div>
  </div>
</template>

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

/* Loading and Error States */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
}

.loading-spinner {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-banner {
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  margin: 1rem 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 1400px;
  width: 100%;
}

.error-icon {
  font-size: 1.25rem;
}

.error-message {
  flex: 1;
  font-weight: 500;
}

.retry-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: #b91c1c;
  transform: translateY(-1px);
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
  
  .error-banner {
    margin: 1rem;
  }
  
  .error-content {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
}
</style>
