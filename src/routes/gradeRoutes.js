const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const {
    getAllGrades,
    createGrade,
    updateGrade,
    deleteGrade
} = require("../controllers/gradeController");

router.use(verifyToken);
router.use(isAdmin);

router.get("/", getAllGrades);
router.post("/", createGrade);
router.put("/:id", updateGrade);
router.delete("/:id", deleteGrade);

module.exports = router;