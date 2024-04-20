import PocketBase from 'pocketbase';
import express from 'express';
import z from 'zod';

const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
});

const newTaskSchema = taskSchema.omit({ id: true });

const pb = new PocketBase('http://127.0.0.1:8090');

const apiRouter = express.Router();

apiRouter.get('/tasks', async (_, res) => {
  try {
    const tasks = await pb.collection('tasks').getFullList({
      sort: '-created',
    });

    res.json({ data: tasks });
  } catch (error) {
    res.status(404).json({ error: 'There has been an issue retrieving tasks' });
  }
});

apiRouter.post('/tasks', async (req, res) => {
  const task = req.body;
  const result = newTaskSchema.safeParse(task);
  if (result.success) {
    try {
      const newTask = await pb.collection('tasks').create(task);
      if (newTask) {
        res.json({ data: newTask });
      } else {
        throw new Error('There has been an issue creating new task');
      }
    } catch (error) {
      res
        .status(404)
        .json({ error: 'There has been an issue creating new task' });
    }
  } else {
    res.status(400).json({ error: 'The request contains invalid data' });
  }
});

apiRouter.patch('/tasks', async (req, res) => {
  const task = req.body;
  const result = taskSchema.safeParse(task);
  if (result.success) {
    try {
      const updatedTask = await pb.collection('tasks').update(task.id, task);
      if (updatedTask) {
        res.json({ data: updatedTask });
      } else {
        throw new Error(
          `There has been an issue updating task with id ${task.id}`
        );
      }
    } catch (error) {
      res.status(404).json({
        error: `There has been an issue updating task with id ${task.id}`,
      });
    }
  } else {
    res.status(400).json({ error: 'The request contains invalid data' });
  }
});

apiRouter.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    const deleteResponse = await pb.collection('tasks').delete(taskId);
    if (deleteResponse.message) {
      res.status(deleteResponse.code || 404).json({
        error: `There has been an issue updating task with id ${taskId}. Error: ${deleteResponse.message}`,
      });
    } else {
      res.json({ data: taskId });
    }
  } catch (error) {
    res.status(404).json({
      error: `There has been an issue deleting task with id ${taskId}`,
    });
  }
});

export default apiRouter;
