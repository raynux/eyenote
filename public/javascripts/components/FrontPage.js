'use strict';
import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import {Panel, Grid, Row, Col, Button} from 'react-bootstrap';

import VisionStore from '../stores/VisionStore';

import Header from './Header';
import InputCamera from './InputCamera';
import LabelView from './LabelsView';
import AudioPad from './AudioPad';
import WebAudio from './WebAudio';


export default React.createClass({
  mixins: [Reflux.connect(VisionStore, 'vision')],

  render() {
    let responseView = null
    if(! _.isEmpty(this.state.vision.results)) {
      responseView = (
        <pre style={{color: '#ccc', backgroundColor: '#333'}}>
          {JSON.stringify(_.last(this.state.vision.results), null, 2)}
        </pre>
      );
    }

    return (
      <div>
        <WebAudio />
        <Header />

        <Grid style={{marginTop: 70}}>
          <Row style={{marginBottom: 10}}>
            <Col xs={6} md={6}>
              <InputCamera />
            </Col>
            <Col xs={6} md={6} className="text-center">
              <AudioPad />
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              {responseView}
            </Col>
            <Col xs={12} md={6}><LabelView /></Col>
          </Row>
        </Grid>
      </div>
    )
  }
})
