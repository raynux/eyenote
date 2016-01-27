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
      const result = JSON.parse(res.text)
      this.data.results.push(result)

      const faceAnnotation = result[0].faceAnnotations[0]
      if(! _.isUndefined(faceAnnotation)) {
        this.analyzeHeadStatus(faceAnnotation)
      }
      this.trigger(this.data)
    })
    .catch((err) => { console.log(err) })
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

  applyEffect() {
    const isUp    = _.isEqual(status.tilt, VisionStore.POSITION.UP)
    const isDown  = _.isEqual(status.tilt, VisionStore.POSITION.DOWN)
    const isRight = _.isEqual(status.pan, VisionStore.POSITION.RIGHT)
    const isLeft  = _.isEqual(status.pan, VisionStore.POSITION.LEFT)


  }
})
