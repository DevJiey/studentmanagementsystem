const express = require("express");
const pool = require("./config/db");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/students", studentRoutes);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});