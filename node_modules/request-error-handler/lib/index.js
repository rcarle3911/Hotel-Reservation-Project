var extend = require('xtend')
var Negotiator = require('negotiator')
var escapeHtml = require('escape-html')
var debug = require('debug')('request-error-handler')
var invariant = require('invariant')

// Source: https://github.com/expressjs/errorhandler.
function htmlDocument (options) {
  return '<!doctype html>' +
    '<html>' +
    '<head>' +
    '<meta charset="utf-8">' +
    '<title>' + escapeHtml(options.title) + '</title>' +
    '<style>' +
    '*{margin:0;padding:0;outline:0}' +
    'body{padding:80px 100px;font:13px "Helvetica Neue", "Lucida Grande", "Arial";background:#ECE9E9 -webkit-gradient(linear, 0% 0%, 0% 100%, from(#fff), to(#ECE9E9));background:#ECE9E9 -moz-linear-gradient(top, #fff, #ECE9E9);background-repeat:no-repeat;color:#555;-webkit-font-smoothing:antialiased}' +
    'h1,h2{font-size:22px;color:#343434}' +
    'h1{font-size:60px;margin-bottom:10px}' +
    'ul li{list-style:none}' +
    '#validations{margin-bottom:10px}' +
    '#stacktrace{}' +
    '</style>' +
    '</head>' +
    '<body>' +
    '<div id="wrapper">' +
    '<h1>' + escapeHtml(options.title) + '</h1>' +
    '<ul id="validations">' + options.errors.map(function (error) {
      return '<li><strong>' + error.type + (error.dataPath ? (' (' + escapeHtml(error.dataPath) + ')') : '') + ':</strong> ' + error.message + '</li>'
    }) + '</ul>' +
    (options.stack
      ? ('<ul id="stacktrace">' + options.stack.split('\n').map(function (line) {
        return '<li>' + escapeHtml(line).replace(/ {2}/g, '&nbsp; ') + '</li>'
      }) + '</ul>')
      : '') +
    '</div>' +
    '</body>' +
    '</html>'
}

/**
 * Expose a consistent API pattern.
 *
 * @return {Function}
 */
module.exports = handler
module.exports.createError = createError
module.exports.responder = responder

/**
 * Map of error handling messages.
 */
var ERROR_MESSAGES = {
  json: require('./messages/json'),
  header: require('./messages/header'),
  query: require('./messages/query'),
  form: require('./messages/form'),
  xml: require('./messages/xml')
}

/**
 * Default responder handles many different output types.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Array}  errors
 * @param {String} stack
 */
function responder (req, res, errors, stack) {
  var negotiator = new Negotiator(req)

  switch (negotiator.mediaType(['application/json', 'text/html', 'text/xml'])) {
    case 'application/json':
      sendJson(req, res, errors, stack)
      return
    case 'text/html':
      sendHtml(req, res, errors, stack)
      return
    case 'text/xml':
      sendXml(req, res, errors, stack)
      return
    default:
      sendPlain(req, res, errors, stack)
      return
  }
}

/**
 * Send an XML document of errors back to the user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Array}  errors
 * @param {String} stack
 */
function sendXml (req, res, errors, stack) {
  var xml = '<?xml version="1.0" encoding="UTF-8"?>'

  xml += '<errors>' + errors.map(function (error) {
    return '<error>' + Object.keys(error).map(function (key) {
      var value = error[key]

      // Only the `meta` object is an object.
      if (typeof value !== 'object') {
        return '<' + key + '>' + escapeHtml(value) + '</' + key + '>'
      }

      var attrs = Object.keys(value).map(function (key) {
        return escapeHtml(key) + '="' + escapeHtml(value[key]) + '"'
      })

      return '<' + key + ' ' + attrs.join(' ') + ' />'
    }).join('') + '</error>'
  }) + '</errors>'

  if (stack) {
    xml += '<stack>' + escapeHtml(stack) + '</stack>'
  }

  var buf = new Buffer(xml, 'utf8')

  res.setHeader('Content-Type', 'text/xml; charset=utf-8')
  res.setHeader('Content-Length', buf.length)
  res.end(buf, 'utf8')
}

/**
 * Send a HTML document of errors back to the user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Array}  errors
 * @param {Array}  [stack]
 */
