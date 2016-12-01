//** Classes **//

// shape reqires an array of objects that include location.row, .column and color
class Shape {
    constructor(shapeType, location) {
      this.shapeType = shapeType;
      this.location = location;
    }

    // loop = 0 means infinite, anything else will only loop that many times.
    moveShape(movementSequence, movementType = {type: "loop"}, speed = 30) {
        let i = 0;
        let movementPattern = [];

        // combine movement patterns into single array
        for (let j = 0; j < movementSequence.length; j++) {
            movementPattern = movementPattern.concat(movementSequence[j]);
        }

        let rowSteps = movementPattern[i].row;
        let columnSteps = movementPattern[i].column;

        let move = setInterval(function() {
            
            if (columnSteps == 0 && rowSteps == 0) {

                // move to next item in movementPattern
                i++;

                // has the hole pattern completed?
                if (i == movementPattern.length) {

                    let numberOfRepeats = movementType.number - 1;
                    if (movementType.type == "repeat" && numberOfRepeats !== 0) {
                        // reset i
                        i = 0;
                        this.moveShape(movementPattern, {type: "repeat", number: numberOfRepeats}, speed);
                    }

                    if (movementType.type == "loop") {
                        // reset i
                        i = 0;
                        this.moveShape(movementPattern, movementType, speed);
                    }

                    clearInterval(move);
                    return;
                }

                rowSteps = movementPattern[i].row;
                columnSteps = movementPattern[i].column;
            }
                
            if (rowSteps !== 0) {
                this.location.row += rowSteps / Math.abs(rowSteps);
                rowSteps -= rowSteps / Math.abs(rowSteps);
            }
        
            if (columnSteps !== 0) {
                this.location.column += columnSteps / Math.abs(columnSteps);
                columnSteps -= columnSteps / Math.abs(columnSteps);
            }
        }.bind(this), speed);
    }
}


class Bullet {
    constructor(location, color, speed) {
      this.location = location;
      this.color = color;
      this.speed = speed;
    }

    fire() {
        let bulletStartLocation = new Location(this.location.row, this.location.column + 1);

        // make sure ship has room to fire
        if (bulletStartLocation.column < grid.width) {
            bulletCount++;

            console.log('Fired bullet ' + bulletCount);
            this.moveBullet(bulletStartLocation);
        }
    }

    moveBullet(bulletStartLocation) {
        if (bulletStartLocation.column < grid.width) {

            let move = setInterval(function() {

                turnOn(bulletStartLocation, this.color);

                // move bullet one column to the right
                bulletStartLocation.column++;

                // stop interval once bullet reaches end of grid
                if (bulletStartLocation.column >= grid.width) {
                    clearInterval(move);
                }
            }.bind(this), this.speed);
        }
    }
}


class Location {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    }
}


class Ship {
    constructor(location, color) {
        this.location = location;
        this.color = color;
    }

    moveUp() {
        let shipRow = this.location.row;

        if (shipRow > 0) {
            shipRow = shipRow - 1;
            this.location.row = shipRow;
        }
    }

    moveDown() {
        let shipRow = this.location.row;

        if (shipRow < 15) {
            shipRow = shipRow + 1;
            this.location.row = shipRow;
        }
    }

    moveLeft() {
        let shipColumn = this.location.column;

        if (shipColumn > 0) {
            shipColumn = shipColumn - 1;
            this.location.column = shipColumn;
        }
    }

    moveRight() {
        let shipColumn = this.location.column;

        if (shipColumn < 31) {
            shipColumn = shipColumn + 1;
            this.location.column = shipColumn;
        }
    }
}