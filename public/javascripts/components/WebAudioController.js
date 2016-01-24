'use strict';
import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import {ButtonGroup, Button, Glyphicon} from 'react-bootstrap';

import AudioAction from '../actions/AudioAction';
import AudioStore from '../stores/AudioStore';

export default React.createClass({
  mixins: [Reflux.connect(AudioStore, 'audio')],

  render() {
    return (
      <ButtonGroup>
        {(() => {
          if(this.state.audio.playing) {
            return (<Button onClick={AudioAction.stop}><Glyphicon glyph="stop" /> Stop</Button>);
          }
          return (<Button onClick={AudioAction.start}><Glyphicon glyph="play" /> Play</Button>);
        })()}
      </ButtonGroup>
    )
  }
})
