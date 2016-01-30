'use strict'
import _ from 'lodash'
import React from 'react'
import Reflux from 'reflux'
import EventEmitterMixin from 'react-event-emitter-mixin'
import {ButtonGroup, Button, Nav, Navbar, NavItem, Glyphicon} from 'react-bootstrap'

import AudioAction from '../actions/AudioAction'
import VisionStore from '../stores/VisionStore'
import AudioStore from '../stores/AudioStore'

import HowToPlay from './HowToPlay'

export default React.createClass({
  mixins: [
    EventEmitterMixin,
    Reflux.connect(VisionStore, 'vision'),
    Reflux.connect(AudioStore, 'audio')
  ],

  startCapture() { this.eventEmitter('emit', 'StartCapture') },
  stopCapture() { this.eventEmitter('emit', 'StopCapture') },
  openHowToPlay() { this.eventEmitter('emit', 'OpenHowToPlay') },

  render() {
    const captureOnClick = this.state.vision.interval ? this.stopCapture : this.startCapture

    let captureButton;
    if(this.state.audio.isLoading) {
      captureButton = (
        <Button disabled={true}>Loading Sound Tracks...</Button>
      )
    }
    else {
      const label = _.isNull(this.state.vision.interval) ? 'Capture' : 'Stop'
      captureButton = (
        <Button onClick={captureOnClick} active={this.state.vision.interval != null}>
          <Glyphicon glyph="camera" /> {label}
        </Button>
      )
    }

    return (
      <Navbar inverse={false} fixedTop={true}>
        <Navbar.Header>
          <Navbar.Brand>Eye Note</Navbar.Brand>
        </Navbar.Header>
        <Nav pullRight>
          <NavItem>
            <Button onClick={this.openHowToPlay} bsStyle='link'>How To Play</Button>
            <ButtonGroup>{captureButton}</ButtonGroup>
            <HowToPlay />
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
})
