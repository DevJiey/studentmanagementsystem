const pool = require("../config/db");

const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id, username, email, role, created_at FROM users ORDER BY id ASC"
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const result = await pool.query(
            `UPDATE users
            SET role = $1
            WHERE id = $2
            RETURNING id, username, email, role`,
            [role, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            message: "Failed to update user"
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM users WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete user"
        });
    }
};

module.exports = {
    getAllUsers,
    updateUserRole,
    deleteUser
};