import React, { Fragment } from 'react';
import cx from 'classnames';

import GameEngine from './gameengine';
import Board from './board';
import SoundEffect from './soundeffect';
import { intitializeVisualConsole } from './console';
import Selectables from './selectables';

export default class SpaceShooter extends React.PureComponent {
  constructor() {
    super();
    this.bgm = new SoundEffect('bgm', 'lf-1.mp3', 0.5, true);

    this.state = {
      selectedTab: 'console',
    }
  }

  toggleSound() {
    this.bgm.toggle();
  }

  onClickConsole() {
    this.setState({
      selectedTab: 'console',
    });
  }

  onClickShapes() {
    this.setState({
      selectedTab: 'shapes',
    });
  }

  componentDidMount() {
    intitializeVisualConsole();
    console.debug('Setting up game...')

    const newShape = new Selectables({
      zone: '#simulator',
      elements: 'li',
      selectedClass: 'selected',
      key: 'altKey'
    })

    let loadButton = document.getElementById('loadButton')

    loadButton.addEventListener('click', async function () {
      const shape = await newShape.loadShapeObject()
      // TODO: Do something with shape
    })

  }

  render() {
    return (
      <Fragment>
        <div id="header" className="flex items-center justify-between">
          <h2 className="lightest-blue pv2">LED Board Simulator</h2>
          <div id="utilties" className="flex items-center justify-between">
            <div className="flex items-center mt2">
              <button type="button" id="loadButton">Load Shape</button>
              <button type="button" id="saveButton">Save Shape</button>
            </div>
            <div className="flex items-center">
              <p className="lightest-blue ph2">Sound</p>
              <label className="switch">
                <input type="checkbox" onClick={() => this.toggleSound()} />
                <div></div>
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-between flex-wrap">
          <GameEngine fps={60} />
          <div id="tabs">
            <ul id="tabNavigation">
              <li
                id="consoleButton"
                className={cx({
                  active: this.state.selectedTab === 'console',
                })}
                onClick={() => this.onClickConsole()}
              >
                <a href="#">
                  Console
                </a>
              </li>
              <li
                id="shapeButton"
                className={cx({
                  active: this.state.selectedTab === 'shapes',
                })}
                onClick={() => this.onClickShapes()}
              >
                <a href="#">
                  Shapes
                </a>
              </li>
            </ul>

            <div id="consolePanel" className={cx({
                hide: this.state.selectedTab !== 'console',
              })}>
              <div id="legend" className="flex justify-between mv2">
                <div className="flex items-center log">
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: 8,
                    marginRight: 4,
                  }}></div>
                  log
                </div>
                <div className="flex items-center debug">
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: 8,
                    marginRight: 4,
                  }}></div>
                  debug
                </div>
                <div className="flex items-center warn">
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: 8,
                    marginRight: 4,
                  }}></div>
                  warn
                </div>
                <div className="flex items-center error">
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: 8,
                    marginRight: 4,
                  }}></div>
                  error
                </div>
              </div>
              <div id="log"></div>
            </div>

            <div id="shapesPanel" className={cx('mt3', {
                hide: this.state.selectedTab !== 'shapes',
              })}>
              <ul>
                <li>
                  <p>Shape-Name</p>
                  <Board name="previewBoard1" grid={{width: 32, height: 16}} color='led-off' />
                </li>
                <li>
                  <p>Shape-Name 2</p>
                  <Board name="previewBoard2" grid={{width: 32, height: 16}} color='led-off' />

                </li>
                <li>
                  <p>Shape-Name 3</p>
                  <Board name="previewBoard3" grid={{width: 32, height: 16}} color='led-off' />

                </li>
                <li>
                  <p>Shape-Name 4</p>
                  <Board name="previewBoard4" grid={{width: 32, height: 16}} color='led-off' />

                </li>
              </ul>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
};

