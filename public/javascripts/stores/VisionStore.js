'use strict';
import Reflux from 'reflux';
import VisionAction from '../actions/VisionAction';
import uuid from 'node-uuid';

import superagent from 'superagent';
require('superagent-as-promised')(superagent);

export default Reflux.createStore({
  listenables: [VisionAction],

  data: {
    interval: null,
    results: []
  },

  submit(result) {
    superagent
    .post('/api/classify')
    .send({image: result})
    .then((res) => {
      this.data.results.push(JSON.parse(res.text));
      this.trigger(this.data);
    })
    .catch((err) => { console.log(err) })
  },

  setTimer(interval) {
    this.data.interval = interval;
    this.trigger(this.data);
  },

  stopTimer() {
    clearInterval(this.data.interval);
    this.data.interval = null;
    this.trigger(this.data);
  },

  init() {
  },

  getInitialState() {
    return this.data;
  }
})
