const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");

router.use(verifyToken);
router.use(isAdmin);

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     description: Retrieve all courses from the database.
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get("/", getAllCourses);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     description: Retrieve a single course by ID.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course found
 *       404:
 *         description: Course not found
 */
router.get("/:id", getCourseById);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     description: Add a new course to the database.
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               course_code:
 *                 type: string
 *               course_name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", createCourse);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update course
 *     description: Update an existing course.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Course not found
 */
router.put("/:id", updateCourse);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete course
 *     description: Remove a course from the database.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 */
router.delete("/:id", deleteCourse);

module.exports = router;