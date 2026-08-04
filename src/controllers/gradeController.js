const pool = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess, sendError } = require("../utils/response");
const getPagination = require("../utils/pagination");

const MIN_GRADE = 1.0;
const MAX_GRADE = 5.0;

const getAllGrades = asyncHandler(async (req, res) => {
    const { page, limit, offset } = getPagination(req);

    const result = await pool.query(
        `SELECT
            grades.id,
            grades.grade,
            grades.remarks,
            grades.student_id,
            grades.class_id,
            students.first_name AS student_first_name,
            students.last_name AS student_last_name,
            classes.class_name
        FROM grades
        LEFT JOIN students ON grades.student_id = students.id
        LEFT JOIN classes ON grades.class_id = classes.id
        ORDER BY grades.id DESC
        LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const countResult = await pool.query("SELECT COUNT(*) FROM grades");
    const totalRecords = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalRecords / limit);

    sendSuccess(res, 200, "Grades fetched successfully", {
        grades: result.rows,
        pagination: { page, limit, totalRecords, totalPages }
    });
});

const createGrade = asyncHandler(async (req, res) => {
    const { student_id, class_id, grade, remarks } = req.body;

    if (!student_id || !class_id || grade === undefined || grade === "") {
        return sendError(res, 400, "Student, class, and grade are required");
    }

    const numericGrade = Number(grade);

    if (isNaN(numericGrade) || numericGrade < MIN_GRADE || numericGrade > MAX_GRADE) {
        return sendError(res, 400, `Grade must be a number between ${MIN_GRADE} and ${MAX_GRADE}`);
    }

    const result = await pool.query(
        `INSERT INTO grades
        (student_id, class_id, grade, remarks)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [student_id, class_id, numericGrade, remarks]
    );

    sendSuccess(res, 201, "Grade created successfully", result.rows[0]);
});

const updateGrade = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { student_id, class_id, grade, remarks } = req.body;

    let numericGrade = grade;

    if (grade !== undefined && grade !== "") {
        numericGrade = Number(grade);

        if (isNaN(numericGrade) || numericGrade < MIN_GRADE || numericGrade > MAX_GRADE) {
            return sendError(res, 400, `Grade must be a number between ${MIN_GRADE} and ${MAX_GRADE}`);
        }
    }

    const result = await pool.query(
        `UPDATE grades
        SET student_id = $1,
            class_id = $2,
            grade = $3,
            remarks = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *`,
        [student_id, class_id, numericGrade, remarks, id]
    );

    if (result.rows.length === 0) {
        return sendError(res, 404, "Grade record not found");
    }

    sendSuccess(res, 200, "Grade updated successfully", result.rows[0]);
});

const deleteGrade = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "DELETE FROM grades WHERE id = $1 RETURNING *",
        [id]
    );

    if (result.rows.length === 0) {
        return sendError(res, 404, "Grade record not found");
    }

    sendSuccess(res, 200, "Grade deleted successfully");
});

module.exports = {
    getAllGrades,
    createGrade,
    updateGrade,
    deleteGrade
};