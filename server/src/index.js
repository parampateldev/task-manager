import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: { 
    origin: ["http://localhost:5179", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  } 
});

const port = process.env.PORT || 4001;

// In-memory storage for tasks (in production, use a database)
let tasks = [
  {
    id: 1,
    title: 'Design new landing page',
    description: 'Create a modern, responsive landing page for the product launch',
    status: 'todo',
    priority: 'high',
    category: 'design',
    dueDate: '2024-01-15',
    assignee: 'John Doe',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Implement user authentication',
    description: 'Add login, register, and password reset functionality',
    status: 'in-progress',
    priority: 'high',
    category: 'development',
    dueDate: '2024-01-20',
    assignee: 'Jane Smith',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Write API documentation',
    description: 'Document all REST API endpoints with examples',
    status: 'todo',
    priority: 'medium',
    category: 'documentation',
    dueDate: '2024-01-25',
    assignee: 'Mike Johnson',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Setup CI/CD pipeline',
    description: 'Configure automated testing and deployment',
    status: 'done',
    priority: 'medium',
    category: 'devops',
    dueDate: '2024-01-10',
    assignee: 'Sarah Wilson',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 5,
    title: 'Conduct user research',
    description: 'Interview 10 users to understand pain points',
    status: 'in-progress',
    priority: 'low',
    category: 'research',
    dueDate: '2024-01-30',
    assignee: 'Alex Brown',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextId = 6;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// Get task by ID
app.get("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  
  res.json(task);
});

// Create new task
app.post("/api/tasks", (req, res) => {
  const { title, description, status, priority, category, dueDate, assignee } = req.body;
  
  if (!title || !description || !assignee) {
    return res.status(400).json({ 
      error: "Title, description, and assignee are required" 
    });
  }
  
  const newTask = {
    id: nextId++,
    title,
    description,
    status: status || 'todo',
    priority: priority || 'medium',
    category: category || 'development',
    dueDate: dueDate || null,
    assignee,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  
  // Emit to all connected clients
  io.emit('task-created', newTask);
  
  res.status(201).json(newTask);
});

// Update task
app.put("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  
  const updatedTask = {
    ...tasks[taskIndex],
    ...req.body,
    id: taskId, // Ensure ID doesn't change
    updatedAt: new Date().toISOString()
  };
  
  tasks[taskIndex] = updatedTask;
  
  // Emit to all connected clients
  io.emit('task-updated', updatedTask);
  
  res.json(updatedTask);
});

// Delete task
app.delete("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  
  const deletedTask = tasks[taskIndex];
  tasks.splice(taskIndex, 1);
  
  // Emit to all connected clients
  io.emit('task-deleted', deletedTask);
  
  res.json({ message: "Task deleted successfully", task: deletedTask });
});

// Update task status
app.patch("/api/tasks/:id/status", (req, res) => {
  const taskId = parseInt(req.params.id);
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }
  
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  
  tasks[taskIndex].status = status;
  tasks[taskIndex].updatedAt = new Date().toISOString();
  
  // Emit to all connected clients
  io.emit('task-status-updated', tasks[taskIndex]);
  
  res.json(tasks[taskIndex]);
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  // Send current tasks to newly connected client
  socket.emit('tasks-updated', tasks);
  
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
  
  // Handle real-time task updates
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Client ${socket.id} joined room ${roomId}`);
  });
  
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`Client ${socket.id} left room ${roomId}`);
  });
});

server.listen(port, () => {
  console.log(`🚀 Task Manager server running on http://localhost:${port}`);
  console.log(`📊 API endpoints available at http://localhost:${port}/api`);
  console.log(`🔌 Socket.io server ready for real-time connections`);
});
