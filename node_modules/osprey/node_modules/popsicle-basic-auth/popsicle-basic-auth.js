/**
 * Native base 64 encoding.
 *
 * @param  {String} str
 * @return {String}
 */
var encode = typeof window === 'object' ? /* istanbul ignore next */ window.btoa : function (str) {
  return new Buffer(str).toString('base64')
}

module.exports = popsicleBasicAuth

function popsicleBasicAuth (username, password) {
  var authorization = 'Basic ' + encode(username + ':' + password)

  return function (req) {
    req.set('Authorization', authorization)
  }
}
