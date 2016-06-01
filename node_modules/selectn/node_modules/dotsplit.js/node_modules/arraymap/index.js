'use strict'

/*!
 * imports.
 */

var curry2 = require('curry2')
var selectn = require('selectn')

/*!
 * exports.
 */

module.exports = curry2(map)

/**
 * Curried function deriving new array values by applying provided function to each item/index of provided array.
 * Optionally, a dot-notation formatted string may be provided for item property access.
 *
 * @param {Function|String} fn
 * Function to apply to each item.
 *
 * @param {Array} list
 * Array to iterate over.
 *
 * @return {Array}
 * Array resulting from applying provided function `fn` to each item of `list`.
 */

function map (fn, list) {
  var end = list.length
  var idx = -1
  var out = []

  while (++idx < end) {
    out.push((typeof fn === 'string') ? selectn(fn, list[idx]) : fn(list[idx]))
  }

  return out
}
