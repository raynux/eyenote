'use strict';
import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import {Row, Col, Panel} from 'react-bootstrap';

import AudioAction from '../actions/AudioAction';
import AudioStore from '../stores/AudioStore';

export default React.createClass({
  mixins: [Reflux.connect(AudioStore, 'audio')],

  render() {
    return (
      <div style={{marginTop: 40}}>
        <Row>
          <Col xs={4} className="text-center">
            <Panel>x</Panel>
          </Col>
          <Col xs={4} className="text-center">
            <Panel>x</Panel>
          </Col>
          <Col xs={4} className="text-center">
            <Panel>x</Panel>
          </Col>
        </Row>
        <Row>
          <Col xs={4} className="text-center">
            <Panel>x</Panel>
          </Col>
          <Col xs={4} className="text-center">
            <Panel>x</Panel>
          </Col>
          <Col xs={4} className="text-center">
            <Panel>x</Panel>
          </Col>
        </Row>
        <Row>
          <Col xs={4} className="text-center">
            <Panel>DRUM-A</Panel>
          </Col>
          <Col xs={4} className="text-center">
            <Panel>DRUM-B</Panel>
          </Col>
          <Col xs={4} className="text-center">
            <Panel>DRUM-C</Panel>
          </Col>
        </Row>
      </div>
    )
  }
})
