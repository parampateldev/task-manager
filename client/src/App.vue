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
          <button @click="openTaskForm" class="btn btn-primary">
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

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import TaskCard from './components/TaskCard.vue'
import TaskForm from './components/TaskForm.vue'
import TaskFilter from './components/TaskFilter.vue'
import TaskStats from './components/TaskStats.vue'

// Reactive state
const tasks = ref([])
const showTaskForm = ref(false)
const editingTask = ref(null)
const filter = reactive({
  status: 'all',
  priority: 'all',
  category: 'all',
  search: ''
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
const addTask = (taskData) => {
  console.log('Adding task:', taskData)
  const newTask = {
    ...taskData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  console.log('New task created:', newTask)
  tasks.value.unshift(newTask)
  saveTasksToStorage()
  showTaskForm.value = false
  console.log('Task added successfully, modal closed')
}

const updateTask = (taskData) => {
  const index = tasks.value.findIndex(task => task.id === taskData.id)
  if (index !== -1) {
    tasks.value[index] = { ...tasks.value[index], ...taskData }
    saveTasksToStorage()
  }
  showTaskForm.value = false
  editingTask.value = null
}

const deleteTask = (taskId) => {
  const index = tasks.value.findIndex(task => task.id === taskId)
  if (index !== -1) {
    tasks.value.splice(index, 1)
    saveTasksToStorage()
  }
}

const updateTaskStatus = (taskId, newStatus) => {
  const index = tasks.value.findIndex(task => task.id === taskId)
  if (index !== -1) {
    tasks.value[index].status = newStatus
    saveTasksToStorage()
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

// Debug method to check if modal should show
const openTaskForm = () => {
  console.log('Opening task form...')
  showTaskForm.value = true
  console.log('showTaskForm:', showTaskForm.value)
}

// Lifecycle
onMounted(() => {
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
}
</style>
