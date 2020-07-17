const express = require("express");
const app = express();
const path = require("path");

// setting
app.set("port", 3000);
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

// routes
app.use(require("./routes/"));

// middlewares

// static files
app.use(express.static(path.join(__dirname, "public")));

// listening the server
app.listen(app.get("port"), () => {
    console.log("server on port", app.get("port"));
});