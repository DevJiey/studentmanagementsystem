const pool = require("../config/db");

const getAllClasses = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                classes.id,
                classes.class_name,
                classes.schedule,
                classes.course_id,
                classes.teacher_id,
                courses.course_code,
                courses.course_name,
                teachers.first_name AS teacher_first_name,
                teachers.last_name AS teacher_last_name
            FROM classes
            LEFT JOIN courses ON classes.course_id = courses.id
            LEFT JOIN teachers ON classes.teacher_id = teachers.id
            ORDER BY classes.id ASC`
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getClassById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                classes.id,
                classes.class_name,
                classes.schedule,
                classes.course_id,
                classes.teacher_id,
                courses.course_code,
                courses.course_name,
                teachers.first_name AS teacher_first_name,
                teachers.last_name AS teacher_last_name
            FROM classes
            LEFT JOIN courses ON classes.course_id = courses.id
            LEFT JOIN teachers ON classes.teacher_id = teachers.id
            WHERE classes.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Class not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const createClass = async (req, res) => {
    try {
        const { class_name, course_id, teacher_id, schedule } = req.body;

        if (!class_name) {
            return res.status(400).json({
                message: "Class name is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO classes
            (class_name, course_id, teacher_id, schedule)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [class_name, course_id || null, teacher_id || null, schedule]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { class_name, course_id, teacher_id, schedule } = req.body;

        const result = await pool.query(
            `UPDATE classes
            SET class_name = $1,
                course_id = $2,
                teacher_id = $3,
                schedule = $4,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *`,
            [class_name, course_id || null, teacher_id || null, schedule, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Class not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            message: "Failed to update class"
        });
    }
};

const deleteClass = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM classes WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Class not found"
            });
        }

        res.json({
            message: "Class deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete class"
        });
    }
};

module.exports = {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass
};