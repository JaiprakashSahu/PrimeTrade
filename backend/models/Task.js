import mongoose from 'mongoose';

/**
 * Task Schema
 * Stores task information with user association
 */
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['todo', 'in-progress', 'completed'],
      message: 'Status must be todo, in-progress, or completed'
    },
    default: 'todo'
  },
  dueDate: {
    type: Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

/**
 * Indexes for efficient querying
 * - Compound index on user and status for filtered task lists
 * - Text index on title and description for search functionality
 */
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, title: 'text', description: 'text' });

/**
 * Override toJSON to format response
 */
taskSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Task = mongoose.model('Task', taskSchema);

export default Task;
