<script setup>
import { ref, reactive, onMounted } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'cancel'])

const form = reactive({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  category: 'development',
  dueDate: '',
  assignee: ''
})

const errors = ref({})

const statusOptions = [
  { value: 'todo', label: 'To Do', icon: '📝' },
  { value: 'in-progress', label: 'In Progress', icon: '⚡' },
  { value: 'done', label: 'Done', icon: '✅' }
]

const priorityOptions = [
  { value: 'low', label: 'Low', color: '#10b981' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#ef4444' }
]

const categoryOptions = [
  { value: 'design', label: 'Design', color: '#8b5cf6' },
  { value: 'development', label: 'Development', color: '#3b82f6' },
  { value: 'documentation', label: 'Documentation', color: '#06b6d4' },
  { value: 'devops', label: 'DevOps', color: '#f59e0b' },
  { value: 'research', label: 'Research', color: '#10b981' },
  { value: 'marketing', label: 'Marketing', color: '#ec4899' },
  { value: 'testing', label: 'Testing', color: '#84cc16' }
]

const validateForm = () => {
  errors.value = {}
  
  if (!form.title.trim()) {
    errors.value.title = 'Title is required'
  }
  
  if (!form.description.trim()) {
    errors.value.description = 'Description is required'
  }
  
  if (!form.assignee.trim()) {
    errors.value.assignee = 'Assignee is required'
  }
  
  if (form.dueDate && new Date(form.dueDate) < new Date()) {
    errors.value.dueDate = 'Due date cannot be in the past'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (validateForm()) {
    const taskData = {
      ...form,
      id: props.task?.id
    }
    emit('save', taskData)
  }
}

const handleCancel = () => {
  emit('cancel')
}

onMounted(() => {
  if (props.task) {
    Object.assign(form, props.task)
  }
})
</script>

<template>
  <div class="task-form">
    <div class="form-header">
      <h2 class="form-title">
        {{ task ? 'Edit Task' : 'Create New Task' }}
      </h2>
      <button @click="handleCancel" class="close-btn">
        <span>✕</span>
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="title" class="form-label">Title *</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          class="form-input"
          :class="{ 'error': errors.title }"
          placeholder="Enter task title"
        />
        <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
      </div>

      <div class="form-group">
        <label for="description" class="form-label">Description *</label>
        <textarea
          id="description"
          v-model="form.description"
          class="form-textarea"
          :class="{ 'error': errors.description }"
          placeholder="Enter task description"
          rows="4"
        ></textarea>
        <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="status" class="form-label">Status</label>
          <select
            id="status"
            v-model="form.status"
            class="form-select"
          >
            <option
              v-for="option in statusOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.icon }} {{ option.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="priority" class="form-label">Priority</label>
          <select
            id="priority"
            v-model="form.priority"
            class="form-select"
          >
            <option
              v-for="option in priorityOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="category" class="form-label">Category</label>
          <select
            id="category"
            v-model="form.category"
            class="form-select"
          >
            <option
              v-for="option in categoryOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="dueDate" class="form-label">Due Date</label>
          <input
            id="dueDate"
            v-model="form.dueDate"
            type="date"
            class="form-input"
            :class="{ 'error': errors.dueDate }"
          />
          <span v-if="errors.dueDate" class="error-message">{{ errors.dueDate }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="assignee" class="form-label">Assignee *</label>
        <input
          id="assignee"
          v-model="form.assignee"
          type="text"
          class="form-input"
          :class="{ 'error': errors.assignee }"
          placeholder="Enter assignee name"
        />
        <span v-if="errors.assignee" class="error-message">{{ errors.assignee }}</span>
      </div>

      <div class="form-actions">
        <button type="button" @click="handleCancel" class="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary">
          {{ task ? 'Update Task' : 'Create Task' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
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

.form-input.error,
.form-textarea.error,
.form-select.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
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

@media (max-width: 640px) {
  .task-form {
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
