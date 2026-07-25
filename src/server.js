const express = require("express");
const pool = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
app.use(express.json());
app.use("/students", studentRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});