//** LED Board **//
import _ from 'lodash';
import React, { Fragment } from 'react';

export default class Board extends React.PureComponent {
  renderCols(r) {
    return  _.times(this.props.grid.width, (c) => {
      const color = this.props.config ? this.props.config[r][c] : 'led-off';
      return (
        <li id={`${r}-${c}-${this.props.name}-board`} className={`dib led-size led-spacing br-100 ${color}`}>
        </li>
      );
    });
  }

  renderRows() {
    return _.times(this.props.grid.height, (r) => {
      return (
        <ul id={`${this.props.name}-row-${r}`}>
          {
           this.renderCols(r)
          }
        </ul>
      );
    });
  }

  render() {
    return (
      <div>
        {this.renderRows()}
      </div>
    );
  }
};
