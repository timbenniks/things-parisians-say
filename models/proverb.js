const getUrl = require('../helpers/getUrl')
const callApi = require('../helpers/callApi')
const striptags = require('striptags')

module.exports = id => new Promise((resolve, reject) => {
  const url = getUrl('proverb', id)
  const meta = {
    originalUrl: url,
    type: 'proverb'
  }

  callApi(url)
    .then(proverb => {
      resolve({
        meta,
        data: {
          id: proverb.data.id,
          proverb: proverb.data.attributes.fields.proverb,
          tweetid: proverb.data.attributes.fields.tweetid,
          explanation: proverb.data.attributes.fields.explanation,
          explanationCleaned: striptags(proverb.data.attributes.fields.explanation),
          revision: proverb.data.attributes.fields.revision,
          revisionCleaned: striptags(proverb.data.attributes.fields.revision),
          revisedby: proverb.data.attributes.fields.revisedby
        }
      })
    })
    .catch(reject)
})
