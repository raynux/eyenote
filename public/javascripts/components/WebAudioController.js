'use strict'
import _ from 'lodash'
import React from 'react'
import Reflux from 'reflux'
import {ButtonGroup, Button, Glyphicon} from 'react-bootstrap'

import AudioAction from '../actions/AudioAction'
import AudioStore from '../stores/AudioStore'

export default React.createClass({
  mixins: [Reflux.connect(AudioStore, 'audio')],

  render() {
    const buttonOnClick = this.state.audio.playing ? AudioAction.stop : AudioAction.start

    return (
      <ButtonGroup>
        <Button onClick={buttonOnClick} active={this.state.audio.playing}>
          <Glyphicon glyph="volume-up" /> Theremin
        </Button>
        <Button onClick={AudioAction.fire} active={this.state.audio.playing}>
          <Glyphicon glyph="headphones" /> FIRE!
        </Button>
      </ButtonGroup>
    )
  }
})
