//** LED Board **//

// Build 16 rows with 32 divs
function getBoard(boardName, ledName, defaultColor = "") {

    let hidden = "";

    if (ledName == "light") {
        hidden = "hidden";
    }

    for (r = 0; r < grid.height; r++) { 
        let currentRow = 'row-' + alphabet[r];
        document.getElementById(boardName).innerHTML += "<div id='row-" + alphabet[r] + "'></div>";

        for (c = 0; c < grid.width; c++) {
            document.getElementById(currentRow).innerHTML += "<div id='" + alphabet[r] + c + "-" + ledName + "' class='dib pa1 ma1 br-100 " + hidden + " " + defaultColor + "'></div>";
        }
    }
}

// Turn on a single light
function turnOn(location, color) {
    document.getElementById(location.row + location.column + "-light").classList.add(color);
    document.getElementById(location.row + location.column + "-light").classList.remove("hidden");
}

// Turn off a single light
function turnOff(location) {
    document.getElementById(location.row + location.column + "-light").className = "dib pa1 ma1 br-100";
    document.getElementById(location.row + location.column + "-light").classList.add("hidden");
}