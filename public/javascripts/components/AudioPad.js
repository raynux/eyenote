'use strict'
import _ from 'lodash'
import React from 'react'
import Reflux from 'reflux'
import {Row, Col, Panel, Button} from 'react-bootstrap'

import AudioAction from '../actions/AudioAction'
import AudioStore from '../stores/AudioStore'

export default React.createClass({
  mixins: [Reflux.connect(AudioStore, 'audio')],


  padGenerator(trackName) {
    const track = _.find(this.state.audio.tracks, {name: trackName})
    if(_.isUndefined(track)) { return <Panel>Loading...</Panel> }

    if(track.isConnected) {
      return (
        <Col xs={4} className="text-center">
          <Panel onClick={() => {AudioAction.stopTrack(trackName)}}
                 style={{backgroundColor: '#339'}}>
            {trackName}
          </Panel>
        </Col>
      )
    }

    return (
      <Col xs={4} className="text-center">
        <Panel onClick={() => {AudioAction.startTrack(trackName)}}>
          {trackName}
        </Panel>
      </Col>
    )
  },

  render() {
    return (
      <div style={{marginTop: 40}}>
        <Row>
          {(() => {return this.padGenerator('se0')})()}
        </Row>
        <Row>
          {(() => {return this.padGenerator('bass0')})()}
        </Row>
        <Row>
          {(() => {return this.padGenerator('drum0')})()}
          {(() => {return this.padGenerator('drum1')})()}
          {(() => {return this.padGenerator('drum2')})()}
        </Row>
      </div>
    )
  }
})
