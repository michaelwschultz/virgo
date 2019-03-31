let bulletCount
let bulletFired
let bulletLocation
let bulletShotOrigin
let displayedWelcomeScreen
let enemies
let fps
let frame
let gameOverShape
let gameRunning
let myShip
let shapesOnScreen
let ship1
let ship2
let shipColor

const grid = {height: 16, width: 32}
const ledColor = 'bg-dark-blue'

// render simulator
getBoard('board', 'slot', 'bg-dark-blue')
getBoard('board-lights', 'light')


let newShape = new Selectables({
  zone: '#board',
  elements: 'li',
  selectedClass: 'selected',
  key: 'altKey'
})

// set sound to off
let soundMuted = true

// TODO this doesn't quite work right
// comment this function call to unmute sound
// toggleSound()
function toggleSound() {
  soundMuted = !soundMuted

  if (soundMuted) {
    bgm.pause()
    document.getElementById('soundToggle').style.color = 'red'
    document.getElementById('soundToggle').innerHTML = 'Sound off'
  } else {
    bgm.play()
    document.getElementById('soundToggle').style.color = '#cdecff'
    document.getElementById('soundToggle').innerHTML = 'Sound on'
  }
}

// start bgm
const bgm = playSoundEffect('bgm', 'lf-1.mp3', 0.5, true)

function init() {
  //** Variables and setup **//
  bulletCount = 0
  bulletFired = false
  bulletLocation = null
  bulletShotOrigin = null
  fps = 60
  frame = 0
  gameOverShape = null
  gameRunning = true
  shapesOnScreen = {}
  shipColor = ""

  // setup game objects
  myShip = new UserShip(
    new Shape(
      userShip,
      new Location(6, 0)
    ), 'my ship', 'bg-yellow', 4, document
  )
  ship1 = new EnemyShip(
    new Shape(
      shapeSmallEnemy,
      new Location(9, 6),
      new MovementPattern (
        // [pattern1, pattern2, pattern1],
        [patternStatic],
        {type: 'repeat', number: 3}, 80
      )
    ), 'orange ship', 4
  )
  ship2 = new EnemyShip(
    new Shape(
      shapeLargeEnemy,
      new Location(3, 6),
      new MovementPattern(
        // [pattern1, pattern2, pattern1],
        [patternStatic],
        {type: 'repeat', number: 3},
        70
      )
    ), 'green ship', 4
  )

  enemies = [ship1, ship2]

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].shape.moveShape()
  }

  let loadButton = document.getElementById('loadButton');

  loadButton.addEventListener('click', async function () {
    const shape = await newShape.loadShapeObject();
    shapesOnScreen[shape.name] = shape;
  });
}

function destory() {
  bulletShotOrigin = null
  bulletLocation = null
  bulletFired = null
  bulletCount = null
  shipColor = ""
  fps = null
  frame = null
  shapesOnScreen = null

  // setup game objects
  myShip.destory()
  myShip = null
  ship1 = null
  ship2 = null
  enemies = null

  gameRunning = false

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
  myShip.collisionCheck(enemies)

  for (let j = 0; j < enemies.length; j++) {
    enemies[j].collisionCheck([myShip])

    if (!enemies[j].alive) {
      enemies.splice(j, 1)
    }
  }

  if (!myShip.alive || enemies.length === 0) {
    destory()
    setTimeout(function() {init()}, 3000)
  }
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
    turnOn(myShip.shape.location, myShip.color)
    for (let b = 0; b < myShip.bullets.length; b++) {
      turnOn(myShip.bullets[b].location, "bg-red")
    }

    // show enemies on screen
    for (let j = 0; j < enemies.length; j++) {
      for (let i = 0; i < enemies[j].shape.shapeType.length; i++) {
        turnOn(
          new Location(
            enemies[j].shape.shapeType[i].row + enemies[j].shape.location.row,
            enemies[j].shape.shapeType[i].column + enemies[j].shape.location.column
          ),
          enemies[j].shape.shapeType[i].color
        )
      }
    }

    Object.entries(shapesOnScreen).forEach(([shapeName, shape]) => {
      shape.shape_configs.forEach(config => {
        turnOn(
          new Location(
            config.row + 0,
            config.column + 0
          ),
          config.color
        );
      });
    });
  } else {
    // render game over screen defined in destroy function
    for (let i = 0; i < gameOverShape.shapeType.length; i++) {
      turnOn(
        new Location(
          gameOverShape.shapeType[i].row + gameOverShape.location.row,
          gameOverShape.shapeType[i].column + gameOverShape.location.column
        ),
        gameOverShape.shapeType[i].color
      )
    }
  }
}

function gameLoop() {
  if (gameRunning) {
    collisionCheck()
  }
  render()
}

init()
