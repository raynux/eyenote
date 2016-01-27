'use strict'
import _ from 'lodash'
import Reflux from 'reflux'
import request from 'xhr-request'

import AudioAction from '../actions/AudioAction'

const TRACK_DATA_CATALOG = [
  {type: 'drum', size: 3},
  {type: 'bass', size: 1},
  {type: 'se',   size: 1}
]

export default Reflux.createStore({
  listenables: [AudioAction],

  res: {
    context: null,
    oscNode: null,
    gainNode: null,
    playing: false,
    isLoading: false,
    tracks: []
  },

  start() {
    this.res.playing = true
    this.res.oscNode.connect(this.res.gainNode)
    this.trigger(this.res)
  },

  stop() {
    this.res.playing = false
    this.res.oscNode.disconnect(this.res.gainNode)
    this.trigger(this.res)
  },

  setFrequency(frequency) {
    this.res.oscNode.frequency.value = frequency
    console.log(`Current Frequency : ${this.res.oscNode.frequency.value}`)
    this.trigger(this.res)
  },

  startTrack(trackName) {
    const track = _.find(this.res.tracks, {name: trackName})
    if(track.isConnected) {
      track.source.disconnect(this.res.context.destination)
    }
    track.source.connect(this.res.context.destination)
    track.isConnected = true
    this.trigger(this.res)
  },

  stopTrack(trackName) {
    const track = _.find(this.res.tracks, {name: trackName})
    if(track.isConnected) {
      track.source.disconnect(this.res.context.destination)
      track.isConnected = false
      this.trigger(this.res)
    }
  },

  init() {
    this.res.context = new AudioContext()

    this.res.oscNode = this.res.context.createOscillator()
    this.res.oscNode.frequency.value = 300

    this.res.gainNode = this.res.context.createGain()
    this.res.gainNode.gain.value = 0.2

    this.res.gainNode.connect(this.res.context.destination)
    this.res.oscNode.start()

    this.loadTracks()
  },

  getInitialState() {
    return this.res
  },

  loadTracks() {
    const sourceGenerator = (audioBuffer) => {
      const source = this.res.context.createBufferSource()
      source.buffer = audioBuffer
      source.loop = true
      source.loopEnd = audioBuffer.duration
      return source
    }

    const audioBufferFetcher = (type, num) => {
      return new Promise((resolve, reject) => {
        request(`/audio/${type}${num}.mp3`, {responseType: 'arraybuffer'}, (err, data) => {
          this.res.context.decodeAudioData(data, (audioBuffer) => {
            resolve({
              name: `${type}${num}`,
              buffer: audioBuffer,
              source: sourceGenerator(audioBuffer),
              isConnected: false
            })
          }, (error) => { reject(error) })
        })
      })
    }

    const fetchers = _(TRACK_DATA_CATALOG)
    .map((catalog) => {
      return _(_.range(catalog.size)).map((num) => {
        return audioBufferFetcher(catalog.type, num)
      }).value()
    })
    .flatten()
    .value()

    // All loading done, so make them ready to connect
    Promise.all(fetchers).then((results) => {
      _.each(results, (data) => {
        data.source.start()
        data.source.isConnected = true
        this.res.tracks.push(data)
      })
      this.res.isLoading = true
      this.trigger(this.res)
    })
    .catch((err) => { console.error(err) })
  }
})
