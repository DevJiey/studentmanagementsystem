const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass
} = require("../controllers/classController");

router.use(verifyToken);
router.use(isAdmin);

router.get("/", getAllClasses);
router.get("/:id", getClassById);
router.post("/", createClass);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);

module.exports = router;