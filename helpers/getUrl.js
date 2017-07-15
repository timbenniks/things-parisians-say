const config = require('../config.json')

module.exports = (which, uuid = 0, apibaseurl = config.apibaseurl) => {
  const url = config.urls[which]
                .replace('__apibaseurl__', apibaseurl)
                .replace('__uuid__', uuid)
  return url
}
