const getUrl = require('../helpers/getUrl')
const callApi = require('../helpers/callApi')
const striptags = require('striptags')

module.exports = () => new Promise((resolve, reject) => {
  const cleanProverbs = proverbs => proverbs.map(proverb => ({
    id: proverb.id,
    proverb: proverb.attributes.fields.proverb,
    tweetid: proverb.attributes.fields.tweetid,
    explanation: proverb.attributes.fields.explanation,
    explanationCleaned: striptags(proverb.attributes.fields.explanation),
    revision: proverb.attributes.fields.revision,
    revisedby: proverb.attributes.fields.revisedby,
    updatedat: proverb.meta.updated_at
  }))

  const url = getUrl('proverbs')
  const meta = {
    originalUrl: url,
    type: 'proverbs'
  }

  callApi(url)
    .then(response => {
      resolve({
        meta,
        data: cleanProverbs(response.data)
      })
    })
    .catch(reject)
})
