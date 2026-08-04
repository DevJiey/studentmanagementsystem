const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass
} = require("../controllers/classController");

router.use(verifyToken);
router.use(isAdmin);

/**
 * @swagger
 * /classes:
 *   get:
 *     summary: Get all classes
 *     description: Retrieve all classes from the database, joined with course and teacher info.
 *     tags: [Classes]
 *     responses:
 *       200:
 *         description: List of classes
 */
router.get("/", getAllClasses);

/**
 * @swagger
 * /classes/{id}:
 *   get:
 *     summary: Get class by ID
 *     description: Retrieve a single class by ID.
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Class found
 *       404:
 *         description: Class not found
 */
router.get("/:id", getClassById);

/**
 * @swagger
 * /classes:
 *   post:
 *     summary: Create a new class
 *     description: Add a new class to the database.
 *     tags: [Classes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               class_name:
 *                 type: string
 *               course_id:
 *                 type: integer
 *               teacher_id:
 *                 type: integer
 *               schedule:
 *                 type: string
 *     responses:
 *       201:
 *         description: Class created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", createClass);

/**
 * @swagger
 * /classes/{id}:
 *   put:
 *     summary: Update class
 *     description: Update an existing class.
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Class updated successfully
 *       404:
 *         description: Class not found
 */
router.put("/:id", updateClass);

/**
 * @swagger
 * /classes/{id}:
 *   delete:
 *     summary: Delete class
 *     description: Remove a class from the database.
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Class deleted successfully
 *       404:
 *         description: Class not found
 */
router.delete("/:id", deleteClass);

module.exports = router;