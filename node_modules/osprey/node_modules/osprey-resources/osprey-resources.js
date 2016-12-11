var extend = require('xtend')
var router = require('osprey-router')

/**
 * Expose `ospreyResources`.
 */
module.exports = ospreyResources

/**
 * Accept resources and a handler function.
 *
 * @param  {Array}    resources
 * @param  {Function} handler
 * @return {Function}
 */
function ospreyResources (resources, handler) {
  return createResources(router(), resources, '', null, handler)
}

/**
 * Create a middleware router that handles the resource.
 *
 * @param  {Function} app
 * @param  {Array}    resources
 * @param  {String}   prefix
 * @param  {Object}   params
 * @param  {Function} handler
 * @return {Function}
 */
function createResources (app, resources, prefix, params, handler) {
  if (Array.isArray(resources)) {
    resources.forEach(function (resource) {
      createResource(app, resource, prefix, params, handler)
    })
  }

  return app
}

/**
 * Create middleware for a single RAML resource and recursively nest children.
 *
 * @param  {Function} app
 * @param  {Object}   resource
 * @param  {String}   prefix
 * @param  {Object}   params
 * @param  {Function} handler
 * @return {Function}
 */
function createResource (app, resource, prefix, params, handler) {
  var methods = resource.methods
  var resources = resource.resources
  var uriParams = extend(params, resource.uriParameters)
  var path = prefix + (resource.relativeUri || '')

  if (methods) {
    methods.forEach(function (method) {
      var handle = handler(method, path)

      // Enables the ability to skip a handler by returning null.
      if (handle != null) {
        app[method.method](path, uriParams, handle, exitRouter)
      }
    })
  }

  if (resources) {
    createResources(app, resources, path, uriParams, handler)
  }

  return app
}

/**
 * Exit the router implementation.
 */
function exitRouter (req, res, next) {
  return next('router')
}
