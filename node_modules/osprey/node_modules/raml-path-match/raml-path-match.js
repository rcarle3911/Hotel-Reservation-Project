var extend = require('xtend');
var ramlSanitize = require('raml-sanitize')();
var ramlValidate = require('raml-validate')();

/**
 * Expose `ramlPathMatch`.
 */
module.exports = ramlPathMatch;

/**
 * Map RAML types to basic regexp patterns.
 *
 * @type {Object}
 */
var REGEXP_MATCH = {
  number:  '[-+]?\\d+(?:\\.\\d+)?',
  integer: '[-+]?\\d+',
  date:    '(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), \\d{2} (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \\d{4} (?:[0-1]\\d|2[0-3]):[0-5]\\d:[0-5]\\d GMT',
  boolean: '(?:true|false)'
};

/**
 * Escape all regexp characters.
 *
 * @type {RegExp}
 */
var ESCAPE_CHARACTERS = /([.*+?=^!:${}()|[\]\/\\])/g;

/**
 * Static regexp for replacing parameters.
 *
 * @type {RegExp}
 */
var REGEXP_REPLACE = new RegExp([
  // Match RAML parameters with an optional prefix.
  '([\\.\\/])?\\{(\\+)?((?:[\\w]|%[0-9abcde]{2})(?:[\\w\\.]|%[0-9abcde]{2})*)\\}',
  // Match any escape characters.
  ESCAPE_CHARACTERS.source
].join('|'), 'ig');

/**
 * Convert the route into a regexp using the passed in parameters.
 *
 * @param  {String} path
 * @param  {Object} params
 * @param  {Array}  keys
 * @param  {Object} options
 * @return {RegExp}
 */
function toRegExp (path, params, keys, options) {
  var end    = options.end !== false;
  var strict = options.strict;
  var flags  = '';
  var used   = {};

  // Allow case insensitivity.
  if (!options.sensitive) {
    flags += 'i';
  }

  // Replace path parameters and transform into a regexp.
  var route = path.replace(
    REGEXP_REPLACE,
    function (match, prefix, modifier, key, escape) {
      if (escape) {
        return '\\' + escape;
      }

      // Decode URI parameters in variable name.
      var name = decodeURIComponent(key);

      // Push the current key into the keys array.
      keys.push({
        name:   name,
        prefix: prefix || '/'
      });

      // Default the prefix to an empty string for simpler concatination.
      prefix = prefix ? '\\' + prefix : '';

      // Use the param type and if it doesn't exist, fallback to matching
      // the entire segment.
      var expanded = modifier === '+';
      var param    = extend({ type: 'string', required: true }, params[name]);
      var type     = param.type;
      var capture  = REGEXP_MATCH[type] || (expanded ? '.*?' : '[^' + (prefix || '\\/') + ']+');
      var optional = param.required === false;

      // Cache used parameters.
      used[name] = param;

      // Allow support for enum values as the regexp match.
      if (Array.isArray(param.enum)) {
        capture = '(?:' + param.enum.map(function (value) {
          return String(value).replace(ESCAPE_CHARACTERS, '\\$1');
        }).join('|') + ')';
      }

      // Return the regexp as a matching group.
      return prefix + '(' + capture + ')' + (optional ? '?' : '');
    }
  );

  var endsWithSlash = path.charAt(path.length - 1) === '/';

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithSlash ? '' : '(?=\\/|$)';
  }

  return {
    regexp: new RegExp('^' + route, flags),
    params: used
  };
}

/**
 * Generate the match function based on a route and RAML params object.
 *
 * @param  {String}   path
 * @param  {Object}   schema
 * @param  {Object}   options
 * @return {Function}
 */
function ramlPathMatch (path, schema, options) {
  options = options || {};

  // Fast slash support.
  if (path === '/' && options.end === false) {
    return truth;
  }

  // Fallback to providing the schema object when undefined.
  schema = schema || {};

  var keys     = [];
  var result   = toRegExp(path, schema, keys, options);
  var sanitize = ramlSanitize(result.params);
  var validate = ramlValidate(result.params);

  /**
   * Return a static, reusable function for matching paths.
   *
   * @param  {String}           pathname
   * @return {(Object|Boolean)}
   */
  function pathMatch (pathname) {
    var m = result.regexp.exec(pathname);

    if (!m) {
      return false;
    }

    var path = m[0];
    var params = {};

    for (var i = 1; i < m.length; i++) {
      var key = keys[i - 1];
      params[key.name] = m[i];
    }

    params = sanitize(params);

    // If the parameters fail validation, return `false`.
    if (!validate(params).valid) {
      return false;
    }

    return {
      path: path,
      params: params
    };
  }

  pathMatch.update = function update (schema) {
    // Check a diff of the old to the new schema.
    if (schema) {
      var paramsKeys = Object.keys(result.params);

      for (var i = 0; i < paramsKeys.length; i++) {
        var key = paramsKeys[i];
        var param = schema[key];

        if (param == null) {
          continue;
        }

        var paramKeys = Object.keys(param);

        for (var j = 0; j < paramKeys.length; j++) {
          var paramKey = paramKeys[i];

          if (result.params[key][paramKey] !== schema[key][paramKey]) {
            return ramlPathMatch(path, extend(result.params, schema), options);
          }
        }
      }
    }

    return pathMatch;
  };

  return pathMatch;
}

/**
 * Always match this path.
 *
 * @return {Object}
 */
function truth () {
  return { path: '', params: {} };
}
