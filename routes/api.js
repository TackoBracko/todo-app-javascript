import PocketBase from 'pocketbase';
import express from 'express';

const pb = new PocketBase('http://127.0.0.1:8090');

const apiRouter = express.Router();

apiRouter.get('/tasks', async (req, res) => {
  const tasks = await pb.collection('tasks').getFullList({
    sort: '-created',
  });
  console.log('TASKS', tasks);
  res.json({ data: tasks });
});

apiRouter.post('/tasks', (req, res) => {
  const task = req.body;
  // Write task to DB
});

apiRouter.put('/todos/:id', (req, res) => {
  // Update Task in DB
});

apiRouter.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
});

export default apiRouter;
