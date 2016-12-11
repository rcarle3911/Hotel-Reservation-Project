var serverAddress = require('server-address')

/**
 * Exports `popsicleServer`.
 */
module.exports = popsicleServer

/**
 * Create a request interceptor that listens and disconnects automatically.
 *
 * @param  {Function} app
 * @return {Function}
 */
function popsicleServer (app) {
  var server = serverAddress(app)

  return function (self) {
    self.before(function (req) {
      server.listen()

      // Update the URL before the request runs.
      req.url = server.url(req.url)
    })

    self.always(function () {
      server.close()
    })
  }
}
