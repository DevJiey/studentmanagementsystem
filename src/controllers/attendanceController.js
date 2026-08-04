const pool = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

const getAllAttendance = asyncHandler(async (req, res) => {
    const result = await pool.query(
        `SELECT
            attendance.id,
            attendance.attendance_date,
            attendance.status,
            attendance.student_id,
            attendance.class_id,
            students.first_name AS student_first_name,
            students.last_name AS student_last_name,
            classes.class_name
        FROM attendance
        LEFT JOIN students ON attendance.student_id = students.id
        LEFT JOIN classes ON attendance.class_id = classes.id
        ORDER BY attendance.attendance_date DESC, attendance.id DESC`
    );

    res.json(result.rows);
});

const createAttendance = asyncHandler(async (req, res) => {
    const { student_id, class_id, attendance_date, status } = req.body;

    if (!student_id || !class_id || !attendance_date || !status) {
        return res.status(400).json({
            message: "Student, class, date, and status are required"
        });
    }

    const result = await pool.query(
        `INSERT INTO attendance
        (student_id, class_id, attendance_date, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [student_id, class_id, attendance_date, status]
    );

    res.status(201).json(result.rows[0]);
});

const updateAttendance = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { student_id, class_id, attendance_date, status } = req.body;

    const result = await pool.query(
        `UPDATE attendance
        SET student_id = $1,
            class_id = $2,
            attendance_date = $3,
            status = $4
        WHERE id = $5
        RETURNING *`,
        [student_id, class_id, attendance_date, status, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Attendance record not found"
        });
    }

    res.json(result.rows[0]);
});

const deleteAttendance = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "DELETE FROM attendance WHERE id = $1 RETURNING *",
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Attendance record not found"
        });
    }

    res.json({
        message: "Attendance record deleted successfully"
    });
});

module.exports = {
    getAllAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance
};