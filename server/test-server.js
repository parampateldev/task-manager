import express from "express";
import cors from "cors";

const app = express();
const port = 4001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/tasks", (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Test Task',
      description: 'This is a test task',
      status: 'todo',
      priority: 'high',
      category: 'development',
      dueDate: '2024-01-15',
      assignee: 'Test User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
});

app.listen(port, () => {
  console.log(`🚀 Test server running on http://localhost:${port}`);
});
