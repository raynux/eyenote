'use strict';
import React from 'react';
import Reflux from 'reflux';
import EventEmitterMixin from 'react-event-emitter-mixin';
import {Button} from 'react-bootstrap';
import Webcam from 'react-webcam';

import VisionAction from '../actions/VisionAction';
import VisionStore from '../stores/VisionStore';

export default React.createClass({
  mixins: [
    EventEmitterMixin,
    Reflux.connect(VisionStore, 'vision')
  ],

  componentDidMount() {
    this.eventEmitter('on', 'StartCapture', () => {
      const interval = setInterval(() => {
        const base64Image = this.refs.webcam.getScreenshot().split(',')[1];
        VisionAction.submit(base64Image);
      }, 1200);

      VisionAction.setTimer(interval);
    });

    this.eventEmitter('on', 'StopCapture', () => {
      VisionAction.stopTimer();
    });
  },

  render() {
    return (
      <div>
        <Webcam style={{display: 'none'}} width={800} audio={false} ref='webcam' screenshotFormat='image/jpeg' />
      </div>
    )
  }
})
