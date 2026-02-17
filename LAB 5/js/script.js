$(document).ready(() => {
  let users = [
    { iD: 0, name: "User A" },
    { iD: 1, name: "User B" },
    { iD: 2, name: "User C" },
  ];

  let currentUser = users[0];

  class note {
    constructor(iD, creator, text) {
      this.iD = iD;
      this.creator = creator;
      this.text = text;
      this.upvoted = [];
      this.downvoted = [];
    }

    upvote(userId) {
      if (!this.upvoted.includes(userId)) {
        this.upvoted.push(userId);
        this.downvoted = this.downvoted.filter((id) => id !== userId);
      }
    }

    downvote(userId) {
      if (!this.downvoted.includes(userId)) {
        this.downvoted.push(userId);
        this.upvoted = this.upvoted.filter((id) => id !== userId);
      }
    }
  }

  let notes = [
    new note(0, "User A", "This is a text written by User A"),
    new note(1, "User B", "This is a text written by User B"),
    new note(2, "User C", "This is a text written by User C"),
  ];

  //----------------------------------------------------------------functions-------------------------------------------------------------------------------
  function loadUserInterface(user) {
    currentUser = user;
    $("#logged-in-as").text(`Logged in as ${user.name}`);

    $("#note-container").empty();

    $.each(notes, function (index, noteItem) {
      let upActive, downActive;

      if(noteItem.upvoted.includes(currentUser.iD)) {
        upActive = "active";
      } else { 
        upActive = "";
      }

      if(noteItem.downvoted.includes(currentUser.iD)) {
        downActive = "active";
      } else {
        downActive = "";
      }

      $("#note-container").append(
        $(`<input type="text" id="note-${noteItem.iD}" class="form-control" placeholder="${noteItem.creator} made this note!"/>
            <button type="button" class="btn btn-outline-success me-1 ms-1 upvote ${upActive}" data-id="${noteItem.iD}">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-arrow-up"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"
                />
              </svg>
            </button>
            <button type="button" class="btn btn-outline-danger me-1 ms-1 downvote ${downActive}" data-id="${noteItem.iD}">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-arrow-down"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"
                />
              </svg>
            </button>`),
      );
    });
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------------------------

  //-------------------------------------event listeners------------------------------------------------------------------------------------------------------------
  $(document).on("click", ".dropdown-item", function () {
    const selectedId = parseInt($(this).data("id"));
    const selectedUser = users.find((user) => user.iD === selectedId);
    
    if (selectedUser) {
      loadUserInterface(selectedUser);
    }
  });
  
  $(document).on("click", ".upvote", function (){
    const noteId = parseInt($(this).data("id"));
    const selectedNote = notes.find(n => n.iD === noteId);

    if (selectedNote) {
      selectedNote.upvote(currentUser.iD);
      loadUserInterface(currentUser);
    }
  });

  $(document).on("click", ".downvote", function (){
    const noteId = parseInt($(this).data("id"));
    const selectedNote = notes.find(n => n.iD === noteId);

    if (selectedNote) {
      selectedNote.downvote(currentUser.iD);
      loadUserInterface(currentUser);
    }
  });

  $(document).on("click", "#upload-btn", function (){
    
    const textValue = $("#to-upload").val();

    if (textValue.trim() !== "") {
      const newNote = new note(
        notes.length,
        currentUser.iD,
        textValue
      );

      notes.push(newNote);
      $("#to-upload").val("");

      loadUserInterface(currentUser);
    }
  });
  //----------------------------------------------------------------------------------------------------------------------------------------------------------------

  loadUserInterface(currentUser);


  
});
