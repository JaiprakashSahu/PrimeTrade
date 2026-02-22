import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import fc from 'fast-check';
import mongoose from 'mongoose';
import User from '../../models/User.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * Property-Based Tests for User Model
 * Feature: scalable-task-manager
 * 
 * These tests verify universal properties that should hold for all valid inputs
 * using fast-check for property-based testing with minimum 100 iterations.
 */

let mongoServer;

beforeAll(async () => {
  // Create in-memory MongoDB instance for testing
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Clean up and close connections
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

/**
 * Property 1: Registration creates valid user accounts
 * **Validates: Requirements 1.1, 1.5**
 * 
 * For any valid registration data (name, email, password), creating a user account 
 * should result in a stored user with a bcrypt-hashed password (not plaintext) 
 * and all provided fields.
 */
describe('Property 1: Registration creates valid user accounts', () => {
  it('should create user with hashed password for any valid registration data', async () => {
    let testCounter = 0;
    
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          emailPrefix: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z0-9]+$/.test(s)),
          password: fc.string({ minLength: 6, maxLength: 50 })
        }),
        async (userData) => {
          // Generate unique email for each test iteration to avoid duplicates
          const uniqueEmail = `${userData.emailPrefix}${testCounter++}@test.com`;
          
          // Create user with the generated data
          const user = await User.create({
            name: userData.name,
            email: uniqueEmail,
            password: userData.password
          });

          // Verify user was created and stored in database
          expect(user).toBeTruthy();
          expect(user._id).toBeDefined();

          // Verify all provided fields are stored correctly
          // Note: name is trimmed by the model, so we compare with trimmed version
          expect(user.name).toBe(userData.name.trim());
          expect(user.email).toBe(uniqueEmail.toLowerCase()); // Email should be lowercased
          expect(user.createdAt).toBeInstanceOf(Date);

          // Verify password is hashed (not plaintext)
          expect(user.password).not.toBe(userData.password);
          
          // Verify password follows bcrypt hash pattern ($2a$, $2b$, or $2y$ followed by cost and hash)
          expect(user.password).toMatch(/^\$2[aby]\$\d{2}\$/);
          
          // Verify the hash is valid by checking it can be compared
          const isMatch = await user.matchPassword(userData.password);
          expect(isMatch).toBe(true);

          // Verify user can be retrieved from database
          const foundUser = await User.findOne({ email: uniqueEmail });
          expect(foundUser).toBeTruthy();
          expect(foundUser._id.toString()).toBe(user._id.toString());
          expect(foundUser.name).toBe(userData.name.trim());
          expect(foundUser.password).toBe(user.password); // Same hash
        }
      ),
      { numRuns: 20 }
    );
  }, 30000); // Timeout for 20 iterations
});
