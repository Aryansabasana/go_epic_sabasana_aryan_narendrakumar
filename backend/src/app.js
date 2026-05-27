const express = require("express");

const homeRoutes = require("./routes/home.routes");
const problemRoutes = require("./routes/problem.routes");

const app = express();

app.use(express.json());

app.use("/", homeRoutes);
app.use("/",problemRoutes);

module.exports = app;