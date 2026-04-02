import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTask,
} from '../controllers/task.controller';

const router = Router();

// All task routes require authentication
router.use(authenticate);

const taskValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
];

const updateTaskValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
];

// GET /tasks  — list with pagination, filtering, searching
// POST /tasks — create a task
router.route('/').get(getTasks).post(taskValidation, createTask);

// GET    /tasks/:id  — get single task
// PATCH  /tasks/:id  — update task
// DELETE /tasks/:id  — delete task
router.route('/:id').get(getTask).patch(updateTaskValidation, updateTask).delete(deleteTask);

// PATCH /tasks/:id/toggle — toggle completion status
router.patch('/:id/toggle', toggleTask);

export default router;
