'use strict';
import _ from 'lodash';
import Reflux from 'reflux';
import request from 'xhr-request';

import AudioAction from '../actions/AudioAction';

const DATA_SIZES = {
  drum: 3,
  bass: 1,
  se: 1
};

export default Reflux.createStore({
  listenables: [AudioAction],

  res: {
    context: null,
    oscNode: null,
    gainNode: null,
    playing: false,

    isLoading: false,
    audio: {
      drum: [],
      bass: [],
      se: []
    }
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

    this.loadAudioData();
  },

  getInitialState() {
    return this.res;
  },

  loadAudioData() {
    // Loading Drum
    const drumP = new Promise((resolve, reject) => {
      _.forEach(_.range(DATA_SIZES.drum), (num) => {
        request(`/audio/drum${num}.mp3`, {responseType: 'arraybuffer'}, (err, data) => {
          this.res.audio.drum.push(data);
          resolve();
        })
      })
    });

    // Loading Bass
    const bassP = new Promise((resolve, reject) => {
      _.forEach(_.range(DATA_SIZES.bass), (num) => {
        request(`/audio/bass${num}.mp3`, {responseType: 'arraybuffer'}, (err, data) => {
          this.res.audio.bass.push(data);
          resolve();
        })
      })
    });

    // Loading SE
    const seP = new Promise((resolve, reject) => {
      _.forEach(_.range(DATA_SIZES.se), (num) => {
        request(`/audio/se${num}.mp3`, {responseType: 'arraybuffer'}, (err, data) => {
          this.res.audio.se.push(data);
          resolve();
        })
      })
    });

    // Mark as loading done
    Promise.all([drumP, bassP, seP]).then(() => {
      this.res.isLoading = true;
      this.trigger(this.res);
    });
  }
})
