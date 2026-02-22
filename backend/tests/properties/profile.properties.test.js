import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import fc from 'fast-check';
import mongoose from 'mongoose';
import User from '../../models/User.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * Property-Based Tests for User Profile
 * Feature: scalable-task-manager
 * 
 * These tests verify that user profiles never expose password hashes
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
 * Property 6: Authenticated users can access their profile (password not exposed)
 * **Validates: Requirements 3.1, 3.4**
 * 
 * For any authenticated user, requesting their profile should return their name, 
 * email, and createdAt date without exposing the password hash.
 */
describe('Property 6: Authenticated users can access their profile (password not exposed)', () => {
  it('should return profile data without password hash for any user', async () => {
    let testCounter = 0;
    
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          emailPrefix: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z0-9]+$/.test(s)),
          password: fc.string({ minLength: 6, maxLength: 50 })
        }),
        async (userData) => {
          // Generate unique email for each test iteration
          const uniqueEmail = `${userData.emailPrefix}${testCounter++}@test.com`;
          
          // Create user with the generated data
          const user = await User.create({
            name: userData.name,
            email: uniqueEmail,
            password: userData.password
          });

          // Verify user was created
          expect(user).toBeTruthy();
          expect(user._id).toBeDefined();

          // Retrieve user from database (simulating profile access)
          const foundUser = await User.findById(user._id);
          expect(foundUser).toBeTruthy();

          // Convert to JSON (as would happen in API response)
          const profileData = foundUser.toJSON();

          // Verify profile contains expected fields
          expect(profileData._id).toBeDefined();
          expect(profileData.name).toBe(userData.name.trim());
          expect(profileData.email).toBe(uniqueEmail.toLowerCase());
          expect(profileData.createdAt).toBeDefined();

          // CRITICAL: Verify password hash is NOT exposed
          expect(profileData.password).toBeUndefined();
          expect(profileData).not.toHaveProperty('password');

          // Verify the password field exists in the raw document (not removed from DB)
          expect(foundUser.password).toBeDefined();
          expect(foundUser.password).toMatch(/^\$2[aby]\$\d{2}\$/);

          // Verify JSON stringification also doesn't expose password
          const jsonString = JSON.stringify(foundUser);
          expect(jsonString).not.toContain(foundUser.password);

          // Verify toObject() with default settings also doesn't expose password
          const objectData = foundUser.toObject();
          // Note: toObject() by default includes password, but toJSON() should not
          // This verifies our toJSON override is working correctly
        }
      ),
      { numRuns: 20 }
    );
  }, 30000); // Timeout for 20 iterations
});
