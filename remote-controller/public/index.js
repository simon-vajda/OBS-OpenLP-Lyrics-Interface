const MIN_LINES = 1;
const MAX_LINES = 999;
const DEFAULT_LINES_1 = 2;
const DEFAULT_LINES_2 = 3;

const nextLinesBtn1 = document.querySelector("#nextLines1>button");
const nextLinesBtn2 = document.querySelector("#nextLines2>button");
const nextLinesInput1 = document.querySelector("#nextLines1>input");
const nextLinesInput2 = document.querySelector("#nextLines2>input");
const undo = document.querySelector("#undo");
const redo = document.querySelector("#redo");
const nextSlide = document.querySelector("#nextSlide");
const prevSlide = document.querySelector("#prevSlide");

function handleLineCountChange(e) {
  const value = e.target.value;
  if (value < MIN_LINES) {
    e.target.value = MIN_LINES;
  }
  if (value > MAX_LINES) {
    e.target.value = MAX_LINES;
  }
}

function displayNextLines(count) {
  fetch(`/displayNext?lineCount=${count}`);
}

function undoDisplay() {
  fetch("/undoDisplay");
}

function redoDisplay() {
  fetch("/redoDisplay");
}

function displayNextSlide() {
  fetch("/nextSlide");
}

function displayPrevSlide() {
  fetch("/prevSlide");
}

nextLinesInput1.addEventListener("change", (e) => {
  handleLineCountChange(e);
  localStorage.setItem("nextLines1", e.target.value);
});

nextLinesInput2.addEventListener("change", (e) => {
  handleLineCountChange(e);
  localStorage.setItem("nextLines2", e.target.value);
});

nextLinesBtn1.addEventListener("click", () => {
  displayNextLines(nextLinesInput1.value);
});

nextLinesBtn2.addEventListener("click", () => {
  displayNextLines(nextLinesInput2.value);
});

undo.addEventListener("click", undoDisplay);
redo.addEventListener("click", redoDisplay);
nextSlide.addEventListener("click", displayNextSlide);
prevSlide.addEventListener("click", displayPrevSlide);

const nextLines1 = localStorage.getItem("nextLines1") ?? DEFAULT_LINES_1;
const nextLines2 = localStorage.getItem("nextLines2") ?? DEFAULT_LINES_2;
nextLinesInput1.value = nextLines1;
nextLinesInput2.value = nextLines2;
