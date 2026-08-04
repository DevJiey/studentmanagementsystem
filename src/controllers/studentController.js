const pool = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

const getAllStudents = asyncHandler(async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM students ORDER BY id ASC"
    );

    res.json(result.rows);
});
const getStudentById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "SELECT * FROM students WHERE id = $1",
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.json(result.rows[0]);
});
const createStudent = asyncHandler(async (req, res) => {
    const {
        student_number,
        first_name,
        last_name,
        course,
        year_level,
        email
    } = req.body;

    if (
        !student_number ||
        !first_name ||
        !last_name ||
        !course ||
        !year_level ||
        !email
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email format"
        });
    }

    const existingStudentNumber = await pool.query(
        "SELECT * FROM students WHERE student_number = $1",
        [student_number]
    );

    if (existingStudentNumber.rows.length > 0) {
        return res.status(400).json({
            message: "Student number already exists"
        });
    }

    const existingEmail = await pool.query(
        "SELECT * FROM students WHERE email = $1",
        [email]
    );

    if (existingEmail.rows.length > 0) {
        return res.status(400).json({
            message: "Email already exists"
        });
    }

    const result = await pool.query(
        `INSERT INTO students
        (
            student_number,
            first_name,
            last_name,
            course,
            year_level,
            email
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
            student_number,
            first_name,
            last_name,
            course,
            year_level,
            email
        ]
    );

    res.status(201).json(result.rows[0]);
});

const updateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const {
        student_number,
        first_name,
        last_name,
        course,
        year_level,
        email
    } = req.body;

    const result = await pool.query(
        `UPDATE students
        SET
            student_number = $1,
            first_name = $2,
            last_name = $3,
            course = $4,
            year_level = $5,
            email = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *`,
        [
            student_number,
            first_name,
            last_name,
            course,
            year_level,
            email,
            id
        ]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.json(result.rows[0]);
});

const deleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "DELETE FROM students WHERE id = $1 RETURNING *",
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.json({
        message: "Student deleted successfully"
    });
});

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};
