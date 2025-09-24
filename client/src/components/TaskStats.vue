<script setup>
import { computed } from 'vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  }
})

const stats = computed(() => {
  const total = props.tasks.length
  const todo = props.tasks.filter(task => task.status === 'todo').length
  const inProgress = props.tasks.filter(task => task.status === 'in-progress').length
  const done = props.tasks.filter(task => task.status === 'done').length
  
  const highPriority = props.tasks.filter(task => task.priority === 'high').length
  const mediumPriority = props.tasks.filter(task => task.priority === 'medium').length
  const lowPriority = props.tasks.filter(task => task.priority === 'low').length
  
  const overdue = props.tasks.filter(task => {
    if (!task.dueDate) return false
    const dueDate = new Date(task.dueDate)
    const now = new Date()
    return dueDate < now && task.status !== 'done'
  }).length
  
  const dueToday = props.tasks.filter(task => {
    if (!task.dueDate) return false
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate.getTime() === today.getTime() && task.status !== 'done'
  }).length
  
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0
  
  return {
    total,
    todo,
    inProgress,
    done,
    highPriority,
    mediumPriority,
    lowPriority,
    overdue,
    dueToday,
    completionRate
  }
})

const statCards = computed(() => [
  {
    title: 'Total Tasks',
    value: stats.value.total,
    icon: '📋',
    color: '#3b82f6',
    bgColor: '#dbeafe'
  },
  {
    title: 'To Do',
    value: stats.value.todo,
    icon: '📝',
    color: '#6b7280',
    bgColor: '#f3f4f6'
  },
  {
    title: 'In Progress',
    value: stats.value.inProgress,
    icon: '⚡',
    color: '#f59e0b',
    bgColor: '#fef3c7'
  },
  {
    title: 'Completed',
    value: stats.value.done,
    icon: '✅',
    color: '#10b981',
    bgColor: '#d1fae5'
  },
  {
    title: 'Overdue',
    value: stats.value.overdue,
    icon: '⚠️',
    color: '#ef4444',
    bgColor: '#fee2e2'
  },
  {
    title: 'Due Today',
    value: stats.value.dueToday,
    icon: '📅',
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  }
])
</script>

<template>
  <div class="task-stats">
    <div class="stats-container">
      <div class="stats-header">
        <h2 class="stats-title">
          <span class="icon">📊</span>
          Task Statistics
        </h2>
        <div class="completion-rate">
          <div class="completion-circle">
            <svg class="progress-ring" width="60" height="60">
              <circle
                class="progress-ring-circle-bg"
                stroke="#e5e7eb"
                stroke-width="4"
                fill="transparent"
                r="26"
                cx="30"
                cy="30"
              />
              <circle
                class="progress-ring-circle"
                :stroke-dasharray="`${2 * Math.PI * 26}`"
                :stroke-dashoffset="`${2 * Math.PI * 26 * (1 - stats.completionRate / 100)}`"
                stroke="#10b981"
                stroke-width="4"
                fill="transparent"
                r="26"
                cx="30"
                cy="30"
              />
            </svg>
            <div class="completion-text">
              <span class="completion-percentage">{{ stats.completionRate }}%</span>
              <span class="completion-label">Complete</span>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-grid">
        <div
          v-for="card in statCards"
          :key="card.title"
          class="stat-card"
          :style="{ '--card-color': card.color, '--card-bg': card.bgColor }"
        >
          <div class="stat-icon">{{ card.icon }}</div>
          <div class="stat-content">
            <div class="stat-value">{{ card.value }}</div>
            <div class="stat-title">{{ card.title }}</div>
          </div>
        </div>
      </div>

      <!-- Priority Breakdown -->
      <div class="priority-breakdown">
        <h3 class="breakdown-title">Priority Breakdown</h3>
        <div class="priority-bars">
          <div class="priority-bar">
            <div class="priority-label">
              <span class="priority-icon">🔴</span>
              High Priority
            </div>
            <div class="priority-progress">
              <div 
                class="priority-fill high"
                :style="{ width: `${stats.total > 0 ? (stats.highPriority / stats.total) * 100 : 0}%` }"
              ></div>
            </div>
            <div class="priority-count">{{ stats.highPriority }}</div>
          </div>
          
          <div class="priority-bar">
            <div class="priority-label">
              <span class="priority-icon">🟡</span>
              Medium Priority
            </div>
            <div class="priority-progress">
              <div 
                class="priority-fill medium"
                :style="{ width: `${stats.total > 0 ? (stats.mediumPriority / stats.total) * 100 : 0}%` }"
              ></div>
            </div>
            <div class="priority-count">{{ stats.mediumPriority }}</div>
          </div>
          
          <div class="priority-bar">
            <div class="priority-label">
              <span class="priority-icon">🟢</span>
              Low Priority
            </div>
            <div class="priority-progress">
              <div 
                class="priority-fill low"
                :style="{ width: `${stats.total > 0 ? (stats.lowPriority / stats.total) * 100 : 0}%` }"
              ></div>
            </div>
            <div class="priority-count">{{ stats.lowPriority }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-stats {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  margin-bottom: 2rem;
}

.stats-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.stats-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.completion-rate {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.completion-circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-circle {
  transition: stroke-dashoffset 0.5s ease-in-out;
}

.completion-text {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.completion-percentage {
  font-size: 1rem;
  font-weight: 700;
  color: #10b981;
}

.completion-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--card-bg);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--card-color);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.priority-breakdown {
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.breakdown-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.priority-bars {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.priority-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.priority-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  min-width: 120px;
}

.priority-icon {
  font-size: 0.75rem;
}

.priority-progress {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.priority-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease-in-out;
}

.priority-fill.high {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.priority-fill.medium {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.priority-fill.low {
  background: linear-gradient(90deg, #10b981, #059669);
}

.priority-count {
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
  min-width: 30px;
  text-align: right;
}

@media (max-width: 768px) {
  .task-stats {
    padding: 0 1rem;
  }
  
  .stats-container {
    padding: 1.5rem;
  }
  
  .stats-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .priority-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .priority-label {
    min-width: auto;
  }
  
  .priority-progress {
    width: 100%;
  }
}
</style>
