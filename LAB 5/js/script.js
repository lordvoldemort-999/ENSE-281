let notes = [
  {
    iD: 0,
    creator: "User A",
    text: `This is a text written by User A`,
    upvoted: [1],
    downvoted: [1],
  },

  {
    iD: 1,
    creator: "User B",
    text: `This is a text written by User B`,
    upvoted: [1],
    downvoted: [1],
  },

  {
    iD: 2,
    creator: "User C",
    text: `This is a text written by User C}`,
    upvoted: [1],
    downvoted: [1],
  },
];

let users = ["User A", "User B", "User C"]; //Might have to remove this later

function note(iD, creator, text) {
  this.iD = id;
  this.creator = creator;
  this.text = text;
}

function upvote(userId) {}

function downvote(userId) {}

$(document).ready(() => {
  $("#logged-in-as").text(`Logged in as...`);

  $("#switch-user").click(() => {
    $("#user-dropdown").toggleClass("show");
  });
});
