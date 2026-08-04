const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const {
    getAllAttendance,
    createAttendance,
    updateAttendance,
    deleteAttendance
} = require("../controllers/attendanceController");

router.use(verifyToken);
router.use(isAdmin);

router.get("/", getAllAttendance);
router.post("/", createAttendance);
router.put("/:id", updateAttendance);
router.delete("/:id", deleteAttendance);

module.exports = router;