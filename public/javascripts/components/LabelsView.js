'use strict'
import _ from 'lodash'
import numeral from 'numeral'
import React from 'react'
import Reflux from 'reflux'
import {Panel} from 'react-bootstrap'

import VisionStore from '../stores/VisionStore'

const FILTER_OBJECTS = [
  // 'hair',
  // 'hairstyle',
  // 'hair care',
  // 'eyebrow',
  // 'beard',
  // 'moustache'
]
const SCORE_THRESHOLD = 0.5
const DISPLAY_ITEM_COUNT = 4

const DetectedItem = React.createClass({
  render() {
    const faces = _(this.props.item.faceAnnotations)
      .map((annot) => {
        const key = `${annot.panAngle}-${annot.tiltAngle}-${annot.rollAngle}`
        return (
          <div key={key}>Pan={annot.panAngle} / tilt={annot.tiltAngle} / roll={annot.rollAngle}</div>
        )
      }).value()


    const objects = _(this.props.item.labelAnnotations)
      .reject((annot) => { return _.includes(FILTER_OBJECTS, annot.description) })
      .filter((annot) => { return annot.score > SCORE_THRESHOLD })
      // .take(DISPLAY_ITEM_COUNT)
      .map((annot) => {
        return (
          <span key={annot.description} style={{marginLeft: 8}}>
            {annot.description} ({numeral(annot.score).format('0.0%')})
          </span>
        )
      }).value()

    const texts = _(this.props.item.textAnnotations)
      // .take(DISPLAY_ITEM_COUNT)
      .map((annot) => {
        return (
          <div key={annot.description}>
            {annot.locale} : {annot.description}
          </div>
        )
      }).value()

    return (
      <Panel>
        {objects}
        <hr />
        {texts}
        <hr />
        {faces}
      </Panel>
    )
  }
})

const DISPLAY_GENERATION_COUNT = 6
export default React.createClass({
  mixins: [Reflux.connect(VisionStore, 'vision')],

  render() {
    const detectedItems = _(this.state.vision.results)
      .flatten()  // ignore "batch" mode
      .reverse()
      .take(DISPLAY_GENERATION_COUNT)
      .map((result, i) => {
        return (<DetectedItem key={`item-${i}`} item={result} />)
      }).value()

    return (<div>{detectedItems}</div>)
  }
})
