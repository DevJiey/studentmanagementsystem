const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const {
    getAllUsers,
    updateUserRole,
    deleteUser
} = require("../controllers/userController");

router.use(verifyToken);
router.use(isAdmin);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve all user accounts.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user role
 *     description: Change a user's role (admin, teacher, or student).
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, teacher, student]
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       404:
 *         description: User not found
 */
router.put("/:id", updateUserRole);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Remove a user account.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete("/:id", deleteUser);

module.exports = router;