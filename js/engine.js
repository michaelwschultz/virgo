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

async function init() {
  //** Variables and setup **//
  bulletCount = 0
  bulletFired = false
  bulletLocation = null
  bulletShotOrigin = null
  fps = 60
  frame = 0
  gameOverShape = null
  gameRunning = false
  shapesOnScreen = {}
  shipColor = ""

  const level = new Level([
    'shape-name-test',
    'shape-square',
  ])

  enemies = await level.loadLevel()

  enemies = enemies.map((enemy) => {
    return new EnemyShip(
      new Shape(
        enemy.shape_configs,
        new Location(0, 31),
        new MovementPattern(
          // [pattern1, pattern2, pattern1],
          [patternScroll],
          { type: 'repeat', number: 3 }, 30
        )
      ), enemy.name, 4
    )
  })

  // setup game objects
  myShip = new UserShip(
    new Shape(
      userShip,
      new Location(6, 0)
    ), 'my ship', 'bg-yellow', 4, document
  )

  enemies[0].shape.moveShape()


  let loadButton = document.getElementById('loadButton')

  loadButton.addEventListener('click', async function () {
    const shape = await newShape.loadShapeObject()
    shapesOnScreen[shape.name] = shape
  })
  gameRunning = true
}

function destroy() {
  bulletShotOrigin = null
  bulletLocation = null
  bulletFired = null
  bulletCount = null
  shipColor = ""
  fps = null
  frame = null
  shapesOnScreen = null

  // setup game objects
  myShip.destroy()
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

  if (!myShip.alive || enemies.length === 0) {
    destroy()
    setTimeout(function () { init() }, 3000)
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
        new Location(
          myShip.shape.shapeType[i].row + myShip.shape.location.row,
          myShip.shape.shapeType[i].column + myShip.shape.location.column
        ),
        myShip.shape.shapeType[i].color
      )
    }

    for (let b = 0; b < myShip.bullets.length; b++) {
      turnOn(myShip.bullets[b].location, "bg-red")
    }

    // show enemies on screen

      for (let i = 0; i < enemies[0].shape.shapeType.length; i++) {
        turnOn(
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
          new Location(
            config.row + 0,
            config.column + 0
          ),
          config.color
        )
      })
    })
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
