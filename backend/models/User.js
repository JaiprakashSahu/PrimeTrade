import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * User Schema
 * Stores user account information with hashed passwords
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Pre-save hook to hash password before saving to database
 * Only hashes if password is modified
 */
userSchema.pre('save', async function() {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return;
  }
  
  // Generate salt with 10 rounds
  const salt = await bcrypt.genSalt(10);
  // Hash password with salt
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Method to compare entered password with hashed password in database
 * @param {string} enteredPassword - Plain text password to compare
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Override toJSON method to exclude password from JSON responses
 * Ensures password hash is never sent to client
 */
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
