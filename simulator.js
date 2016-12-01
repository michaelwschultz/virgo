//** LED Board **//

// Build 16 rows with 32 divs
function getBoard(boardName, ledName, defaultColor = "") {

    let hidden = "";

    if (ledName == "light") {
        hidden = "hidden";
    }

    for (r = 0; r < grid.height; r++) { 
        let currentRow = 'row-' + r;
        document.getElementById(boardName).innerHTML += "<div id='row-" + r + "'></div>";

        for (c = 0; c < grid.width; c++) {
            document.getElementById(currentRow).innerHTML += "<div id='" + r + "-" + c + "-" + ledName + "' class='dib pa1 ma2 br-100 " + hidden + " " + defaultColor + "'></div>";
        }
    }
}

// Turn on a single light
function turnOn(location, color) {
    // dont turn on light if not on grid
    if (location.column >= grid.width || location.column < 0 || location.row >= grid.height || location.row < 0) { return; }

    document.getElementById(location.row + "-" + location.column + "-light").classList.add(color);
    document.getElementById(location.row + "-" + location.column + "-light").classList.remove("hidden");
}

// Turn off a single light
function turnOff(location) {
    document.getElementById(location.row + "-" + location.column + "-light").className = "dib pa1 ma2 br-100";
    document.getElementById(location.row + "-" + location.column + "-light").classList.add("hidden");
}