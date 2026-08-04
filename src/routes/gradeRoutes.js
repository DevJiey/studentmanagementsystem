const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const {
    getAllGrades,
    createGrade,
    updateGrade,
    deleteGrade
} = require("../controllers/gradeController");

router.use(verifyToken);
router.use(isAdmin);

/**
 * @swagger
 * /grades:
 *   get:
 *     summary: Get all grades
 *     description: Retrieve all grade records, joined with student and class info.
 *     tags: [Grades]
 *     responses:
 *       200:
 *         description: List of grades
 */
router.get("/", getAllGrades);

/**
 * @swagger
 * /grades:
 *   post:
 *     summary: Create a grade record
 *     description: Add a new grade record.
 *     tags: [Grades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: integer
 *               class_id:
 *                 type: integer
 *               grade:
 *                 type: number
 *                 minimum: 1.0
 *                 maximum: 5.0
 *               remarks:
 *                 type: string
 *     responses:
 *       201:
 *         description: Grade created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", createGrade);

/**
 * @swagger
 * /grades/{id}:
 *   put:
 *     summary: Update grade record
 *     description: Update an existing grade record.
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Grade updated successfully
 *       404:
 *         description: Grade record not found
 */
router.put("/:id", updateGrade);

/**
 * @swagger
 * /grades/{id}:
 *   delete:
 *     summary: Delete grade record
 *     description: Remove a grade record.
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Grade deleted successfully
 *       404:
 *         description: Grade record not found
 */
router.delete("/:id", deleteGrade);

module.exports = router;