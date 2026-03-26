const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose").default;
const express = require("express");
require("dotenv").config();

mongoose.connect("mongodb://localhost:27017/notevote");

const { User, Post } = require("./seed.js");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/note-vote", async (req, res) => {
  console.log("A user is trying to  access the notevote route.");
  if (req.isAuthenticated()) {
    try {
      console.log("User is authorized and found.");
      const posts = await Post.find();
      const users = await User.find();
      console.log(posts, users);
      res.render("note-vote", { postsList: posts, username: req.user.username, users});
    } catch (error) {
      console.log(error.message);
    }
  } else {
    console.log("User was not authorized.");
    res.redirect("/");
  }
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/note-vote",
  failureRedirect: "/",
}));

app.post("/register", async (req, res) => {
  console.log("User", req.body.username, "is attempting to register");

  if (req.body.inviteCode !== process.env.INVITE_CODE) {
    console.log("Invite code", req.body.inviteCode, "is incorrect");
    return res.redirect("/");
  }

  try {
    const user = new User({ username: req.body.username.trim() });
    await User.register(user, req.body.password);

    passport.authenticate("local")(req, res, () => {
      res.redirect("/login");
    });
  } catch (err) {
    console.error("Error registering user:", err.message);
    res.redirect("/"); 
  }
});

async function voteOnPost(postId, username, type) {
  const post = await Post.findById(postId);
  if (!post) return null;

  if (type === "upvote") {
    if (post.upvotes.includes(username)) {
      post.upvotes = post.upvotes.filter(u => u !== username);
    } else {
      post.upvotes.push(username);
      post.downvotes = post.downvotes.filter(u => u !== username);
    }
  } else if (type === "downvote") {
    if (post.downvotes.includes(username)) {
      post.downvotes = post.downvotes.filter(u => u !== username);
    } else {
      post.downvotes.push(username);
      post.upvotes = post.upvotes.filter(u => u !== username);
    }
  }

  await post.save();
  return post;
}

app.post("/upvote", async (req, res) => {
  try {
    if (!req.user) return res.status(401).send("You must be logged in to vote");

    await voteOnPost(req.body.post_id, req.user.username, "upvote");

    const posts = await Post.find();
    const users = await User.find();

    res.render("note-vote", {
      username: req.user.username,
      postsList: posts,
      users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/downvote", async (req, res) => {
  try {
    if (!req.user) return res.status(401).send("You must be logged in to vote");

    await voteOnPost(req.body.post_id, req.user.username, "downvote");

    const posts = await Post.find();
    const users = await User.find();

    res.render("note-vote", {
      username: req.user.username,
      postsList: posts,
      users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/post", async (req, res) => {
  try {
    if (!req.user) return res.redirect("/login");

    const content = req.body.toUpload.trim();
    if (content === "") return res.redirect("/note-vote");

    const toPost = {
      text: content,
      creator: req.user.username,
      upvotes: [],
      downvotes: [],
    };

    await Post.create(toPost);

    const users = await User.find();
    const posts = await Post.find();

    res.render("note-vote", {
      username: req.user.username,
      postsList: posts,
      users: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/switch-user", async (req, res, next) => {
  try {
    const newUsername = req.body.newUsername.trim();

    const foundUser = await User.findOne({ username: newUsername });
    if (!foundUser) {
      return res.redirect("/");
    }

    req.login(foundUser, (err) => {
      if (err) return next(err);

      Post.find().then((posts) => {
        User.find().then((users) => {
          res.render("note-vote", {
            username: req.user.username,
            postsList: posts,
            users: users,
          });
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
