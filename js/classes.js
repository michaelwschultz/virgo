//** Classes **//

import { SoundEffect } from './SoundEffect';

// shape reqires an array of objects that include location.row, .column and color
export class Shape {
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
        // has the whole pattern completed?
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

export class Bullet {
  constructor(grid, location, color, speed) {
    this.grid = grid
    this.location = location
    this.color = color
    this.speed = speed
    this.moveBullet(this.location)
    this.alive = true
  }

  moveBullet(bulletStartLocation) {
    if (bulletStartLocation.column < this.grid.width) {
      let move = setInterval(function() {
        // turnOn(bulletStartLocation, this.color)

        // move bullet one column to the right
        bulletStartLocation.row--
      }.bind(this), this.speed)
    }
  }

  destroy()  {
    this.alive = false
  }
}

export class MovementPattern {
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

export class Location {
  constructor(row, column) {
    this.row = row
    this.column = column
  }
}

export class Ship {
  constructor(grid, shape, name, color, health, endCoord = 0) {
    this.grid = grid
    this.bullets = []
    this.health = health
    this.color = color
    this.name = name
    this.shape = shape
    this.invulnerable = false
    this.endCoord = endCoord
  }

  fire() {
    // make sure ship has room to fire
    if (this.shape.location.column < this.grid.width) {
      this.bullets.push(new Bullet(this.grid, new Location(this.shape.location.row, this.shape.location.column + 2), "bg-red", 20))
      console.log('Fired bullet')
      new SoundEffect('lasers', '3.wav', 0.5).play()
    }
  }

  invulnerablility(time) {
    this.invulnerable = true
    this.color = 'bg-pink'
    return sleep(time)
      .then(() => {
        this.invulnerable = false
        this.color = 'bg-yellow'
      })
  }

  isOffScreen() {
    for (let k = 0; k < this.shape.shapeType.length; k++) {
      let myColumn = this.shape.shapeType[k].column + this.shape.location.column
      if (myColumn >= 0) return false
    }

    return true
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
            if (!this.invulnerable) {
              this.reactToCollision(true)
            }
          }

          // loop through enemy bullets
          for (let l = 0; l < enemies[i].bullets.length; l++) {
            if (enemies[i].bullets[l]) {
              if (enemies[i].bullets[l].location.row == myRow && enemies[i].bullets[l].location.column == myColumn) {
                this.reactToCollision()
                enemies[i].bullets[l].destroy()
                enemies[i].bullets.splice(l, 1)
              }
            }
          }
        }
      }
    }

    this.bullets = this.bullets.filter((bullet) => {
      // stop interval once bullet reaches end of grid
      if (bullet.location.row < this.endCoord) {
        bullet.destroy()
        return false
      }
      return true
    })

  }
}

export class UserShip extends Ship {
  constructor(grid, shape, name, color, health, document, invulnerable) {
    super(grid, shape, name, color, health, invulnerable)
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

  destroy() {
    this.document.onkeydown = null
  }

  reactToCollision() {
    this.health--
    console.warn('Player health: ' + this.health)
    if (this.health <= 0) {
        this.alive = false
        new SoundEffect('explosions', '5.wav').play()
        console.warn('Player is dead')
    }
    this.color = 'bg-purple'
    const hit = new SoundEffect('lasers', '3.wav', 0.5, true).play()
    this.invulnerablility(2000)
      .then(() => {
        this.color = 'bg-yellow'
        hit.pause()
      })
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

    // todo: remove need for magic number
    // We should know how big our ship is and
    // the board should set the boundaries
    if (shipRow < 60) {
      shipRow = shipRow + 1
      this.shape.location.row = shipRow
    }
  }

  moveLeft() {
    let shipColumn = this.shape.location.column

    if (shipColumn > 1) {
      shipColumn = shipColumn - 1
      this.shape.location.column = shipColumn
    }
  }

  moveRight() {
    let shipColumn = this.shape.location.column

    if (shipColumn < 30) {
      shipColumn = shipColumn + 1
      this.shape.location.column = shipColumn
    }
  }
}

export class EnemyShip extends Ship {
  constructor(grid, shape, name, color, health) {
    super(grid, shape, name, color, health)
    this.alive = true
  }

  destroy() {
    // do something here
    this.alive = false
    new SoundEffect('explosions', '1.wav', 0.5).play()
  }

  reactToCollision(collidedWithPlayer = false) {
    if (collidedWithPlayer) this.destroy()
    this.health--
    if (this.health <= 0) {
      this.destroy()
    }
  }
}

export class Level {
  constructor(enemyNames) {
    this.enemyNames = enemyNames
  }

  async loadLevel() {
    return Promise.all(this.enemyNames.map(async (name) => {
      const shape = await fetch(`${process.env.API_URL}/get-shape?name=${name}`, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // "Content-Type": "application/x-www-form-urlencoded",
        },
      })

      return shape.json().then(data => data[0])
    }))
  }
}

