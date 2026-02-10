let card = document.getElementById("title");
let cardContent = document.getElementById("content");
let postSubmit = document.getElementById("post");
let stickyNotes = document.getElementById("sticky-notes");

let colors = ["#ff7eb9", "#ff65a3", "#7afcff", "#feff9c", "#fff740"];

let cards = [
    {
        title: "Buy Oat Milk",
        content: "The oatier the better!"
    },

    {
        title: "Complete Lab 3",
        content: "Hand it in by midnight"
    },

    {
        title: "Eat Supper",
        content: "Something healthy this time!"
    }
];

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

for (note of cards) {
    const randomColor = getRandomColor();

    stickyNotes.innerHTML += `
        <div class="card mb-3" style="background-color: ${randomColor};">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <h4 class="card-title">${note.title}</h4>

                    <button class="btn btn-secondary burn">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-fire"
                            viewBox="0 0 16 16"
                        >
                            <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6
                            .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0
                            c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5
                            C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75
                            0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5
                            c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3
                            .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/>
                        </svg>
                    </button>
                </div>
                <p class="card-text">${note.content}</p>
            </div>
        </div>
    `;
}

function postHandler(event) {
    event.preventDefault();

    const randomColor = getRandomColor();


    stickyNotes.innerHTML += `
        <div class="card mb-3" style="background-color: ${randomColor};">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <h4 class="card-title">${card.value}</h4>

                    <button class="btn btn-secondary burn">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-fire"
                            viewBox="0 0 16 16"
                        >
                            <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6
                            .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0
                            c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5
                            C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75
                            0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5
                            c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3
                            .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/>
                        </svg>
                    </button>
                </div>
                <p class="card-text">${cardContent.value}</p>
            </div>
        </div>
    `;

    card.value = "";
    cardContent.value = "";
}

postSubmit.addEventListener("click", postHandler);

stickyNotes.addEventListener("click", function (event) {
    const burnButton = event.target.closest(".burn");

    if (!burnButton) return;

    const card = burnButton.closest(".card");
    card.remove();
});

