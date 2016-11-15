//** Archive **//


// Test FPS
setTimeout(function() {
    clearInterval(go);
}, 1000);

turn on light based on fps between 1 (every frame) and 30 (once every 30 frames or once a second)
if (frame % 2 === 0) {
    turnOn(new Location("d", 15), "bg-yellow");
} else {
    turnOff(new Location("d", 15));
}
frame++;



// Test Commands
turnOn(new Location("b", 24), "bg-red");

lightsOn("bg-yellow");

setTimeout(function() { lightsOff() }, 3000);

blink("i15", "bg-red", 500, 1000);
blink("i16", "bg-yellow", 500, 1500);
blink("i17", "bg-green", 500, 2000);


// Turn on all the lights
function lightsOn(color) {
    console.log("lights on");

    for (r = 0; r < 16; r++) {
        for (c = 0; c < 32; c++) {document.getElementById(alphabet[r] + c).classList.add(color);
            document.getElementById(alphabet[r] + c).classList.remove(ledColor);
        }
    }
};

// Turn all the lights off
function lightsOff() {
    console.log("lights off");

    for (r = 0; r < 16; r++) {
        for (c = 0; c < 32; c++) {
            document.getElementById(alphabet[r] + c).classList.add(ledColor);
            document.getElementById(alphabet[r] + c).classList.remove(color);
        }
    }
}

// Turn a light on then back off
function blink(led, color, duration, delay) {
    setTimeout(function() {
        turnOn(null, led, color);
        document.getElementById(led).classList.add(color);
        document.getElementById(led).classList.remove(ledColor);

        setTimeout(function() {
            document.getElementById(led).classList.add(ledColor);
            document.getElementById(led).classList.remove(color);
        }, duration);
    }, delay);
}