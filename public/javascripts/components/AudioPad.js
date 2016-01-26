'use strict';
import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import {Grid, Row, Col} from 'react-bootstrap';

import AudioAction from '../actions/AudioAction';
import AudioStore from '../stores/AudioStore';

export default React.createClass({
  mixins: [Reflux.connect(AudioStore, 'audio')],

  render() {
    return (
      <div>
        <Row>
          <Col xs={4} className="text-center">
            1
          </Col>
          <Col xs={4} className="text-center">
            2
          </Col>
          <Col xs={4} className="text-center">
            3
          </Col>
        </Row>
        <Row>
          <Col xs={4} className="text-center">
            4
          </Col>
          <Col xs={4} className="text-center">
            5
          </Col>
          <Col xs={4} className="text-center">
            6
          </Col>
        </Row>
        <Row>
          <Col xs={4} className="text-center">
            7
          </Col>
          <Col xs={4} className="text-center" style={{backgroundColor: '#333'}}>
            8
          </Col>
          <Col xs={4} className="text-center">
            9
          </Col>
        </Row>
      </div>
    )
  }
})
