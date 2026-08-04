const pool = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess, sendError } = require("../utils/response");

const getAllCourses = asyncHandler(async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM courses ORDER BY id ASC"
    );

    sendSuccess(res, 200, "Courses fetched successfully", result.rows);
});

const getCourseById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "SELECT * FROM courses WHERE id = $1",
        [id]
    );

    if (result.rows.length === 0) {
        return sendError(res, 404, "Course not found");
    }

    sendSuccess(res, 200, "Course fetched successfully", result.rows[0]);
});

const createCourse = asyncHandler(async (req, res) => {
    const { course_code, course_name, description } = req.body;

    if (!course_code || !course_name) {
        return sendError(res, 400, "Course code and course name are required");
    }

    const existingCourse = await pool.query(
        "SELECT * FROM courses WHERE course_code = $1",
        [course_code]
    );

    if (existingCourse.rows.length > 0) {
        return sendError(res, 400, "Course code already exists");
    }

    const result = await pool.query(
        `INSERT INTO courses
        (course_code, course_name, description)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [course_code, course_name, description]
    );

    sendSuccess(res, 201, "Course created successfully", result.rows[0]);
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
        return sendError(res, 404, "Course not found");
    }

    sendSuccess(res, 200, "Course updated successfully", result.rows[0]);
});

const deleteCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "DELETE FROM courses WHERE id = $1 RETURNING *",
        [id]
    );

    if (result.rows.length === 0) {
        return sendError(res, 404, "Course not found");
    }

    sendSuccess(res, 200, "Course deleted successfully");
});

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};