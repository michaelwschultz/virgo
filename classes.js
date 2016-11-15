//** Classes **//

// shape reqires an array of objects that include location.row, .column and color
class Shape {
    constructor(shapeType) {
      this.shapeType = shapeType;
    }

    placeShape() {
        for (let i = 0; i < this.shapeType.length; i++) {
            turnOn(new Location(this.shapeType[i].row, this.shapeType[i].column), this.shapeType[i].color);
        }
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
        let shipRow = alphabet.indexOf(this.location.row);

        if (shipRow > 0) {
            shipRow = shipRow - 1;
            this.location.row = alphabet[shipRow];
        }
    }

    moveDown() {
        let shipRow = alphabet.indexOf(this.location.row);

        if (shipRow < 15) {
            shipRow = shipRow + 1;
            this.location.row = alphabet[shipRow];
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