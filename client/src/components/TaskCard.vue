<script setup>
import { computed } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'status-change'])

const priorityColors = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981'
}

const priorityLabels = {
  high: 'High',
  medium: 'Medium',
  low: 'Low'
}

const categoryColors = {
  design: '#8b5cf6',
  development: '#3b82f6',
  documentation: '#06b6d4',
  devops: '#f59e0b',
  research: '#10b981',
  marketing: '#ec4899',
  testing: '#84cc16'
}

const categoryLabels = {
  design: 'Design',
  development: 'Development',
  documentation: 'Documentation',
  devops: 'DevOps',
  research: 'Research',
  marketing: 'Marketing',
  testing: 'Testing'
}

const statusOptions = [
  { value: 'todo', label: 'To Do', icon: '📝' },
  { value: 'in-progress', label: 'In Progress', icon: '⚡' },
  { value: 'done', label: 'Done', icon: '✅' }
]

const formattedDueDate = computed(() => {
  if (!props.task.dueDate) return null
  const date = new Date(props.task.dueDate)
  const now = new Date()
  const diffTime = date - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return { text: 'Overdue', class: 'overdue' }
  if (diffDays === 0) return { text: 'Due today', class: 'due-today' }
  if (diffDays === 1) return { text: 'Due tomorrow', class: 'due-soon' }
  if (diffDays <= 7) return { text: `Due in ${diffDays} days`, class: 'due-soon' }
  return { text: date.toLocaleDateString(), class: 'due-normal' }
})

const handleStatusChange = (newStatus) => {
  emit('status-change', props.task.id, newStatus)
}

const handleEdit = () => {
  emit('edit', props.task)
}

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this task?')) {
    emit('delete', props.task.id)
  }
}
</script>

<template>
  <div class="task-card" :class="`priority-${task.priority}`">
    <div class="task-header">
      <div class="task-title">{{ task.title }}</div>
      <div class="task-actions">
        <button @click="handleEdit" class="btn-icon" title="Edit task">
          <span>✏️</span>
        </button>
        <button @click="handleDelete" class="btn-icon" title="Delete task">
          <span>🗑️</span>
        </button>
      </div>
    </div>

    <div class="task-description">{{ task.description }}</div>

    <div class="task-meta">
      <div class="task-badges">
        <span 
          class="priority-badge" 
          :style="{ backgroundColor: priorityColors[task.priority] }"
        >
          {{ priorityLabels[task.priority] }}
        </span>
        <span 
          class="category-badge" 
          :style="{ backgroundColor: categoryColors[task.category] }"
        >
          {{ categoryLabels[task.category] }}
        </span>
      </div>

      <div class="task-assignee">
        <span class="assignee-icon">👤</span>
        <span class="assignee-name">{{ task.assignee }}</span>
      </div>
    </div>

    <div v-if="formattedDueDate" class="task-due-date" :class="formattedDueDate.class">
      <span class="due-icon">📅</span>
      <span>{{ formattedDueDate.text }}</span>
    </div>

    <div class="task-status">
      <label class="status-label">Status:</label>
      <select 
        :value="task.status" 
        @change="handleStatusChange($event.target.value)"
        class="status-select"
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

    <div class="task-footer">
      <div class="task-dates">
        <small class="created-date">
          Created: {{ new Date(task.createdAt).toLocaleDateString() }}
        </small>
        <small v-if="task.updatedAt !== task.createdAt" class="updated-date">
          Updated: {{ new Date(task.updatedAt).toLocaleDateString() }}
        </small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #e5e7eb;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.task-card.priority-high {
  border-left-color: #ef4444;
}

.task-card.priority-medium {
  border-left-color: #f59e0b;
}

.task-card.priority-low {
  border-left-color: #10b981;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.task-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
  flex: 1;
  margin-right: 0.5rem;
}

.task-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.task-card:hover .task-actions {
  opacity: 1;
}

.btn-icon {
  background: none;
  border: none;
  padding: 0.25rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.btn-icon:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

.task-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.task-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.priority-badge,
.category-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.task-assignee {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.assignee-icon {
  font-size: 0.75rem;
}

.task-due-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.task-due-date.overdue {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.task-due-date.due-today {
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fed7aa;
}

.task-due-date.due-soon {
  background: #f0f9ff;
  color: #0284c7;
  border: 1px solid #bae6fd;
}

.task-due-date.due-normal {
  background: #f9fafb;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}

.task-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.status-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.status-select {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.status-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.task-footer {
  border-top: 1px solid #f3f4f6;
  padding-top: 0.75rem;
}

.task-dates {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.created-date,
.updated-date {
  color: #9ca3af;
  font-size: 0.75rem;
}

@media (max-width: 640px) {
  .task-meta {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .task-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .task-actions {
    opacity: 1;
    align-self: flex-end;
  }
}
</style>
