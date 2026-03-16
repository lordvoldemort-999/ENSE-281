const fs = require("fs");
const express = require("express");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

function readFromPosts() {
  try {
    const jsonString = fs.readFileSync(__dirname + "/posts.json", "utf-8");
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Error reading from file: ", err.message);
    return [];
  }
}

function writeToPosts(myObj) {
  fs.writeFile(
    __dirname + "/posts.json",
    JSON.stringify(myObj),
    "utf-8",
    (err) => {
      if (err) return console.error("Error writing to file:", err.message);
    },
  );
}

function readFromUsers() {
  try {
    const jsonString = fs.readFileSync(__dirname + "/users.json", "utf-8");
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Error reading from file:", err.message);
    return [];
  }
}

function writeToUsers(myObj) {
  let users = readFromUsers();
  users.push(myObj);
  fs.writeFile(
    __dirname + "/users.json",
    JSON.stringify(users),
    "utf-8",
    (err) => {
      if (err) return console.error("Error writing to file: ", err.message);
    },
  );
}

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/note-vote", (req, res) => {
  res.redirect("/");
});

app.post("/login", (req, res) => {
  let users = readFromUsers();
  let email = req.body.email;
  let password = req.body.password;
  const foundUser = users.find(
    (user) => user.email === email && user.password === password,
  );
  if (foundUser) {
    let posts = readFromPosts();
    return res.render("note-vote", {
      email: foundUser.email,
      postsList: posts,
      users: users,
    });
  }
  res.send("Invalid login credentials");
});

app.post("/register", (req, res) => {
  let inviteCode = req.body.inviteCode.trim();
  let email = req.body.email;
  let users = readFromUsers();
  let password = req.body.password;

  console.log(req.body);

  if (
    inviteCode === "Note Vote 2026" &&
    !users.find((user) => user.email === email)
  ) {
    let posts = readFromPosts();
    const newUser = { email: `${email}`, password: `${password}` };
    writeToUsers(newUser);
    return res.render("note-vote", {
      email: newUser.email,
      postsList: posts,
      users: users,
    });
  } else {
    res.send("Invalid invite Code or user already exists");
  }
});

app.post("/upvote", (req, res) => {
  let posts = readFromPosts();
  let users = readFromUsers();
  let voter = users.find((user) => user.email === req.body.voterEmail);
  let postVoted = posts.find(
    (post) => post._id.toString() === req.body.post_id,
  );

  if (voter && postVoted) {
    if (postVoted.upvotes.includes(voter.email)) {
      postVoted.upvotes = postVoted.upvotes.filter(
        (email) => email !== voter.email,
      );
    } else {
      postVoted.upvotes.push(voter.email);
      postVoted.downvotes = postVoted.downvotes.filter(
        (email) => email !== voter.email,
      );
    }
    writeToPosts(posts);
  }

  res.render("note-vote", {
    email: req.body.voterEmail,
    postsList: posts,
    users: users,
  });
});

app.post("/downvote", (req, res) => {
  let posts = readFromPosts();
  let users = readFromUsers();
  let voter = users.find((user) => user.email === req.body.voterEmail);
  let postVoted = posts.find(
    (post) => post._id.toString() === req.body.post_id,
  );

  if (voter && postVoted) {
    if (postVoted.downvotes.includes(voter.email)) {
      postVoted.downvotes = postVoted.downvotes.filter(
        (email) => email !== voter.email,
      );
    } else {
      postVoted.downvotes.push(voter.email);
      postVoted.upvotes = postVoted.upvotes.filter(
        (email) => email !== voter.email,
      );
    }
    writeToPosts(posts);
  }

  res.render("note-vote", {
    email: req.body.voterEmail,
    postsList: posts,
    users: users,
  });
});

app.post("/post", (req, res) => {
  if (req.body.toUpload.trim() !== "") {
    let posts = readFromPosts();
    const toPost = {
      _id: `${posts.length}`,
      text: `${req.body.toUpload}`,
      creator: `${req.body.userEmail}`,
      upvotes: [],
      downvotes: [],
    };
    posts.push(toPost);
    writeToPosts(posts);
    const users = readFromUsers();
    res.render("note-vote", {
      email: req.body.userEmail,
      postsList: posts,
      users: users,
    });
  } else {
    res.redirect("/note-vote");
  }
});

app.post("/switch-user", (req, res) => {
  const newEmail = req.body.newEmail;
  const users = readFromUsers();
  const foundUser = users.find((user) => user.email === newEmail);
  if (foundUser) {
    const posts = readFromPosts();
    res.render("note-vote", {
      email: newEmail,
      postsList: posts,
      users: users,
    });
  } else {
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
