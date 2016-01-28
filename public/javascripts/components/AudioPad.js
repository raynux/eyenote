'use strict'
import _ from 'lodash'
import React from 'react'
import Reflux from 'reflux'
import {Row, Col, Panel, Button} from 'react-bootstrap'

import AudioAction from '../actions/AudioAction'
import AudioStore from '../stores/AudioStore'

const ActiveStyle = {backgroundColor: '#44a'}
const ActiveStyle2 = {backgroundColor: '#a44'}

const PadCol = React.createClass({
  mixins: [Reflux.connect(AudioStore, 'audio')],

  getDefaultProps() {
    return {
      label: '',
      exclude: null
    }
  },

  startTrack() {
    AudioAction.startTrack(this.props.trackName, {exclude: this.props.exclude})
  },

  stopTrack() {
    AudioAction.stopTrack(this.props.trackName)
  },

  render() {
    const track = _.find(this.state.audio.tracks, {name: this.props.trackName})
    if(_.isUndefined(track)) { return <div /> }

    if(track.gain.gain.value == 0) {    // Muted
      return (
        <Col xs={4} className="text-center">
          <Panel onClick={this.startTrack}>{this.props.label}</Panel>
        </Col>
      )
    }

    return (
      <Col xs={4} className="text-center">
        <Panel onClick={this.stopTrack} style={ActiveStyle}>
          {this.props.label}
        </Panel>
      </Col>
    )
  }
})

export default React.createClass({
  mixins: [Reflux.connect(AudioStore, 'audio')],

  render() {
    const lowPassStyle = this.state.audio.isFiltered ? ActiveStyle2 : {}

    return (
      <div style={{marginTop: 40}}>
        <Row>
          <Col md={12}>
            <h5>Sound Track</h5>
          </Col>
        </Row>
        <Row>
          <PadCol trackName='se0' label='Sound Effect A' exclude={/se/} />
          <PadCol trackName='se1' label='Sound Effect B' exclude={/se/} />
        </Row>
        <Row>
          <PadCol trackName='bass0' label='Bass Pattern A' exclude={/bass/} />
          <PadCol trackName='bass1' label='Bass Pattern B' exclude={/bass/}/>
        </Row>
        <Row>
          <PadCol trackName='drum0' label='Drum Pattern A' exclude={/drum/} />
          <PadCol trackName='drum1' label='Drum Pattern B' exclude={/drum/} />
          <Col xs={4}>
            <Panel onClick={AudioAction.toggleBiquadFilter} style={lowPassStyle}>Low Pass</Panel>
          </Col>
        </Row>
      </div>
    )
  }
})
