<script setup>
import { watch } from 'vue'

const props = defineProps({
  filter: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:filter'])

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' }
]

const priorityOptions = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'low', label: 'Low Priority' }
]

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'design', label: 'Design' },
  { value: 'development', label: 'Development' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'devops', label: 'DevOps' },
  { value: 'research', label: 'Research' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'testing', label: 'Testing' }
]

const updateFilter = (key, value) => {
  const newFilter = { ...props.filter, [key]: value }
  emit('update:filter', newFilter)
}

const clearFilters = () => {
  const clearedFilter = {
    status: 'all',
    priority: 'all',
    category: 'all',
    search: ''
  }
  emit('update:filter', clearedFilter)
}

const hasActiveFilters = () => {
  return props.filter.status !== 'all' || 
         props.filter.priority !== 'all' || 
         props.filter.category !== 'all' || 
         props.filter.search !== ''
}
</script>

<template>
  <div class="task-filter">
    <div class="filter-container">
      <div class="filter-header">
        <h3 class="filter-title">
          <span class="icon">🔍</span>
          Filters
        </h3>
        <button 
          v-if="hasActiveFilters()" 
          @click="clearFilters" 
          class="clear-filters-btn"
        >
          Clear All
        </button>
      </div>

      <div class="filter-controls">
        <!-- Search -->
        <div class="filter-group">
          <label for="search" class="filter-label">Search</label>
          <div class="search-input-container">
            <span class="search-icon">🔍</span>
            <input
              id="search"
              :value="filter.search"
              @input="updateFilter('search', $event.target.value)"
              type="text"
              class="search-input"
              placeholder="Search tasks, descriptions, or assignees..."
            />
          </div>
        </div>

        <!-- Status Filter -->
        <div class="filter-group">
          <label for="status" class="filter-label">Status</label>
          <select
            id="status"
            :value="filter.status"
            @change="updateFilter('status', $event.target.value)"
            class="filter-select"
          >
            <option
              v-for="option in statusOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div class="filter-group">
          <label for="priority" class="filter-label">Priority</label>
          <select
            id="priority"
            :value="filter.priority"
            @change="updateFilter('priority', $event.target.value)"
            class="filter-select"
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

        <!-- Category Filter -->
        <div class="filter-group">
          <label for="category" class="filter-label">Category</label>
          <select
            id="category"
            :value="filter.category"
            @change="updateFilter('category', $event.target.value)"
            class="filter-select"
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
      </div>

      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters()" class="active-filters">
        <span class="active-filters-label">Active filters:</span>
        <div class="active-filter-tags">
          <span 
            v-if="filter.status !== 'all'" 
            class="filter-tag"
          >
            Status: {{ statusOptions.find(opt => opt.value === filter.status)?.label }}
            <button @click="updateFilter('status', 'all')" class="remove-filter">×</button>
          </span>
          <span 
            v-if="filter.priority !== 'all'" 
            class="filter-tag"
          >
            Priority: {{ priorityOptions.find(opt => opt.value === filter.priority)?.label }}
            <button @click="updateFilter('priority', 'all')" class="remove-filter">×</button>
          </span>
          <span 
            v-if="filter.category !== 'all'" 
            class="filter-tag"
          >
            Category: {{ categoryOptions.find(opt => opt.value === filter.category)?.label }}
            <button @click="updateFilter('category', 'all')" class="remove-filter">×</button>
          </span>
          <span 
            v-if="filter.search" 
            class="filter-tag"
          >
            Search: "{{ filter.search }}"
            <button @click="updateFilter('search', '')" class="remove-filter">×</button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-filter {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  margin-bottom: 2rem;
}

.filter-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.filter-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.clear-filters-btn {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-filters-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.filter-controls {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.search-input-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 0.875rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.active-filters {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.active-filters-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
}

.active-filter-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #dbeafe;
  color: #1e40af;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.remove-filter {
  background: none;
  border: none;
  color: #1e40af;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.remove-filter:hover {
  background: #93c5fd;
  color: white;
}

@media (max-width: 1024px) {
  .filter-controls {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .task-filter {
    padding: 0 1rem;
  }
  
  .filter-controls {
    grid-template-columns: 1fr;
  }
  
  .filter-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .active-filters {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
