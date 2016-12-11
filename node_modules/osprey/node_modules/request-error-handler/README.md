# Request Error Handler

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

> Standardized error handler for rendering API responses with i18n. Automatically renders with support for JSON, XML, HTML and plain text.

## Installation

```sh
npm install request-error-handler --save
```

## Usage

For the error handler to work, you must emit an error with an array of `requestErrors`. The format for `requestErrors` is defined below as an array of `RequestError`s.

```js
var errorHandler = require('request-error-handler')
var express = require('express')
var app = module.exports = express()

function responder (req, res, error, stack) { /* Custom respond logic here */ }

var defaultLanguage = 'en'
var customMessages = {}

app.use(errorHandler(responder, defaultLanguage, customMessages))
```

**Options**

* `responder` Provide a custom error formatter with optional stack depending on environment (default: `errorHandler.responder`)
* `defaultLanguage` Override the default i18n language of English (default: `en`)
* `customMessages` Merge custom i18n messages with default messages (default: `{}`, see interface below)

The messages interface is as follows:

```js
interface CustomMessages {
  [type: string]: {
    [keyword: string]: {
      [language: string]: (error: RequestError) => string
    }
  }
}
```

### Creating Errors

The only restriction on errors that can be formatted using **request-error-handler** is that the error instance has an array of error objects on the `requestErrors` property. Every error object MUST follow the following interface:

```js
interface RequestError {
  type: 'json' | 'form' | 'headers' | 'query' | 'xml' | string /* Comes with standard types built-in, but you can also provide your own */
  keyword: string /* Keyword that failed validation */
  message: string /* Merged with i18n when available */
  id?: string /* A unique identifier for the instance of this error */
  dataPath?: string /* Natural path to the error message (E.g. JSON Pointers when using JSON) */
  data?: any /* The data that failed validation */
  schema?: any /* The schema value that failed validation */
  detail?: string /* Additional details about this specific error instance */
  meta?: { [name: string]: string } /* Meta data from the error (XML validation provides a code, column, etc.) */
}
```

To automatically create a compatible error instance, use `errorHandler.createError` and pass an array of errors with an option `status` number.

## License

Apache License 2.0

[npm-image]: https://img.shields.io/npm/v/request-error-handler.svg?style=flat
[npm-url]: https://npmjs.org/package/request-error-handler
[downloads-image]: https://img.shields.io/npm/dm/request-error-handler.svg?style=flat
[downloads-url]: https://npmjs.org/package/request-error-handler
[travis-image]: https://img.shields.io/travis/mulesoft-labs/node-request-error-handler.svg?style=flat
[travis-url]: https://travis-ci.org/mulesoft-labs/node-request-error-handler
[coveralls-image]: https://img.shields.io/coveralls/mulesoft-labs/node-request-error-handler.svg?style=flat
[coveralls-url]: https://coveralls.io/r/mulesoft-labs/node-request-error-handler?branch=master
