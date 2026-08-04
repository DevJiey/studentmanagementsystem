const pool = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess, sendError } = require("../utils/response");
const getPagination = require("../utils/pagination");

const VALID_STATUSES = ["Present", "Absent", "Late"];

const getAllAttendance = asyncHandler(async (req, res) => {
    const { page, limit, offset } = getPagination(req);

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
        ORDER BY attendance.attendance_date DESC, attendance.id DESC
        LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const countResult = await pool.query("SELECT COUNT(*) FROM attendance");
    const totalRecords = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalRecords / limit);

    sendSuccess(res, 200, "Attendance records fetched successfully", {
        attendance: result.rows,
        pagination: { page, limit, totalRecords, totalPages }
    });
});

const createAttendance = asyncHandler(async (req, res) => {
    const { student_id, class_id, attendance_date, status } = req.body;

    if (!student_id || !class_id || !attendance_date || !status) {
        return sendError(res, 400, "Student, class, date, and status are required");
    }

    if (!VALID_STATUSES.includes(status)) {
        return sendError(res, 400, `Status must be one of: ${VALID_STATUSES.join(", ")}`);
    }

    const result = await pool.query(
        `INSERT INTO attendance
        (student_id, class_id, attendance_date, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [student_id, class_id, attendance_date, status]
    );

    sendSuccess(res, 201, "Attendance record created successfully", result.rows[0]);
});

const updateAttendance = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { student_id, class_id, attendance_date, status } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
        return sendError(res, 400, `Status must be one of: ${VALID_STATUSES.join(", ")}`);
    }

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
        return sendError(res, 404, "Attendance record not found");
    }

    sendSuccess(res, 200, "Attendance record updated successfully", result.rows[0]);
});

const deleteAttendance = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "DELETE FROM attendance WHERE id = $1 RETURNING *",
        [id]
    );

    if (result.rows.length === 0) {
        return sendError(res, 404, "Attendance record not found");
    }

    sendSuccess(res, 200, "Attendance record deleted successfully");
});

module.exports = {
    getAllAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance
};