const pool = require("../config/db");

const getAllGrades = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const createGrade = async (req, res) => {
    try {
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

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateGrade = async (req, res) => {
    try {
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

    } catch (error) {
        res.status(500).json({
            message: "Failed to update grade"
        });
    }
};

const deleteGrade = async (req, res) => {
    try {
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

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete grade"
        });
    }
};

module.exports = {
    getAllGrades,
    createGrade,
    updateGrade,
    deleteGrade
};