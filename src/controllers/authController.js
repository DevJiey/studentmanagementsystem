const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const result = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
    );

    if (result.rows.length === 0) {
        return res.status(401).json({
            success: false,
            message: "Invalid username or password"
        });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid username or password"
        });
    }

    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "5h" }
    );

    res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
});

const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Username, email, and password are required"
        });
    }

    const existingUser = await pool.query(
        "SELECT * FROM users WHERE username = $1 OR email = $2",
        [username, email]
    );

    if (existingUser.rows.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Username or email already taken"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users (username, email, password, role)
        VALUES ($1, $2, $3, 'student')
        RETURNING id, username, email, role`,
        [username, email, hashedPassword]
    );

    res.status(201).json({
        success: true,
        message: "Registration successful",
        user: result.rows[0]
    });
});

module.exports = {
    login,
    register
};