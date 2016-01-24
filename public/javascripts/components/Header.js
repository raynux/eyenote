'use strict';
import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import EventEmitterMixin from 'react-event-emitter-mixin';
import {Button, Nav, Navbar, NavItem, Glyphicon} from 'react-bootstrap';

import WebAudioController from './WebAudioController';
import VisionStore from '../stores/VisionStore';

export default React.createClass({
  mixins: [
    EventEmitterMixin,
    Reflux.connect(VisionStore, 'vision')
  ],

  startCapture() { this.eventEmitter('emit', 'StartCapture') },
  stopCapture() { this.eventEmitter('emit', 'StopCapture') },

  render() {
    return (
      <Navbar inverse={false} fixedTop={true}>
        <Navbar.Header>
          <Navbar.Brand>Eye Note</Navbar.Brand>
        </Navbar.Header>
        <Nav pullRight>
          <NavItem>
            <WebAudioController />
            {(() => {
              if(this.state.vision.interval) {
                return (<Button onClick={this.stopCapture}><Glyphicon glyph="stop" /> Pause</Button>)
              }
              else {
                return (<Button onClick={this.startCapture}><Glyphicon glyph="camera" /> Capture</Button>)
              }
            })()}
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
})
