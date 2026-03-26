const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
mongoose.connect("mongodb://localhost:27017/notevote");

const userSchema = new mongoose.Schema({
  username: String,
});

const postSchema = new mongoose.Schema({
  text: String,
  creator: String,
  upvotes: [String],
  downvotes: [String],
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

async function createDB() {
  await User.deleteMany({});
  await Post.deleteMany({});

  await User.register(
    new User({ username: "aoo988@uregina.ca" }),
    "fakepassword@@",
  );

  await User.register(
    new User({ username: "secondUser@gmail.com" }),
    "secondUserPassword",
  );

  await Post.insertMany([
    {
      text: "First post by aoo988",
      creator: "aoo988@uregina.ca",
      upvotes: [],
      downvotes: [],
    },
    {
      text: "Second post by aoo988",
      creator: "aoo988@uregina.ca",
      upvotes: ["secondUser@gmail.com"],
      downvotes: [],
    },
    {
      text: "Third post by aoo988",
      creator: "aoo988@uregina.ca",
      upvotes: [],
      downvotes: ["secondUser@gmail.com"],
    },
    {
      text: "First post by secondUser",
      creator: "secondUser@gmail.com",
      upvotes: [],
      downvotes: [],
    },
    {
      text: "Second post by secondUser",
      creator: "secondUser@gmail.com",
      upvotes: ["aoo988@uregina.ca"],
      downvotes: [],
    },
    {
      text: "Third post by secondUser",
      creator: "secondUser@gmail.com",
      upvotes: [],
      downvotes: ["aoo988@uregina.ca"],
    },
  ]);

  mongoose.connection.close();
}

createDB();
