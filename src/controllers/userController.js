const pool = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess, sendError } = require("../utils/response");

const VALID_ROLES = ["admin", "teacher", "student"];

const getAllUsers = asyncHandler(async (req, res) => {
    const result = await pool.query(
        "SELECT id, username, email, role, created_at FROM users ORDER BY id ASC"
    );

    sendSuccess(res, 200, "Users fetched successfully", result.rows);
});

const updateUserRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!VALID_ROLES.includes(role)) {
        return sendError(res, 400, `Role must be one of: ${VALID_ROLES.join(", ")}`);
    }

    const result = await pool.query(
        `UPDATE users
        SET role = $1
        WHERE id = $2
        RETURNING id, username, email, role`,
        [role, id]
    );

    if (result.rows.length === 0) {
        return sendError(res, 404, "User not found");
    }

    sendSuccess(res, 200, "User role updated successfully", result.rows[0]);
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        [id]
    );

    if (result.rows.length === 0) {
        return sendError(res, 404, "User not found");
    }

    sendSuccess(res, 200, "User deleted successfully");
});

module.exports = {
    getAllUsers,
    updateUserRole,
    deleteUser
};