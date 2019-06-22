import 'babel-polyfill'
import { init, gameLoop, toggleSound } from './engine';
import { getPreviewBoard } from './simulator';
require('./console');


// render game at designated fps
init()

global.toggleSound = toggleSound

const consoleButton = document.getElementById("consoleButton")
const shapeButton = document.getElementById("shapeButton")
const consolePanel = document.getElementById("consolePanel")
const shapesPanel = document.getElementById("shapesPanel")

consoleButton.addEventListener("click", function () {
  shapeButton.classList.remove("active")
  consoleButton.classList.add("active")
  shapesPanel.classList.add("hide")
  consolePanel.classList.remove("hide")
});

shapeButton.addEventListener("click", function () {
  shapeButton.classList.add("active")
  consoleButton.classList.remove("active")
  consolePanel.classList.add("hide")
  shapesPanel.classList.remove("hide")
});

// TODO not sure why this isn't working or being executed
const allShapes = async () => {
  const shapes = await fetch('/get-all-shapes', {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return shapes
}

// TODO this loop over all the shapes
getPreviewBoard('previewBoard1', 'preview', 'led-off')
getPreviewBoard('previewBoard2', 'preview', 'led-off')
getPreviewBoard('previewBoard3', 'preview', 'led-off')
getPreviewBoard('previewBoard4', 'preview', 'led-off')
