const pool = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

const getAllGrades = asyncHandler(async (req, res) => {
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
        ORDER BY grades.id DESC`
    );

    res.json(result.rows);
});

const createGrade = asyncHandler(async (req, res) => {
    const { student_id, class_id, grade, remarks } = req.body;

    if (!student_id || !class_id || grade === undefined || grade === "") {
        return res.status(400).json({
            message: "Student, class, and grade are required"
        });
    }

    const result = await pool.query(
        `INSERT INTO grades
        (student_id, class_id, grade, remarks)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [student_id, class_id, grade, remarks]
    );

    res.status(201).json(result.rows[0]);
});

const updateGrade = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { student_id, class_id, grade, remarks } = req.body;

    const result = await pool.query(
        `UPDATE grades
        SET student_id = $1,
            class_id = $2,
            grade = $3,
            remarks = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *`,
        [student_id, class_id, grade, remarks, id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Grade record not found"
        });
    }

    res.json(result.rows[0]);
});

const deleteGrade = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "DELETE FROM grades WHERE id = $1 RETURNING *",
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Grade record not found"
        });
    }

    res.json({
        message: "Grade record deleted successfully"
    });
});

module.exports = {
    getAllGrades,
    createGrade,
    updateGrade,
    deleteGrade
};