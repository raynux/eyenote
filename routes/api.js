'use strict';
const express    = require('express');
const router     = express.Router();
const superagent = require('superagent');
require('superagent-as-promised')(superagent);

router.get('/', (req, res, next) => {
  res.json({hey: 'dude'})
});

router.post('/classify', (req, res, next) => {
  const query = {
    requests: [
      {
        image: {
          content: req.body.image
        },
        features: [
          {type: "FACE_DETECTION",     maxResults:20},
          {type: "LANDMARK_DETECTION", maxResults:20},
          {type: "LOGO_DETECTION",     maxResults:20},
          {type: "LABEL_DETECTION",    maxResults:20},
          {type: "TEXT_DETECTION",     maxResults:20}
        ]
      }
    ]
  };

  superagent
  .post(`https://vision.googleapis.com/v1alpha1/images:annotate?key=${process.env.GOOGLE_API_KEY}`)
  .send(query)
  .then((result) => { res.json(result.body.responses) })
  .catch((err) => { res.status(500).json({reason: err}) })
});

module.exports = router;
