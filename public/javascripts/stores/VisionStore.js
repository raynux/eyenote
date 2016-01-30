'use strict'
import Reflux from 'reflux'
import VisionAction from '../actions/VisionAction'
import AudioAction from '../actions/AudioAction'
import uuid from 'node-uuid'

import superagent from 'superagent'
require('superagent-as-promised')(superagent)

const POSITION = {
  CENTER: 0,
  LEFT:   1,
  RIGHT:  2,
  UP:     3,
  DOWN:   4
}

export default Reflux.createStore({
  listenables: [VisionAction],

  POSITION: POSITION,

  BOUNDARIES: {
    pan: [
      {pos: POSITION.RIGHT,  min: -60, max: -25},
      {pos: POSITION.CENTER, min: -25, max:  25},
      {pos: POSITION.LEFT,   min:  25, max:  60}
    ],
    tilt: [
      {pos: POSITION.DOWN,   min: -60, max: -10},
      {pos: POSITION.CENTER, min: -10, max:  10},
      {pos: POSITION.UP,     min:  10, max:  60}
    ],
    roll: [
      {pos: POSITION.RIGHT,  min: -60, max: -20},
      {pos: POSITION.CENTER, min: -20, max:  20},
      {pos: POSITION.LEFT,   min:  20, max:  60}
    ]
  },

  data: {
    interval: null,
    results: [],
    headStatus: {
      tilt: POSITION.CENTER,
      roll: POSITION.CENTER,
      pan:  POSITION.CENTER
    }
  },

  submit(result) {
    superagent
    .post('/api/classify')
    .send({image: result})
    .then((res) => {
      this.onResultReceived(JSON.parse(res.text))
      this.trigger(this.data)
    })
    .catch((err, res) => {
      console.error(err)
      console.info(res)
    })
  },

  setTimer(interval) {
    this.data.interval = interval
    this.trigger(this.data)
  },

  stopTimer() {
    clearInterval(this.data.interval)
    this.data.interval = null
    this.trigger(this.data)
  },

  init() {
  },

  getInitialState() { return this.data },

  onResultReceived(result) {
    this.data.results.push(result)

    // Face detected or not
    const faceAnnotations = result[0].faceAnnotations
    if(_.isUndefined(faceAnnotations)) {
      AudioAction.setLowPassFilter(true)
    }
    else {
      AudioAction.setLowPassFilter(false)
      this.analyzeHeadStatus(faceAnnotations[0])  // Only the first face
      this.applyMoment()
    }

    // Label detected
    const labelAnnotations = result[0].labelAnnotations
    if(! _.isUndefined(labelAnnotations)) {
      // Stop all tracks if "finger" detected
      if(_.find(labelAnnotations, {description: 'finger'})) { AudioAction.stopTrack('*') }
    }

    // // Text detected
    const textAnnotations = result[0].textAnnotations
    if(! _.isUndefined(textAnnotations)) { this.applyText(textAnnotations) }
  },

  getPosition(angle, boundaries) {
    const boundaryInfo = _.find(boundaries, (b) => {
      return _.inRange(angle, b.min, b.max)
    })

    if(!boundaryInfo) { return POSITION.CENTER }   // Out of Range
    return boundaryInfo.pos
  },

  analyzeHeadStatus(face) {
    this.data.headStatus.tilt = this.getPosition(face.tiltAngle, this.BOUNDARIES.tilt)
    this.data.headStatus.roll = this.getPosition(face.rollAngle, this.BOUNDARIES.roll)
    this.data.headStatus.pan  = this.getPosition(face.panAngle,  this.BOUNDARIES.pan)
  },

  applyMoment() {
    const isUp        = _.isEqual(this.data.headStatus.tilt, this.POSITION.UP)
    const isDown      = _.isEqual(this.data.headStatus.tilt, this.POSITION.DOWN)
    const isPanRight  = _.isEqual(this.data.headStatus.pan,  this.POSITION.RIGHT)
    const isPanLeft   = _.isEqual(this.data.headStatus.pan,  this.POSITION.LEFT)
    const isRollRight = _.isEqual(this.data.headStatus.roll, this.POSITION.RIGHT)
    const isRollLeft  = _.isEqual(this.data.headStatus.roll, this.POSITION.LEFT)

    // Drum
    if(isUp) { AudioAction.startTrack('drum0', {exclude: /drum/}) }
    else if(isDown) { AudioAction.startTrack('drum1', {exclude: /drum/}) }

    // Bass
    if(isPanLeft) { AudioAction.startTrack('bass0', {exclude: /bass/}) }
    else if(isPanRight) { AudioAction.startTrack('bass1', {exclude: /bass/}) }

    // SE
    if(isRollLeft) { AudioAction.startTrack('se0', {exclude: /se/}) }
    else if(isRollRight) { AudioAction.startTrack('se1', {exclude: /se/}) }
  },

  applyText(annotations) {
    _.each(annotations, (a) => {
      if(a.description.match(/NO SE/)) { AudioAction.stopTrack(/se/) }
      if(a.description.match(/NO BASS/)) { AudioAction.stopTrack(/bass/) }
      if(a.description.match(/NO DRUM/)) { AudioAction.stopTrack(/drum/) }
    })
  }
})
