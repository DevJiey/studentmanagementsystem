const express = require("express");
const router = express.Router();

const {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     description: Retrieve all students from the database.
 *     responses:
 *       200:
 *         description: List of students
 */
router.get("/", getAllStudents);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get student by ID
 *     description: Retrieve a single student by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student found
 *       404:
 *         description: Student not found
 */
router.get("/:id", getStudentById);

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     description: Add a new student to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_number:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               course:
 *                 type: string
 *               year_level:
 *                 type: integer
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", createStudent);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update student
 *     description: Update an existing student.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       404:
 *         description: Student not found
 */
router.put("/:id", updateStudent);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete student
 *     description: Remove a student from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 */
router.delete("/:id", deleteStudent);

module.exports = router;