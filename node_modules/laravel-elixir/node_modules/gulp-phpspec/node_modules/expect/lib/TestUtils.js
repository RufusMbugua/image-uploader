'use strict';

exports.__esModule = true;
exports.functionThrows = functionThrows;
exports.arrayContains = arrayContains;
exports.stringContains = stringContains;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isA = isA;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _isEqual = require('is-equal');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _isRegex = require('is-regex');

var _isRegex2 = _interopRequireDefault(_isRegex);

/**
 * Returns true if the given function throws the given value
 * when invoked. The value may be:
 *
 * - undefined, to merely assert there was a throw
 * - a constructor function, for comparing using instanceof
 * - a regular expression, to compare with the error message
 * - a string, to find in the error message
 */

function functionThrows(fn, context, args, value) {
  try {
    fn.apply(context, args);
  } catch (error) {
    if (value == null) return true;

    if (isFunction(value) && error instanceof value) return true;

    var message = error.message || error;

    if (typeof message === 'string') {
      if (_isRegex2['default'](value) && value.test(error.message)) return true;

      if (typeof value === 'string' && message.indexOf(value) !== -1) return true;
    }
  }

  return false;
}

/**
 * Returns true if the given array contains the value, false
 * otherwise. The compareValues function must return false to
 * indicate a non-match.
 */

function arrayContains(array, value, compareValues) {
  if (compareValues == null) compareValues = _isEqual2['default'];

  return array.some(function (item) {
    return compareValues(item, value) !== false;
  });
}

/**
 * Returns true if the given string contains the value, false otherwise.
 */

function stringContains(string, value) {
  return string.indexOf(value) !== -1;
}

/**
 * Returns true if the given object is an array.
 */

function isArray(object) {
  return Array.isArray(object);
}

/**
 * Returns true if the given object is a function.
 */

function isFunction(object) {
  return typeof object === 'function';
}

/**
 * Returns true if the given object is an instanceof value
 * or its typeof is the given value.
 */

function isA(object, value) {
  if (isFunction(value)) return object instanceof value;

  if (value === 'array') return Array.isArray(object);

  return typeof object === value;
}