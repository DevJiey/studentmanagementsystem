const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
} = require("../controllers/teacherController");

router.use(verifyToken);
router.use(isAdmin);

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Get all teachers
 *     description: Retrieve all teachers from the database.
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: List of teachers
 */
router.get("/", getAllTeachers);

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Get teacher by ID
 *     description: Retrieve a single teacher by ID.
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Teacher found
 *       404:
 *         description: Teacher not found
 */
router.get("/:id", getTeacherById);

/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Create a new teacher
 *     description: Add a new teacher to the database.
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employee_number:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       201:
 *         description: Teacher created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", createTeacher);

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Update teacher
 *     description: Update an existing teacher.
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Teacher updated successfully
 *       404:
 *         description: Teacher not found
 */
router.put("/:id", updateTeacher);

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Delete teacher
 *     description: Remove a teacher from the database.
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Teacher deleted successfully
 *       404:
 *         description: Teacher not found
 */
router.delete("/:id", deleteTeacher);

module.exports = router;