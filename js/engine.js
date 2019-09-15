import { getBoard, turnOn,  turnOff } from './simulator';
import {
  Bullet,
  MovementPattern,
  Location,
  Shape,
  Ship,
  UserShip,
  EnemyShip,
  Level,
} from './classes';
import { SoundEffect} from './SoundEffect';
import  {
  userShip,
  shapeSmallEnemy,
  shapeLargeEnemy,
  gameOver,
  patternStatic,
  patternDropDown,
  pattern1,
  pattern2,
  patternScroll,
} from './shapes';

import { Selectables } from './selectables';
let bulletCount
let bulletFired
let bulletLocation
let bulletShotOrigin
let currentLevel
let displayedWelcomeScreen
let enemies
let fps
let frame
let gameOverShape
let gameRunning
let inTransition
let levelLightOn
let levels
let lightInterval
let myShip
let shapesOnScreen
let ship1
let ship2
let shipColor

const grid = {height: 64, width: 32}
const ledColor = 'led-off'

// render simulator
getBoard(grid, 'board', 'slot', ledColor)
getBoard(grid, 'board-lights', 'light')

let newShape = new Selectables({
  zone: '#board',
  elements: 'li',
  selectedClass: 'selected',
  key: 'altKey'
})

// start bgm
const bgm = new SoundEffect('bgm', 'lf-1.mp3', 0.5, true)
export function toggleSound() {
  bgm.toggle()
}

export async function init() {
  console.debug('Setting up game...')
  //** Variables and setup **//
  bulletCount = 0
  bulletFired = false
  bulletLocation = null
  bulletShotOrigin = null
  currentLevel = 1
  fps = 60
  frame = 0
  gameOverShape = null
  gameRunning = false
  inTransition = true
  levelLightOn = true
  shapesOnScreen = {}
  shipColor = ""

  let loadButton = document.getElementById('loadButton')

  loadButton.addEventListener('click', async function () {
    // const shape = await newShape.loadShapeObject()
    // shapesOnScreen[shape.name] = shape
  })

  levels = [
    new Level([
      'crescent',
    ]),
    new Level([
      'x-wing',
    ]),
    new Level([
      'x-fighter',
    ]),
    // new Level([
    //   'pyramid',
    // ]),
    new Level([
      'boss',
    ]),
  ]

  console.debug('Starting level 1')
  setTimeout(async () => await transitionLevel(), 5000)
  lightInterval = setInterval(() => levelLightOn = !levelLightOn, 500)

  setInterval(gameLoop, 1000 / fps)
}


async function transitionLevel() {
  if (currentLevel > levels.length) {
    return destroy()
  }
  inTransition = false
  clearInterval(lightInterval);
  enemies = await levels[currentLevel - 1].loadLevel()

  enemies = enemies.map((enemy) => {
    return new EnemyShip(
      grid,
      new Shape(
        enemy.shape_configs,
        new Location(0, 13),
        new MovementPattern(
          // [pattern1, pattern2, pattern1],
          [patternScroll],
          { type: 'repeat', number: 3 }, 30
        )
      ), enemy.name, enemy.shape_configs[0].color, 4, 64
    )
  })

  // setup game objects
  myShip = new UserShip(
    grid,
    new Shape(
      userShip,
      new Location(60, 15)
    ), 'my ship', 'bg-yellow', 4, document
  )

  enemies[0].shape.moveShape()

  gameRunning = true
}

function destroy() {
  console.log("Game Over")

  bulletShotOrigin = null
  bulletLocation = null
  bulletFired = null
  bulletCount = null
  shipColor = ""
  fps = null
  frame = null
  shapesOnScreen = null

  // setup game objects
  myShip = null
  ship1 = null
  ship2 = null
  enemies = null

  gameRunning = false
  inTransition = false

  gameOverShape = new Shape(
    gameOver,
    new Location(-5, 11),
    new MovementPattern([patternDropDown],
      {type: "repeat", number: 1},
      50
    ),
    "game over"
  )

  gameOverShape.moveShape()
}

function collisionCheck() {

  if (!myShip.alive || enemies.length === 0) {
    gameRunning = false;
    currentLevel++;
    if (currentLevel >= levels.length + 1) {
      inTransition = false
      clearInterval(lightInterval);
      return destroy()
    } else {
      console.debug(`Starting level ${currentLevel}`);
      inTransition = true
      lightInterval = setInterval(() => levelLightOn = !levelLightOn, 500);
      setTimeout(async function () { await transitionLevel() }, 5000);
    }
  }

  myShip.collisionCheck(enemies)

  enemies[0].collisionCheck([myShip])

  if (!enemies[0].alive) {
    enemies.splice(0, 1)
    if (enemies.length > 0) {
      enemies[0].shape.moveShape()
    }
  }

  if (enemies[0].isOffScreen()) enemies[0].destroy();
}

// render
function render() {
  // cleanup all unused lights
  for (let r = 0; r < grid.height; r++) {
    for (let c = 0; c < grid.width; c++) {
      let led = (new Location(r, c))
      turnOff(led)
    }
  }

  // turn on lights in the simulator
  if (gameRunning) {
    for (let i = 0; i < myShip.shape.shapeType.length; i++) {
      turnOn(
        grid,
        new Location(
          myShip.shape.shapeType[i].row + myShip.shape.location.row,
          myShip.shape.shapeType[i].column + myShip.shape.location.column
        ),
        myShip.shape.shapeType[i].color
      )
    }

    for (let b = 0; b < myShip.bullets.length; b++) {
      turnOn(grid, myShip.bullets[b].location, "bg-red")
    }

    // show enemies on screen
    for (let i = 0; i < enemies[0].shape.shapeType.length; i++) {
      turnOn(
        grid,
        new Location(
          enemies[0].shape.shapeType[i].row + enemies[0].shape.location.row,
          enemies[0].shape.shapeType[i].column + enemies[0].shape.location.column
        ),
        enemies[0].shape.shapeType[i].color
      )
    }

    Object.entries(shapesOnScreen).forEach(([shapeName, shape]) => {
      shape.shape_configs.forEach(config => {
        turnOn(
          grid,
          new Location(
            config.row + 0,
            config.column + 0
          ),
          config.color
        )
      })
    })
  } else if (inTransition) {
    colorSection('bg-red', 16, 0, currentLevel === 1);
    colorSection('bg-green', 16, 16, currentLevel === 2);
    colorSection('bg-purple', 16, 32, currentLevel === 3);
    colorSection('bg-blue', 16, 48, currentLevel === 4);
  } else {
    // render game over screen defined in destroy function
    for (let i = 0; i < gameOverShape.shapeType.length; i++) {
      turnOn(
        grid,
        new Location(
          gameOverShape.shapeType[i].row + gameOverShape.location.row,
          gameOverShape.shapeType[i].column + gameOverShape.location.column
        ),
        gameOverShape.shapeType[i].color
      )
    }
  }
}

function colorSection(color, numRows, startingRow, isBlinking) {
  for (let i = startingRow; i < startingRow + numRows; i++) {
    for (let j = 0; j < grid.width; j++) {
      if (!isBlinking || levelLightOn) {
        turnOn(
          grid,
          new Location(i, j),
          color,
        );
      }
    }
  }
}

export function gameLoop() {
  if (gameRunning && !inTransition) {
    collisionCheck()
  }
  render()
}
