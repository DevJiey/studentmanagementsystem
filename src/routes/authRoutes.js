const express = require("express");
const router = express.Router();

const { login, register } = require("../controllers/authController");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     description: Authenticate a user and receive a JWT token.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns token and user info
 *       401:
 *         description: Invalid username or password
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register
 *     description: Create a new user account (defaults to student role).
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Username or email already taken
 */
router.post("/register", register);

module.exports = router;