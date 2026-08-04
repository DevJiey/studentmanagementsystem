const pool = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");

const getAllUsers = asyncHandler(async (req, res) => {
    const result = await pool.query(
        "SELECT id, username, email, role, created_at FROM users ORDER BY id ASC"
    );

    res.json(result.rows);
});

const updateUserRole = asyncHandler(async (req, res) => {
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
});

const deleteUser = asyncHandler(async (req, res) => {
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
});

module.exports = {
    getAllUsers,
    updateUserRole,
    deleteUser
};