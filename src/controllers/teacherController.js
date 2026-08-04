const pool = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess, sendError } = require("../utils/response");

const getAllTeachers = asyncHandler(async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM teachers ORDER BY id ASC"
    );

    sendSuccess(res, 200, "Teachers fetched successfully", result.rows);
});

const getTeacherById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "SELECT * FROM teachers WHERE id = $1",
        [id]
    );

    if (result.rows.length === 0) {
        return sendError(res, 404, "Teacher not found");
    }

    sendSuccess(res, 200, "Teacher fetched successfully", result.rows[0]);
});

const createTeacher = asyncHandler(async (req, res) => {
    const { employee_number, first_name, last_name, email, department } = req.body;

    if (!employee_number || !first_name || !last_name || !email) {
        return sendError(res, 400, "Employee number, first name, last name, and email are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return sendError(res, 400, "Invalid email format");
    }

    const existingEmployeeNumber = await pool.query(
        "SELECT * FROM teachers WHERE employee_number = $1",
        [employee_number]
    );

    if (existingEmployeeNumber.rows.length > 0) {
        return sendError(res, 400, "Employee number already exists");
    }

    const existingEmail = await pool.query(
        "SELECT * FROM teachers WHERE email = $1",
        [email]
    );

    if (existingEmail.rows.length > 0) {
        return sendError(res, 400, "Email already exists");
    }

    const result = await pool.query(
        `INSERT INTO teachers
        (employee_number, first_name, last_name, email, department)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [employee_number, first_name, last_name, email, department]
    );

    sendSuccess(res, 201, "Teacher created successfully", result.rows[0]);
});

const updateTeacher = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { employee_number, first_name, last_name, email, department } = req.body;

    const result = await pool.query(
        `UPDATE teachers
        SET employee_number = $1,
            first_name = $2,
            last_name = $3,
            email = $4,
            department = $5,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING *`,
        [employee_number, first_name, last_name, email, department, id]
    );

    if (result.rows.length === 0) {
        return sendError(res, 404, "Teacher not found");
    }

    sendSuccess(res, 200, "Teacher updated successfully", result.rows[0]);
});

const deleteTeacher = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "DELETE FROM teachers WHERE id = $1 RETURNING *",
        [id]
    );

    if (result.rows.length === 0) {
        return sendError(res, 404, "Teacher not found");
    }

    sendSuccess(res, 200, "Teacher deleted successfully");
});

module.exports = {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
};