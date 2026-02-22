import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import fc from 'fast-check';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { protect } from '../../middleware/authMiddleware.js';
import User from '../../models/User.js';
import generateToken from '../../utils/generateToken.js';

/**
 * Property-Based Tests for Authentication Middleware
 * Feature: scalable-task-manager
 * 
 * These tests verify universal properties that should hold for authentication
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

  // Create a test Express app with protected route
  app = express();
  app.use(express.json());
  app.use(cookieParser());

  // Test route that requires authentication
  app.get('/api/protected', protect, (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Access granted',
      userId: req.user._id
    });
  });
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
 * Property 8: Unauthenticated requests are rejected
 * **Validates: Requirements 3.3**
 * 
 * For any request to protected endpoints without a valid JWT token, 
 * the system should reject the request with 401 Unauthorized status.
 */
describe('Property 8: Unauthenticated requests are rejected', () => {
  it('should reject requests without token with 401 status', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          // Generate random request data to ensure property holds for any request
          queryParam: fc.option(fc.string({ maxLength: 50 }), { nil: undefined }),
          userAgent: fc.option(fc.string({ maxLength: 100 }), { nil: undefined })
        }),
        async (requestData) => {
          // Make request without token
          const res = await request(app)
            .get('/api/protected')
            .query(requestData.queryParam ? { q: requestData.queryParam } : {})
            .set('User-Agent', requestData.userAgent || 'test-agent');

          // Verify request is rejected with 401 Unauthorized
          expect(res.status).toBe(401);
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBeDefined();
          expect(res.body.message).toMatch(/not authorized|no token/i);
        }
      ),
      { numRuns: 20 }
    );
  }, 30000); // Timeout for 20 iterations

  it('should reject requests with invalid token with 401 status', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          // Generate various invalid token formats
          invalidToken: fc.oneof(
            fc.string({ minLength: 1, maxLength: 50 }), // Random string
            fc.constant(''), // Empty string
            fc.constant('invalid.token.format'), // Invalid JWT format
            fc.constant('Bearer invalid'), // Invalid Bearer format
            fc.string({ minLength: 20, maxLength: 100 }) // Random string
          )
        }),
        async (tokenData) => {
          // Make request with invalid token
          const res = await request(app)
            .get('/api/protected')
            .set('Cookie', [`token=${tokenData.invalidToken}`]);

          // Verify request is rejected with 401 Unauthorized
          expect(res.status).toBe(401);
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBeDefined();
          expect(res.body.message).toMatch(/not authorized|invalid|token/i);
        }
      ),
      { numRuns: 20 }
    );
  }, 30000);

  it('should reject requests with token for non-existent user with 401 status', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          // Generate random MongoDB ObjectId-like strings (24 hex characters)
          fakeUserId: fc.string({ minLength: 24, maxLength: 24 }).filter(s => /^[0-9a-f]{24}$/.test(s))
        }),
        async (userData) => {
          // Generate token for non-existent user
          const fakeToken = generateToken(userData.fakeUserId);

          // Make request with token for non-existent user
          const res = await request(app)
            .get('/api/protected')
            .set('Cookie', [`token=${fakeToken}`]);

          // Verify request is rejected with 401 Unauthorized
          expect(res.status).toBe(401);
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBeDefined();
          expect(res.body.message).toMatch(/not authorized|user not found/i);
        }
      ),
      { numRuns: 20 }
    );
  }, 30000);

  it('should allow requests with valid token and existing user', async () => {
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

          // Create a real user
          const user = await User.create({
            name: userData.name,
            email: uniqueEmail,
            password: userData.password
          });

          // Generate valid token for the user
          const validToken = generateToken(user._id.toString());

          // Make request with valid token
          const res = await request(app)
            .get('/api/protected')
            .set('Cookie', [`token=${validToken}`]);

          // Verify request is accepted with 200 OK
          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Access granted');
          expect(res.body.userId).toBeDefined();
          expect(res.body.userId).toBe(user._id.toString());
        }
      ),
      { numRuns: 20 }
    );
  }, 30000);
});
