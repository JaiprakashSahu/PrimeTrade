import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  createTaskValidation,
  updateTaskValidation
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected (require authentication)

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post('/', protect, createTaskValidation, createTask);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for authenticated user (supports search and filter)
 * @query   ?search=keyword&status=completed
 * @access  Private
 */
router.get('/', protect, getTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get single task by ID
 * @access  Private
 */
router.get('/:id', protect, getTaskById);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task
 * @access  Private
 */
router.put('/:id', protect, updateTaskValidation, updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task
 * @access  Private
 */
router.delete('/:id', protect, deleteTask);

export default router;
