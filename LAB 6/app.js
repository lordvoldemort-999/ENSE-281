const fs = require("fs");
const express = require("express");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true})); 

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
    console.log("User requested the root route");
});

app.get("/pages/todo.html", (req, res) => {
    res.sendFile(__dirname + "/pages/todo.html");
    console.log("Successfully requested and sent the todo page");
})

app.post("/", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    fs.readFile (__dirname + "/users.json",
    "utf-8",
    (err, jsonString) => {
        if (err) {
            console.log("Error reading file from disk:", err.message);
            return;
        } try {
            const users = JSON.parse(jsonString);
            const foundUser = users.find(user => user.email === email && user.password === password);
            if (foundUser) {
                res.sendFile(__dirname + "/pages/todo.html")
                console.log("User:", foundUser.email, "has logged in")
            } else {
                res.redirect("/");
            }
        } catch (err) {
            console.log("Error parsing JSON:", err.message);
        }
    }
    ); 
});

app.listen(port, () => {
    console.log (`Server is running on http://localhost:${port}`);
});
