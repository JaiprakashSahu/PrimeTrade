import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import fc from 'fast-check';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { errorHandler } from '../../middleware/errorMiddleware.js';
import User from '../../models/User.js';
import authRoutes from '../../routes/authRoutes.js';
import jwt from 'jsonwebtoken';

/**
 * Property-Based Tests for User Registration
 * Feature: scalable-task-manager
 * 
 * These tests verify universal properties that should hold for user registration
 * using fast-check for property-based testing with minimum 100 iterations.
 */

let mongoServer;
let app;

beforeAll(async () => {
  // Set JWT_SECRET for testing
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-property-testing';

  // Create in-memory MongoDB instance for testing
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create a test Express app with registration routes
  app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors({ credentials: true }));

  // Mount auth routes
  app.use('/api/auth', authRoutes);

  // Error handling middleware
  app.use(errorHandler);
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
 * Property 3: Successful registration returns JWT cookie
 * **Validates: Requirements 1.4**
 * 
 * For any successful registration, the response should include an HTTP-only cookie 
 * containing a valid JWT token.
 */
describe('Property 3: Successful registration returns JWT cookie', () => {
  it('should return valid JWT cookie for any successful registration', async () => {
    let testCounter = 0;

    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 2, maxLength: 100 }).filter(s => s.trim().length >= 2),
          emailPrefix: fc.string({ minLength: 3, maxLength: 20 }).filter(s => /^[a-zA-Z0-9]+$/.test(s)),
          password: fc.string({ minLength: 6, maxLength: 50 })
        }),
        async (userData) => {
          // Generate unique email for each test iteration to avoid duplicates
          const uniqueEmail = `${userData.emailPrefix}${testCounter++}@test.com`;

          // Make registration request
          const res = await request(app)
            .post('/api/auth/register')
            .send({
              name: userData.name,
              email: uniqueEmail,
              password: userData.password
            });

          // Verify successful registration response
          expect(res.status).toBe(201);
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('User registered successfully');
          expect(res.body.data.user).toBeDefined();
          expect(res.body.data.user.name).toBe(userData.name);
          expect(res.body.data.user.email).toBe(uniqueEmail);
          expect(res.body.data.user._id).toBeDefined();
          expect(res.body.data.user.createdAt).toBeDefined();

          // Verify JWT cookie is set
          expect(res.headers['set-cookie']).toBeDefined();
          const cookies = res.headers['set-cookie'];
          const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
          expect(tokenCookie).toBeDefined();

          // Extract token from cookie
          const tokenMatch = tokenCookie.match(/token=([^;]+)/);
          expect(tokenMatch).toBeDefined();
          const token = tokenMatch[1];
          expect(token).toBeDefined();
          expect(token.length).toBeGreaterThan(0);

          // Verify cookie attributes (HTTP-only, secure settings)
          expect(tokenCookie).toContain('HttpOnly');
          expect(tokenCookie).toContain('SameSite=Strict');
          expect(tokenCookie).toContain('Max-Age=86400'); // 1 day in seconds

          // Verify JWT token is valid and contains correct user ID
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          expect(decoded.id).toBeDefined();
          expect(decoded.id).toBe(res.body.data.user._id);
          expect(decoded.exp).toBeDefined();
          
          // Verify token expiration is approximately 1 day from now
          const now = Math.floor(Date.now() / 1000);
          const expectedExpiry = now + (24 * 60 * 60); // 1 day
          expect(decoded.exp).toBeGreaterThan(now);
          expect(decoded.exp).toBeLessThanOrEqual(expectedExpiry + 60); // Allow 1 minute tolerance

          // Verify user was actually created in database with hashed password
          const createdUser = await User.findById(res.body.data.user._id);
          expect(createdUser).toBeDefined();
          expect(createdUser.name).toBe(userData.name);
          expect(createdUser.email).toBe(uniqueEmail);
          expect(createdUser.password).toBeDefined();
          expect(createdUser.password).not.toBe(userData.password); // Should be hashed
          expect(createdUser.password).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
        }
      ),
      { numRuns: 10 }
    );
  }, 60000); // Timeout for 100 iterations
});
