'use strict'
import _ from 'lodash'
import React from 'react'
import Reflux from 'reflux'
import EventEmitterMixin from 'react-event-emitter-mixin'
import {Modal} from 'react-bootstrap'

export default React.createClass({
  mixins: [EventEmitterMixin],

  getInitialState() {
    return { showModal: false };
  },

  componentDidMount() {
    this.eventEmitter('on', 'OpenHowToPlay', () => {
      this.setState({showModal: true})
    })
  },

  close() {
    this.setState({ showModal: false });
  },

  open() {
    this.setState({ showModal: true });
  },

  render() {
    return (
      <Modal bsSize='large' show={this.state.showModal} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>How To Play</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Requirement</h4>
          <p className="lead">
            Latest Google Chrome
          </p>

          <h4>Switch Track (Head Derection)</h4>
          <p className="lead">
            <strong>PAN</strong> to switch <strong>Bass</strong> pattern<br />
            <strong>TILT</strong> to switch <strong>Drum</strong> pattern<br />
            <strong>ROLL</strong> to switch <strong>Sound Effect</strong> pattern
          </p>

          <h4>Muting Track (OCR)</h4>
          <p className="lead">
            <strong>NO BASS</strong> to turn off bass<br />
            <strong>NO DRUM</strong> to turn off drum<br />
            <strong>NO SE</strong> to turn off sound-effect<br />
          </p>

          <h4>Muting All Track (Object Recognition)</h4>
          <p className="lead">
            Show <strong>finger</strong> to stop all tracks
          </p>

          <h4>Low-Pass Filter (Object Recognition)</h4>
          <p className="lead">
            Enabled when no face detected
          </p>

        </Modal.Body>
      </Modal>
    )
  }
})
