'use strict'
import _ from 'lodash'
import React from 'react'
import Reflux from 'reflux'
import {Row, Col, Panel, Button} from 'react-bootstrap'

import AudioAction from '../actions/AudioAction'
import AudioStore from '../stores/AudioStore'

const PadCol = React.createClass({
  mixins: [Reflux.connect(AudioStore, 'audio')],

  getDefaultProps() {
    return {exclude: null}
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

    if(track.isConnected) {
      return (
        <Col xs={4} className="text-center">
          <Panel onClick={this.stopTrack} style={{backgroundColor: '#339'}}>
            {this.props.trackName}
          </Panel>
        </Col>
      )
    }

    return (
      <Col xs={4} className="text-center">
        <Panel onClick={this.startTrack}>{this.props.trackName}</Panel>
      </Col>
    )
  }
})

export default React.createClass({
  render() {
    return (
      <div style={{marginTop: 40}}>
        <Row>
          <PadCol trackName='se0' />
        </Row>
        <Row>
          <PadCol trackName='bass0' />
        </Row>
        <Row>
          <PadCol trackName='drum0' exclude={/drum/} />
          <PadCol trackName='drum1' exclude={/drum/} />
          <PadCol trackName='drum2' exclude={/drum/} />
        </Row>
      </div>
    )
  }
})
