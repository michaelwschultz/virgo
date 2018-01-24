//** Classes **//

// shape reqires an array of objects that include location.row, .column and color
class Shape {
  constructor(shapeType, location, movementPattern) {
    this.shapeType = shapeType
    this.location = location
    this.movementPattern = movementPattern
  }
  
  // loop = 0 means infinite, anything else will only loop that many times.
  moveShape() {
    let i = 0
    let movementSequence = this.movementPattern.movementSequence
    let movementType = this.movementPattern.movementType
    let movementSpeed = this.movementPattern.movementSpeed

    let rowSteps = movementSequence[i].row
    let columnSteps = movementSequence[i].column

    let move = setInterval(function() {  
      if (columnSteps == 0 && rowSteps == 0) {
        // move to next item in movementSequence
        i++
        // has the hole pattern completed?
        if (i == movementSequence.length) {
          let numberOfRepeats = movementType.number - 1
          if (movementType.type == "repeat" && numberOfRepeats !== 0) {
            // reset i
            i = 0
            this.moveShape(movementSequence, {type: "repeat", number: numberOfRepeats}, movementSpeed)
          }
          if (movementType.type == "loop") {
            // reset i
            i = 0
            this.moveShape(movementSequence, movementType, movementSpeed)
          }
          clearInterval(move)
          return
        }
        rowSteps = movementSequence[i].row
        columnSteps = movementSequence[i].column
      }  
      if (rowSteps !== 0) {
        this.location.row += rowSteps / Math.abs(rowSteps)
        rowSteps -= rowSteps / Math.abs(rowSteps)
      }
      if (columnSteps !== 0) {
        this.location.column += columnSteps / Math.abs(columnSteps)
        columnSteps -= columnSteps / Math.abs(columnSteps)
      }
    }.bind(this), movementSpeed)
  }
}

class Bullet {
  constructor(location, color, speed) {
    this.location = location
    this.color = color
    this.speed = speed
    this.moveBullet(this.location)
  }

  moveBullet(bulletStartLocation) {
    if (bulletStartLocation.column < grid.width) {
      let move = setInterval(function() {
        // turnOn(bulletStartLocation, this.color)

        // move bullet one column to the right
        bulletStartLocation.column++

        // stop interval once bullet reaches end of grid
        if (bulletStartLocation.column >= grid.width) {
          clearInterval(move)
        }
      }.bind(this), this.speed)
    }
  }
}

class MovementPattern {
  constructor(movementGroup, movementType = {type: "loop"}, movementSpeed = 30) {
    this.movementType = movementType
    this.movementSpeed = movementSpeed
    this.movementSequence = []

    // combine movement patterns into single array
    for (let j = 0; j < movementGroup.length; j++) {
      this.movementSequence = this.movementSequence.concat(movementGroup[j])
    }
  }
}

class Location {
  constructor(row, column) {
    this.row = row
    this.column = column
  }
}

class Ship {
  constructor(shape, name) {
    this.shape = shape
    this.name = name
    this.bullets = []
  }

  fire() {
    // make sure ship has room to fire
    if (this.shape.location.column < grid.width) {
      this.bullets.push(new Bullet(new Location(this.shape.location.row, this.shape.location.column), "bg-red", 20))
      console.log('Fired bullet ' + this.bullets.length)
      playSoundEffect('lasers', '3.wav', 0.5)
    }
  }

  reactToCollision(object) {
    console.log("Collision with " + object)
  }

  collisionCheck(enemies) {
    // loop through enemy list
    for (let i = 0; i < enemies.length; i++) {
      // loop through enemy shape LEDs
      let shipShape = enemies[i].shape.shapeType
      for (let j = 0; j < shipShape.length; j++) {
        let ledRow = shipShape[j].row + enemies[i].shape.location.row
        let ledColumn = shipShape[j].column + enemies[i].shape.location.column

        // loop through current shape LEDs
        for (let k = 0; k < this.shape.shapeType.length; k++) {
          let myRow = this.shape.shapeType[k].row + this.shape.location.row
          let myColumn = this.shape.shapeType[k].column + this.shape.location.column

          if (ledRow == myRow && ledColumn == myColumn) {
            this.reactToCollision(enemies[i].name)
            enemies[i].reactToCollision()
          }

          // loops through my bullets
          for (let l = 0; l < this.bullets.length; l++) {
            if (this.bullets[l].location.row == ledRow && this.bullets[l].location.column == ledColumn) {
              enemies[i].reactToCollision("bullet " + (l + 1))
              this.bullets.splice(l, 1)
            }
          }

          // loop through enemy bullets
          for (let l = 0; l < enemies[i].bullets.length; l++) {
            if (enemies[i].bullets[l].location.row == myRow && enemies[i].bullets[l].location.column == myColumn) {
              this.reactToCollision("bullet " + (l + 1))
            }
          }
        }
      }
    }
  }   
}

class UserShip extends Ship {
  constructor(shape, name, document) {
    super(shape, name)
    this.document = document
    this.alive = true

    // keyboard controls
    this.document.onkeydown = function(e) {
      switch (e.keyCode) {
        case 32: // spacebar
          this.fire()
          break
        case 38: // up
          this.moveUp()
          break
        case 87: // w
          this.moveUp()
          break
        case 40: // down
          this.moveDown()
          break
        case 83: // s
          this.moveDown()
          break
        case 37: // left
          this.moveLeft()
          break
        case 39: // right
          this.moveRight()
          break
      }
    }.bind(this)
  }

  destory() {
    this.document.onkeydown = null
  }
    
  reactToCollision(enemyShape) {
    this.alive = false
    playSoundEffect('explosions', '5.wav')
    console.log("you are dead")
  }

  moveUp() {
    let shipRow = this.shape.location.row

    if (shipRow > 0) {
      shipRow = shipRow - 1
      this.shape.location.row = shipRow
    }
  }

  moveDown() {
    let shipRow = this.shape.location.row

    if (shipRow < 15) {
      shipRow = shipRow + 1
      this.shape.location.row = shipRow
    }
  }

  moveLeft() {
    let shipColumn = this.shape.location.column

    if (shipColumn > 0) {
      shipColumn = shipColumn - 1
      this.shape.location.column = shipColumn
    }
  }

  moveRight() {
    let shipColumn = this.shape.location.column

    if (shipColumn < 31) {
      shipColumn = shipColumn + 1
      this.shape.location.column = shipColumn
    }
  }
}

class EnemyShip extends Ship {
  constructor(shape, name) {
    super(shape, name)
    this.alive = true
  }

  destory() {
    // do something here
  }
    
  reactToCollision() {
    this.alive = false
    playSoundEffect('explosions', '1.wav', 0.5)
    console.log("ship destroyed")
  }
}