const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/notevote");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const postSchema = new mongoose.Schema({
  _id: String,
  text: String,
  creator: String,
  upvotes: [String],
  downvotes: [String],
});

const user = mongoose.model("user", userSchema);
const post = mongoose.model("post", postSchema);

async function createDB() {
    await user.insertMany([
      { email: "aoo988@uregina.ca", password: "fakepassword@@" },
      { email: "secondUser@gmail.com", password: "secondUserPassword" },
    ]);
    
    await post.insertMany([
      {
        _id: "0",
        text: "First post by aoo988",
        creator: "aoo988@uregina.ca",
        upvotes: [],
        downvotes: [],
      },
      {
        _id: "1",
        text: "Second post by aoo988",
        creator: "aoo988@uregina.ca",
        upvotes: ["secondUser@gmail.com"],
        downvotes: [],
      },
      {
        _id: "2",
        text: "Third post by aoo988",
        creator: "aoo988@uregina.ca",
        upvotes: [],
        downvotes: ["secondUser@gmail.com"],
      },
      {
        _id: "3",
        text: "First post by secondUser",
        creator: "secondUser@gmail.com",
        upvotes: [],
        downvotes: [],
      },
      {
        _id: "4",
        text: "Second post by secondUser",
        creator: "secondUser@gmail.com",
        upvotes: ["aoo988@uregina.ca"],
        downvotes: [],
      },
      {
        _id: "5",
        text: "Third post by secondUser",
        creator: "secondUser@gmail.com",
        upvotes: [],
        downvotes: ["aoo988@uregina.ca"],
      },
    ]);
    
    mongoose.connection.close();
}

createDB();