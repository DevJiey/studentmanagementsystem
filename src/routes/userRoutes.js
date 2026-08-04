const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const {
    getAllUsers,
    updateUserRole,
    deleteUser
} = require("../controllers/userController");

router.use(verifyToken);
router.use(isAdmin);

router.get("/", getAllUsers);
router.put("/:id", updateUserRole);
router.delete("/:id", deleteUser);

module.exports = router;