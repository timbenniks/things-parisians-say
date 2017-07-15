const request = require('request-promise-native')

module.exports = (url) => request({ uri: url, json: true, headers: { 'Authorization': `Token token=${process.env.ELEGANT_CMS_TOKEN}` }})
