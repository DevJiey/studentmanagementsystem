const express = require("express");
const router = express.Router();

const {
    getAllUsers,
    updateUserRole,
    deleteUser
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.put("/:id", updateUserRole);
router.delete("/:id", deleteUser);

module.exports = router;