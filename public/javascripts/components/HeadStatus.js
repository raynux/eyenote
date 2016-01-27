'use strict'
import _ from 'lodash'
import React from 'react'
import Reflux from 'reflux'
import {Row, Col, Panel, Button} from 'react-bootstrap'

import VisionStore from '../stores/VisionStore'

const activeStyle = {
  backgroundColor: '#44a'
}

export default React.createClass({
  mixins: [Reflux.connect(VisionStore, 'vision')],

  upStyle: {},
  downStyle: {},
  rollRightStyle: {},
  rollLeftStyle: {},
  panRightStyle: {},
  panLeftStyle: {},

  render() {
    const status = this.state.vision.headStatus
    this.upStyle        = _.isEqual(status.tilt, VisionStore.POSITION.UP)    ? activeStyle : {}
    this.downStyle      = _.isEqual(status.tilt, VisionStore.POSITION.DOWN)  ? activeStyle : {}
    this.rollRightStyle = _.isEqual(status.roll, VisionStore.POSITION.RIGHT) ? activeStyle : {}
    this.rollLeftStyle  = _.isEqual(status.roll, VisionStore.POSITION.LEFT)  ? activeStyle : {}
    this.panRightStyle  = _.isEqual(status.pan,  VisionStore.POSITION.RIGHT) ? activeStyle : {}
    this.panLeftStyle   = _.isEqual(status.pan,  VisionStore.POSITION.LEFT)  ? activeStyle : {}

    return (
      <div>
        <Row>
          <Col md={12}>
            <h5>Head Direction</h5>
          </Col>
          <Col md={4}>
            <Panel style={this.rollRightStyle}>Roll Right</Panel>
            <Panel style={this.panRightStyle}>Pan Right</Panel>
          </Col>
          <Col md={4}>
            <Panel style={this.upStyle}>Tilt Up</Panel>
            <Panel style={this.downStyle}>Tilt Down</Panel>
          </Col>
          <Col md={4}>
            <Panel style={this.rollLeftStyle}>Roll Left</Panel>
            <Panel style={this.panLeftStyle}>Pan Left</Panel>
          </Col>
        </Row>
      </div>
    )
  }
})
