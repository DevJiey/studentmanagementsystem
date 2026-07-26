const express = require("express");
const router = express.Router();

const {
    getAllGrades,
    createGrade,
    updateGrade,
    deleteGrade
} = require("../controllers/gradeController");

router.get("/", getAllGrades);
router.post("/", createGrade);
router.put("/:id", updateGrade);
router.delete("/:id", deleteGrade);

module.exports = router;