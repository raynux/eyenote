'use strict'
import _ from 'lodash'
import Reflux from 'reflux'
import request from 'xhr-request'

import AudioAction from '../actions/AudioAction'

const TRACK_DATA_CATALOG = [
  {type: 'drum', size: 2},
  {type: 'bass', size: 2},
  {type: 'se',   size: 2}
]

const DEFAULT_GAIN = 40

export default Reflux.createStore({
  listenables: [AudioAction],

  res: {
    isLoading: false,
    isFiltered: false,
    tracks: []
  },

  context: null,
  destination: null,  // the last Node to be connected
  biquadFilter: null,

  startTrack(trackName, option={exclude: null}) {
    // Stop tracks that matches the "exclude" (RegExp)
    if(!_.isNull(option.exclude)) {
      _(this.res.tracks)
      .filter((t) => {
        if(_.isEqual(t.name, trackName)){ return false }
        return t.name.match(option.exclude)
      })
      .each((t) => { this.stopTrack(t.name) })
      .value()
    }

    // Go!
    const track = _.find(this.res.tracks, {name: trackName})
    track.gain.gain.value = DEFAULT_GAIN
    this.trigger(this.res)
  },

  stopTrack(trackName) {
    let tracks
    if(_.isEqual(trackName, '*')) { tracks = this.res.tracks }
    else { tracks = [_.find(this.res.tracks, {name: trackName})] }

    _.each(tracks, (track) => {
      track.gain.gain.value = 0
      this.trigger(this.res)
    })
  },

  toggleBiquadFilter() {
    if(_.isEqual(this.destination, this.context.destination)) {
      this.destination = this.biquadFilter
      this.res.isFiltered = true
    }
    else {
      this.destination = this.context.destination
      this.res.isFiltered = false
    }

    _(this.res.tracks)
    .each((track) => {
      track.gain.disconnect()
      track.gain.connect(this.destination)
    }).value()

    this.trigger(this.res)
  },

  init() {
    this.context = new AudioContext()
    this.initBiquadFilter()
    this.loadTracks()
    this.destination = this.context.destination
  },

  getInitialState() { return this.res },

  initBiquadFilter() {
    const filter = this.context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 2200
    filter.connect(this.context.destination)

    this.biquadFilter = filter
  },

  loadTracks() {
    const sourceGenerator = (audioBuffer) => {
      const source = this.context.createBufferSource()
      source.buffer = audioBuffer
      source.loop = true
      source.loopEnd = audioBuffer.duration
      return source
    }

    const trackLoader = (type, num) => {
      return new Promise((resolve, reject) => {
        request(`/audio/${type}${num}.mp3`, {responseType: 'arraybuffer'}, (err, data) => {
          this.context.decodeAudioData(data, (audioBuffer) => {
            const source = sourceGenerator(audioBuffer)
            const gain = this.context.createGain()
            gain.gain.value = 0
            source.connect(gain)

            resolve({
              name: `${type}${num}`,
              buffer: audioBuffer,
              source: source,
              gain: gain
            })
          }, (error) => { reject(error) })
        })
      })
    }

    const fetchers = _(TRACK_DATA_CATALOG)
    .map((catalog) => {
      return _(_.range(catalog.size)).map((num) => {
        return trackLoader(catalog.type, num)
      }).value()
    })
    .flatten()
    .value()

    // All loading done, so make them ready to connect
    Promise.all(fetchers).then((results) => {
      _.each(results, (track) => {
        track.gain.connect(this.destination)
        track.source.start()
        this.res.tracks.push(track)
      })
      this.res.isLoading = true
      this.trigger(this.res)
    })
    .catch((err) => { console.error(err) })
  }
})
