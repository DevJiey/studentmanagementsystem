const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const {
    getAllAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance
} = require("../controllers/attendanceController");

router.use(verifyToken);
router.use(isAdmin);

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: Get all attendance records
 *     description: Retrieve all attendance records, joined with student and class info.
 *     tags: [Attendance]
 *     responses:
 *       200:
 *         description: List of attendance records
 */
router.get("/", getAllAttendance);

/**
 * @swagger
 * /attendance:
 *   post:
 *     summary: Create an attendance record
 *     description: Add a new attendance record.
 *     tags: [Attendance]
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
 *               attendance_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [Present, Absent, Late]
 *     responses:
 *       201:
 *         description: Attendance record created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", createAttendance);

/**
 * @swagger
 * /attendance/{id}:
 *   put:
 *     summary: Update attendance record
 *     description: Update an existing attendance record.
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Attendance record updated successfully
 *       404:
 *         description: Attendance record not found
 */
router.put("/:id", updateAttendance);

/**
 * @swagger
 * /attendance/{id}:
 *   delete:
 *     summary: Delete attendance record
 *     description: Remove an attendance record.
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Attendance record deleted successfully
 *       404:
 *         description: Attendance record not found
 */
router.delete("/:id", deleteAttendance);

module.exports = router;