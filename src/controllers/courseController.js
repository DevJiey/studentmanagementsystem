const pool = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

const getAllCourses = asyncHandler(async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM courses ORDER BY id ASC"
    );

    res.json(result.rows);
});

const getCourseById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "SELECT * FROM courses WHERE id = $1",
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Course not found"
        });
    }

    res.json(result.rows[0]);
});

const createCourse = asyncHandler(async (req, res) => {
    const { course_code, course_name, description } = req.body;

    if (!course_code || !course_name) {
        return res.status(400).json({
            message: "Course code and course name are required"
        });
    }

    const existingCourse = await pool.query(
        "SELECT * FROM courses WHERE course_code = $1",
        [course_code]
    );

    if (existingCourse.rows.length > 0) {
        return res.status(400).json({
            message: "Course code already exists"
        });
    }

    const result = await pool.query(
        `INSERT INTO courses
        (course_code, course_name, description)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [course_code, course_name, description]
    );

    res.status(201).json(result.rows[0]);
});

const updateCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { course_code, course_name, description } = req.body;

    const result = await pool.query(
        `UPDATE courses
        SET course_code = $1,
            course_name = $2,
            description = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *`,
        [course_code, course_name, description, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Course not found"
        });
    }

    res.json(result.rows[0]);
});

const deleteCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "DELETE FROM courses WHERE id = $1 RETURNING *",
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Course not found"
        });
    }

    res.json({
        message: "Course deleted successfully"
    });
});

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};