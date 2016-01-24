'use strict';
import Reflux from 'reflux';
import AudioAction from '../actions/AudioAction';

export default Reflux.createStore({
  listenables: [AudioAction],

  res: {
    context: null,
    oscNode: null,
    gainNode: null,
    playing: false
  },

  start() {
    this.res.playing = true;
    this.res.oscNode.connect(this.res.gainNode);
    this.trigger(this.res);
  },

  stop() {
    this.res.playing = false;
    this.res.oscNode.disconnect(this.res.gainNode);
    this.trigger(this.res);
  },

  setFrequency(frequency) {
    this.res.oscNode.frequency.value = frequency;
    console.log(`Current Frequency : ${this.res.oscNode.frequency.value}`);
    this.trigger(this.res);
  },

  init() {
    this.res.context = new AudioContext();

    this.res.oscNode = this.res.context.createOscillator();
    this.res.oscNode.frequency.value = 300;

    this.res.gainNode = this.res.context.createGain();
    this.res.gainNode.gain.value = 0.2;

    this.res.gainNode.connect(this.res.context.destination);
    this.res.oscNode.start();
  },

  getInitialState() {
    return this.res;
  }
})
