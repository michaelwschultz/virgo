import React from 'react';
import _ from 'lodash';
import Board from './board';
import {
  EnemyShip,
  Level,
  Shape,
  Location,
  MovementPattern,
  UserShip,
} from './classes';
import  {
  userShip,
  gameOver,
  patternDropDown,
  patternScroll,
} from './shapes';

export default class GameEngine extends React.PureComponent {
  constructor(props, context) {
    super(props, context);
    console.debug('Setting up gameEngine...')

    console.debug('Starting level 1')

    this.grid = {height: 64, width: 32};

    this.levels = [
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
    ];

    this.state = {
      displayedWelcomeScreen: null,
      enemies: null,
      lightInterval: null,
      myShip: null,
      ship1: null,
      ship2: null,
      bulletCount: 0,
      bulletFired: false,
      bulletLocation: null,
      bulletShotOrigin: null,
      currentLevel: 1,
      frame: 0,
      gameOverShape: new Shape(
        gameOver,
        new Location(-5, 11),
        new MovementPattern([patternDropDown],
          { type: "repeat", number: 1 },
          50
        ),
        "game over"
      ),
      gameRunning: false,
      inTransition: true,
      shipColor: "",
      levelLightOn: false
    };

    this.loopId = null;
    this.lightInterval = null;
    this.transitionLevel = this.transitionLevel.bind(this);
    this.execGameLoop = this.execGameLoop.bind(this);
  }

  componentDidMount() {
    this.lightInterval = setInterval(() => {
      this.state.levelLightOn = !this.state.levelLightOn;
    }, 500)
    setTimeout(async () => await this.transitionLevel(), 5000)
    this.loopId = setInterval(() => this.execGameLoop(), 1000 / this.props.fps)
  }

  componentWillUnmount() {
    clearInterval(this.loopId);
  }

  destroy() {
    this.state.gameRunning = false;
    this.state.inTransition = false;

    this.state.gameOverShape.moveShape();
  }

  collisionCheck() {
    const { currentLevel, myShip,  enemies } = this.state;

    if (!myShip.alive) {
      return this.destroy();
    }
    if (enemies.length === 0 || !_.some(enemies, e => e.alive)) {
      this.state.gameRunning = false;
      this.state.currentLevel++;

      if (this.state.currentLevel >= this.levels.length + 1) {
        this.state.inTransition = false;
        this.state.gameRunning = false;
        clearInterval(this.lightInterval);
        return this.destroy();
      } else {
        console.debug(`Starting level ${currentLevel}`);
        this.state.inTransition = true;
        this.lightInterval = setInterval(() => {
          this.state.levelLightOn = !this.state.levelLightOn;
        }, 500)
        setTimeout(async () => { await this.transitionLevel() }, 5000);
      }
    }

    myShip.collisionCheck(enemies);

    if (enemies && enemies[0]) {
      enemies[0].collisionCheck([myShip]);
    }

    if (enemies[0] && enemies[0].isOffScreen()) {
      enemies[0].destroy();
    }

    if (enemies[0] && !enemies[0].alive) {
      this.state.enemies = enemies.slice(1);
      if (enemies.length > 0) {
        enemies[0].shape.moveShape();
      }
    }
  }

  execGameLoop() {
    const { gameRunning, inTransition } = this.state;
    if (gameRunning && !inTransition) {
      this.collisionCheck();
    }
    this.forceUpdate();
  };

  async transitionLevel() {
    const { currentLevel } = this.state;
    if (currentLevel > this.levels.length) {
      return this.destroy()
    }
    clearInterval(this.lightInterval);
    let enemies = await this.levels[currentLevel - 1].loadLevel()

    enemies = enemies.map((enemy) => {
      return new EnemyShip(
        this.grid,
        new Shape(
          enemy.shape_configs,
          new Location(0, 13),
          new MovementPattern(
            // [pattern1, pattern2, pattern1],
            [patternScroll],
            { type: 'repeat', number: 3 }, 30
          )
        ), enemy.name, enemy.shape_configs[0].color, 4, 64,
      )
    });
    // setup game objects
    const myShip = new UserShip(
      this.grid,
      new Shape(
        userShip,
        new Location(60, 15)
      ), 'my ship', 'bg-yellow', 4, document
    );

    enemies[0].shape.moveShape()

    this.state.gameRunning = true;
    this.state.inTransition = false;
    this.state.myShip = myShip;
    this.state.enemies = enemies;
  }

  colorSection(color, numRows, startingRow, isBlinking) {
    let config = [];
    for (let i = startingRow; i < startingRow + numRows; i++) {
      let row = [];
      for (let j = 0; j < this.grid.width; j++) {
        if (!isBlinking || this.state.levelLightOn) {
          row.push(color);
        } else {
          row.push('led-off');
        }
      }
      config.push(row);
    }

    return config;
  }

  getConfig() {
    const { enemies, gameRunning, gameOverShape, inTransition, myShip, } = this.state;
    let config = [];
    for (let i = 0; i < this.grid.height; i++) {
      let row = [];
      for (let j = 0; j < this.grid.width; j++) {
        row.push('led-off')
      }
      config.push(row);
    }

    // turn on lights in the simulator
    if (gameRunning) {
      for (let i = 0; i < myShip.shape.shapeType.length; i++) {
        const row = myShip.shape.shapeType[i].row + myShip.shape.location.row;
        const col = myShip.shape.shapeType[i].column + myShip.shape.location.column;
        config[row][col] = myShip.shape.shapeType[i].color;
      }

      for (let b = 0; b < myShip.bullets.length; b++) {
        config[myShip.bullets[b].location.row][myShip.bullets[b].location.column] = "bg-red";
      }

      // show enemies on screen
      if (enemies[0]) {
        for (let i = 0; i < enemies[0].shape.shapeType.length; i++) {
          const row = enemies[0].shape.shapeType[i].row + enemies[0].shape.location.row;
          const col = enemies[0].shape.shapeType[i].column + enemies[0].shape.location.column;
          if (row >= 0 && col >= 0 && row < this.grid.height && col < this.grid.width) {
            config[row][col] = enemies[0].shape.shapeType[i].color
          }
        }
      }
    } else if (inTransition) {
      config = [];
      config = [...config, ...this.colorSection('bg-red', 16, 0, this.state.currentLevel === 1)];
      config = [...config, ...this.colorSection('bg-green', 16, 0, this.state.currentLevel === 2)];
      config = [...config, ...this.colorSection('bg-purple', 16, 0, this.state.currentLevel === 3)];
      config = [...config, ...this.colorSection('bg-blue', 16, 0, this.state.currentLevel === 4)];
    } else {
      // render game over screen defined in destroy function
      for (let i = 0; i < gameOverShape.shapeType.length; i++) {
        const row = gameOverShape.shapeType[i].row + gameOverShape.location.row;
        const col = gameOverShape.shapeType[i].column + gameOverShape.location.column;
        if (row >= 0 && col >= 0 && row < this.grid.height && col < this.grid.width) {
          config[row][col] = gameOverShape.shapeType[i].color;
        }
      }
    }

    return config;
  }

  render() {
    const config = this.getConfig();
    return (
        <div id="simulator">
          <Board name="simulator" grid={this.grid} config={config} color='led-off' />
        </div>
    );
  }
};
