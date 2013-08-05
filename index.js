
/*!
 *
 * tree-emit
 *
 * MIT licensed.
 *
 */

/**
 * Module dependencies.
 */

var slice = [].slice;
var each = require('each');
var type = require('type');
var traverse = require('traverse-object');

/**
 * Emit depth-first.
 *
 * @api public
 */

var emit = iterator('depth');

/**
 * Expose `emit`.
 */

exports = module.exports = emit;

/**
 * Emit depth-first as method.
 *
 * @api public
 */

emit.depth = emit;

/**
 * Emit breadth-first.
 *
 * @api public
 */

emit.breadth = iterator('breadth');

/**
 * Traverse object.
 *
 * @api private
 */

emit.traverse = traverse;

/**
 * Filter traversal using `fn`.
 *
 * The passed function is invoked with
 * `(key, property)` and must return
 * `true` or `false` depending on whether
 * to traverse down that property.
 *
 * @param {Function} fn
 * @return {Object} this
 * @api public
 */

emit.filter = function(fn) {
  this.traverse = this.traverse.filter(fn);
  return this;
};

/**
 * Intercept an `emitter` and
 * tree-emit its events to `out`.
 *
 * @param {Emitter} emitter
 * @param {Object} out
 * @return {Emitter} emitter
 */

emit.intercept = function(emitter, out) {
  var realEmit = emitter.emit;
  emitter.emit = function(event) {
    // emit to regular listeners
    realEmit.apply(emitter, arguments);

    var params = slice.call(arguments, 1);
    params.unshift(out, event);
    emit.apply(this, params);
  };
  return emitter;
};

/**
 * Iterator strategy factory.
 *
 * @param {String} strategy
 * @return {Function}
 * @api private
 */

function iterator(strategy) {
  return emit;

  /**
   * Emit `name` event to `target`
   * passing following parameters.
   *
   * @param {Object} target
   * @param {String} name
   * @param {Mixed} [...]
   * @return {Object} this
   * @api public
   */

  function emit(target, name) {
    var params = slice.call(arguments, 2);
    runner(strategy, target, name, params);
    return this;
  };
}

/**
 * Traverse `target` using `strategy` traversal algorithm,
 * applying `params` on every method named `on<name>`.
 *
 * @param {String} strategy
 * @param {Object} target
 * @param {String} name
 * @param {Array} params
 * @api private
 */

function runner(strategy, target, name, params) {
  var method = 'on' + name;
  emit.traverse[strategy](target, traverser);

  /**
   * Object traverser.
   *
   * @param {String} key
   * @param {Function} fn
   * @api private
   */

  function traverser(key, fn) {
    if (method != key) return;
    if (isArray(fn)) each(fn, apply, this);
    else fn.apply(this, params);
  }

  /**
   * Apply params to function `fn`.
   *
   * @param {Function} fn
   * @api private
   */

  function apply(fn) {
    fn.apply(this, params);
  }
}

/**
 * Examine if `obj` is an Array.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */

function isArray(obj) {
  return 'array' == type(obj);
}