function sendHtml (req, res, errors, stack) {
  var buf = new Buffer(htmlDocument({
    title: 'Invalid Request',
    errors: errors,
    stack: stack
  }), 'utf8')

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Content-Length', buf.length)
  res.end(buf, 'utf8')
}

/**
 * Send plain text errors back to the user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Array}  errors
 */
function sendPlain (req, res, errors) {
  var buf = new Buffer(errors.map(function (error) {
    var msg = error.type

    if (error.dataPath) {
      msg += ' (' + error.dataPath + ')'
    }

    msg += ': ' + error.message

    return msg
  }).join('\n'), 'utf8')

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Content-Length', buf.length)
  res.end(buf, 'utf8')
}

/**
 * Send JSON errors back to the user.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Array}  errors
 * @param {Array}  [stack]
 */
function sendJson (req, res, errors, stack) {
  var buf = new Buffer(JSON.stringify({ errors: errors, stack: stack }), 'utf8')

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Content-Length', buf.length)
  res.end(buf, 'utf8')
}

/**
 * Express-style error middleware (uses four arguments).
 *
 * @param  {Function} customResponder
 * @param  {String}   fallbackLanguage
 * @param  {Object}   customMessages
 * @return {Function}
 */
function handler (customResponder, fallbackLanguage, customMessages) {
  // Custom messages or fallback language as first argument.
  if (typeof customResponder !== 'function') {
    fallbackLanguage = customResponder
    customResponder = null
  }

  // Custom messages as second argument.
  if (typeof fallbackLanguage !== 'string') {
    customMessages = fallbackLanguage
    fallbackLanguage = null
  }

  var respond = customResponder || responder
  var fallback = fallbackLanguage || 'en'
  var errorMessages = ERROR_MESSAGES
  var isProd = process.env.NODE_ENV === 'production'

  // Allow custom i18n messages to merge over defaults.
  if (customMessages) {
    errorMessages = extend(customMessages, extend(errorMessages, {
      json: extend(errorMessages.json, customMessages.json),
      headers: extend(errorMessages.headers, customMessages.headers),
      query: extend(errorMessages.query, customMessages.query),
      form: extend(errorMessages.form, customMessages.form),
      xml: extend(errorMessages.xml, customMessages.xml)
    }))
  }

  return function (err, req, res, next) {
    // Only handling formatted validation errors.
    if (!Array.isArray(err.requestErrors)) {
      return next(err)
    }

    var errors = err.requestErrors
    var negotiator = new Negotiator(req)
    var stack = isProd ? undefined : err.stack

    // Extend default error objects with i18n messages.
    var data = errors.map(function (error) {
      var messages = errorMessages[error.type]

      if (!messages || !messages[error.keyword]) {
        debug('No message for "%s %s"', error.type, error.keyword)

        return error
      }

      var language = fallback

      if (req.headers['accept-language']) {
        language = negotiator.language(Object.keys(messages[error.keyword]))
      }

      // Fall back to English when the preferred language is unavailable.
      if (!language) {
        debug(
          'No messages available for "%s %s" in %s, falling back to %s',
          error.type,
          error.keyword,
          negotiator.languages().join(', '),
          fallback
        )

        language = fallback
      }

      var message = messages[error.keyword][language]

      if (!message) {
        debug(
          'No messages available for "%s %s", create a "%s" message as the fallback',
          error.type,
          error.keyword,
          fallback
        )

        return error
      }

      return extend(error, { message: message(error) })
    })

    res.statusCode = err.status || err.statusCode || 500
    res.setHeader('X-Content-Type-Options', 'nosniff')

    return respond(req, res, data, stack)
  }
}

/**
 * Create a compatible error instance.
 *
 * @param  {Array}  requestErrors
 * @param  {Number} status
 * @return {Error}
 */
function createError (requestErrors, status) {
  invariant(Array.isArray(requestErrors), 'Argument requestErrors must be an array')

  // Validate request error objects.
  requestErrors.forEach(function (requestError) {
    invariant(typeof requestError === 'object', 'Request errors must be an object')
    invariant(typeof requestError.type === 'string', 'Request errors must have a type string')
    invariant(typeof requestError.keyword === 'string', 'Request errors must have a type string')
    invariant(typeof requestError.message === 'string', 'Request errors must have a message string to fallback on when i18n fails')
  })

  var err = new Error('Request Error')
  err.status = err.statusCode = status || 400
  err.requestErrors = requestErrors
  return err
}
