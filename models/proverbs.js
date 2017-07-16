const getUrl = require('../helpers/getUrl')
const callApi = require('../helpers/callApi')

module.exports = () => new Promise((resolve, reject) => {
  const cleanProverbs = proverbs => proverbs.map(proverb => ({
    id: proverb.id,
    proverb: proverb.attributes.fields.proverb,
    tweetid: proverb.attributes.fields.tweetid,
    explanation: proverb.attributes.fields.explanation,
    revision: proverb.attributes.fields.revision,
    revisedby: proverb.attributes.fields.revisedby
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