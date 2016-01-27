'use strict'
import _ from 'lodash'
import React from 'react'
import Reflux from 'reflux'

import VisionStore from '../stores/VisionStore'
import AudioStore from '../stores/AudioStore'

import AudioAction from '../actions/AudioAction'

export default React.createClass({
  mixins: [
    // Reflux.connect(AudioStore, 'audio'),
    Reflux.connect(VisionStore, 'vision')
  ],

  render() {
    const current = _(this.state.vision.results)
      .flatten()  // ignore "batch" mode
      .reverse()
      .take(1)
      .value()[0]

    if(current && !_.isEmpty(current.faceAnnotations)) {
      AudioAction.setFrequency(
        100 * _.floor(Math.abs(current.faceAnnotations[0].tiltAngle))
      )
    }

    return React.createElement('span')
  }
})
