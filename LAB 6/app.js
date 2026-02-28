const fs = require("fs");
const express = require("express");

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
    console.log("User requested the root route");
});

app.get("/pages/todo.html", (req, res) => {
    res.sendFile(__dirname + "/pages/todo.html");
    console.log("Successfully requested and sent the todo page");
})

app.listen(port, () => {
    console.log (`Server is running on http://localhost:${port}`);
});
