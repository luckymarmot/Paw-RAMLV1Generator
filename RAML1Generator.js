(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 186);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

(function (global, factory) {
   true ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Immutable = factory());
}(this, function () { 'use strict';var SLICE$0 = Array.prototype.slice;

  function createClass(ctor, superClass) {
    if (superClass) {
      ctor.prototype = Object.create(superClass.prototype);
    }
    ctor.prototype.constructor = ctor;
  }

  function Iterable(value) {
      return isIterable(value) ? value : Seq(value);
    }


  createClass(KeyedIterable, Iterable);
    function KeyedIterable(value) {
      return isKeyed(value) ? value : KeyedSeq(value);
    }


  createClass(IndexedIterable, Iterable);
    function IndexedIterable(value) {
      return isIndexed(value) ? value : IndexedSeq(value);
    }


  createClass(SetIterable, Iterable);
    function SetIterable(value) {
      return isIterable(value) && !isAssociative(value) ? value : SetSeq(value);
    }



  function isIterable(maybeIterable) {
    return !!(maybeIterable && maybeIterable[IS_ITERABLE_SENTINEL]);
  }

  function isKeyed(maybeKeyed) {
    return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL]);
  }

  function isIndexed(maybeIndexed) {
    return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL]);
  }

  function isAssociative(maybeAssociative) {
    return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);
  }

  function isOrdered(maybeOrdered) {
    return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL]);
  }

  Iterable.isIterable = isIterable;
  Iterable.isKeyed = isKeyed;
  Iterable.isIndexed = isIndexed;
  Iterable.isAssociative = isAssociative;
  Iterable.isOrdered = isOrdered;

  Iterable.Keyed = KeyedIterable;
  Iterable.Indexed = IndexedIterable;
  Iterable.Set = SetIterable;


  var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
  var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
  var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
  var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';

  // Used for setting prototype methods that IE8 chokes on.
  var DELETE = 'delete';

  // Constants describing the size of trie nodes.
  var SHIFT = 5; // Resulted in best performance after ______?
  var SIZE = 1 << SHIFT;
  var MASK = SIZE - 1;

  // A consistent shared value representing "not set" which equals nothing other
  // than itself, and nothing that could be provided externally.
  var NOT_SET = {};

  // Boolean references, Rough equivalent of `bool &`.
  var CHANGE_LENGTH = { value: false };
  var DID_ALTER = { value: false };

  function MakeRef(ref) {
    ref.value = false;
    return ref;
  }

  function SetRef(ref) {
    ref && (ref.value = true);
  }

  // A function which returns a value representing an "owner" for transient writes
  // to tries. The return value will only ever equal itself, and will not equal
  // the return of any subsequent call of this function.
  function OwnerID() {}

  // http://jsperf.com/copy-array-inline
  function arrCopy(arr, offset) {
    offset = offset || 0;
    var len = Math.max(0, arr.length - offset);
    var newArr = new Array(len);
    for (var ii = 0; ii < len; ii++) {
      newArr[ii] = arr[ii + offset];
    }
    return newArr;
  }

  function ensureSize(iter) {
    if (iter.size === undefined) {
      iter.size = iter.__iterate(returnTrue);
    }
    return iter.size;
  }

  function wrapIndex(iter, index) {
    // This implements "is array index" which the ECMAString spec defines as:
    //
    //     A String property name P is an array index if and only if
    //     ToString(ToUint32(P)) is equal to P and ToUint32(P) is not equal
    //     to 2^32−1.
    //
    // http://www.ecma-international.org/ecma-262/6.0/#sec-array-exotic-objects
    if (typeof index !== 'number') {
      var uint32Index = index >>> 0; // N >>> 0 is shorthand for ToUint32
      if ('' + uint32Index !== index || uint32Index === 4294967295) {
        return NaN;
      }
      index = uint32Index;
    }
    return index < 0 ? ensureSize(iter) + index : index;
  }

  function returnTrue() {
    return true;
  }

  function wholeSlice(begin, end, size) {
    return (begin === 0 || (size !== undefined && begin <= -size)) &&
      (end === undefined || (size !== undefined && end >= size));
  }

  function resolveBegin(begin, size) {
    return resolveIndex(begin, size, 0);
  }

  function resolveEnd(end, size) {
    return resolveIndex(end, size, size);
  }

  function resolveIndex(index, size, defaultIndex) {
    return index === undefined ?
      defaultIndex :
      index < 0 ?
        Math.max(0, size + index) :
        size === undefined ?
          index :
          Math.min(size, index);
  }

  /* global Symbol */

  var ITERATE_KEYS = 0;
  var ITERATE_VALUES = 1;
  var ITERATE_ENTRIES = 2;

  var REAL_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator';

  var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;


  function Iterator(next) {
      this.next = next;
    }

    Iterator.prototype.toString = function() {
      return '[Iterator]';
    };


  Iterator.KEYS = ITERATE_KEYS;
  Iterator.VALUES = ITERATE_VALUES;
  Iterator.ENTRIES = ITERATE_ENTRIES;

  Iterator.prototype.inspect =
  Iterator.prototype.toSource = function () { return this.toString(); }
  Iterator.prototype[ITERATOR_SYMBOL] = function () {
    return this;
  };


  function iteratorValue(type, k, v, iteratorResult) {
    var value = type === 0 ? k : type === 1 ? v : [k, v];
    iteratorResult ? (iteratorResult.value = value) : (iteratorResult = {
      value: value, done: false
    });
    return iteratorResult;
  }

  function iteratorDone() {
    return { value: undefined, done: true };
  }

  function hasIterator(maybeIterable) {
    return !!getIteratorFn(maybeIterable);
  }

  function isIterator(maybeIterator) {
    return maybeIterator && typeof maybeIterator.next === 'function';
  }

  function getIterator(iterable) {
    var iteratorFn = getIteratorFn(iterable);
    return iteratorFn && iteratorFn.call(iterable);
  }

  function getIteratorFn(iterable) {
    var iteratorFn = iterable && (
      (REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL]) ||
      iterable[FAUX_ITERATOR_SYMBOL]
    );
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  function isArrayLike(value) {
    return value && typeof value.length === 'number';
  }

  createClass(Seq, Iterable);
    function Seq(value) {
      return value === null || value === undefined ? emptySequence() :
        isIterable(value) ? value.toSeq() : seqFromValue(value);
    }

    Seq.of = function(/*...values*/) {
      return Seq(arguments);
    };

    Seq.prototype.toSeq = function() {
      return this;
    };

    Seq.prototype.toString = function() {
      return this.__toString('Seq {', '}');
    };

    Seq.prototype.cacheResult = function() {
      if (!this._cache && this.__iterateUncached) {
        this._cache = this.entrySeq().toArray();
        this.size = this._cache.length;
      }
      return this;
    };

    // abstract __iterateUncached(fn, reverse)

    Seq.prototype.__iterate = function(fn, reverse) {
      return seqIterate(this, fn, reverse, true);
    };

    // abstract __iteratorUncached(type, reverse)

    Seq.prototype.__iterator = function(type, reverse) {
      return seqIterator(this, type, reverse, true);
    };



  createClass(KeyedSeq, Seq);
    function KeyedSeq(value) {
      return value === null || value === undefined ?
        emptySequence().toKeyedSeq() :
        isIterable(value) ?
          (isKeyed(value) ? value.toSeq() : value.fromEntrySeq()) :
          keyedSeqFromValue(value);
    }

    KeyedSeq.prototype.toKeyedSeq = function() {
      return this;
    };



  createClass(IndexedSeq, Seq);
    function IndexedSeq(value) {
      return value === null || value === undefined ? emptySequence() :
        !isIterable(value) ? indexedSeqFromValue(value) :
        isKeyed(value) ? value.entrySeq() : value.toIndexedSeq();
    }

    IndexedSeq.of = function(/*...values*/) {
      return IndexedSeq(arguments);
    };

    IndexedSeq.prototype.toIndexedSeq = function() {
      return this;
    };

    IndexedSeq.prototype.toString = function() {
      return this.__toString('Seq [', ']');
    };

    IndexedSeq.prototype.__iterate = function(fn, reverse) {
      return seqIterate(this, fn, reverse, false);
    };

    IndexedSeq.prototype.__iterator = function(type, reverse) {
      return seqIterator(this, type, reverse, false);
    };



  createClass(SetSeq, Seq);
    function SetSeq(value) {
      return (
        value === null || value === undefined ? emptySequence() :
        !isIterable(value) ? indexedSeqFromValue(value) :
        isKeyed(value) ? value.entrySeq() : value
      ).toSetSeq();
    }

    SetSeq.of = function(/*...values*/) {
      return SetSeq(arguments);
    };

    SetSeq.prototype.toSetSeq = function() {
      return this;
    };



  Seq.isSeq = isSeq;
  Seq.Keyed = KeyedSeq;
  Seq.Set = SetSeq;
  Seq.Indexed = IndexedSeq;

  var IS_SEQ_SENTINEL = '@@__IMMUTABLE_SEQ__@@';

  Seq.prototype[IS_SEQ_SENTINEL] = true;



  createClass(ArraySeq, IndexedSeq);
    function ArraySeq(array) {
      this._array = array;
      this.size = array.length;
    }

    ArraySeq.prototype.get = function(index, notSetValue) {
      return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue;
    };

    ArraySeq.prototype.__iterate = function(fn, reverse) {
      var array = this._array;
      var maxIndex = array.length - 1;
      for (var ii = 0; ii <= maxIndex; ii++) {
        if (fn(array[reverse ? maxIndex - ii : ii], ii, this) === false) {
          return ii + 1;
        }
      }
      return ii;
    };

    ArraySeq.prototype.__iterator = function(type, reverse) {
      var array = this._array;
      var maxIndex = array.length - 1;
      var ii = 0;
      return new Iterator(function() 
        {return ii > maxIndex ?
          iteratorDone() :
          iteratorValue(type, ii, array[reverse ? maxIndex - ii++ : ii++])}
      );
    };



  createClass(ObjectSeq, KeyedSeq);
    function ObjectSeq(object) {
      var keys = Object.keys(object);
      this._object = object;
      this._keys = keys;
      this.size = keys.length;
    }

    ObjectSeq.prototype.get = function(key, notSetValue) {
      if (notSetValue !== undefined && !this.has(key)) {
        return notSetValue;
      }
      return this._object[key];
    };

    ObjectSeq.prototype.has = function(key) {
      return this._object.hasOwnProperty(key);
    };

    ObjectSeq.prototype.__iterate = function(fn, reverse) {
      var object = this._object;
      var keys = this._keys;
      var maxIndex = keys.length - 1;
      for (var ii = 0; ii <= maxIndex; ii++) {
        var key = keys[reverse ? maxIndex - ii : ii];
        if (fn(object[key], key, this) === false) {
          return ii + 1;
        }
      }
      return ii;
    };

    ObjectSeq.prototype.__iterator = function(type, reverse) {
      var object = this._object;
      var keys = this._keys;
      var maxIndex = keys.length - 1;
      var ii = 0;
      return new Iterator(function()  {
        var key = keys[reverse ? maxIndex - ii : ii];
        return ii++ > maxIndex ?
          iteratorDone() :
          iteratorValue(type, key, object[key]);
      });
    };

  ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;


  createClass(IterableSeq, IndexedSeq);
    function IterableSeq(iterable) {
      this._iterable = iterable;
      this.size = iterable.length || iterable.size;
    }

    IterableSeq.prototype.__iterateUncached = function(fn, reverse) {
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var iterable = this._iterable;
      var iterator = getIterator(iterable);
      var iterations = 0;
      if (isIterator(iterator)) {
        var step;
        while (!(step = iterator.next()).done) {
          if (fn(step.value, iterations++, this) === false) {
            break;
          }
        }
      }
      return iterations;
    };

    IterableSeq.prototype.__iteratorUncached = function(type, reverse) {
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterable = this._iterable;
      var iterator = getIterator(iterable);
      if (!isIterator(iterator)) {
        return new Iterator(iteratorDone);
      }
      var iterations = 0;
      return new Iterator(function()  {
        var step = iterator.next();
        return step.done ? step : iteratorValue(type, iterations++, step.value);
      });
    };



  createClass(IteratorSeq, IndexedSeq);
    function IteratorSeq(iterator) {
      this._iterator = iterator;
      this._iteratorCache = [];
    }

    IteratorSeq.prototype.__iterateUncached = function(fn, reverse) {
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var iterator = this._iterator;
      var cache = this._iteratorCache;
      var iterations = 0;
      while (iterations < cache.length) {
        if (fn(cache[iterations], iterations++, this) === false) {
          return iterations;
        }
      }
      var step;
      while (!(step = iterator.next()).done) {
        var val = step.value;
        cache[iterations] = val;
        if (fn(val, iterations++, this) === false) {
          break;
        }
      }
      return iterations;
    };

    IteratorSeq.prototype.__iteratorUncached = function(type, reverse) {
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterator = this._iterator;
      var cache = this._iteratorCache;
      var iterations = 0;
      return new Iterator(function()  {
        if (iterations >= cache.length) {
          var step = iterator.next();
          if (step.done) {
            return step;
          }
          cache[iterations] = step.value;
        }
        return iteratorValue(type, iterations, cache[iterations++]);
      });
    };




  // # pragma Helper functions

  function isSeq(maybeSeq) {
    return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL]);
  }

  var EMPTY_SEQ;

  function emptySequence() {
    return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));
  }

  function keyedSeqFromValue(value) {
    var seq =
      Array.isArray(value) ? new ArraySeq(value).fromEntrySeq() :
      isIterator(value) ? new IteratorSeq(value).fromEntrySeq() :
      hasIterator(value) ? new IterableSeq(value).fromEntrySeq() :
      typeof value === 'object' ? new ObjectSeq(value) :
      undefined;
    if (!seq) {
      throw new TypeError(
        'Expected Array or iterable object of [k, v] entries, '+
        'or keyed object: ' + value
      );
    }
    return seq;
  }

  function indexedSeqFromValue(value) {
    var seq = maybeIndexedSeqFromValue(value);
    if (!seq) {
      throw new TypeError(
        'Expected Array or iterable object of values: ' + value
      );
    }
    return seq;
  }

  function seqFromValue(value) {
    var seq = maybeIndexedSeqFromValue(value) ||
      (typeof value === 'object' && new ObjectSeq(value));
    if (!seq) {
      throw new TypeError(
        'Expected Array or iterable object of values, or keyed object: ' + value
      );
    }
    return seq;
  }

  function maybeIndexedSeqFromValue(value) {
    return (
      isArrayLike(value) ? new ArraySeq(value) :
      isIterator(value) ? new IteratorSeq(value) :
      hasIterator(value) ? new IterableSeq(value) :
      undefined
    );
  }

  function seqIterate(seq, fn, reverse, useKeys) {
    var cache = seq._cache;
    if (cache) {
      var maxIndex = cache.length - 1;
      for (var ii = 0; ii <= maxIndex; ii++) {
        var entry = cache[reverse ? maxIndex - ii : ii];
        if (fn(entry[1], useKeys ? entry[0] : ii, seq) === false) {
          return ii + 1;
        }
      }
      return ii;
    }
    return seq.__iterateUncached(fn, reverse);
  }

  function seqIterator(seq, type, reverse, useKeys) {
    var cache = seq._cache;
    if (cache) {
      var maxIndex = cache.length - 1;
      var ii = 0;
      return new Iterator(function()  {
        var entry = cache[reverse ? maxIndex - ii : ii];
        return ii++ > maxIndex ?
          iteratorDone() :
          iteratorValue(type, useKeys ? entry[0] : ii - 1, entry[1]);
      });
    }
    return seq.__iteratorUncached(type, reverse);
  }

  function fromJS(json, converter) {
    return converter ?
      fromJSWith(converter, json, '', {'': json}) :
      fromJSDefault(json);
  }

  function fromJSWith(converter, json, key, parentJSON) {
    if (Array.isArray(json)) {
      return converter.call(parentJSON, key, IndexedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
    }
    if (isPlainObj(json)) {
      return converter.call(parentJSON, key, KeyedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
    }
    return json;
  }

  function fromJSDefault(json) {
    if (Array.isArray(json)) {
      return IndexedSeq(json).map(fromJSDefault).toList();
    }
    if (isPlainObj(json)) {
      return KeyedSeq(json).map(fromJSDefault).toMap();
    }
    return json;
  }

  function isPlainObj(value) {
    return value && (value.constructor === Object || value.constructor === undefined);
  }

  /**
   * An extension of the "same-value" algorithm as [described for use by ES6 Map
   * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
   *
   * NaN is considered the same as NaN, however -0 and 0 are considered the same
   * value, which is different from the algorithm described by
   * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
   *
   * This is extended further to allow Objects to describe the values they
   * represent, by way of `valueOf` or `equals` (and `hashCode`).
   *
   * Note: because of this extension, the key equality of Immutable.Map and the
   * value equality of Immutable.Set will differ from ES6 Map and Set.
   *
   * ### Defining custom values
   *
   * The easiest way to describe the value an object represents is by implementing
   * `valueOf`. For example, `Date` represents a value by returning a unix
   * timestamp for `valueOf`:
   *
   *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
   *     var date2 = new Date(1234567890000);
   *     date1.valueOf(); // 1234567890000
   *     assert( date1 !== date2 );
   *     assert( Immutable.is( date1, date2 ) );
   *
   * Note: overriding `valueOf` may have other implications if you use this object
   * where JavaScript expects a primitive, such as implicit string coercion.
   *
   * For more complex types, especially collections, implementing `valueOf` may
   * not be performant. An alternative is to implement `equals` and `hashCode`.
   *
   * `equals` takes another object, presumably of similar type, and returns true
   * if the it is equal. Equality is symmetrical, so the same result should be
   * returned if this and the argument are flipped.
   *
   *     assert( a.equals(b) === b.equals(a) );
   *
   * `hashCode` returns a 32bit integer number representing the object which will
   * be used to determine how to store the value object in a Map or Set. You must
   * provide both or neither methods, one must not exist without the other.
   *
   * Also, an important relationship between these methods must be upheld: if two
   * values are equal, they *must* return the same hashCode. If the values are not
   * equal, they might have the same hashCode; this is called a hash collision,
   * and while undesirable for performance reasons, it is acceptable.
   *
   *     if (a.equals(b)) {
   *       assert( a.hashCode() === b.hashCode() );
   *     }
   *
   * All Immutable collections implement `equals` and `hashCode`.
   *
   */
  function is(valueA, valueB) {
    if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
      return true;
    }
    if (!valueA || !valueB) {
      return false;
    }
    if (typeof valueA.valueOf === 'function' &&
        typeof valueB.valueOf === 'function') {
      valueA = valueA.valueOf();
      valueB = valueB.valueOf();
      if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
        return true;
      }
      if (!valueA || !valueB) {
        return false;
      }
    }
    if (typeof valueA.equals === 'function' &&
        typeof valueB.equals === 'function' &&
        valueA.equals(valueB)) {
      return true;
    }
    return false;
  }

  function deepEqual(a, b) {
    if (a === b) {
      return true;
    }

    if (
      !isIterable(b) ||
      a.size !== undefined && b.size !== undefined && a.size !== b.size ||
      a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash ||
      isKeyed(a) !== isKeyed(b) ||
      isIndexed(a) !== isIndexed(b) ||
      isOrdered(a) !== isOrdered(b)
    ) {
      return false;
    }

    if (a.size === 0 && b.size === 0) {
      return true;
    }

    var notAssociative = !isAssociative(a);

    if (isOrdered(a)) {
      var entries = a.entries();
      return b.every(function(v, k)  {
        var entry = entries.next().value;
        return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));
      }) && entries.next().done;
    }

    var flipped = false;

    if (a.size === undefined) {
      if (b.size === undefined) {
        if (typeof a.cacheResult === 'function') {
          a.cacheResult();
        }
      } else {
        flipped = true;
        var _ = a;
        a = b;
        b = _;
      }
    }

    var allEqual = true;
    var bSize = b.__iterate(function(v, k)  {
      if (notAssociative ? !a.has(v) :
          flipped ? !is(v, a.get(k, NOT_SET)) : !is(a.get(k, NOT_SET), v)) {
        allEqual = false;
        return false;
      }
    });

    return allEqual && a.size === bSize;
  }

  createClass(Repeat, IndexedSeq);

    function Repeat(value, times) {
      if (!(this instanceof Repeat)) {
        return new Repeat(value, times);
      }
      this._value = value;
      this.size = times === undefined ? Infinity : Math.max(0, times);
      if (this.size === 0) {
        if (EMPTY_REPEAT) {
          return EMPTY_REPEAT;
        }
        EMPTY_REPEAT = this;
      }
    }

    Repeat.prototype.toString = function() {
      if (this.size === 0) {
        return 'Repeat []';
      }
      return 'Repeat [ ' + this._value + ' ' + this.size + ' times ]';
    };

    Repeat.prototype.get = function(index, notSetValue) {
      return this.has(index) ? this._value : notSetValue;
    };

    Repeat.prototype.includes = function(searchValue) {
      return is(this._value, searchValue);
    };

    Repeat.prototype.slice = function(begin, end) {
      var size = this.size;
      return wholeSlice(begin, end, size) ? this :
        new Repeat(this._value, resolveEnd(end, size) - resolveBegin(begin, size));
    };

    Repeat.prototype.reverse = function() {
      return this;
    };

    Repeat.prototype.indexOf = function(searchValue) {
      if (is(this._value, searchValue)) {
        return 0;
      }
      return -1;
    };

    Repeat.prototype.lastIndexOf = function(searchValue) {
      if (is(this._value, searchValue)) {
        return this.size;
      }
      return -1;
    };

    Repeat.prototype.__iterate = function(fn, reverse) {
      for (var ii = 0; ii < this.size; ii++) {
        if (fn(this._value, ii, this) === false) {
          return ii + 1;
        }
      }
      return ii;
    };

    Repeat.prototype.__iterator = function(type, reverse) {var this$0 = this;
      var ii = 0;
      return new Iterator(function() 
        {return ii < this$0.size ? iteratorValue(type, ii++, this$0._value) : iteratorDone()}
      );
    };

    Repeat.prototype.equals = function(other) {
      return other instanceof Repeat ?
        is(this._value, other._value) :
        deepEqual(other);
    };


  var EMPTY_REPEAT;

  function invariant(condition, error) {
    if (!condition) throw new Error(error);
  }

  createClass(Range, IndexedSeq);

    function Range(start, end, step) {
      if (!(this instanceof Range)) {
        return new Range(start, end, step);
      }
      invariant(step !== 0, 'Cannot step a Range by 0');
      start = start || 0;
      if (end === undefined) {
        end = Infinity;
      }
      step = step === undefined ? 1 : Math.abs(step);
      if (end < start) {
        step = -step;
      }
      this._start = start;
      this._end = end;
      this._step = step;
      this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);
      if (this.size === 0) {
        if (EMPTY_RANGE) {
          return EMPTY_RANGE;
        }
        EMPTY_RANGE = this;
      }
    }

    Range.prototype.toString = function() {
      if (this.size === 0) {
        return 'Range []';
      }
      return 'Range [ ' +
        this._start + '...' + this._end +
        (this._step !== 1 ? ' by ' + this._step : '') +
      ' ]';
    };

    Range.prototype.get = function(index, notSetValue) {
      return this.has(index) ?
        this._start + wrapIndex(this, index) * this._step :
        notSetValue;
    };

    Range.prototype.includes = function(searchValue) {
      var possibleIndex = (searchValue - this._start) / this._step;
      return possibleIndex >= 0 &&
        possibleIndex < this.size &&
        possibleIndex === Math.floor(possibleIndex);
    };

    Range.prototype.slice = function(begin, end) {
      if (wholeSlice(begin, end, this.size)) {
        return this;
      }
      begin = resolveBegin(begin, this.size);
      end = resolveEnd(end, this.size);
      if (end <= begin) {
        return new Range(0, 0);
      }
      return new Range(this.get(begin, this._end), this.get(end, this._end), this._step);
    };

    Range.prototype.indexOf = function(searchValue) {
      var offsetValue = searchValue - this._start;
      if (offsetValue % this._step === 0) {
        var index = offsetValue / this._step;
        if (index >= 0 && index < this.size) {
          return index
        }
      }
      return -1;
    };

    Range.prototype.lastIndexOf = function(searchValue) {
      return this.indexOf(searchValue);
    };

    Range.prototype.__iterate = function(fn, reverse) {
      var maxIndex = this.size - 1;
      var step = this._step;
      var value = reverse ? this._start + maxIndex * step : this._start;
      for (var ii = 0; ii <= maxIndex; ii++) {
        if (fn(value, ii, this) === false) {
          return ii + 1;
        }
        value += reverse ? -step : step;
      }
      return ii;
    };

    Range.prototype.__iterator = function(type, reverse) {
      var maxIndex = this.size - 1;
      var step = this._step;
      var value = reverse ? this._start + maxIndex * step : this._start;
      var ii = 0;
      return new Iterator(function()  {
        var v = value;
        value += reverse ? -step : step;
        return ii > maxIndex ? iteratorDone() : iteratorValue(type, ii++, v);
      });
    };

    Range.prototype.equals = function(other) {
      return other instanceof Range ?
        this._start === other._start &&
        this._end === other._end &&
        this._step === other._step :
        deepEqual(this, other);
    };


  var EMPTY_RANGE;

  createClass(Collection, Iterable);
    function Collection() {
      throw TypeError('Abstract');
    }


  createClass(KeyedCollection, Collection);function KeyedCollection() {}

  createClass(IndexedCollection, Collection);function IndexedCollection() {}

  createClass(SetCollection, Collection);function SetCollection() {}


  Collection.Keyed = KeyedCollection;
  Collection.Indexed = IndexedCollection;
  Collection.Set = SetCollection;

  var imul =
    typeof Math.imul === 'function' && Math.imul(0xffffffff, 2) === -2 ?
    Math.imul :
    function imul(a, b) {
      a = a | 0; // int
      b = b | 0; // int
      var c = a & 0xffff;
      var d = b & 0xffff;
      // Shift by 0 fixes the sign on the high part.
      return (c * d) + ((((a >>> 16) * d + c * (b >>> 16)) << 16) >>> 0) | 0; // int
    };

  // v8 has an optimization for storing 31-bit signed numbers.
  // Values which have either 00 or 11 as the high order bits qualify.
  // This function drops the highest order bit in a signed number, maintaining
  // the sign bit.
  function smi(i32) {
    return ((i32 >>> 1) & 0x40000000) | (i32 & 0xBFFFFFFF);
  }

  function hash(o) {
    if (o === false || o === null || o === undefined) {
      return 0;
    }
    if (typeof o.valueOf === 'function') {
      o = o.valueOf();
      if (o === false || o === null || o === undefined) {
        return 0;
      }
    }
    if (o === true) {
      return 1;
    }
    var type = typeof o;
    if (type === 'number') {
      if (o !== o || o === Infinity) {
        return 0;
      }
      var h = o | 0;
      if (h !== o) {
        h ^= o * 0xFFFFFFFF;
      }
      while (o > 0xFFFFFFFF) {
        o /= 0xFFFFFFFF;
        h ^= o;
      }
      return smi(h);
    }
    if (type === 'string') {
      return o.length > STRING_HASH_CACHE_MIN_STRLEN ? cachedHashString(o) : hashString(o);
    }
    if (typeof o.hashCode === 'function') {
      return o.hashCode();
    }
    if (type === 'object') {
      return hashJSObj(o);
    }
    if (typeof o.toString === 'function') {
      return hashString(o.toString());
    }
    throw new Error('Value type ' + type + ' cannot be hashed.');
  }

  function cachedHashString(string) {
    var hash = stringHashCache[string];
    if (hash === undefined) {
      hash = hashString(string);
      if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
        STRING_HASH_CACHE_SIZE = 0;
        stringHashCache = {};
      }
      STRING_HASH_CACHE_SIZE++;
      stringHashCache[string] = hash;
    }
    return hash;
  }

  // http://jsperf.com/hashing-strings
  function hashString(string) {
    // This is the hash from JVM
    // The hash code for a string is computed as
    // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
    // where s[i] is the ith character of the string and n is the length of
    // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
    // (exclusive) by dropping high bits.
    var hash = 0;
    for (var ii = 0; ii < string.length; ii++) {
      hash = 31 * hash + string.charCodeAt(ii) | 0;
    }
    return smi(hash);
  }

  function hashJSObj(obj) {
    var hash;
    if (usingWeakMap) {
      hash = weakMap.get(obj);
      if (hash !== undefined) {
        return hash;
      }
    }

    hash = obj[UID_HASH_KEY];
    if (hash !== undefined) {
      return hash;
    }

    if (!canDefineProperty) {
      hash = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];
      if (hash !== undefined) {
        return hash;
      }

      hash = getIENodeHash(obj);
      if (hash !== undefined) {
        return hash;
      }
    }

    hash = ++objHashUID;
    if (objHashUID & 0x40000000) {
      objHashUID = 0;
    }

    if (usingWeakMap) {
      weakMap.set(obj, hash);
    } else if (isExtensible !== undefined && isExtensible(obj) === false) {
      throw new Error('Non-extensible objects are not allowed as keys.');
    } else if (canDefineProperty) {
      Object.defineProperty(obj, UID_HASH_KEY, {
        'enumerable': false,
        'configurable': false,
        'writable': false,
        'value': hash
      });
    } else if (obj.propertyIsEnumerable !== undefined &&
               obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable) {
      // Since we can't define a non-enumerable property on the object
      // we'll hijack one of the less-used non-enumerable properties to
      // save our hash on it. Since this is a function it will not show up in
      // `JSON.stringify` which is what we want.
      obj.propertyIsEnumerable = function() {
        return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);
      };
      obj.propertyIsEnumerable[UID_HASH_KEY] = hash;
    } else if (obj.nodeType !== undefined) {
      // At this point we couldn't get the IE `uniqueID` to use as a hash
      // and we couldn't use a non-enumerable property to exploit the
      // dontEnum bug so we simply add the `UID_HASH_KEY` on the node
      // itself.
      obj[UID_HASH_KEY] = hash;
    } else {
      throw new Error('Unable to set a non-enumerable property on object.');
    }

    return hash;
  }

  // Get references to ES5 object methods.
  var isExtensible = Object.isExtensible;

  // True if Object.defineProperty works as expected. IE8 fails this test.
  var canDefineProperty = (function() {
    try {
      Object.defineProperty({}, '@', {});
      return true;
    } catch (e) {
      return false;
    }
  }());

  // IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
  // and avoid memory leaks from the IE cloneNode bug.
  function getIENodeHash(node) {
    if (node && node.nodeType > 0) {
      switch (node.nodeType) {
        case 1: // Element
          return node.uniqueID;
        case 9: // Document
          return node.documentElement && node.documentElement.uniqueID;
      }
    }
  }

  // If possible, use a WeakMap.
  var usingWeakMap = typeof WeakMap === 'function';
  var weakMap;
  if (usingWeakMap) {
    weakMap = new WeakMap();
  }

  var objHashUID = 0;

  var UID_HASH_KEY = '__immutablehash__';
  if (typeof Symbol === 'function') {
    UID_HASH_KEY = Symbol(UID_HASH_KEY);
  }

  var STRING_HASH_CACHE_MIN_STRLEN = 16;
  var STRING_HASH_CACHE_MAX_SIZE = 255;
  var STRING_HASH_CACHE_SIZE = 0;
  var stringHashCache = {};

  function assertNotInfinite(size) {
    invariant(
      size !== Infinity,
      'Cannot perform this action with an infinite size.'
    );
  }

  createClass(Map, KeyedCollection);

    // @pragma Construction

    function Map(value) {
      return value === null || value === undefined ? emptyMap() :
        isMap(value) && !isOrdered(value) ? value :
        emptyMap().withMutations(function(map ) {
          var iter = KeyedIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v, k)  {return map.set(k, v)});
        });
    }

    Map.of = function() {var keyValues = SLICE$0.call(arguments, 0);
      return emptyMap().withMutations(function(map ) {
        for (var i = 0; i < keyValues.length; i += 2) {
          if (i + 1 >= keyValues.length) {
            throw new Error('Missing value for key: ' + keyValues[i]);
          }
          map.set(keyValues[i], keyValues[i + 1]);
        }
      });
    };

    Map.prototype.toString = function() {
      return this.__toString('Map {', '}');
    };

    // @pragma Access

    Map.prototype.get = function(k, notSetValue) {
      return this._root ?
        this._root.get(0, undefined, k, notSetValue) :
        notSetValue;
    };

    // @pragma Modification

    Map.prototype.set = function(k, v) {
      return updateMap(this, k, v);
    };

    Map.prototype.setIn = function(keyPath, v) {
      return this.updateIn(keyPath, NOT_SET, function()  {return v});
    };

    Map.prototype.remove = function(k) {
      return updateMap(this, k, NOT_SET);
    };

    Map.prototype.deleteIn = function(keyPath) {
      return this.updateIn(keyPath, function()  {return NOT_SET});
    };

    Map.prototype.update = function(k, notSetValue, updater) {
      return arguments.length === 1 ?
        k(this) :
        this.updateIn([k], notSetValue, updater);
    };

    Map.prototype.updateIn = function(keyPath, notSetValue, updater) {
      if (!updater) {
        updater = notSetValue;
        notSetValue = undefined;
      }
      var updatedValue = updateInDeepMap(
        this,
        forceIterator(keyPath),
        notSetValue,
        updater
      );
      return updatedValue === NOT_SET ? undefined : updatedValue;
    };

    Map.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = 0;
        this._root = null;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return emptyMap();
    };

    // @pragma Composition

    Map.prototype.merge = function(/*...iters*/) {
      return mergeIntoMapWith(this, undefined, arguments);
    };

    Map.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoMapWith(this, merger, iters);
    };

    Map.prototype.mergeIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
      return this.updateIn(
        keyPath,
        emptyMap(),
        function(m ) {return typeof m.merge === 'function' ?
          m.merge.apply(m, iters) :
          iters[iters.length - 1]}
      );
    };

    Map.prototype.mergeDeep = function(/*...iters*/) {
      return mergeIntoMapWith(this, deepMerger, arguments);
    };

    Map.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoMapWith(this, deepMergerWith(merger), iters);
    };

    Map.prototype.mergeDeepIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
      return this.updateIn(
        keyPath,
        emptyMap(),
        function(m ) {return typeof m.mergeDeep === 'function' ?
          m.mergeDeep.apply(m, iters) :
          iters[iters.length - 1]}
      );
    };

    Map.prototype.sort = function(comparator) {
      // Late binding
      return OrderedMap(sortFactory(this, comparator));
    };

    Map.prototype.sortBy = function(mapper, comparator) {
      // Late binding
      return OrderedMap(sortFactory(this, comparator, mapper));
    };

    // @pragma Mutability

    Map.prototype.withMutations = function(fn) {
      var mutable = this.asMutable();
      fn(mutable);
      return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
    };

    Map.prototype.asMutable = function() {
      return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
    };

    Map.prototype.asImmutable = function() {
      return this.__ensureOwner();
    };

    Map.prototype.wasAltered = function() {
      return this.__altered;
    };

    Map.prototype.__iterator = function(type, reverse) {
      return new MapIterator(this, type, reverse);
    };

    Map.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      var iterations = 0;
      this._root && this._root.iterate(function(entry ) {
        iterations++;
        return fn(entry[1], entry[0], this$0);
      }, reverse);
      return iterations;
    };

    Map.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      if (!ownerID) {
        this.__ownerID = ownerID;
        this.__altered = false;
        return this;
      }
      return makeMap(this.size, this._root, ownerID, this.__hash);
    };


  function isMap(maybeMap) {
    return !!(maybeMap && maybeMap[IS_MAP_SENTINEL]);
  }

  Map.isMap = isMap;

  var IS_MAP_SENTINEL = '@@__IMMUTABLE_MAP__@@';

  var MapPrototype = Map.prototype;
  MapPrototype[IS_MAP_SENTINEL] = true;
  MapPrototype[DELETE] = MapPrototype.remove;
  MapPrototype.removeIn = MapPrototype.deleteIn;


  // #pragma Trie Nodes



    function ArrayMapNode(ownerID, entries) {
      this.ownerID = ownerID;
      this.entries = entries;
    }

    ArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      var entries = this.entries;
      for (var ii = 0, len = entries.length; ii < len; ii++) {
        if (is(key, entries[ii][0])) {
          return entries[ii][1];
        }
      }
      return notSetValue;
    };

    ArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      var removed = value === NOT_SET;

      var entries = this.entries;
      var idx = 0;
      for (var len = entries.length; idx < len; idx++) {
        if (is(key, entries[idx][0])) {
          break;
        }
      }
      var exists = idx < len;

      if (exists ? entries[idx][1] === value : removed) {
        return this;
      }

      SetRef(didAlter);
      (removed || !exists) && SetRef(didChangeSize);

      if (removed && entries.length === 1) {
        return; // undefined
      }

      if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
        return createNodes(ownerID, entries, key, value);
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newEntries = isEditable ? entries : arrCopy(entries);

      if (exists) {
        if (removed) {
          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
        } else {
          newEntries[idx] = [key, value];
        }
      } else {
        newEntries.push([key, value]);
      }

      if (isEditable) {
        this.entries = newEntries;
        return this;
      }

      return new ArrayMapNode(ownerID, newEntries);
    };




    function BitmapIndexedNode(ownerID, bitmap, nodes) {
      this.ownerID = ownerID;
      this.bitmap = bitmap;
      this.nodes = nodes;
    }

    BitmapIndexedNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var bit = (1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK));
      var bitmap = this.bitmap;
      return (bitmap & bit) === 0 ? notSetValue :
        this.nodes[popCount(bitmap & (bit - 1))].get(shift + SHIFT, keyHash, key, notSetValue);
    };

    BitmapIndexedNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
      var bit = 1 << keyHashFrag;
      var bitmap = this.bitmap;
      var exists = (bitmap & bit) !== 0;

      if (!exists && value === NOT_SET) {
        return this;
      }

      var idx = popCount(bitmap & (bit - 1));
      var nodes = this.nodes;
      var node = exists ? nodes[idx] : undefined;
      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);

      if (newNode === node) {
        return this;
      }

      if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
        return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
      }

      if (exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])) {
        return nodes[idx ^ 1];
      }

      if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
        return newNode;
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newBitmap = exists ? newNode ? bitmap : bitmap ^ bit : bitmap | bit;
      var newNodes = exists ? newNode ?
        setIn(nodes, idx, newNode, isEditable) :
        spliceOut(nodes, idx, isEditable) :
        spliceIn(nodes, idx, newNode, isEditable);

      if (isEditable) {
        this.bitmap = newBitmap;
        this.nodes = newNodes;
        return this;
      }

      return new BitmapIndexedNode(ownerID, newBitmap, newNodes);
    };




    function HashArrayMapNode(ownerID, count, nodes) {
      this.ownerID = ownerID;
      this.count = count;
      this.nodes = nodes;
    }

    HashArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
      var node = this.nodes[idx];
      return node ? node.get(shift + SHIFT, keyHash, key, notSetValue) : notSetValue;
    };

    HashArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
      var removed = value === NOT_SET;
      var nodes = this.nodes;
      var node = nodes[idx];

      if (removed && !node) {
        return this;
      }

      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);
      if (newNode === node) {
        return this;
      }

      var newCount = this.count;
      if (!node) {
        newCount++;
      } else if (!newNode) {
        newCount--;
        if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
          return packNodes(ownerID, nodes, newCount, idx);
        }
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newNodes = setIn(nodes, idx, newNode, isEditable);

      if (isEditable) {
        this.count = newCount;
        this.nodes = newNodes;
        return this;
      }

      return new HashArrayMapNode(ownerID, newCount, newNodes);
    };




    function HashCollisionNode(ownerID, keyHash, entries) {
      this.ownerID = ownerID;
      this.keyHash = keyHash;
      this.entries = entries;
    }

    HashCollisionNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      var entries = this.entries;
      for (var ii = 0, len = entries.length; ii < len; ii++) {
        if (is(key, entries[ii][0])) {
          return entries[ii][1];
        }
      }
      return notSetValue;
    };

    HashCollisionNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }

      var removed = value === NOT_SET;

      if (keyHash !== this.keyHash) {
        if (removed) {
          return this;
        }
        SetRef(didAlter);
        SetRef(didChangeSize);
        return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
      }

      var entries = this.entries;
      var idx = 0;
      for (var len = entries.length; idx < len; idx++) {
        if (is(key, entries[idx][0])) {
          break;
        }
      }
      var exists = idx < len;

      if (exists ? entries[idx][1] === value : removed) {
        return this;
      }

      SetRef(didAlter);
      (removed || !exists) && SetRef(didChangeSize);

      if (removed && len === 2) {
        return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newEntries = isEditable ? entries : arrCopy(entries);

      if (exists) {
        if (removed) {
          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
        } else {
          newEntries[idx] = [key, value];
        }
      } else {
        newEntries.push([key, value]);
      }

      if (isEditable) {
        this.entries = newEntries;
        return this;
      }

      return new HashCollisionNode(ownerID, this.keyHash, newEntries);
    };




    function ValueNode(ownerID, keyHash, entry) {
      this.ownerID = ownerID;
      this.keyHash = keyHash;
      this.entry = entry;
    }

    ValueNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      return is(key, this.entry[0]) ? this.entry[1] : notSetValue;
    };

    ValueNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      var removed = value === NOT_SET;
      var keyMatch = is(key, this.entry[0]);
      if (keyMatch ? value === this.entry[1] : removed) {
        return this;
      }

      SetRef(didAlter);

      if (removed) {
        SetRef(didChangeSize);
        return; // undefined
      }

      if (keyMatch) {
        if (ownerID && ownerID === this.ownerID) {
          this.entry[1] = value;
          return this;
        }
        return new ValueNode(ownerID, this.keyHash, [key, value]);
      }

      SetRef(didChangeSize);
      return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
    };



  // #pragma Iterators

  ArrayMapNode.prototype.iterate =
  HashCollisionNode.prototype.iterate = function (fn, reverse) {
    var entries = this.entries;
    for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
      if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
        return false;
      }
    }
  }

  BitmapIndexedNode.prototype.iterate =
  HashArrayMapNode.prototype.iterate = function (fn, reverse) {
    var nodes = this.nodes;
    for (var ii = 0, maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
      var node = nodes[reverse ? maxIndex - ii : ii];
      if (node && node.iterate(fn, reverse) === false) {
        return false;
      }
    }
  }

  ValueNode.prototype.iterate = function (fn, reverse) {
    return fn(this.entry);
  }

  createClass(MapIterator, Iterator);

    function MapIterator(map, type, reverse) {
      this._type = type;
      this._reverse = reverse;
      this._stack = map._root && mapIteratorFrame(map._root);
    }

    MapIterator.prototype.next = function() {
      var type = this._type;
      var stack = this._stack;
      while (stack) {
        var node = stack.node;
        var index = stack.index++;
        var maxIndex;
        if (node.entry) {
          if (index === 0) {
            return mapIteratorValue(type, node.entry);
          }
        } else if (node.entries) {
          maxIndex = node.entries.length - 1;
          if (index <= maxIndex) {
            return mapIteratorValue(type, node.entries[this._reverse ? maxIndex - index : index]);
          }
        } else {
          maxIndex = node.nodes.length - 1;
          if (index <= maxIndex) {
            var subNode = node.nodes[this._reverse ? maxIndex - index : index];
            if (subNode) {
              if (subNode.entry) {
                return mapIteratorValue(type, subNode.entry);
              }
              stack = this._stack = mapIteratorFrame(subNode, stack);
            }
            continue;
          }
        }
        stack = this._stack = this._stack.__prev;
      }
      return iteratorDone();
    };


  function mapIteratorValue(type, entry) {
    return iteratorValue(type, entry[0], entry[1]);
  }

  function mapIteratorFrame(node, prev) {
    return {
      node: node,
      index: 0,
      __prev: prev
    };
  }

  function makeMap(size, root, ownerID, hash) {
    var map = Object.create(MapPrototype);
    map.size = size;
    map._root = root;
    map.__ownerID = ownerID;
    map.__hash = hash;
    map.__altered = false;
    return map;
  }

  var EMPTY_MAP;
  function emptyMap() {
    return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
  }

  function updateMap(map, k, v) {
    var newRoot;
    var newSize;
    if (!map._root) {
      if (v === NOT_SET) {
        return map;
      }
      newSize = 1;
      newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
    } else {
      var didChangeSize = MakeRef(CHANGE_LENGTH);
      var didAlter = MakeRef(DID_ALTER);
      newRoot = updateNode(map._root, map.__ownerID, 0, undefined, k, v, didChangeSize, didAlter);
      if (!didAlter.value) {
        return map;
      }
      newSize = map.size + (didChangeSize.value ? v === NOT_SET ? -1 : 1 : 0);
    }
    if (map.__ownerID) {
      map.size = newSize;
      map._root = newRoot;
      map.__hash = undefined;
      map.__altered = true;
      return map;
    }
    return newRoot ? makeMap(newSize, newRoot) : emptyMap();
  }

  function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
    if (!node) {
      if (value === NOT_SET) {
        return node;
      }
      SetRef(didAlter);
      SetRef(didChangeSize);
      return new ValueNode(ownerID, keyHash, [key, value]);
    }
    return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter);
  }

  function isLeafNode(node) {
    return node.constructor === ValueNode || node.constructor === HashCollisionNode;
  }

  function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
    if (node.keyHash === keyHash) {
      return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);
    }

    var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
    var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;

    var newNode;
    var nodes = idx1 === idx2 ?
      [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)] :
      ((newNode = new ValueNode(ownerID, keyHash, entry)), idx1 < idx2 ? [node, newNode] : [newNode, node]);

    return new BitmapIndexedNode(ownerID, (1 << idx1) | (1 << idx2), nodes);
  }

  function createNodes(ownerID, entries, key, value) {
    if (!ownerID) {
      ownerID = new OwnerID();
    }
    var node = new ValueNode(ownerID, hash(key), [key, value]);
    for (var ii = 0; ii < entries.length; ii++) {
      var entry = entries[ii];
      node = node.update(ownerID, 0, undefined, entry[0], entry[1]);
    }
    return node;
  }

  function packNodes(ownerID, nodes, count, excluding) {
    var bitmap = 0;
    var packedII = 0;
    var packedNodes = new Array(count);
    for (var ii = 0, bit = 1, len = nodes.length; ii < len; ii++, bit <<= 1) {
      var node = nodes[ii];
      if (node !== undefined && ii !== excluding) {
        bitmap |= bit;
        packedNodes[packedII++] = node;
      }
    }
    return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
  }

  function expandNodes(ownerID, nodes, bitmap, including, node) {
    var count = 0;
    var expandedNodes = new Array(SIZE);
    for (var ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
      expandedNodes[ii] = bitmap & 1 ? nodes[count++] : undefined;
    }
    expandedNodes[including] = node;
    return new HashArrayMapNode(ownerID, count + 1, expandedNodes);
  }

  function mergeIntoMapWith(map, merger, iterables) {
    var iters = [];
    for (var ii = 0; ii < iterables.length; ii++) {
      var value = iterables[ii];
      var iter = KeyedIterable(value);
      if (!isIterable(value)) {
        iter = iter.map(function(v ) {return fromJS(v)});
      }
      iters.push(iter);
    }
    return mergeIntoCollectionWith(map, merger, iters);
  }

  function deepMerger(existing, value, key) {
    return existing && existing.mergeDeep && isIterable(value) ?
      existing.mergeDeep(value) :
      is(existing, value) ? existing : value;
  }

  function deepMergerWith(merger) {
    return function(existing, value, key)  {
      if (existing && existing.mergeDeepWith && isIterable(value)) {
        return existing.mergeDeepWith(merger, value);
      }
      var nextValue = merger(existing, value, key);
      return is(existing, nextValue) ? existing : nextValue;
    };
  }

  function mergeIntoCollectionWith(collection, merger, iters) {
    iters = iters.filter(function(x ) {return x.size !== 0});
    if (iters.length === 0) {
      return collection;
    }
    if (collection.size === 0 && !collection.__ownerID && iters.length === 1) {
      return collection.constructor(iters[0]);
    }
    return collection.withMutations(function(collection ) {
      var mergeIntoMap = merger ?
        function(value, key)  {
          collection.update(key, NOT_SET, function(existing )
            {return existing === NOT_SET ? value : merger(existing, value, key)}
          );
        } :
        function(value, key)  {
          collection.set(key, value);
        }
      for (var ii = 0; ii < iters.length; ii++) {
        iters[ii].forEach(mergeIntoMap);
      }
    });
  }

  function updateInDeepMap(existing, keyPathIter, notSetValue, updater) {
    var isNotSet = existing === NOT_SET;
    var step = keyPathIter.next();
    if (step.done) {
      var existingValue = isNotSet ? notSetValue : existing;
      var newValue = updater(existingValue);
      return newValue === existingValue ? existing : newValue;
    }
    invariant(
      isNotSet || (existing && existing.set),
      'invalid keyPath'
    );
    var key = step.value;
    var nextExisting = isNotSet ? NOT_SET : existing.get(key, NOT_SET);
    var nextUpdated = updateInDeepMap(
      nextExisting,
      keyPathIter,
      notSetValue,
      updater
    );
    return nextUpdated === nextExisting ? existing :
      nextUpdated === NOT_SET ? existing.remove(key) :
      (isNotSet ? emptyMap() : existing).set(key, nextUpdated);
  }

  function popCount(x) {
    x = x - ((x >> 1) & 0x55555555);
    x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
    x = (x + (x >> 4)) & 0x0f0f0f0f;
    x = x + (x >> 8);
    x = x + (x >> 16);
    return x & 0x7f;
  }

  function setIn(array, idx, val, canEdit) {
    var newArray = canEdit ? array : arrCopy(array);
    newArray[idx] = val;
    return newArray;
  }

  function spliceIn(array, idx, val, canEdit) {
    var newLen = array.length + 1;
    if (canEdit && idx + 1 === newLen) {
      array[idx] = val;
      return array;
    }
    var newArray = new Array(newLen);
    var after = 0;
    for (var ii = 0; ii < newLen; ii++) {
      if (ii === idx) {
        newArray[ii] = val;
        after = -1;
      } else {
        newArray[ii] = array[ii + after];
      }
    }
    return newArray;
  }

  function spliceOut(array, idx, canEdit) {
    var newLen = array.length - 1;
    if (canEdit && idx === newLen) {
      array.pop();
      return array;
    }
    var newArray = new Array(newLen);
    var after = 0;
    for (var ii = 0; ii < newLen; ii++) {
      if (ii === idx) {
        after = 1;
      }
      newArray[ii] = array[ii + after];
    }
    return newArray;
  }

  var MAX_ARRAY_MAP_SIZE = SIZE / 4;
  var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
  var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;

  createClass(List, IndexedCollection);

    // @pragma Construction

    function List(value) {
      var empty = emptyList();
      if (value === null || value === undefined) {
        return empty;
      }
      if (isList(value)) {
        return value;
      }
      var iter = IndexedIterable(value);
      var size = iter.size;
      if (size === 0) {
        return empty;
      }
      assertNotInfinite(size);
      if (size > 0 && size < SIZE) {
        return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));
      }
      return empty.withMutations(function(list ) {
        list.setSize(size);
        iter.forEach(function(v, i)  {return list.set(i, v)});
      });
    }

    List.of = function(/*...values*/) {
      return this(arguments);
    };

    List.prototype.toString = function() {
      return this.__toString('List [', ']');
    };

    // @pragma Access

    List.prototype.get = function(index, notSetValue) {
      index = wrapIndex(this, index);
      if (index >= 0 && index < this.size) {
        index += this._origin;
        var node = listNodeFor(this, index);
        return node && node.array[index & MASK];
      }
      return notSetValue;
    };

    // @pragma Modification

    List.prototype.set = function(index, value) {
      return updateList(this, index, value);
    };

    List.prototype.remove = function(index) {
      return !this.has(index) ? this :
        index === 0 ? this.shift() :
        index === this.size - 1 ? this.pop() :
        this.splice(index, 1);
    };

    List.prototype.insert = function(index, value) {
      return this.splice(index, 0, value);
    };

    List.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = this._origin = this._capacity = 0;
        this._level = SHIFT;
        this._root = this._tail = null;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return emptyList();
    };

    List.prototype.push = function(/*...values*/) {
      var values = arguments;
      var oldSize = this.size;
      return this.withMutations(function(list ) {
        setListBounds(list, 0, oldSize + values.length);
        for (var ii = 0; ii < values.length; ii++) {
          list.set(oldSize + ii, values[ii]);
        }
      });
    };

    List.prototype.pop = function() {
      return setListBounds(this, 0, -1);
    };

    List.prototype.unshift = function(/*...values*/) {
      var values = arguments;
      return this.withMutations(function(list ) {
        setListBounds(list, -values.length);
        for (var ii = 0; ii < values.length; ii++) {
          list.set(ii, values[ii]);
        }
      });
    };

    List.prototype.shift = function() {
      return setListBounds(this, 1);
    };

    // @pragma Composition

    List.prototype.merge = function(/*...iters*/) {
      return mergeIntoListWith(this, undefined, arguments);
    };

    List.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoListWith(this, merger, iters);
    };

    List.prototype.mergeDeep = function(/*...iters*/) {
      return mergeIntoListWith(this, deepMerger, arguments);
    };

    List.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoListWith(this, deepMergerWith(merger), iters);
    };

    List.prototype.setSize = function(size) {
      return setListBounds(this, 0, size);
    };

    // @pragma Iteration

    List.prototype.slice = function(begin, end) {
      var size = this.size;
      if (wholeSlice(begin, end, size)) {
        return this;
      }
      return setListBounds(
        this,
        resolveBegin(begin, size),
        resolveEnd(end, size)
      );
    };

    List.prototype.__iterator = function(type, reverse) {
      var index = 0;
      var values = iterateList(this, reverse);
      return new Iterator(function()  {
        var value = values();
        return value === DONE ?
          iteratorDone() :
          iteratorValue(type, index++, value);
      });
    };

    List.prototype.__iterate = function(fn, reverse) {
      var index = 0;
      var values = iterateList(this, reverse);
      var value;
      while ((value = values()) !== DONE) {
        if (fn(value, index++, this) === false) {
          break;
        }
      }
      return index;
    };

    List.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      if (!ownerID) {
        this.__ownerID = ownerID;
        return this;
      }
      return makeList(this._origin, this._capacity, this._level, this._root, this._tail, ownerID, this.__hash);
    };


  function isList(maybeList) {
    return !!(maybeList && maybeList[IS_LIST_SENTINEL]);
  }

  List.isList = isList;

  var IS_LIST_SENTINEL = '@@__IMMUTABLE_LIST__@@';

  var ListPrototype = List.prototype;
  ListPrototype[IS_LIST_SENTINEL] = true;
  ListPrototype[DELETE] = ListPrototype.remove;
  ListPrototype.setIn = MapPrototype.setIn;
  ListPrototype.deleteIn =
  ListPrototype.removeIn = MapPrototype.removeIn;
  ListPrototype.update = MapPrototype.update;
  ListPrototype.updateIn = MapPrototype.updateIn;
  ListPrototype.mergeIn = MapPrototype.mergeIn;
  ListPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
  ListPrototype.withMutations = MapPrototype.withMutations;
  ListPrototype.asMutable = MapPrototype.asMutable;
  ListPrototype.asImmutable = MapPrototype.asImmutable;
  ListPrototype.wasAltered = MapPrototype.wasAltered;



    function VNode(array, ownerID) {
      this.array = array;
      this.ownerID = ownerID;
    }

    // TODO: seems like these methods are very similar

    VNode.prototype.removeBefore = function(ownerID, level, index) {
      if (index === level ? 1 << level : 0 || this.array.length === 0) {
        return this;
      }
      var originIndex = (index >>> level) & MASK;
      if (originIndex >= this.array.length) {
        return new VNode([], ownerID);
      }
      var removingFirst = originIndex === 0;
      var newChild;
      if (level > 0) {
        var oldChild = this.array[originIndex];
        newChild = oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);
        if (newChild === oldChild && removingFirst) {
          return this;
        }
      }
      if (removingFirst && !newChild) {
        return this;
      }
      var editable = editableVNode(this, ownerID);
      if (!removingFirst) {
        for (var ii = 0; ii < originIndex; ii++) {
          editable.array[ii] = undefined;
        }
      }
      if (newChild) {
        editable.array[originIndex] = newChild;
      }
      return editable;
    };

    VNode.prototype.removeAfter = function(ownerID, level, index) {
      if (index === (level ? 1 << level : 0) || this.array.length === 0) {
        return this;
      }
      var sizeIndex = ((index - 1) >>> level) & MASK;
      if (sizeIndex >= this.array.length) {
        return this;
      }

      var newChild;
      if (level > 0) {
        var oldChild = this.array[sizeIndex];
        newChild = oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);
        if (newChild === oldChild && sizeIndex === this.array.length - 1) {
          return this;
        }
      }

      var editable = editableVNode(this, ownerID);
      editable.array.splice(sizeIndex + 1);
      if (newChild) {
        editable.array[sizeIndex] = newChild;
      }
      return editable;
    };



  var DONE = {};

  function iterateList(list, reverse) {
    var left = list._origin;
    var right = list._capacity;
    var tailPos = getTailOffset(right);
    var tail = list._tail;

    return iterateNodeOrLeaf(list._root, list._level, 0);

    function iterateNodeOrLeaf(node, level, offset) {
      return level === 0 ?
        iterateLeaf(node, offset) :
        iterateNode(node, level, offset);
    }

    function iterateLeaf(node, offset) {
      var array = offset === tailPos ? tail && tail.array : node && node.array;
      var from = offset > left ? 0 : left - offset;
      var to = right - offset;
      if (to > SIZE) {
        to = SIZE;
      }
      return function()  {
        if (from === to) {
          return DONE;
        }
        var idx = reverse ? --to : from++;
        return array && array[idx];
      };
    }

    function iterateNode(node, level, offset) {
      var values;
      var array = node && node.array;
      var from = offset > left ? 0 : (left - offset) >> level;
      var to = ((right - offset) >> level) + 1;
      if (to > SIZE) {
        to = SIZE;
      }
      return function()  {
        do {
          if (values) {
            var value = values();
            if (value !== DONE) {
              return value;
            }
            values = null;
          }
          if (from === to) {
            return DONE;
          }
          var idx = reverse ? --to : from++;
          values = iterateNodeOrLeaf(
            array && array[idx], level - SHIFT, offset + (idx << level)
          );
        } while (true);
      };
    }
  }

  function makeList(origin, capacity, level, root, tail, ownerID, hash) {
    var list = Object.create(ListPrototype);
    list.size = capacity - origin;
    list._origin = origin;
    list._capacity = capacity;
    list._level = level;
    list._root = root;
    list._tail = tail;
    list.__ownerID = ownerID;
    list.__hash = hash;
    list.__altered = false;
    return list;
  }

  var EMPTY_LIST;
  function emptyList() {
    return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));
  }

  function updateList(list, index, value) {
    index = wrapIndex(list, index);

    if (index !== index) {
      return list;
    }

    if (index >= list.size || index < 0) {
      return list.withMutations(function(list ) {
        index < 0 ?
          setListBounds(list, index).set(0, value) :
          setListBounds(list, 0, index + 1).set(index, value)
      });
    }

    index += list._origin;

    var newTail = list._tail;
    var newRoot = list._root;
    var didAlter = MakeRef(DID_ALTER);
    if (index >= getTailOffset(list._capacity)) {
      newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);
    } else {
      newRoot = updateVNode(newRoot, list.__ownerID, list._level, index, value, didAlter);
    }

    if (!didAlter.value) {
      return list;
    }

    if (list.__ownerID) {
      list._root = newRoot;
      list._tail = newTail;
      list.__hash = undefined;
      list.__altered = true;
      return list;
    }
    return makeList(list._origin, list._capacity, list._level, newRoot, newTail);
  }

  function updateVNode(node, ownerID, level, index, value, didAlter) {
    var idx = (index >>> level) & MASK;
    var nodeHas = node && idx < node.array.length;
    if (!nodeHas && value === undefined) {
      return node;
    }

    var newNode;

    if (level > 0) {
      var lowerNode = node && node.array[idx];
      var newLowerNode = updateVNode(lowerNode, ownerID, level - SHIFT, index, value, didAlter);
      if (newLowerNode === lowerNode) {
        return node;
      }
      newNode = editableVNode(node, ownerID);
      newNode.array[idx] = newLowerNode;
      return newNode;
    }

    if (nodeHas && node.array[idx] === value) {
      return node;
    }

    SetRef(didAlter);

    newNode = editableVNode(node, ownerID);
    if (value === undefined && idx === newNode.array.length - 1) {
      newNode.array.pop();
    } else {
      newNode.array[idx] = value;
    }
    return newNode;
  }

  function editableVNode(node, ownerID) {
    if (ownerID && node && ownerID === node.ownerID) {
      return node;
    }
    return new VNode(node ? node.array.slice() : [], ownerID);
  }

  function listNodeFor(list, rawIndex) {
    if (rawIndex >= getTailOffset(list._capacity)) {
      return list._tail;
    }
    if (rawIndex < 1 << (list._level + SHIFT)) {
      var node = list._root;
      var level = list._level;
      while (node && level > 0) {
        node = node.array[(rawIndex >>> level) & MASK];
        level -= SHIFT;
      }
      return node;
    }
  }

  function setListBounds(list, begin, end) {
    // Sanitize begin & end using this shorthand for ToInt32(argument)
    // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
    if (begin !== undefined) {
      begin = begin | 0;
    }
    if (end !== undefined) {
      end = end | 0;
    }
    var owner = list.__ownerID || new OwnerID();
    var oldOrigin = list._origin;
    var oldCapacity = list._capacity;
    var newOrigin = oldOrigin + begin;
    var newCapacity = end === undefined ? oldCapacity : end < 0 ? oldCapacity + end : oldOrigin + end;
    if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
      return list;
    }

    // If it's going to end after it starts, it's empty.
    if (newOrigin >= newCapacity) {
      return list.clear();
    }

    var newLevel = list._level;
    var newRoot = list._root;

    // New origin might need creating a higher root.
    var offsetShift = 0;
    while (newOrigin + offsetShift < 0) {
      newRoot = new VNode(newRoot && newRoot.array.length ? [undefined, newRoot] : [], owner);
      newLevel += SHIFT;
      offsetShift += 1 << newLevel;
    }
    if (offsetShift) {
      newOrigin += offsetShift;
      oldOrigin += offsetShift;
      newCapacity += offsetShift;
      oldCapacity += offsetShift;
    }

    var oldTailOffset = getTailOffset(oldCapacity);
    var newTailOffset = getTailOffset(newCapacity);

    // New size might need creating a higher root.
    while (newTailOffset >= 1 << (newLevel + SHIFT)) {
      newRoot = new VNode(newRoot && newRoot.array.length ? [newRoot] : [], owner);
      newLevel += SHIFT;
    }

    // Locate or create the new tail.
    var oldTail = list._tail;
    var newTail = newTailOffset < oldTailOffset ?
      listNodeFor(list, newCapacity - 1) :
      newTailOffset > oldTailOffset ? new VNode([], owner) : oldTail;

    // Merge Tail into tree.
    if (oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length) {
      newRoot = editableVNode(newRoot, owner);
      var node = newRoot;
      for (var level = newLevel; level > SHIFT; level -= SHIFT) {
        var idx = (oldTailOffset >>> level) & MASK;
        node = node.array[idx] = editableVNode(node.array[idx], owner);
      }
      node.array[(oldTailOffset >>> SHIFT) & MASK] = oldTail;
    }

    // If the size has been reduced, there's a chance the tail needs to be trimmed.
    if (newCapacity < oldCapacity) {
      newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);
    }

    // If the new origin is within the tail, then we do not need a root.
    if (newOrigin >= newTailOffset) {
      newOrigin -= newTailOffset;
      newCapacity -= newTailOffset;
      newLevel = SHIFT;
      newRoot = null;
      newTail = newTail && newTail.removeBefore(owner, 0, newOrigin);

    // Otherwise, if the root has been trimmed, garbage collect.
    } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
      offsetShift = 0;

      // Identify the new top root node of the subtree of the old root.
      while (newRoot) {
        var beginIndex = (newOrigin >>> newLevel) & MASK;
        if (beginIndex !== (newTailOffset >>> newLevel) & MASK) {
          break;
        }
        if (beginIndex) {
          offsetShift += (1 << newLevel) * beginIndex;
        }
        newLevel -= SHIFT;
        newRoot = newRoot.array[beginIndex];
      }

      // Trim the new sides of the new root.
      if (newRoot && newOrigin > oldOrigin) {
        newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);
      }
      if (newRoot && newTailOffset < oldTailOffset) {
        newRoot = newRoot.removeAfter(owner, newLevel, newTailOffset - offsetShift);
      }
      if (offsetShift) {
        newOrigin -= offsetShift;
        newCapacity -= offsetShift;
      }
    }

    if (list.__ownerID) {
      list.size = newCapacity - newOrigin;
      list._origin = newOrigin;
      list._capacity = newCapacity;
      list._level = newLevel;
      list._root = newRoot;
      list._tail = newTail;
      list.__hash = undefined;
      list.__altered = true;
      return list;
    }
    return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);
  }

  function mergeIntoListWith(list, merger, iterables) {
    var iters = [];
    var maxSize = 0;
    for (var ii = 0; ii < iterables.length; ii++) {
      var value = iterables[ii];
      var iter = IndexedIterable(value);
      if (iter.size > maxSize) {
        maxSize = iter.size;
      }
      if (!isIterable(value)) {
        iter = iter.map(function(v ) {return fromJS(v)});
      }
      iters.push(iter);
    }
    if (maxSize > list.size) {
      list = list.setSize(maxSize);
    }
    return mergeIntoCollectionWith(list, merger, iters);
  }

  function getTailOffset(size) {
    return size < SIZE ? 0 : (((size - 1) >>> SHIFT) << SHIFT);
  }

  createClass(OrderedMap, Map);

    // @pragma Construction

    function OrderedMap(value) {
      return value === null || value === undefined ? emptyOrderedMap() :
        isOrderedMap(value) ? value :
        emptyOrderedMap().withMutations(function(map ) {
          var iter = KeyedIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v, k)  {return map.set(k, v)});
        });
    }

    OrderedMap.of = function(/*...values*/) {
      return this(arguments);
    };

    OrderedMap.prototype.toString = function() {
      return this.__toString('OrderedMap {', '}');
    };

    // @pragma Access

    OrderedMap.prototype.get = function(k, notSetValue) {
      var index = this._map.get(k);
      return index !== undefined ? this._list.get(index)[1] : notSetValue;
    };

    // @pragma Modification

    OrderedMap.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = 0;
        this._map.clear();
        this._list.clear();
        return this;
      }
      return emptyOrderedMap();
    };

    OrderedMap.prototype.set = function(k, v) {
      return updateOrderedMap(this, k, v);
    };

    OrderedMap.prototype.remove = function(k) {
      return updateOrderedMap(this, k, NOT_SET);
    };

    OrderedMap.prototype.wasAltered = function() {
      return this._map.wasAltered() || this._list.wasAltered();
    };

    OrderedMap.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._list.__iterate(
        function(entry ) {return entry && fn(entry[1], entry[0], this$0)},
        reverse
      );
    };

    OrderedMap.prototype.__iterator = function(type, reverse) {
      return this._list.fromEntrySeq().__iterator(type, reverse);
    };

    OrderedMap.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      var newMap = this._map.__ensureOwner(ownerID);
      var newList = this._list.__ensureOwner(ownerID);
      if (!ownerID) {
        this.__ownerID = ownerID;
        this._map = newMap;
        this._list = newList;
        return this;
      }
      return makeOrderedMap(newMap, newList, ownerID, this.__hash);
    };


  function isOrderedMap(maybeOrderedMap) {
    return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);
  }

  OrderedMap.isOrderedMap = isOrderedMap;

  OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;
  OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;



  function makeOrderedMap(map, list, ownerID, hash) {
    var omap = Object.create(OrderedMap.prototype);
    omap.size = map ? map.size : 0;
    omap._map = map;
    omap._list = list;
    omap.__ownerID = ownerID;
    omap.__hash = hash;
    return omap;
  }

  var EMPTY_ORDERED_MAP;
  function emptyOrderedMap() {
    return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()));
  }

  function updateOrderedMap(omap, k, v) {
    var map = omap._map;
    var list = omap._list;
    var i = map.get(k);
    var has = i !== undefined;
    var newMap;
    var newList;
    if (v === NOT_SET) { // removed
      if (!has) {
        return omap;
      }
      if (list.size >= SIZE && list.size >= map.size * 2) {
        newList = list.filter(function(entry, idx)  {return entry !== undefined && i !== idx});
        newMap = newList.toKeyedSeq().map(function(entry ) {return entry[0]}).flip().toMap();
        if (omap.__ownerID) {
          newMap.__ownerID = newList.__ownerID = omap.__ownerID;
        }
      } else {
        newMap = map.remove(k);
        newList = i === list.size - 1 ? list.pop() : list.set(i, undefined);
      }
    } else {
      if (has) {
        if (v === list.get(i)[1]) {
          return omap;
        }
        newMap = map;
        newList = list.set(i, [k, v]);
      } else {
        newMap = map.set(k, list.size);
        newList = list.set(list.size, [k, v]);
      }
    }
    if (omap.__ownerID) {
      omap.size = newMap.size;
      omap._map = newMap;
      omap._list = newList;
      omap.__hash = undefined;
      return omap;
    }
    return makeOrderedMap(newMap, newList);
  }

  createClass(ToKeyedSequence, KeyedSeq);
    function ToKeyedSequence(indexed, useKeys) {
      this._iter = indexed;
      this._useKeys = useKeys;
      this.size = indexed.size;
    }

    ToKeyedSequence.prototype.get = function(key, notSetValue) {
      return this._iter.get(key, notSetValue);
    };

    ToKeyedSequence.prototype.has = function(key) {
      return this._iter.has(key);
    };

    ToKeyedSequence.prototype.valueSeq = function() {
      return this._iter.valueSeq();
    };

    ToKeyedSequence.prototype.reverse = function() {var this$0 = this;
      var reversedSequence = reverseFactory(this, true);
      if (!this._useKeys) {
        reversedSequence.valueSeq = function()  {return this$0._iter.toSeq().reverse()};
      }
      return reversedSequence;
    };

    ToKeyedSequence.prototype.map = function(mapper, context) {var this$0 = this;
      var mappedSequence = mapFactory(this, mapper, context);
      if (!this._useKeys) {
        mappedSequence.valueSeq = function()  {return this$0._iter.toSeq().map(mapper, context)};
      }
      return mappedSequence;
    };

    ToKeyedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      var ii;
      return this._iter.__iterate(
        this._useKeys ?
          function(v, k)  {return fn(v, k, this$0)} :
          ((ii = reverse ? resolveSize(this) : 0),
            function(v ) {return fn(v, reverse ? --ii : ii++, this$0)}),
        reverse
      );
    };

    ToKeyedSequence.prototype.__iterator = function(type, reverse) {
      if (this._useKeys) {
        return this._iter.__iterator(type, reverse);
      }
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      var ii = reverse ? resolveSize(this) : 0;
      return new Iterator(function()  {
        var step = iterator.next();
        return step.done ? step :
          iteratorValue(type, reverse ? --ii : ii++, step.value, step);
      });
    };

  ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;


  createClass(ToIndexedSequence, IndexedSeq);
    function ToIndexedSequence(iter) {
      this._iter = iter;
      this.size = iter.size;
    }

    ToIndexedSequence.prototype.includes = function(value) {
      return this._iter.includes(value);
    };

    ToIndexedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      var iterations = 0;
      return this._iter.__iterate(function(v ) {return fn(v, iterations++, this$0)}, reverse);
    };

    ToIndexedSequence.prototype.__iterator = function(type, reverse) {
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      var iterations = 0;
      return new Iterator(function()  {
        var step = iterator.next();
        return step.done ? step :
          iteratorValue(type, iterations++, step.value, step)
      });
    };



  createClass(ToSetSequence, SetSeq);
    function ToSetSequence(iter) {
      this._iter = iter;
      this.size = iter.size;
    }

    ToSetSequence.prototype.has = function(key) {
      return this._iter.includes(key);
    };

    ToSetSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._iter.__iterate(function(v ) {return fn(v, v, this$0)}, reverse);
    };

    ToSetSequence.prototype.__iterator = function(type, reverse) {
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      return new Iterator(function()  {
        var step = iterator.next();
        return step.done ? step :
          iteratorValue(type, step.value, step.value, step);
      });
    };



  createClass(FromEntriesSequence, KeyedSeq);
    function FromEntriesSequence(entries) {
      this._iter = entries;
      this.size = entries.size;
    }

    FromEntriesSequence.prototype.entrySeq = function() {
      return this._iter.toSeq();
    };

    FromEntriesSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._iter.__iterate(function(entry ) {
        // Check if entry exists first so array access doesn't throw for holes
        // in the parent iteration.
        if (entry) {
          validateEntry(entry);
          var indexedIterable = isIterable(entry);
          return fn(
            indexedIterable ? entry.get(1) : entry[1],
            indexedIterable ? entry.get(0) : entry[0],
            this$0
          );
        }
      }, reverse);
    };

    FromEntriesSequence.prototype.__iterator = function(type, reverse) {
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      return new Iterator(function()  {
        while (true) {
          var step = iterator.next();
          if (step.done) {
            return step;
          }
          var entry = step.value;
          // Check if entry exists first so array access doesn't throw for holes
          // in the parent iteration.
          if (entry) {
            validateEntry(entry);
            var indexedIterable = isIterable(entry);
            return iteratorValue(
              type,
              indexedIterable ? entry.get(0) : entry[0],
              indexedIterable ? entry.get(1) : entry[1],
              step
            );
          }
        }
      });
    };


  ToIndexedSequence.prototype.cacheResult =
  ToKeyedSequence.prototype.cacheResult =
  ToSetSequence.prototype.cacheResult =
  FromEntriesSequence.prototype.cacheResult =
    cacheResultThrough;


  function flipFactory(iterable) {
    var flipSequence = makeSequence(iterable);
    flipSequence._iter = iterable;
    flipSequence.size = iterable.size;
    flipSequence.flip = function()  {return iterable};
    flipSequence.reverse = function () {
      var reversedSequence = iterable.reverse.apply(this); // super.reverse()
      reversedSequence.flip = function()  {return iterable.reverse()};
      return reversedSequence;
    };
    flipSequence.has = function(key ) {return iterable.includes(key)};
    flipSequence.includes = function(key ) {return iterable.has(key)};
    flipSequence.cacheResult = cacheResultThrough;
    flipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      return iterable.__iterate(function(v, k)  {return fn(k, v, this$0) !== false}, reverse);
    }
    flipSequence.__iteratorUncached = function(type, reverse) {
      if (type === ITERATE_ENTRIES) {
        var iterator = iterable.__iterator(type, reverse);
        return new Iterator(function()  {
          var step = iterator.next();
          if (!step.done) {
            var k = step.value[0];
            step.value[0] = step.value[1];
            step.value[1] = k;
          }
          return step;
        });
      }
      return iterable.__iterator(
        type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES,
        reverse
      );
    }
    return flipSequence;
  }


  function mapFactory(iterable, mapper, context) {
    var mappedSequence = makeSequence(iterable);
    mappedSequence.size = iterable.size;
    mappedSequence.has = function(key ) {return iterable.has(key)};
    mappedSequence.get = function(key, notSetValue)  {
      var v = iterable.get(key, NOT_SET);
      return v === NOT_SET ?
        notSetValue :
        mapper.call(context, v, key, iterable);
    };
    mappedSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      return iterable.__iterate(
        function(v, k, c)  {return fn(mapper.call(context, v, k, c), k, this$0) !== false},
        reverse
      );
    }
    mappedSequence.__iteratorUncached = function (type, reverse) {
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      return new Iterator(function()  {
        var step = iterator.next();
        if (step.done) {
          return step;
        }
        var entry = step.value;
        var key = entry[0];
        return iteratorValue(
          type,
          key,
          mapper.call(context, entry[1], key, iterable),
          step
        );
      });
    }
    return mappedSequence;
  }


  function reverseFactory(iterable, useKeys) {
    var reversedSequence = makeSequence(iterable);
    reversedSequence._iter = iterable;
    reversedSequence.size = iterable.size;
    reversedSequence.reverse = function()  {return iterable};
    if (iterable.flip) {
      reversedSequence.flip = function () {
        var flipSequence = flipFactory(iterable);
        flipSequence.reverse = function()  {return iterable.flip()};
        return flipSequence;
      };
    }
    reversedSequence.get = function(key, notSetValue) 
      {return iterable.get(useKeys ? key : -1 - key, notSetValue)};
    reversedSequence.has = function(key )
      {return iterable.has(useKeys ? key : -1 - key)};
    reversedSequence.includes = function(value ) {return iterable.includes(value)};
    reversedSequence.cacheResult = cacheResultThrough;
    reversedSequence.__iterate = function (fn, reverse) {var this$0 = this;
      return iterable.__iterate(function(v, k)  {return fn(v, k, this$0)}, !reverse);
    };
    reversedSequence.__iterator =
      function(type, reverse)  {return iterable.__iterator(type, !reverse)};
    return reversedSequence;
  }


  function filterFactory(iterable, predicate, context, useKeys) {
    var filterSequence = makeSequence(iterable);
    if (useKeys) {
      filterSequence.has = function(key ) {
        var v = iterable.get(key, NOT_SET);
        return v !== NOT_SET && !!predicate.call(context, v, key, iterable);
      };
      filterSequence.get = function(key, notSetValue)  {
        var v = iterable.get(key, NOT_SET);
        return v !== NOT_SET && predicate.call(context, v, key, iterable) ?
          v : notSetValue;
      };
    }
    filterSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      var iterations = 0;
      iterable.__iterate(function(v, k, c)  {
        if (predicate.call(context, v, k, c)) {
          iterations++;
          return fn(v, useKeys ? k : iterations - 1, this$0);
        }
      }, reverse);
      return iterations;
    };
    filterSequence.__iteratorUncached = function (type, reverse) {
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      var iterations = 0;
      return new Iterator(function()  {
        while (true) {
          var step = iterator.next();
          if (step.done) {
            return step;
          }
          var entry = step.value;
          var key = entry[0];
          var value = entry[1];
          if (predicate.call(context, value, key, iterable)) {
            return iteratorValue(type, useKeys ? key : iterations++, value, step);
          }
        }
      });
    }
    return filterSequence;
  }


  function countByFactory(iterable, grouper, context) {
    var groups = Map().asMutable();
    iterable.__iterate(function(v, k)  {
      groups.update(
        grouper.call(context, v, k, iterable),
        0,
        function(a ) {return a + 1}
      );
    });
    return groups.asImmutable();
  }


  function groupByFactory(iterable, grouper, context) {
    var isKeyedIter = isKeyed(iterable);
    var groups = (isOrdered(iterable) ? OrderedMap() : Map()).asMutable();
    iterable.__iterate(function(v, k)  {
      groups.update(
        grouper.call(context, v, k, iterable),
        function(a ) {return (a = a || [], a.push(isKeyedIter ? [k, v] : v), a)}
      );
    });
    var coerce = iterableClass(iterable);
    return groups.map(function(arr ) {return reify(iterable, coerce(arr))});
  }


  function sliceFactory(iterable, begin, end, useKeys) {
    var originalSize = iterable.size;

    // Sanitize begin & end using this shorthand for ToInt32(argument)
    // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
    if (begin !== undefined) {
      begin = begin | 0;
    }
    if (end !== undefined) {
      if (end === Infinity) {
        end = originalSize;
      } else {
        end = end | 0;
      }
    }

    if (wholeSlice(begin, end, originalSize)) {
      return iterable;
    }

    var resolvedBegin = resolveBegin(begin, originalSize);
    var resolvedEnd = resolveEnd(end, originalSize);

    // begin or end will be NaN if they were provided as negative numbers and
    // this iterable's size is unknown. In that case, cache first so there is
    // a known size and these do not resolve to NaN.
    if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
      return sliceFactory(iterable.toSeq().cacheResult(), begin, end, useKeys);
    }

    // Note: resolvedEnd is undefined when the original sequence's length is
    // unknown and this slice did not supply an end and should contain all
    // elements after resolvedBegin.
    // In that case, resolvedSize will be NaN and sliceSize will remain undefined.
    var resolvedSize = resolvedEnd - resolvedBegin;
    var sliceSize;
    if (resolvedSize === resolvedSize) {
      sliceSize = resolvedSize < 0 ? 0 : resolvedSize;
    }

    var sliceSeq = makeSequence(iterable);

    // If iterable.size is undefined, the size of the realized sliceSeq is
    // unknown at this point unless the number of items to slice is 0
    sliceSeq.size = sliceSize === 0 ? sliceSize : iterable.size && sliceSize || undefined;

    if (!useKeys && isSeq(iterable) && sliceSize >= 0) {
      sliceSeq.get = function (index, notSetValue) {
        index = wrapIndex(this, index);
        return index >= 0 && index < sliceSize ?
          iterable.get(index + resolvedBegin, notSetValue) :
          notSetValue;
      }
    }

    sliceSeq.__iterateUncached = function(fn, reverse) {var this$0 = this;
      if (sliceSize === 0) {
        return 0;
      }
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var skipped = 0;
      var isSkipping = true;
      var iterations = 0;
      iterable.__iterate(function(v, k)  {
        if (!(isSkipping && (isSkipping = skipped++ < resolvedBegin))) {
          iterations++;
          return fn(v, useKeys ? k : iterations - 1, this$0) !== false &&
                 iterations !== sliceSize;
        }
      });
      return iterations;
    };

    sliceSeq.__iteratorUncached = function(type, reverse) {
      if (sliceSize !== 0 && reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      // Don't bother instantiating parent iterator if taking 0.
      var iterator = sliceSize !== 0 && iterable.__iterator(type, reverse);
      var skipped = 0;
      var iterations = 0;
      return new Iterator(function()  {
        while (skipped++ < resolvedBegin) {
          iterator.next();
        }
        if (++iterations > sliceSize) {
          return iteratorDone();
        }
        var step = iterator.next();
        if (useKeys || type === ITERATE_VALUES) {
          return step;
        } else if (type === ITERATE_KEYS) {
          return iteratorValue(type, iterations - 1, undefined, step);
        } else {
          return iteratorValue(type, iterations - 1, step.value[1], step);
        }
      });
    }

    return sliceSeq;
  }


  function takeWhileFactory(iterable, predicate, context) {
    var takeSequence = makeSequence(iterable);
    takeSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var iterations = 0;
      iterable.__iterate(function(v, k, c) 
        {return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$0)}
      );
      return iterations;
    };
    takeSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      var iterating = true;
      return new Iterator(function()  {
        if (!iterating) {
          return iteratorDone();
        }
        var step = iterator.next();
        if (step.done) {
          return step;
        }
        var entry = step.value;
        var k = entry[0];
        var v = entry[1];
        if (!predicate.call(context, v, k, this$0)) {
          iterating = false;
          return iteratorDone();
        }
        return type === ITERATE_ENTRIES ? step :
          iteratorValue(type, k, v, step);
      });
    };
    return takeSequence;
  }


  function skipWhileFactory(iterable, predicate, context, useKeys) {
    var skipSequence = makeSequence(iterable);
    skipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var isSkipping = true;
      var iterations = 0;
      iterable.__iterate(function(v, k, c)  {
        if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
          iterations++;
          return fn(v, useKeys ? k : iterations - 1, this$0);
        }
      });
      return iterations;
    };
    skipSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      var skipping = true;
      var iterations = 0;
      return new Iterator(function()  {
        var step, k, v;
        do {
          step = iterator.next();
          if (step.done) {
            if (useKeys || type === ITERATE_VALUES) {
              return step;
            } else if (type === ITERATE_KEYS) {
              return iteratorValue(type, iterations++, undefined, step);
            } else {
              return iteratorValue(type, iterations++, step.value[1], step);
            }
          }
          var entry = step.value;
          k = entry[0];
          v = entry[1];
          skipping && (skipping = predicate.call(context, v, k, this$0));
        } while (skipping);
        return type === ITERATE_ENTRIES ? step :
          iteratorValue(type, k, v, step);
      });
    };
    return skipSequence;
  }


  function concatFactory(iterable, values) {
    var isKeyedIterable = isKeyed(iterable);
    var iters = [iterable].concat(values).map(function(v ) {
      if (!isIterable(v)) {
        v = isKeyedIterable ?
          keyedSeqFromValue(v) :
          indexedSeqFromValue(Array.isArray(v) ? v : [v]);
      } else if (isKeyedIterable) {
        v = KeyedIterable(v);
      }
      return v;
    }).filter(function(v ) {return v.size !== 0});

    if (iters.length === 0) {
      return iterable;
    }

    if (iters.length === 1) {
      var singleton = iters[0];
      if (singleton === iterable ||
          isKeyedIterable && isKeyed(singleton) ||
          isIndexed(iterable) && isIndexed(singleton)) {
        return singleton;
      }
    }

    var concatSeq = new ArraySeq(iters);
    if (isKeyedIterable) {
      concatSeq = concatSeq.toKeyedSeq();
    } else if (!isIndexed(iterable)) {
      concatSeq = concatSeq.toSetSeq();
    }
    concatSeq = concatSeq.flatten(true);
    concatSeq.size = iters.reduce(
      function(sum, seq)  {
        if (sum !== undefined) {
          var size = seq.size;
          if (size !== undefined) {
            return sum + size;
          }
        }
      },
      0
    );
    return concatSeq;
  }


  function flattenFactory(iterable, depth, useKeys) {
    var flatSequence = makeSequence(iterable);
    flatSequence.__iterateUncached = function(fn, reverse) {
      var iterations = 0;
      var stopped = false;
      function flatDeep(iter, currentDepth) {var this$0 = this;
        iter.__iterate(function(v, k)  {
          if ((!depth || currentDepth < depth) && isIterable(v)) {
            flatDeep(v, currentDepth + 1);
          } else if (fn(v, useKeys ? k : iterations++, this$0) === false) {
            stopped = true;
          }
          return !stopped;
        }, reverse);
      }
      flatDeep(iterable, 0);
      return iterations;
    }
    flatSequence.__iteratorUncached = function(type, reverse) {
      var iterator = iterable.__iterator(type, reverse);
      var stack = [];
      var iterations = 0;
      return new Iterator(function()  {
        while (iterator) {
          var step = iterator.next();
          if (step.done !== false) {
            iterator = stack.pop();
            continue;
          }
          var v = step.value;
          if (type === ITERATE_ENTRIES) {
            v = v[1];
          }
          if ((!depth || stack.length < depth) && isIterable(v)) {
            stack.push(iterator);
            iterator = v.__iterator(type, reverse);
          } else {
            return useKeys ? step : iteratorValue(type, iterations++, v, step);
          }
        }
        return iteratorDone();
      });
    }
    return flatSequence;
  }


  function flatMapFactory(iterable, mapper, context) {
    var coerce = iterableClass(iterable);
    return iterable.toSeq().map(
      function(v, k)  {return coerce(mapper.call(context, v, k, iterable))}
    ).flatten(true);
  }


  function interposeFactory(iterable, separator) {
    var interposedSequence = makeSequence(iterable);
    interposedSequence.size = iterable.size && iterable.size * 2 -1;
    interposedSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
      var iterations = 0;
      iterable.__iterate(function(v, k) 
        {return (!iterations || fn(separator, iterations++, this$0) !== false) &&
        fn(v, iterations++, this$0) !== false},
        reverse
      );
      return iterations;
    };
    interposedSequence.__iteratorUncached = function(type, reverse) {
      var iterator = iterable.__iterator(ITERATE_VALUES, reverse);
      var iterations = 0;
      var step;
      return new Iterator(function()  {
        if (!step || iterations % 2) {
          step = iterator.next();
          if (step.done) {
            return step;
          }
        }
        return iterations % 2 ?
          iteratorValue(type, iterations++, separator) :
          iteratorValue(type, iterations++, step.value, step);
      });
    };
    return interposedSequence;
  }


  function sortFactory(iterable, comparator, mapper) {
    if (!comparator) {
      comparator = defaultComparator;
    }
    var isKeyedIterable = isKeyed(iterable);
    var index = 0;
    var entries = iterable.toSeq().map(
      function(v, k)  {return [k, v, index++, mapper ? mapper(v, k, iterable) : v]}
    ).toArray();
    entries.sort(function(a, b)  {return comparator(a[3], b[3]) || a[2] - b[2]}).forEach(
      isKeyedIterable ?
      function(v, i)  { entries[i].length = 2; } :
      function(v, i)  { entries[i] = v[1]; }
    );
    return isKeyedIterable ? KeyedSeq(entries) :
      isIndexed(iterable) ? IndexedSeq(entries) :
      SetSeq(entries);
  }


  function maxFactory(iterable, comparator, mapper) {
    if (!comparator) {
      comparator = defaultComparator;
    }
    if (mapper) {
      var entry = iterable.toSeq()
        .map(function(v, k)  {return [v, mapper(v, k, iterable)]})
        .reduce(function(a, b)  {return maxCompare(comparator, a[1], b[1]) ? b : a});
      return entry && entry[0];
    } else {
      return iterable.reduce(function(a, b)  {return maxCompare(comparator, a, b) ? b : a});
    }
  }

  function maxCompare(comparator, a, b) {
    var comp = comparator(b, a);
    // b is considered the new max if the comparator declares them equal, but
    // they are not equal and b is in fact a nullish value.
    return (comp === 0 && b !== a && (b === undefined || b === null || b !== b)) || comp > 0;
  }


  function zipWithFactory(keyIter, zipper, iters) {
    var zipSequence = makeSequence(keyIter);
    zipSequence.size = new ArraySeq(iters).map(function(i ) {return i.size}).min();
    // Note: this a generic base implementation of __iterate in terms of
    // __iterator which may be more generically useful in the future.
    zipSequence.__iterate = function(fn, reverse) {
      /* generic:
      var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
      var step;
      var iterations = 0;
      while (!(step = iterator.next()).done) {
        iterations++;
        if (fn(step.value[1], step.value[0], this) === false) {
          break;
        }
      }
      return iterations;
      */
      // indexed:
      var iterator = this.__iterator(ITERATE_VALUES, reverse);
      var step;
      var iterations = 0;
      while (!(step = iterator.next()).done) {
        if (fn(step.value, iterations++, this) === false) {
          break;
        }
      }
      return iterations;
    };
    zipSequence.__iteratorUncached = function(type, reverse) {
      var iterators = iters.map(function(i )
        {return (i = Iterable(i), getIterator(reverse ? i.reverse() : i))}
      );
      var iterations = 0;
      var isDone = false;
      return new Iterator(function()  {
        var steps;
        if (!isDone) {
          steps = iterators.map(function(i ) {return i.next()});
          isDone = steps.some(function(s ) {return s.done});
        }
        if (isDone) {
          return iteratorDone();
        }
        return iteratorValue(
          type,
          iterations++,
          zipper.apply(null, steps.map(function(s ) {return s.value}))
        );
      });
    };
    return zipSequence
  }


  // #pragma Helper Functions

  function reify(iter, seq) {
    return isSeq(iter) ? seq : iter.constructor(seq);
  }

  function validateEntry(entry) {
    if (entry !== Object(entry)) {
      throw new TypeError('Expected [K, V] tuple: ' + entry);
    }
  }

  function resolveSize(iter) {
    assertNotInfinite(iter.size);
    return ensureSize(iter);
  }

  function iterableClass(iterable) {
    return isKeyed(iterable) ? KeyedIterable :
      isIndexed(iterable) ? IndexedIterable :
      SetIterable;
  }

  function makeSequence(iterable) {
    return Object.create(
      (
        isKeyed(iterable) ? KeyedSeq :
        isIndexed(iterable) ? IndexedSeq :
        SetSeq
      ).prototype
    );
  }

  function cacheResultThrough() {
    if (this._iter.cacheResult) {
      this._iter.cacheResult();
      this.size = this._iter.size;
      return this;
    } else {
      return Seq.prototype.cacheResult.call(this);
    }
  }

  function defaultComparator(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
  }

  function forceIterator(keyPath) {
    var iter = getIterator(keyPath);
    if (!iter) {
      // Array might not be iterable in this environment, so we need a fallback
      // to our wrapped type.
      if (!isArrayLike(keyPath)) {
        throw new TypeError('Expected iterable or array-like: ' + keyPath);
      }
      iter = getIterator(Iterable(keyPath));
    }
    return iter;
  }

  createClass(Record, KeyedCollection);

    function Record(defaultValues, name) {
      var hasInitialized;

      var RecordType = function Record(values) {
        if (values instanceof RecordType) {
          return values;
        }
        if (!(this instanceof RecordType)) {
          return new RecordType(values);
        }
        if (!hasInitialized) {
          hasInitialized = true;
          var keys = Object.keys(defaultValues);
          setProps(RecordTypePrototype, keys);
          RecordTypePrototype.size = keys.length;
          RecordTypePrototype._name = name;
          RecordTypePrototype._keys = keys;
          RecordTypePrototype._defaultValues = defaultValues;
        }
        this._map = Map(values);
      };

      var RecordTypePrototype = RecordType.prototype = Object.create(RecordPrototype);
      RecordTypePrototype.constructor = RecordType;

      return RecordType;
    }

    Record.prototype.toString = function() {
      return this.__toString(recordName(this) + ' {', '}');
    };

    // @pragma Access

    Record.prototype.has = function(k) {
      return this._defaultValues.hasOwnProperty(k);
    };

    Record.prototype.get = function(k, notSetValue) {
      if (!this.has(k)) {
        return notSetValue;
      }
      var defaultVal = this._defaultValues[k];
      return this._map ? this._map.get(k, defaultVal) : defaultVal;
    };

    // @pragma Modification

    Record.prototype.clear = function() {
      if (this.__ownerID) {
        this._map && this._map.clear();
        return this;
      }
      var RecordType = this.constructor;
      return RecordType._empty || (RecordType._empty = makeRecord(this, emptyMap()));
    };

    Record.prototype.set = function(k, v) {
      if (!this.has(k)) {
        throw new Error('Cannot set unknown key "' + k + '" on ' + recordName(this));
      }
      if (this._map && !this._map.has(k)) {
        var defaultVal = this._defaultValues[k];
        if (v === defaultVal) {
          return this;
        }
      }
      var newMap = this._map && this._map.set(k, v);
      if (this.__ownerID || newMap === this._map) {
        return this;
      }
      return makeRecord(this, newMap);
    };

    Record.prototype.remove = function(k) {
      if (!this.has(k)) {
        return this;
      }
      var newMap = this._map && this._map.remove(k);
      if (this.__ownerID || newMap === this._map) {
        return this;
      }
      return makeRecord(this, newMap);
    };

    Record.prototype.wasAltered = function() {
      return this._map.wasAltered();
    };

    Record.prototype.__iterator = function(type, reverse) {var this$0 = this;
      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterator(type, reverse);
    };

    Record.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterate(fn, reverse);
    };

    Record.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      var newMap = this._map && this._map.__ensureOwner(ownerID);
      if (!ownerID) {
        this.__ownerID = ownerID;
        this._map = newMap;
        return this;
      }
      return makeRecord(this, newMap, ownerID);
    };


  var RecordPrototype = Record.prototype;
  RecordPrototype[DELETE] = RecordPrototype.remove;
  RecordPrototype.deleteIn =
  RecordPrototype.removeIn = MapPrototype.removeIn;
  RecordPrototype.merge = MapPrototype.merge;
  RecordPrototype.mergeWith = MapPrototype.mergeWith;
  RecordPrototype.mergeIn = MapPrototype.mergeIn;
  RecordPrototype.mergeDeep = MapPrototype.mergeDeep;
  RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;
  RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
  RecordPrototype.setIn = MapPrototype.setIn;
  RecordPrototype.update = MapPrototype.update;
  RecordPrototype.updateIn = MapPrototype.updateIn;
  RecordPrototype.withMutations = MapPrototype.withMutations;
  RecordPrototype.asMutable = MapPrototype.asMutable;
  RecordPrototype.asImmutable = MapPrototype.asImmutable;


  function makeRecord(likeRecord, map, ownerID) {
    var record = Object.create(Object.getPrototypeOf(likeRecord));
    record._map = map;
    record.__ownerID = ownerID;
    return record;
  }

  function recordName(record) {
    return record._name || record.constructor.name || 'Record';
  }

  function setProps(prototype, names) {
    try {
      names.forEach(setProp.bind(undefined, prototype));
    } catch (error) {
      // Object.defineProperty failed. Probably IE8.
    }
  }

  function setProp(prototype, name) {
    Object.defineProperty(prototype, name, {
      get: function() {
        return this.get(name);
      },
      set: function(value) {
        invariant(this.__ownerID, 'Cannot set on an immutable record.');
        this.set(name, value);
      }
    });
  }

  createClass(Set, SetCollection);

    // @pragma Construction

    function Set(value) {
      return value === null || value === undefined ? emptySet() :
        isSet(value) && !isOrdered(value) ? value :
        emptySet().withMutations(function(set ) {
          var iter = SetIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v ) {return set.add(v)});
        });
    }

    Set.of = function(/*...values*/) {
      return this(arguments);
    };

    Set.fromKeys = function(value) {
      return this(KeyedIterable(value).keySeq());
    };

    Set.prototype.toString = function() {
      return this.__toString('Set {', '}');
    };

    // @pragma Access

    Set.prototype.has = function(value) {
      return this._map.has(value);
    };

    // @pragma Modification

    Set.prototype.add = function(value) {
      return updateSet(this, this._map.set(value, true));
    };

    Set.prototype.remove = function(value) {
      return updateSet(this, this._map.remove(value));
    };

    Set.prototype.clear = function() {
      return updateSet(this, this._map.clear());
    };

    // @pragma Composition

    Set.prototype.union = function() {var iters = SLICE$0.call(arguments, 0);
      iters = iters.filter(function(x ) {return x.size !== 0});
      if (iters.length === 0) {
        return this;
      }
      if (this.size === 0 && !this.__ownerID && iters.length === 1) {
        return this.constructor(iters[0]);
      }
      return this.withMutations(function(set ) {
        for (var ii = 0; ii < iters.length; ii++) {
          SetIterable(iters[ii]).forEach(function(value ) {return set.add(value)});
        }
      });
    };

    Set.prototype.intersect = function() {var iters = SLICE$0.call(arguments, 0);
      if (iters.length === 0) {
        return this;
      }
      iters = iters.map(function(iter ) {return SetIterable(iter)});
      var originalSet = this;
      return this.withMutations(function(set ) {
        originalSet.forEach(function(value ) {
          if (!iters.every(function(iter ) {return iter.includes(value)})) {
            set.remove(value);
          }
        });
      });
    };

    Set.prototype.subtract = function() {var iters = SLICE$0.call(arguments, 0);
      if (iters.length === 0) {
        return this;
      }
      iters = iters.map(function(iter ) {return SetIterable(iter)});
      var originalSet = this;
      return this.withMutations(function(set ) {
        originalSet.forEach(function(value ) {
          if (iters.some(function(iter ) {return iter.includes(value)})) {
            set.remove(value);
          }
        });
      });
    };

    Set.prototype.merge = function() {
      return this.union.apply(this, arguments);
    };

    Set.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return this.union.apply(this, iters);
    };

    Set.prototype.sort = function(comparator) {
      // Late binding
      return OrderedSet(sortFactory(this, comparator));
    };

    Set.prototype.sortBy = function(mapper, comparator) {
      // Late binding
      return OrderedSet(sortFactory(this, comparator, mapper));
    };

    Set.prototype.wasAltered = function() {
      return this._map.wasAltered();
    };

    Set.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._map.__iterate(function(_, k)  {return fn(k, k, this$0)}, reverse);
    };

    Set.prototype.__iterator = function(type, reverse) {
      return this._map.map(function(_, k)  {return k}).__iterator(type, reverse);
    };

    Set.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      var newMap = this._map.__ensureOwner(ownerID);
      if (!ownerID) {
        this.__ownerID = ownerID;
        this._map = newMap;
        return this;
      }
      return this.__make(newMap, ownerID);
    };


  function isSet(maybeSet) {
    return !!(maybeSet && maybeSet[IS_SET_SENTINEL]);
  }

  Set.isSet = isSet;

  var IS_SET_SENTINEL = '@@__IMMUTABLE_SET__@@';

  var SetPrototype = Set.prototype;
  SetPrototype[IS_SET_SENTINEL] = true;
  SetPrototype[DELETE] = SetPrototype.remove;
  SetPrototype.mergeDeep = SetPrototype.merge;
  SetPrototype.mergeDeepWith = SetPrototype.mergeWith;
  SetPrototype.withMutations = MapPrototype.withMutations;
  SetPrototype.asMutable = MapPrototype.asMutable;
  SetPrototype.asImmutable = MapPrototype.asImmutable;

  SetPrototype.__empty = emptySet;
  SetPrototype.__make = makeSet;

  function updateSet(set, newMap) {
    if (set.__ownerID) {
      set.size = newMap.size;
      set._map = newMap;
      return set;
    }
    return newMap === set._map ? set :
      newMap.size === 0 ? set.__empty() :
      set.__make(newMap);
  }

  function makeSet(map, ownerID) {
    var set = Object.create(SetPrototype);
    set.size = map ? map.size : 0;
    set._map = map;
    set.__ownerID = ownerID;
    return set;
  }

  var EMPTY_SET;
  function emptySet() {
    return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));
  }

  createClass(OrderedSet, Set);

    // @pragma Construction

    function OrderedSet(value) {
      return value === null || value === undefined ? emptyOrderedSet() :
        isOrderedSet(value) ? value :
        emptyOrderedSet().withMutations(function(set ) {
          var iter = SetIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v ) {return set.add(v)});
        });
    }

    OrderedSet.of = function(/*...values*/) {
      return this(arguments);
    };

    OrderedSet.fromKeys = function(value) {
      return this(KeyedIterable(value).keySeq());
    };

    OrderedSet.prototype.toString = function() {
      return this.__toString('OrderedSet {', '}');
    };


  function isOrderedSet(maybeOrderedSet) {
    return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
  }

  OrderedSet.isOrderedSet = isOrderedSet;

  var OrderedSetPrototype = OrderedSet.prototype;
  OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;

  OrderedSetPrototype.__empty = emptyOrderedSet;
  OrderedSetPrototype.__make = makeOrderedSet;

  function makeOrderedSet(map, ownerID) {
    var set = Object.create(OrderedSetPrototype);
    set.size = map ? map.size : 0;
    set._map = map;
    set.__ownerID = ownerID;
    return set;
  }

  var EMPTY_ORDERED_SET;
  function emptyOrderedSet() {
    return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));
  }

  createClass(Stack, IndexedCollection);

    // @pragma Construction

    function Stack(value) {
      return value === null || value === undefined ? emptyStack() :
        isStack(value) ? value :
        emptyStack().unshiftAll(value);
    }

    Stack.of = function(/*...values*/) {
      return this(arguments);
    };

    Stack.prototype.toString = function() {
      return this.__toString('Stack [', ']');
    };

    // @pragma Access

    Stack.prototype.get = function(index, notSetValue) {
      var head = this._head;
      index = wrapIndex(this, index);
      while (head && index--) {
        head = head.next;
      }
      return head ? head.value : notSetValue;
    };

    Stack.prototype.peek = function() {
      return this._head && this._head.value;
    };

    // @pragma Modification

    Stack.prototype.push = function(/*...values*/) {
      if (arguments.length === 0) {
        return this;
      }
      var newSize = this.size + arguments.length;
      var head = this._head;
      for (var ii = arguments.length - 1; ii >= 0; ii--) {
        head = {
          value: arguments[ii],
          next: head
        };
      }
      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return makeStack(newSize, head);
    };

    Stack.prototype.pushAll = function(iter) {
      iter = IndexedIterable(iter);
      if (iter.size === 0) {
        return this;
      }
      assertNotInfinite(iter.size);
      var newSize = this.size;
      var head = this._head;
      iter.reverse().forEach(function(value ) {
        newSize++;
        head = {
          value: value,
          next: head
        };
      });
      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return makeStack(newSize, head);
    };

    Stack.prototype.pop = function() {
      return this.slice(1);
    };

    Stack.prototype.unshift = function(/*...values*/) {
      return this.push.apply(this, arguments);
    };

    Stack.prototype.unshiftAll = function(iter) {
      return this.pushAll(iter);
    };

    Stack.prototype.shift = function() {
      return this.pop.apply(this, arguments);
    };

    Stack.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = 0;
        this._head = undefined;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return emptyStack();
    };

    Stack.prototype.slice = function(begin, end) {
      if (wholeSlice(begin, end, this.size)) {
        return this;
      }
      var resolvedBegin = resolveBegin(begin, this.size);
      var resolvedEnd = resolveEnd(end, this.size);
      if (resolvedEnd !== this.size) {
        // super.slice(begin, end);
        return IndexedCollection.prototype.slice.call(this, begin, end);
      }
      var newSize = this.size - resolvedBegin;
      var head = this._head;
      while (resolvedBegin--) {
        head = head.next;
      }
      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return makeStack(newSize, head);
    };

    // @pragma Mutability

    Stack.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      if (!ownerID) {
        this.__ownerID = ownerID;
        this.__altered = false;
        return this;
      }
      return makeStack(this.size, this._head, ownerID, this.__hash);
    };

    // @pragma Iteration

    Stack.prototype.__iterate = function(fn, reverse) {
      if (reverse) {
        return this.reverse().__iterate(fn);
      }
      var iterations = 0;
      var node = this._head;
      while (node) {
        if (fn(node.value, iterations++, this) === false) {
          break;
        }
        node = node.next;
      }
      return iterations;
    };

    Stack.prototype.__iterator = function(type, reverse) {
      if (reverse) {
        return this.reverse().__iterator(type);
      }
      var iterations = 0;
      var node = this._head;
      return new Iterator(function()  {
        if (node) {
          var value = node.value;
          node = node.next;
          return iteratorValue(type, iterations++, value);
        }
        return iteratorDone();
      });
    };


  function isStack(maybeStack) {
    return !!(maybeStack && maybeStack[IS_STACK_SENTINEL]);
  }

  Stack.isStack = isStack;

  var IS_STACK_SENTINEL = '@@__IMMUTABLE_STACK__@@';

  var StackPrototype = Stack.prototype;
  StackPrototype[IS_STACK_SENTINEL] = true;
  StackPrototype.withMutations = MapPrototype.withMutations;
  StackPrototype.asMutable = MapPrototype.asMutable;
  StackPrototype.asImmutable = MapPrototype.asImmutable;
  StackPrototype.wasAltered = MapPrototype.wasAltered;


  function makeStack(size, head, ownerID, hash) {
    var map = Object.create(StackPrototype);
    map.size = size;
    map._head = head;
    map.__ownerID = ownerID;
    map.__hash = hash;
    map.__altered = false;
    return map;
  }

  var EMPTY_STACK;
  function emptyStack() {
    return EMPTY_STACK || (EMPTY_STACK = makeStack(0));
  }

  /**
   * Contributes additional methods to a constructor
   */
  function mixin(ctor, methods) {
    var keyCopier = function(key ) { ctor.prototype[key] = methods[key]; };
    Object.keys(methods).forEach(keyCopier);
    Object.getOwnPropertySymbols &&
      Object.getOwnPropertySymbols(methods).forEach(keyCopier);
    return ctor;
  }

  Iterable.Iterator = Iterator;

  mixin(Iterable, {

    // ### Conversion to other types

    toArray: function() {
      assertNotInfinite(this.size);
      var array = new Array(this.size || 0);
      this.valueSeq().__iterate(function(v, i)  { array[i] = v; });
      return array;
    },

    toIndexedSeq: function() {
      return new ToIndexedSequence(this);
    },

    toJS: function() {
      return this.toSeq().map(
        function(value ) {return value && typeof value.toJS === 'function' ? value.toJS() : value}
      ).__toJS();
    },

    toJSON: function() {
      return this.toSeq().map(
        function(value ) {return value && typeof value.toJSON === 'function' ? value.toJSON() : value}
      ).__toJS();
    },

    toKeyedSeq: function() {
      return new ToKeyedSequence(this, true);
    },

    toMap: function() {
      // Use Late Binding here to solve the circular dependency.
      return Map(this.toKeyedSeq());
    },

    toObject: function() {
      assertNotInfinite(this.size);
      var object = {};
      this.__iterate(function(v, k)  { object[k] = v; });
      return object;
    },

    toOrderedMap: function() {
      // Use Late Binding here to solve the circular dependency.
      return OrderedMap(this.toKeyedSeq());
    },

    toOrderedSet: function() {
      // Use Late Binding here to solve the circular dependency.
      return OrderedSet(isKeyed(this) ? this.valueSeq() : this);
    },

    toSet: function() {
      // Use Late Binding here to solve the circular dependency.
      return Set(isKeyed(this) ? this.valueSeq() : this);
    },

    toSetSeq: function() {
      return new ToSetSequence(this);
    },

    toSeq: function() {
      return isIndexed(this) ? this.toIndexedSeq() :
        isKeyed(this) ? this.toKeyedSeq() :
        this.toSetSeq();
    },

    toStack: function() {
      // Use Late Binding here to solve the circular dependency.
      return Stack(isKeyed(this) ? this.valueSeq() : this);
    },

    toList: function() {
      // Use Late Binding here to solve the circular dependency.
      return List(isKeyed(this) ? this.valueSeq() : this);
    },


    // ### Common JavaScript methods and properties

    toString: function() {
      return '[Iterable]';
    },

    __toString: function(head, tail) {
      if (this.size === 0) {
        return head + tail;
      }
      return head + ' ' + this.toSeq().map(this.__toStringMapper).join(', ') + ' ' + tail;
    },


    // ### ES6 Collection methods (ES6 Array and Map)

    concat: function() {var values = SLICE$0.call(arguments, 0);
      return reify(this, concatFactory(this, values));
    },

    includes: function(searchValue) {
      return this.some(function(value ) {return is(value, searchValue)});
    },

    entries: function() {
      return this.__iterator(ITERATE_ENTRIES);
    },

    every: function(predicate, context) {
      assertNotInfinite(this.size);
      var returnValue = true;
      this.__iterate(function(v, k, c)  {
        if (!predicate.call(context, v, k, c)) {
          returnValue = false;
          return false;
        }
      });
      return returnValue;
    },

    filter: function(predicate, context) {
      return reify(this, filterFactory(this, predicate, context, true));
    },

    find: function(predicate, context, notSetValue) {
      var entry = this.findEntry(predicate, context);
      return entry ? entry[1] : notSetValue;
    },

    forEach: function(sideEffect, context) {
      assertNotInfinite(this.size);
      return this.__iterate(context ? sideEffect.bind(context) : sideEffect);
    },

    join: function(separator) {
      assertNotInfinite(this.size);
      separator = separator !== undefined ? '' + separator : ',';
      var joined = '';
      var isFirst = true;
      this.__iterate(function(v ) {
        isFirst ? (isFirst = false) : (joined += separator);
        joined += v !== null && v !== undefined ? v.toString() : '';
      });
      return joined;
    },

    keys: function() {
      return this.__iterator(ITERATE_KEYS);
    },

    map: function(mapper, context) {
      return reify(this, mapFactory(this, mapper, context));
    },

    reduce: function(reducer, initialReduction, context) {
      assertNotInfinite(this.size);
      var reduction;
      var useFirst;
      if (arguments.length < 2) {
        useFirst = true;
      } else {
        reduction = initialReduction;
      }
      this.__iterate(function(v, k, c)  {
        if (useFirst) {
          useFirst = false;
          reduction = v;
        } else {
          reduction = reducer.call(context, reduction, v, k, c);
        }
      });
      return reduction;
    },

    reduceRight: function(reducer, initialReduction, context) {
      var reversed = this.toKeyedSeq().reverse();
      return reversed.reduce.apply(reversed, arguments);
    },

    reverse: function() {
      return reify(this, reverseFactory(this, true));
    },

    slice: function(begin, end) {
      return reify(this, sliceFactory(this, begin, end, true));
    },

    some: function(predicate, context) {
      return !this.every(not(predicate), context);
    },

    sort: function(comparator) {
      return reify(this, sortFactory(this, comparator));
    },

    values: function() {
      return this.__iterator(ITERATE_VALUES);
    },


    // ### More sequential methods

    butLast: function() {
      return this.slice(0, -1);
    },

    isEmpty: function() {
      return this.size !== undefined ? this.size === 0 : !this.some(function()  {return true});
    },

    count: function(predicate, context) {
      return ensureSize(
        predicate ? this.toSeq().filter(predicate, context) : this
      );
    },

    countBy: function(grouper, context) {
      return countByFactory(this, grouper, context);
    },

    equals: function(other) {
      return deepEqual(this, other);
    },

    entrySeq: function() {
      var iterable = this;
      if (iterable._cache) {
        // We cache as an entries array, so we can just return the cache!
        return new ArraySeq(iterable._cache);
      }
      var entriesSequence = iterable.toSeq().map(entryMapper).toIndexedSeq();
      entriesSequence.fromEntrySeq = function()  {return iterable.toSeq()};
      return entriesSequence;
    },

    filterNot: function(predicate, context) {
      return this.filter(not(predicate), context);
    },

    findEntry: function(predicate, context, notSetValue) {
      var found = notSetValue;
      this.__iterate(function(v, k, c)  {
        if (predicate.call(context, v, k, c)) {
          found = [k, v];
          return false;
        }
      });
      return found;
    },

    findKey: function(predicate, context) {
      var entry = this.findEntry(predicate, context);
      return entry && entry[0];
    },

    findLast: function(predicate, context, notSetValue) {
      return this.toKeyedSeq().reverse().find(predicate, context, notSetValue);
    },

    findLastEntry: function(predicate, context, notSetValue) {
      return this.toKeyedSeq().reverse().findEntry(predicate, context, notSetValue);
    },

    findLastKey: function(predicate, context) {
      return this.toKeyedSeq().reverse().findKey(predicate, context);
    },

    first: function() {
      return this.find(returnTrue);
    },

    flatMap: function(mapper, context) {
      return reify(this, flatMapFactory(this, mapper, context));
    },

    flatten: function(depth) {
      return reify(this, flattenFactory(this, depth, true));
    },

    fromEntrySeq: function() {
      return new FromEntriesSequence(this);
    },

    get: function(searchKey, notSetValue) {
      return this.find(function(_, key)  {return is(key, searchKey)}, undefined, notSetValue);
    },

    getIn: function(searchKeyPath, notSetValue) {
      var nested = this;
      // Note: in an ES6 environment, we would prefer:
      // for (var key of searchKeyPath) {
      var iter = forceIterator(searchKeyPath);
      var step;
      while (!(step = iter.next()).done) {
        var key = step.value;
        nested = nested && nested.get ? nested.get(key, NOT_SET) : NOT_SET;
        if (nested === NOT_SET) {
          return notSetValue;
        }
      }
      return nested;
    },

    groupBy: function(grouper, context) {
      return groupByFactory(this, grouper, context);
    },

    has: function(searchKey) {
      return this.get(searchKey, NOT_SET) !== NOT_SET;
    },

    hasIn: function(searchKeyPath) {
      return this.getIn(searchKeyPath, NOT_SET) !== NOT_SET;
    },

    isSubset: function(iter) {
      iter = typeof iter.includes === 'function' ? iter : Iterable(iter);
      return this.every(function(value ) {return iter.includes(value)});
    },

    isSuperset: function(iter) {
      iter = typeof iter.isSubset === 'function' ? iter : Iterable(iter);
      return iter.isSubset(this);
    },

    keyOf: function(searchValue) {
      return this.findKey(function(value ) {return is(value, searchValue)});
    },

    keySeq: function() {
      return this.toSeq().map(keyMapper).toIndexedSeq();
    },

    last: function() {
      return this.toSeq().reverse().first();
    },

    lastKeyOf: function(searchValue) {
      return this.toKeyedSeq().reverse().keyOf(searchValue);
    },

    max: function(comparator) {
      return maxFactory(this, comparator);
    },

    maxBy: function(mapper, comparator) {
      return maxFactory(this, comparator, mapper);
    },

    min: function(comparator) {
      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator);
    },

    minBy: function(mapper, comparator) {
      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator, mapper);
    },

    rest: function() {
      return this.slice(1);
    },

    skip: function(amount) {
      return this.slice(Math.max(0, amount));
    },

    skipLast: function(amount) {
      return reify(this, this.toSeq().reverse().skip(amount).reverse());
    },

    skipWhile: function(predicate, context) {
      return reify(this, skipWhileFactory(this, predicate, context, true));
    },

    skipUntil: function(predicate, context) {
      return this.skipWhile(not(predicate), context);
    },

    sortBy: function(mapper, comparator) {
      return reify(this, sortFactory(this, comparator, mapper));
    },

    take: function(amount) {
      return this.slice(0, Math.max(0, amount));
    },

    takeLast: function(amount) {
      return reify(this, this.toSeq().reverse().take(amount).reverse());
    },

    takeWhile: function(predicate, context) {
      return reify(this, takeWhileFactory(this, predicate, context));
    },

    takeUntil: function(predicate, context) {
      return this.takeWhile(not(predicate), context);
    },

    valueSeq: function() {
      return this.toIndexedSeq();
    },


    // ### Hashable Object

    hashCode: function() {
      return this.__hash || (this.__hash = hashIterable(this));
    }


    // ### Internal

    // abstract __iterate(fn, reverse)

    // abstract __iterator(type, reverse)
  });

  // var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
  // var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
  // var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
  // var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';

  var IterablePrototype = Iterable.prototype;
  IterablePrototype[IS_ITERABLE_SENTINEL] = true;
  IterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.values;
  IterablePrototype.__toJS = IterablePrototype.toArray;
  IterablePrototype.__toStringMapper = quoteString;
  IterablePrototype.inspect =
  IterablePrototype.toSource = function() { return this.toString(); };
  IterablePrototype.chain = IterablePrototype.flatMap;
  IterablePrototype.contains = IterablePrototype.includes;

  mixin(KeyedIterable, {

    // ### More sequential methods

    flip: function() {
      return reify(this, flipFactory(this));
    },

    mapEntries: function(mapper, context) {var this$0 = this;
      var iterations = 0;
      return reify(this,
        this.toSeq().map(
          function(v, k)  {return mapper.call(context, [k, v], iterations++, this$0)}
        ).fromEntrySeq()
      );
    },

    mapKeys: function(mapper, context) {var this$0 = this;
      return reify(this,
        this.toSeq().flip().map(
          function(k, v)  {return mapper.call(context, k, v, this$0)}
        ).flip()
      );
    }

  });

  var KeyedIterablePrototype = KeyedIterable.prototype;
  KeyedIterablePrototype[IS_KEYED_SENTINEL] = true;
  KeyedIterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.entries;
  KeyedIterablePrototype.__toJS = IterablePrototype.toObject;
  KeyedIterablePrototype.__toStringMapper = function(v, k)  {return JSON.stringify(k) + ': ' + quoteString(v)};



  mixin(IndexedIterable, {

    // ### Conversion to other types

    toKeyedSeq: function() {
      return new ToKeyedSequence(this, false);
    },


    // ### ES6 Collection methods (ES6 Array and Map)

    filter: function(predicate, context) {
      return reify(this, filterFactory(this, predicate, context, false));
    },

    findIndex: function(predicate, context) {
      var entry = this.findEntry(predicate, context);
      return entry ? entry[0] : -1;
    },

    indexOf: function(searchValue) {
      var key = this.keyOf(searchValue);
      return key === undefined ? -1 : key;
    },

    lastIndexOf: function(searchValue) {
      var key = this.lastKeyOf(searchValue);
      return key === undefined ? -1 : key;
    },

    reverse: function() {
      return reify(this, reverseFactory(this, false));
    },

    slice: function(begin, end) {
      return reify(this, sliceFactory(this, begin, end, false));
    },

    splice: function(index, removeNum /*, ...values*/) {
      var numArgs = arguments.length;
      removeNum = Math.max(removeNum | 0, 0);
      if (numArgs === 0 || (numArgs === 2 && !removeNum)) {
        return this;
      }
      // If index is negative, it should resolve relative to the size of the
      // collection. However size may be expensive to compute if not cached, so
      // only call count() if the number is in fact negative.
      index = resolveBegin(index, index < 0 ? this.count() : this.size);
      var spliced = this.slice(0, index);
      return reify(
        this,
        numArgs === 1 ?
          spliced :
          spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum))
      );
    },


    // ### More collection methods

    findLastIndex: function(predicate, context) {
      var entry = this.findLastEntry(predicate, context);
      return entry ? entry[0] : -1;
    },

    first: function() {
      return this.get(0);
    },

    flatten: function(depth) {
      return reify(this, flattenFactory(this, depth, false));
    },

    get: function(index, notSetValue) {
      index = wrapIndex(this, index);
      return (index < 0 || (this.size === Infinity ||
          (this.size !== undefined && index > this.size))) ?
        notSetValue :
        this.find(function(_, key)  {return key === index}, undefined, notSetValue);
    },

    has: function(index) {
      index = wrapIndex(this, index);
      return index >= 0 && (this.size !== undefined ?
        this.size === Infinity || index < this.size :
        this.indexOf(index) !== -1
      );
    },

    interpose: function(separator) {
      return reify(this, interposeFactory(this, separator));
    },

    interleave: function(/*...iterables*/) {
      var iterables = [this].concat(arrCopy(arguments));
      var zipped = zipWithFactory(this.toSeq(), IndexedSeq.of, iterables);
      var interleaved = zipped.flatten(true);
      if (zipped.size) {
        interleaved.size = zipped.size * iterables.length;
      }
      return reify(this, interleaved);
    },

    keySeq: function() {
      return Range(0, this.size);
    },

    last: function() {
      return this.get(-1);
    },

    skipWhile: function(predicate, context) {
      return reify(this, skipWhileFactory(this, predicate, context, false));
    },

    zip: function(/*, ...iterables */) {
      var iterables = [this].concat(arrCopy(arguments));
      return reify(this, zipWithFactory(this, defaultZipper, iterables));
    },

    zipWith: function(zipper/*, ...iterables */) {
      var iterables = arrCopy(arguments);
      iterables[0] = this;
      return reify(this, zipWithFactory(this, zipper, iterables));
    }

  });

  IndexedIterable.prototype[IS_INDEXED_SENTINEL] = true;
  IndexedIterable.prototype[IS_ORDERED_SENTINEL] = true;



  mixin(SetIterable, {

    // ### ES6 Collection methods (ES6 Array and Map)

    get: function(value, notSetValue) {
      return this.has(value) ? value : notSetValue;
    },

    includes: function(value) {
      return this.has(value);
    },


    // ### More sequential methods

    keySeq: function() {
      return this.valueSeq();
    }

  });

  SetIterable.prototype.has = IterablePrototype.includes;
  SetIterable.prototype.contains = SetIterable.prototype.includes;


  // Mixin subclasses

  mixin(KeyedSeq, KeyedIterable.prototype);
  mixin(IndexedSeq, IndexedIterable.prototype);
  mixin(SetSeq, SetIterable.prototype);

  mixin(KeyedCollection, KeyedIterable.prototype);
  mixin(IndexedCollection, IndexedIterable.prototype);
  mixin(SetCollection, SetIterable.prototype);


  // #pragma Helper functions

  function keyMapper(v, k) {
    return k;
  }

  function entryMapper(v, k) {
    return [k, v];
  }

  function not(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    }
  }

  function neg(predicate) {
    return function() {
      return -predicate.apply(this, arguments);
    }
  }

  function quoteString(value) {
    return typeof value === 'string' ? JSON.stringify(value) : String(value);
  }

  function defaultZipper() {
    return arrCopy(arguments);
  }

  function defaultNegComparator(a, b) {
    return a < b ? 1 : a > b ? -1 : 0;
  }

  function hashIterable(iterable) {
    if (iterable.size === Infinity) {
      return 0;
    }
    var ordered = isOrdered(iterable);
    var keyed = isKeyed(iterable);
    var h = ordered ? 1 : 0;
    var size = iterable.__iterate(
      keyed ?
        ordered ?
          function(v, k)  { h = 31 * h + hashMerge(hash(v), hash(k)) | 0; } :
          function(v, k)  { h = h + hashMerge(hash(v), hash(k)) | 0; } :
        ordered ?
          function(v ) { h = 31 * h + hash(v) | 0; } :
          function(v ) { h = h + hash(v) | 0; }
    );
    return murmurHashOfSize(size, h);
  }

  function murmurHashOfSize(size, h) {
    h = imul(h, 0xCC9E2D51);
    h = imul(h << 15 | h >>> -15, 0x1B873593);
    h = imul(h << 13 | h >>> -13, 5);
    h = (h + 0xE6546B64 | 0) ^ size;
    h = imul(h ^ h >>> 16, 0x85EBCA6B);
    h = imul(h ^ h >>> 13, 0xC2B2AE35);
    h = smi(h ^ h >>> 16);
    return h;
  }

  function hashMerge(a, b) {
    return a ^ b + 0x9E3779B9 + (a << 6) + (a >> 2) | 0; // int
  }

  var Immutable = {

    Iterable: Iterable,

    Seq: Seq,
    Collection: Collection,
    Map: Map,
    OrderedMap: OrderedMap,
    List: List,
    Stack: Stack,
    Set: Set,
    OrderedSet: OrderedSet,

    Record: Record,
    Range: Range,
    Repeat: Repeat,

    is: is,
    fromJS: fromJS

  };

  return Immutable;

}));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = undefined;

var _immutable = __webpack_require__(0);

/**
 * Default Spec for the Model Record.
 */
var ModelSpec = {
  name: '',
  version: ''
};

var Model = exports.Model = (0, _immutable.Record)(ModelSpec);

exports.default = Model;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(120), __esModule: true };

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _setPrototypeOf = __webpack_require__(108);

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = __webpack_require__(106);

var _create2 = _interopRequireDefault(_create);

var _typeof2 = __webpack_require__(12);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof2 = __webpack_require__(12);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var YAMLException = __webpack_require__(25);

var TYPE_CONSTRUCTOR_OPTIONS = [
  'kind',
  'resolve',
  'construct',
  'instanceOf',
  'predicate',
  'represent',
  'defaultStyle',
  'styleAliases'
];

var YAML_NODE_KINDS = [
  'scalar',
  'sequence',
  'mapping'
];

function compileStyleAliases(map) {
  var result = {};

  if (map !== null) {
    Object.keys(map).forEach(function (style) {
      map[style].forEach(function (alias) {
        result[String(alias)] = style;
      });
    });
  }

  return result;
}

function Type(tag, options) {
  options = options || {};

  Object.keys(options).forEach(function (name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new YAMLException('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });

  // TODO: Add tag format check.
  this.tag          = tag;
  this.kind         = options['kind']         || null;
  this.resolve      = options['resolve']      || function () { return true; };
  this.construct    = options['construct']    || function (data) { return data; };
  this.instanceOf   = options['instanceOf']   || null;
  this.predicate    = options['predicate']    || null;
  this.represent    = options['represent']    || null;
  this.defaultStyle = options['defaultStyle'] || null;
  this.styleAliases = compileStyleAliases(options['styleAliases'] || null);

  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new YAMLException('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}

module.exports = Type;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

var core = module.exports = {version: '1.2.6'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 8 */
/***/ (function(module, exports) {

var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var store  = __webpack_require__(69)('wks')
  , uid    = __webpack_require__(72)
  , Symbol = __webpack_require__(11).Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(58);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

/***/ }),
/* 11 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _symbol = __webpack_require__(109);

var _symbol2 = _interopRequireDefault(_symbol);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof _Symbol !== "undefined" && obj.constructor === _Symbol ? "symbol" : typeof obj; }

exports.default = function (obj) {
  return obj && typeof _symbol2.default !== "undefined" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(31);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(11)
  , core      = __webpack_require__(7)
  , ctx       = __webpack_require__(15)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$export.F = 1;  // forced
$export.G = 2;  // global
$export.S = 4;  // static
$export.P = 8;  // proto
$export.B = 16; // bind
$export.W = 32; // wrap
module.exports = $export;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(39);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



function isNothing(subject) {
  return (typeof subject === 'undefined') || (subject === null);
}


function isObject(subject) {
  return (typeof subject === 'object') && (subject !== null);
}


function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;
  else if (isNothing(sequence)) return [];

  return [ sequence ];
}


function extend(target, source) {
  var index, length, key, sourceKeys;

  if (source) {
    sourceKeys = Object.keys(source);

    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }

  return target;
}


function repeat(string, count) {
  var result = '', cycle;

  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }

  return result;
}


function isNegativeZero(number) {
  return (number === 0) && (Number.NEGATIVE_INFINITY === 1 / number);
}


module.exports.isNothing      = isNothing;
module.exports.isObject       = isObject;
module.exports.toArray        = toArray;
module.exports.repeat         = repeat;
module.exports.isNegativeZero = isNegativeZero;
module.exports.extend         = extend;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*eslint-disable max-len*/

var common        = __webpack_require__(17);
var YAMLException = __webpack_require__(25);
var Type          = __webpack_require__(6);


function compileList(schema, name, result) {
  var exclude = [];

  schema.include.forEach(function (includedSchema) {
    result = compileList(includedSchema, name, result);
  });

  schema[name].forEach(function (currentType) {
    result.forEach(function (previousType, previousIndex) {
      if (previousType.tag === currentType.tag) {
        exclude.push(previousIndex);
      }
    });

    result.push(currentType);
  });

  return result.filter(function (type, index) {
    return exclude.indexOf(index) === -1;
  });
}


function compileMap(/* lists... */) {
  var result = {}, index, length;

  function collectType(type) {
    result[type.tag] = type;
  }

  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }

  return result;
}


function Schema(definition) {
  this.include  = definition.include  || [];
  this.implicit = definition.implicit || [];
  this.explicit = definition.explicit || [];

  this.implicit.forEach(function (type) {
    if (type.loadKind && type.loadKind !== 'scalar') {
      throw new YAMLException('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
    }
  });

  this.compiledImplicit = compileList(this, 'implicit', []);
  this.compiledExplicit = compileList(this, 'explicit', []);
  this.compiledTypeMap  = compileMap(this.compiledImplicit, this.compiledExplicit);
}


Schema.DEFAULT = null;


Schema.create = function createSchema() {
  var schemas, types;

  switch (arguments.length) {
    case 1:
      schemas = Schema.DEFAULT;
      types = arguments[0];
      break;

    case 2:
      schemas = arguments[0];
      types = arguments[1];
      break;

    default:
      throw new YAMLException('Wrong number of arguments for Schema.create function');
  }

  schemas = common.toArray(schemas);
  types = common.toArray(types);

  if (!schemas.every(function (schema) { return schema instanceof Schema; })) {
    throw new YAMLException('Specified list of super schemas (or a single Schema object) contains a non-Schema object.');
  }

  if (!types.every(function (type) { return type instanceof Type; })) {
    throw new YAMLException('Specified list of YAML types (or a single Type object) contains a non-Type object.');
  }

  return new Schema({
    include: schemas,
    explicit: types
  });
};


module.exports = Schema;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.environment = exports.target = exports.serializers = exports.parsers = exports.loaders = undefined;

var _Environment = __webpack_require__(79);

var _Environment2 = _interopRequireDefault(_Environment);

var _Loader = __webpack_require__(81);

var _Loader2 = _interopRequireDefault(_Loader);

var _Parser = __webpack_require__(101);

var _Parser2 = _interopRequireDefault(_Parser);

var _Serializer = __webpack_require__(102);

var _Serializer2 = _interopRequireDefault(_Serializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loaders = exports.loaders = [_Loader2.default];

var parsers = exports.parsers = [_Parser2.default];

var serializers = exports.serializers = [_Serializer2.default];

var target = exports.target = {
  identifier: 'com.luckymarmot.PawExtensions.RAML1Generator',
  title: 'RAML1Generator',
  humanTitle: 'RAML 1.0',
  format: _Serializer2.default.__meta__.format,
  version: _Serializer2.default.__meta__.version
};

var environment = exports.environment = _Environment2.default;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.flatten = exports.convertEntryListInMap = exports.entries = exports.values = exports.keys = exports.currify = undefined;

var _toConsumableArray2 = __webpack_require__(38);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = __webpack_require__(22);

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = __webpack_require__(12);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * currifies a function with a partial list of arguments
 * @param {Function} uncurried: the function to currify
 * @param {Array<any>} params: a partial list of parameters to use with this function
 * @returns {Function} the currified function
 */
var currify = exports.currify = function currify(uncurried) {
  for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, otherParams = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      otherParams[_key2] = arguments[_key2];
    }

    return uncurried.apply(null, params.concat(otherParams));
  };
};

/**
 * extracts the keys from an object
 * @param {Object|any?} obj: the object to get the keys from
 * @returns {Array<string>} the corresponding keys
 */
var keys = exports.keys = function keys() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) !== 'object') {
    return [];
  }

  return (0, _keys2.default)(obj);
};

/**
 * extracts the values from an object
 * @param {Object|any?} obj: the object to get the values from
 * @returns {Array<*>} the corresponding values
 */
var values = exports.values = function values(obj) {
  return keys(obj).map(function (key) {
    return obj[key];
  });
};

/**
 * extracts the key-value pairs from an object
 * @param {Object|any?} obj: the object to get the entries from
 * @returns {Array<{key: string, value: *}>} the corresponding entries
 */
var entries = exports.entries = function entries(obj) {
  return keys(obj).map(function (key) {
    return { key: key, value: obj[key] };
  });
};

/**
 * converts an array of key-value pairs into an Object (as a reducer)
 * @param {Object} obj: the object to update with a new key-value pair
 * @param {Entry} entry: the entry to insert in the object
 * @returns {Object} the updated object
 */
var convertEntryListInMap = exports.convertEntryListInMap = function convertEntryListInMap(obj) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      key = _ref.key,
      value = _ref.value;

  if (typeof key === 'undefined' && typeof value === 'undefined') {
    return obj;
  }

  obj[key] = value;
  return obj;
};

/**
 * flattens an array of array into an array (as a reducer)
 * @param {Array<*>} f: the flat list to update with new elements
 * @param {Array<*>} l: the list to append to the flat list
 * @returns {Array<*>} the updated flat list
 */
var flatten = exports.flatten = function flatten(f, l) {
  return [].concat((0, _toConsumableArray3.default)(f), (0, _toConsumableArray3.default)(l));
};

var __internals__ = exports.__internals__ = { currify: currify, keys: keys, values: values, entries: entries, convertEntryListInMap: convertEntryListInMap };

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(116), __esModule: true };

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(121), __esModule: true };

/***/ }),
/* 23 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at  = __webpack_require__(143)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(66)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// YAML error class. http://stackoverflow.com/questions/8458984
//


function YAMLException(reason, mark) {
  // Super constructor
  Error.call(this);

  // Include stack trace in error object
  if (Error.captureStackTrace) {
    // Chrome and NodeJS
    Error.captureStackTrace(this, this.constructor);
  } else {
    // FF, IE 10+ and Safari 6+. Fallback for others
    this.stack = (new Error()).stack || '';
  }

  this.name = 'YAMLException';
  this.reason = reason;
  this.mark = mark;
  this.message = (this.reason || '(unknown reason)') + (this.mark ? ' ' + this.mark.toString() : '');
}


// Inherit from Error
YAMLException.prototype = Object.create(Error.prototype);
YAMLException.prototype.constructor = YAMLException;


YAMLException.prototype.toString = function toString(compact) {
  var result = this.name + ': ';

  result += this.reason || '(unknown reason)';

  if (!compact && this.mark) {
    result += ' ' + this.mark.toString();
  }

  return result;
};


module.exports = YAMLException;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// JS-YAML's default schema for `safeLoad` function.
// It is not described in the YAML specification.
//
// This schema is based on standard YAML's Core schema and includes most of
// extra types described at YAML tag repository. (http://yaml.org/type/)





var Schema = __webpack_require__(18);


module.exports = new Schema({
  include: [
    __webpack_require__(74)
  ],
  implicit: [
    __webpack_require__(177),
    __webpack_require__(170)
  ],
  explicit: [
    __webpack_require__(162),
    __webpack_require__(172),
    __webpack_require__(173),
    __webpack_require__(175)
  ]
});


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.Reference = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(10);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var methods = {};

/**
 * Metadata about the Reference Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'reference.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Reference Record.
 * @property {string} type: the type of reference. Used to access the correct store. For instance,
 * if type is 'parameter', then the Parameter store will be access in the Store object.
 * @property {string} uuid: the key to access the desired Object in the store. Does not have to be
 * uuid, so long as it is uniquely defined.
 * @overlay {string} overlay: parameters to apply to the linked object. For instance, assuming this
 * Reference links to an OAuth2 Auth Object, we could have an `overlay` such as:
 * const overlay = new Auth.OAuth2({
 *  scopes: someScopebjects
 * })
 * this would override the scopes defined in the linked OAuth2 Record with the scopes
 * defined in the overlay.
 */
var ReferenceSpec = {
  _model: model,
  type: null,
  uuid: null,
  overlay: null
};

/**
 * The Reference Record
 */

var Reference = exports.Reference = function (_Record) {
  (0, _inherits3.default)(Reference, _Record);

  function Reference() {
    (0, _classCallCheck3.default)(this, Reference);
    return (0, _possibleConstructorReturn3.default)(this, (Reference.__proto__ || (0, _getPrototypeOf2.default)(Reference)).apply(this, arguments));
  }

  (0, _createClass3.default)(Reference, [{
    key: 'getLocation',

    /**
     * returns the path of a reference in a store
     * @returns {List<string>} the path to use with store.getIn()
     */
    value: function getLocation() {
      return methods.getLocation(this);
    }

    /**
     * resolves a Reference against a Store. (finds what is located in the store at the location
     * described by the Reference)
     * @param {Store} store: the Store to search in
     * @returns {any} the object found in the Store at the location provided by the Reference. returns
     * undefined if not found
     */

  }, {
    key: 'resolve',
    value: function resolve(store) {
      return methods.resolve(this, store);
    }
  }]);
  return Reference;
}((0, _immutable.Record)(ReferenceSpec));

/**
 * returns the path of a reference in a store
 * @param {Reference} ref: the reference to get the path from
 * @returns {List<string>} the path to use with store.getIn()
 */


methods.getLocation = function (ref) {
  return [ref.get('type'), ref.get('uuid')];
};

/**
 * resolves a Reference against a Store. (finds what is located in the store at the location
 * described by the Reference)
 * @param {Reference} ref: the Reference to use to search the store
 * @param {Store} store: the Store to search in
 * @returns {any} the object found in the Store at the location provided by the Reference. returns
 * undefined if not found
 */
methods.resolve = function (ref, store) {
  var path = methods.getLocation(ref);
  var resolved = store.getIn(path);

  return resolved;
};

var __internals__ = exports.__internals__ = methods;
exports.default = Reference;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(113), __esModule: true };

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(30)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(8).setDesc
  , has = __webpack_require__(42)
  , TAG = __webpack_require__(9)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(63)
  , defined = __webpack_require__(41);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(41);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(148);
var Iterators = __webpack_require__(16);
Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// JS-YAML's default schema for `load` function.
// It is not described in the YAML specification.
//
// This schema is based on JS-YAML's default safe schema and includes
// JavaScript-specific types: !!js/undefined, !!js/regexp and !!js/function.
//
// Also this schema is used as default base schema at `Schema.create` function.





var Schema = __webpack_require__(18);


module.exports = Schema.DEFAULT = new Schema({
  include: [
    __webpack_require__(26)
  ],
  explicit: [
    __webpack_require__(168),
    __webpack_require__(167),
    __webpack_require__(166)
  ]
});


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(115), __esModule: true };

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(104);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(23)
  , TAG = __webpack_require__(9)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 41 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 42 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var $          = __webpack_require__(8)
  , createDesc = __webpack_require__(46);
module.exports = __webpack_require__(29) ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(14)
  , core    = __webpack_require__(7)
  , fails   = __webpack_require__(30);
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(43);

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(40)
  , ITERATOR  = __webpack_require__(9)('iterator')
  , Iterators = __webpack_require__(16);
module.exports = __webpack_require__(7).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Standard YAML's Failsafe schema.
// http://www.yaml.org/spec/1.2/spec.html#id2802346





var Schema = __webpack_require__(18);


module.exports = new Schema({
  explicit: [
    __webpack_require__(176),
    __webpack_require__(174),
    __webpack_require__(169)
  ]
});


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* istanbul ignore next */
if (typeof registerImporter === 'undefined' || typeof DynamicValue === 'undefined' || typeof DynamicString === 'undefined' || typeof registerCodeGenerator === 'undefined' || typeof InputField === 'undefined' || typeof NetworkHTTPRequest === 'undefined') {
  var mocks = __webpack_require__(82);
  module.exports = {
    registerImporter: mocks.registerImporter,
    DynamicValue: mocks.DynamicValue,
    DynamicString: mocks.DynamicString,
    registerCodeGenerator: mocks.registerCodeGenerator,
    InputField: mocks.InputField,
    NetworkHTTPRequest: mocks.NetworkHTTPRequest,
    RecordParameter: mocks.RecordParameter
  };
} else {
  /* eslint-disable no-undef */
  module.exports = {
    registerImporter: registerImporter,
    DynamicValue: DynamicValue,
    DynamicString: DynamicString,
    registerCodeGenerator: registerCodeGenerator,
    InputField: InputField,
    NetworkHTTPRequest: NetworkHTTPRequest,
    RecordParameter: RecordParameter
  };
  /* eslint-enable no-undef */
}

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Basic = __webpack_require__(92);

var _Basic2 = _interopRequireDefault(_Basic);

var _Digest = __webpack_require__(94);

var _Digest2 = _interopRequireDefault(_Digest);

var _NTLM = __webpack_require__(96);

var _NTLM2 = _interopRequireDefault(_NTLM);

var _Negotiate = __webpack_require__(97);

var _Negotiate2 = _interopRequireDefault(_Negotiate);

var _ApiKey = __webpack_require__(91);

var _ApiKey2 = _interopRequireDefault(_ApiKey);

var _OAuth = __webpack_require__(98);

var _OAuth2 = _interopRequireDefault(_OAuth);

var _OAuth3 = __webpack_require__(99);

var _OAuth4 = _interopRequireDefault(_OAuth3);

var _AWSSig = __webpack_require__(90);

var _AWSSig2 = _interopRequireDefault(_AWSSig);

var _Hawk = __webpack_require__(95);

var _Hawk2 = _interopRequireDefault(_Hawk);

var _Custom = __webpack_require__(93);

var _Custom2 = _interopRequireDefault(_Custom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Auth = {
  Basic: _Basic2.default,
  Digest: _Digest2.default,
  NTLM: _NTLM2.default,
  Negotiate: _Negotiate2.default,
  ApiKey: _ApiKey2.default,
  OAuth1: _OAuth2.default,
  OAuth2: _OAuth4.default,
  AWSSig4: _AWSSig2.default,
  Hawk: _Hawk2.default,
  Custom: _Custom2.default
};

exports.default = Auth;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Info = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Info Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'info.utils.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Info Record.
 */
var InfoSpec = {
  _model: model,
  title: null,
  description: null,
  tos: null,
  contact: null,
  license: null,
  version: null
};

/**
 * The Info Record
 */

var Info = exports.Info = function (_Record) {
  (0, _inherits3.default)(Info, _Record);

  function Info() {
    (0, _classCallCheck3.default)(this, Info);
    return (0, _possibleConstructorReturn3.default)(this, (Info.__proto__ || (0, _getPrototypeOf2.default)(Info)).apply(this, arguments));
  }

  return Info;
}((0, _immutable.Record)(InfoSpec));

exports.default = Info;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.Parameter = undefined;

var _typeof2 = __webpack_require__(12);

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = __webpack_require__(22);

var _keys2 = _interopRequireDefault(_keys);

var _assign = __webpack_require__(21);

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(10);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

var _Reference = __webpack_require__(27);

var _Reference2 = _interopRequireDefault(_Reference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Parameter Record.
 * Used for internal serialization and deserialization
 */

// import jsf from 'json-schema-faker'

var modelInstance = {
  name: 'parameter.core.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Parameter Record.
 * @property {string} in: the location of the parameter (header, query, body, ...). Mainly used for
 * shared parameters, as the ParameterStore is location agnostic
 * @property {string} usedIn: the type of object that holds the parameter (can be either request or
 * response)
 * @property {string} uuid:  a string that uniquely identifies this parameter (not a true uuid)
 * @property {string} key: the key of the Parameter as used in the header, query, body, etc.
 * @property {string} name?: a humand readable name for the Parameter like `Access token`
 * @property {string} description: a description of the purpose of the parameter
 * @property {List<*>} examples: a List of values that are valid representations of the parameter
 * @property {string} type: the JSON type of the Parameter
 * @property {string} format: the format of the Parameter (highly coupled with type)
 * @property {any} default: the default value of the Parameter
 * @property {boolean} required: whether the Parameter is mandatory or not.
 * @property {string} superType: some Parameters have complex representations, like sequences of
 * string Parameters that combine together create what would be a DynamicString in Paw or a string
 * with environment variables in Postman. the superType helps further define what the behavior of
 * the parameter is, without supercharging other fields (like format or type) with semantics that
 * are only relevant inside the model
 * @property {any} value: an object that is relevant to the construction of the Parameter, depending
 * on the superType. For instance, it could be a List<Parameter>, if the superType is "sequence".
 * @property {List<Constraint>} constraints: a List of Constraint that the Parameter must respect.
 * it is used to generate a JSON Schema out of the Parameter, and also to test if a value is valid
 * with respect to the Parameter. For instance, 'application/json' is not a valid Value for a
 * Parameter with the constraints: List([ new Contraint.Enum([ 'application/xml' ]) ])
 * @property {List<Parameter>} applicableContexts: a List of Parameters that help define whether
 * the Parameter can used in a given Context. @see methods.@isValid for more information
 * @property {Map<*, Reference)>} interfaces: a List of Interfaces implemented by the Parameter.
 * This is used to extract shared features at difference levels (like Resource, Request, Response,
 * URL, and Parameter).
 */
var ParameterSpec = {
  _model: model,
  in: null,
  usedIn: 'request',
  uuid: null,
  key: null,
  name: null,
  description: null,
  examples: (0, _immutable.List)(),
  type: null,
  format: null,
  default: null,
  required: false,
  superType: null,
  value: null,
  constraints: (0, _immutable.List)(),
  applicableContexts: (0, _immutable.List)(),
  interfaces: (0, _immutable.Map)()
};

/**
 * Holds all the internal methods used in tandem with a Parameter
 */
var methods = {};

/**
 * The Parameter Record
 */

var Parameter = exports.Parameter = function (_Record) {
  (0, _inherits3.default)(Parameter, _Record);

  function Parameter() {
    (0, _classCallCheck3.default)(this, Parameter);
    return (0, _possibleConstructorReturn3.default)(this, (Parameter.__proto__ || (0, _getPrototypeOf2.default)(Parameter)).apply(this, arguments));
  }

  (0, _createClass3.default)(Parameter, [{
    key: 'getJSONSchema',

    /**
     * transforms a Parameter into a JSON Schema
     * @param {boolean} useFaker: whether to use Faker or not
     * @param {boolean} replaceRefs: whether to replace refs with simple strings or to replace them
     * with $refs
     * @returns {schema} the corresponding schema
     */
    value: function getJSONSchema() {
      var useFaker = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var replaceRefs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      return methods.getJSONSchema(this, useFaker, replaceRefs);
    }

    /**
     * generates a value from a Parameter or a JSON Schema.
     * @param {boolean} useDefault: whether to use the default value or not
     * @param {schema} _constraintSet: an optional schema to generate from. If this schema is
     * provided, the calling Parameter is ignored.
     * @returns {any} the generated value
     */

  }, {
    key: 'generate',
    value: function generate(useDefault, _constraintSet) {
      return methods.generate(this, useDefault, _constraintSet);
    }

    /**
     * validates a value against the constraints of a Parameter
     * @param {any} value: the value to test
     * @returns {boolean} whether the value respects all the constraints of the Parameter or not
     */

  }, {
    key: 'validate',
    value: function validate(value) {
      return methods.validate(this, value);
    }

    /**
     * tests whether there is an applicableContext in which the param is validated
     * @param {Parameter} param: the param to validate
     * @returns {boolean} whether the param respects all the constraints of one of the
     * applicableContexts or not
     */

  }, {
    key: 'isValid',
    value: function isValid(param) {
      return methods.isValid(this, param);
    }
  }]);
  return Parameter;
}((0, _immutable.Record)(ParameterSpec));

/**
 * merges a constraint schema with a schema
 * @param {schema} set: the schema to update
 * @param {schema} constraint: the constraint schema to merge
 * @returns {schema} the updated schema
 */


methods.mergeConstraintInSchema = function (set, constraint) {
  var obj = constraint.toJSONSchema();
  (0, _assign2.default)(set, obj);
  return set;
};

/**
 * adds constraints from a Parameter to a schema
 * @param {Parameter} param: the parameter to get the constraints from
 * @param {schema} schema: the schema to update
 * @returns {schema} the updated schema
 */
methods.addConstraintsToSchema = function (param, schema) {
  var constraints = param.get('constraints');
  var _schema = constraints.reduce(methods.mergeConstraintInSchema, schema);
  return _schema;
};

/**
 * normalizes the type from a Parameter
 * @param {string | any} type: the type to normalize
 * @returns {string} the infered type
 */
methods.inferType = function (type) {
  if (!type) {
    return null;
  }

  if (typeof type !== 'string') {
    return 'string';
  }

  if (type.match(/double/i) || type.match(/float/i)) {
    return 'number';
  }

  if (type.match(/date/i)) {
    return 'string';
  }

  return type;
};

/**
 * adds type from a Parameter to a schema
 * @param {Parameter} param: the parameter to get the type from
 * @param {schema} schema: the schema to update
 * @returns {schema} the updated schema
 */
methods.addTypeFromParameterToSchema = function (param, schema) {
  var types = ['integer', 'number', 'array', 'string', 'object', 'boolean', 'null'];

  var type = param.get('type') || '';

  if (types.indexOf(type) === -1) {
    type = methods.inferType(type);

    if (!type) {
      return schema;
    }
  }

  schema.type = type;
  return schema;
};

/**
 * adds title from a Parameter to a schema
 * @param {Parameter} param: the parameter to get the title from
 * @param {schema} schema: the schema to update
 * @returns {schema} the updated schema
 */
methods.addTitleFromParameterToSchema = function (param, schema) {
  var key = param.get('key');
  if (key) {
    schema['x-title'] = key;
  }

  return schema;
};

/**
 * adds the default value from a Parameter to a schema
 * @param {Parameter} param: the parameter to get the default value from
 * @param {schema} schema: the schema to update
 * @returns {schema} the updated schema
 */
methods.addDefaultFromParameterToSchema = function (param, schema) {
  var _default = param.get('default');
  if (_default !== null && typeof _default !== 'undefined') {
    schema.default = param.get('default');
  }

  return schema;
};

/**
 * transforms a simple Parameter into a schema
 * @param {Parameter} simple: the parameter to transform
 * @returns {schema} the corresponding schema
 */
methods.getJSONSchemaFromSimpleParameter = function (simple) {
  var schema = {};
  schema = methods.addConstraintsToSchema(simple, schema);
  schema = methods.addTypeFromParameterToSchema(simple, schema);
  schema = methods.addTitleFromParameterToSchema(simple, schema);
  schema = methods.addDefaultFromParameterToSchema(simple, schema);

  return schema;
};

/**
 * extracts the sequence from a SequenceParameter into a schema
 * @param {Parameter} sequenceParam: the parameter to get the sequence from
 * @param {schema} schema: the schema to update
 * @param {boolean} useFaker: whether we should use Faker or not
 * @returns {schema} the updated schema
 */
methods.addSequenceToSchema = function (sequenceParam, schema) {
  var useFaker = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var sequence = sequenceParam.get('value');
  if (!sequence) {
    return schema;
  }

  schema['x-sequence'] = sequence.map(function (param) {
    return methods.getJSONSchema(param, useFaker);
  }).toJS();

  schema.format = 'sequence';

  return schema;
};

/**
 * transforms a SequenceParameter into a schema
 * @param {Parameter} sequenceParam: the parameter to transform
 * @param {boolean} useFaker: whether we should use Faker or not
 * @returns {schema} the corresponding schema
 */
methods.getJSONSchemaFromSequenceParameter = function (sequenceParam) {
  var useFaker = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var schema = {};
  schema = methods.addConstraintsToSchema(sequenceParam, schema);
  schema = methods.addTypeFromParameterToSchema(sequenceParam, schema);
  schema = methods.addTitleFromParameterToSchema(sequenceParam, schema);
  schema = methods.addSequenceToSchema(sequenceParam, schema, useFaker);
  return schema;
};

/**
 * extracts the items field from an ArrayParameter into a schema
 * @param {Parameter} param: the parameter to transform
 * @param {schema} schema: the schema to update
 * @param {boolean} useFaker: whether we should use Faker or not
 * @returns {schema} the updated schema
 */
methods.addItemstoSchema = function (param, schema) {
  var useFaker = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var items = param.get('value');
  if (items instanceof Parameter) {
    schema.items = methods.getJSONSchema(items, useFaker);
  }

  return schema;
};

/**
 * transforms an ArrayParameter into a schema
 * @param {Parameter} arrayParam: the parameter to transform
 * @param {boolean} useFaker: whether we should use Faker or not
 * @returns {schema} the corresponding schema
 */
methods.getJSONSchemaFromArrayParameter = function (arrayParam) {
  var useFaker = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  var schema = {};
  schema = methods.addConstraintsToSchema(arrayParam, schema);
  schema = methods.addTypeFromParameterToSchema(arrayParam, schema);
  schema = methods.addTitleFromParameterToSchema(arrayParam, schema);
  schema = methods.addItemstoSchema(arrayParam, schema, useFaker);

  return schema;
};

/**
 * applies the reference field from a ReferenceParameter to a schema
 * @param {Parameter} param: the parameter to get the reference from
 * @param {schema} schema: the schema to update
 * @returns {schema} the updated schema
 */
methods.addReferenceToSchema = function (param, schema) {
  var ref = param.get('value');

  if (!(ref instanceof _Reference2.default)) {
    return schema;
  }

  schema.$ref = ref.get('uuid');
  return schema;
};

/**
 * transforms a ReferenceParameter into a schema
 * @param {Parameter} refParam: the parameter to transform
 * @returns {schema} the corresponding schema
 */
methods.getJSONSchemaFromReferenceParameter = function (refParam) {
  var schema = {};

  schema = methods.addConstraintsToSchema(refParam, schema);
  schema = methods.addTitleFromParameterToSchema(refParam, schema);
  schema = methods.addReferenceToSchema(refParam, schema);

  return schema;
};

/**
 * adds Faker fields if applicable based on format of Parameter
 * @param {Parameter} param: the parameter to get the reference from
 * @param {schema} schema: the schema to update
 * @returns {schema} the updated schema
 */
methods.updateSchemaWithFaker = function (param, schema) {
  var fakerFormatMap = {
    email: {
      faker: 'internet.email'
    },
    // base64 endoded
    byte: {
      pattern: '^(?:[A-Za-z0-9+/]{4})*' + '(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$'
    },
    // not really binary but who cares
    binary: {
      pattern: '^.*$'
    },
    'date-time': {
      faker: 'date.recent'
    },
    password: {
      pattern: '^.*$'
    },
    sequence: {
      format: 'sequence'
    }
  };

  var format = param.get('format') || '';

  if (fakerFormatMap[format]) {
    var constraint = fakerFormatMap[format];
    var key = (0, _keys2.default)(constraint)[0];
    if (key && !schema[key]) {
      (0, _assign2.default)(schema, constraint);
    }
  }

  return schema;
};

/**
 * unescapes a URI fragment
 * @param {string} uriFragment: the uri fragment to unescape
 * @returns {string} the updated schema
 */
methods.unescapeURIFragment = function (uriFragment) {
  return uriFragment.replace(/~1/g, '/').replace(/~0/g, '~');
};

methods.replaceRefsInArray = function (obj) {
  for (var i = 0; i < obj.length; i += 1) {
    var content = obj[i];
    obj[i] = methods.replaceRefs(content);
  }
  return obj;
};

methods.replaceRefsInObject = function (obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key] = methods.replaceRefs(obj[key]);
    }
  }

  return obj;
};

/**
 * @deprecated (use at your own risk)
 * replaces References in a pseudo-schema with default values to make it a simple schema
 * @param {object} obj: the pseudo-schema to transform in a schema
 * @returns {schema} the corresponding schema
 */
methods.replaceRefs = function (obj) {
  if ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) !== 'object' || obj === null) {
    return obj;
  }

  if (obj.$ref) {
    obj.default = methods.unescapeURIFragment(obj.$ref.split('/').slice(-1)[0]);
    obj.type = 'string';
    delete obj.$ref;
  }

  if (Array.isArray(obj)) {
    return methods.replaceRefsInArray(obj);
  }

  return methods.replaceRefsInObject(obj);
};

methods.simplifyRefsInArray = function (obj) {
  for (var i = 0; i < obj.length; i += 1) {
    var content = obj[i];
    obj[i] = methods.simplifyRefs(content);
  }

  return obj;
};

methods.simplifyRefsInObject = function (obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key] = methods.simplifyRefs(obj[key]);
    }
  }

  return obj;
};

/**
 * replaces References in a pseudo-schema with $refs to make it a valid schema
 * @param {object} obj: the pseudo-schema to transform in a schema
 * @returns {schema} the corresponding schema
 */
methods.simplifyRefs = function (obj) {
  if ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) !== 'object' || obj === null) {
    return obj;
  }

  if (obj.$ref instanceof _Reference2.default) {
    obj.$ref = obj.$ref.get('uuid');
  }

  if (Array.isArray(obj)) {
    return methods.simplifyRefsInArray(obj);
  }

  return methods.simplifyRefsInObject(obj);
};

/**
 * tests wether a Parameter is simple (standard type, no weird things)
 * @param {Parameter} param: the parameter to test
 * @returns {boolean} the corresponding schema
 */
methods.isSimpleParameter = function (param) {
  if (param.get('superType')) {
    return false;
  }

  // if no type is provided assume simple
  var type = param.get('type') || null;

  var types = ['integer', 'number', 'string', 'object', 'boolean', 'null'];

  if (type && types.indexOf(type) === -1) {
    return false;
  }

  return true;
};

/**
 * tests wether a Parameter is a SequenceParameter
 * @param {Parameter} param: the parameter to test
 * @returns {boolean} the corresponding schema
 */
methods.isSequenceParameter = function (param) {
  var superType = param.get('superType') || '';

  return superType === 'sequence';
};

/**
 * tests wether a Parameter is an ArrayParameter
 * @param {Parameter} param: the parameter to test
 * @returns {boolean} the corresponding schema
 */
methods.isArrayParameter = function (param) {
  var type = param.get('type') || '';

  return type === 'array';
};

/**
 * tests wether a Parameter is a ReferenceParameter
 * @param {Parameter} param: the parameter to test
 * @returns {boolean} the corresponding schema
 */
methods.isReferenceParameter = function (param) {
  var superType = param.get('superType') || '';

  return superType === 'reference';
};

methods.getRawJSONSchema = function (parameter, useFaker) {
  if (methods.isSimpleParameter(parameter)) {
    return methods.getJSONSchemaFromSimpleParameter(parameter);
  }

  if (methods.isSequenceParameter(parameter)) {
    return methods.getJSONSchemaFromSequenceParameter(parameter, useFaker);
  }

  if (methods.isArrayParameter(parameter)) {
    return methods.getJSONSchemaFromArrayParameter(parameter, useFaker);
  }

  if (methods.isReferenceParameter(parameter)) {
    return methods.getJSONSchemaFromReferenceParameter(parameter);
  }

  return {};
};

/**
 * transforms a Parameter into a JSON Schema
 * @param {Parameter} parameter: the parameter to transform
 * @param {boolean} useFaker: whether to use Faker or not
 * @param {boolean} replaceRefs: whether to replace refs with simple strings or to replace them with
 * $refs
 * @returns {schema} the corresponding schema
 */
methods.getJSONSchema = function (parameter) {
  var useFaker = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var replaceRefs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var schema = methods.getRawJSONSchema(parameter, useFaker);

  if (useFaker) {
    schema = methods.updateSchemaWithFaker(parameter, schema);
  }

  if (replaceRefs) {
    schema = methods.replaceRefs(schema);
  } else {
    schema = methods.simplifyRefs(schema);
  }

  return schema;
};

/**
 * Gets the default value of a Parameter, if applicable
 * @param {Parameter} parameter: the parameter to get the default value of
 * @returns {any} the default value
 */
methods.generateFromDefault = function (parameter) {
  var _default = parameter.get('default');
  if (_default !== null && typeof _default !== 'undefined') {
    return _default;
  }

  return null;
};

methods.generateFromSequenceDefaults = function (parameter) {
  var sequence = parameter.get('value');
  if (!sequence) {
    return null;
  }

  var defaults = sequence.map(function (param) {
    return methods.generate(param) || '';
  }).toJS();

  return defaults.join('');
};

/**
 * generates a value from a Parameter or a JSON Schema.
 * @param {Parameter} parameter: the Parameter to get a JSON Schema from
 * @param {boolean} useDefault: whether to use the default value or not
 * @param {schema} _schema: an optional schema to generate from. If this schema is provided, the
 * Parameter is ignored.
 * @returns {any} the generated value
 */
methods.generate = function (parameter) {
  if (parameter.get('superType') === 'sequence') {
    return methods.generateFromSequenceDefaults(parameter);
  }

  return methods.generateFromDefault(parameter);
};

/**
 * validates a value against the constraints of a Parameter
 * @param {Parameter} parameter: the Parameter to test the value against
 * @param {any} value: the value to test
 * @returns {boolean} whether the value respects all the constraints of the Parameter or not
 */
methods.validate = function (parameter, value) {
  var constraints = parameter.get('constraints');
  return constraints.reduce(function (bool, cond) {
    return bool && cond.evaluate(value);
  }, true);
};

/**
 * tests whether there is an applicableContext in which the param is validated
 * @param {Parameter} source: the Parameter to get the applicableContexts from
 * @param {Parameter} param: the param to validate
 * @returns {boolean} whether the param respects all the constraints of one of the
 * applicableContexts or not
 */
methods.isValid = function (source, param) {
  var list = source.get('applicableContexts');
  // No external constraint
  if (list.size === 0) {
    return true;
  }

  return list.reduce(function (bool, _param) {
    // && has precedence on ||
    // === (1 || (2a && 2b))
    return bool || _param.get('key') === param.get('key') && _param.validate(param.get('default'));
  }, false);
};

var __internals__ = exports.__internals__ = methods;
exports.default = Parameter;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.ParameterContainer = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(10);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _fpUtils = __webpack_require__(20);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

var _Reference = __webpack_require__(27);

var _Reference2 = _interopRequireDefault(_Reference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the ParameterContainer Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'parameter-container.core.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the ParameterContainer Record.
 */
var ParameterContainerSpec = {
  _model: model,
  headers: (0, _immutable.OrderedMap)(),
  queries: (0, _immutable.OrderedMap)(),
  body: (0, _immutable.OrderedMap)(),
  path: (0, _immutable.OrderedMap)()
};

/**
 * Holds all the internal methods used in tandem with a ParameterContainer
 */
var methods = {};

/**
 * The ParameterContainer Record
 */

var ParameterContainer = exports.ParameterContainer = function (_Record) {
  (0, _inherits3.default)(ParameterContainer, _Record);

  function ParameterContainer() {
    (0, _classCallCheck3.default)(this, ParameterContainer);
    return (0, _possibleConstructorReturn3.default)(this, (ParameterContainer.__proto__ || (0, _getPrototypeOf2.default)(ParameterContainer)).apply(this, arguments));
  }

  (0, _createClass3.default)(ParameterContainer, [{
    key: 'getHeadersSet',

    /**
     * gets a set of headers from a ParameterContainer
     * @returns {OrderedMap} the set of headers
     */
    value: function getHeadersSet() {
      return methods.getHeadersSet(this);
    }

    /**
     * resolves all the References the ParameterContainer contains to their corresponding object in
     * a given store
     * @param {Store} store: the store to use to resolve Reference
     * @returns {ParameterContainer} a ParameterContainer with as few References as possible
     */

  }, {
    key: 'resolve',
    value: function resolve(store) {
      return methods.resolve(this, store);
    }

    /**
     * filters a ParameterContainer based on a set of constraint Parameter from a Context
     * @param {List<Parameter>} contextContraints: a List of constraint Parameters from a Context
     * @returns {ParameterContainer} a ParameterContainer that respects all the constraints from a
     * Context.
     */

  }, {
    key: 'filter',
    value: function filter(contextContraints) {
      return methods.filter(this, contextContraints);
    }
  }]);
  return ParameterContainer;
}((0, _immutable.Record)(ParameterContainerSpec));

/**
 * adds a Parameter to an object based on its key field
 * @param {obj} set: the set to update
 * @param {Parameter} param: the Parameter to add
 * @returns {set} the updated set
 */


methods.headerSetReducer = function (set, param) {
  var key = param.get('key');

  if (key === null || typeof key === 'undefined') {
    return set;
  }

  set[param.get('key')] = param;
  return set;
};

/**
 * gets a set of headers from a ParameterContainer
 * @param {ParameterContainer} container: the ParameterContainer to get the headers from
 * @returns {OrderedMap} the set of headers
 */
methods.getHeadersSet = function (container) {
  var headers = container.get('headers');
  var _set = headers.reduce(methods.headerSetReducer, {});
  return new _immutable.OrderedMap(_set);
};

/**
 * filters a block against a Parameter
 * @param {List<Parameter>} block: a list of Parameters belonging to a certain part of a request,
 * like headers, or query params, etc.
 * @param {Parameter} param: the Parameter to test the validation against
 * @returns {List<Parameter>} the filtered block with only valid Parameters against the param
 */
methods.filterBlockReducer = function (block, param) {
  return block.filter(function (d) {
    return d.isValid(param);
  });
};

/**
 * filters a block against a list of constraints from a context
 * @param {List<Parameter>} block: a list of Parameters belonging to a certain part of a request,
 * like headers, or query params, etc.
 * @param {List<Parameter>} contextContraints: the list of Parameters to test against
 * @returns {List<Parameter>} the filtered block with only valid Parameters against the
 * contextContraints
 */
methods.filterBlock = function (block, contextContraints) {
  return contextContraints.reduce(methods.filterBlockReducer, block);
};

/**
 * filters a block against a list of constraints from a context
 * @param {ParameterContainer} container: the ParameterContainer to filter based on the context
 * @param {List<Parameter>} contextContraints: the list of Parameters to test against
 * @returns {ParameterContainer} the filtered ParameterContainer with only valid Parameters
 * against the contextContraints
 */
methods.filter = function (container, contextContraints) {
  if (!contextContraints) {
    return container;
  }

  var headers = methods.filterBlock(container.get('headers'), contextContraints);
  var queries = methods.filterBlock(container.get('queries'), contextContraints);
  var body = methods.filterBlock(container.get('body'), contextContraints);
  var path = methods.filterBlock(container.get('path'), contextContraints);

  return container.withMutations(function (_container) {
    _container.set('headers', headers).set('queries', queries).set('body', body).set('path', path);
  });
};

methods.resolveReference = function (store, paramOrRef) {
  if (paramOrRef instanceof _Reference2.default) {
    return store.getIn(paramOrRef.getLocation());
  }

  return paramOrRef;
};

methods.removeUnresolvedRefs = function (param) {
  return !!param;
};

methods.resolveBlock = function (store, block) {
  var transformRefs = (0, _fpUtils.currify)(methods.resolveReference, store);
  return block.map(transformRefs).filter(methods.removeUnresolvedRefs);
};

methods.resolve = function (container, store) {
  var resolveBlock = (0, _fpUtils.currify)(methods.resolveBlock, store);
  var headers = resolveBlock(container.get('headers'));
  var queries = resolveBlock(container.get('queries'));
  var body = resolveBlock(container.get('body'));
  var path = resolveBlock(container.get('path'));

  var resolved = container.withMutations(function (_container) {
    _container.set('headers', headers).set('queries', queries).set('body', body).set('path', path);
  });

  return resolved;
};

var __internals__ = exports.__internals__ = methods;
exports.default = ParameterContainer;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Store = undefined;

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Store Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'store.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Store Record.
 */
var StoreSpec = {
  _model: model,
  variable: new _immutable.OrderedMap(),
  constraint: new _immutable.OrderedMap(),
  endpoint: new _immutable.OrderedMap(),
  parameter: new _immutable.OrderedMap(),
  response: new _immutable.OrderedMap(),
  auth: new _immutable.OrderedMap(),
  interface: new _immutable.OrderedMap()
};

/**
 * The Store Record
 */
var Store = exports.Store = (0, _immutable.Record)(StoreSpec);

exports.default = Store;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.URL = undefined;

var _slicedToArray2 = __webpack_require__(61);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = __webpack_require__(28);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = __webpack_require__(22);

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = __webpack_require__(12);

var _typeof3 = _interopRequireDefault(_typeof2);

var _extends2 = __webpack_require__(111);

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(10);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _url = __webpack_require__(76);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

var _URLComponent = __webpack_require__(57);

var _URLComponent2 = _interopRequireDefault(_URLComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the URL Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'url.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the URL Record.
 * Most fields are direct matches for parse(url), except for protocol, hostname, pathname, and
 * secure.
 * - `protocol` expects a List of protocols applicable to the url
 * - `hostname` and `pathname` are URLComponents, as they are the two core fields of the urlObject.
 * - `secure` is a boolean to tell whether the url supports a secure protocol. This is a helper to
 * make generation more uniform and favor secure protocols over unsecure ones.
 * Other fields may evolve into URLComponents in future versions, when the need for higher
 * descriptivity arises.
 */
var URLSpec = {
  _model: model,
  uuid: null,
  protocol: (0, _immutable.List)(),
  slashes: true,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  href: null,
  path: null,
  pathname: null,
  query: null,
  search: null,
  hash: null,
  secure: false,
  variableDelimiters: (0, _immutable.List)(),
  description: null
};

/**
 * Holds all the internal methods used in tandem with a URL
 */
var methods = {};

/**
 * The URL Record
 */

var URL = exports.URL = function (_Record) {
  (0, _inherits3.default)(URL, _Record);

  /**
   * @constructor
   * @param {Object} props: the properties of this URL Record
   * @param {string|Object} props.url: a representation of the url this Record needs to reflect.
   * The string representation of the url is preferred.
   * @param {List<string>} props.variableDelimiters: a List of delimiters for variables present in
   * the url.
   * @param {string?} props.description: an optional description of the purpose of this URL.
   * @param {string?} props.uuid: an optional uuid field
   * @param {boolean?} props.secure: an optional field to tell whether a URL is secure or not.
   */
  function URL(props) {
    var _ret2;

    (0, _classCallCheck3.default)(this, URL);

    if (!props) {
      var _ret;

      var _this = (0, _possibleConstructorReturn3.default)(this, (URL.__proto__ || (0, _getPrototypeOf2.default)(URL)).call(this));

      return _ret = _this, (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    var url = props.url,
        uuid = props.uuid,
        secure = props.secure,
        variableDelimiters = props.variableDelimiters,
        description = props.description;

    var urlComponents = methods.getURLComponents(url, variableDelimiters);

    var _this = (0, _possibleConstructorReturn3.default)(this, (URL.__proto__ || (0, _getPrototypeOf2.default)(URL)).call(this, (0, _extends3.default)({}, urlComponents, { secure: secure, uuid: uuid, variableDelimiters: variableDelimiters, description: description })));

    return _ret2 = _this, (0, _possibleConstructorReturn3.default)(_this, _ret2);
  }

  /**
   * generates an href from a URL
   * @param {List<string>} delimiters: the variable delimiters (needed to format variables in the
   * fields)
   * @param {boolean} useDefault: whether to use the default values or not
   * @returns {string} the url.href
   */


  (0, _createClass3.default)(URL, [{
    key: 'generate',
    value: function generate() {
      var delimiters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _immutable.List)();
      var useDefault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      return methods.generate(this, delimiters, useDefault);
    }

    /**
     * generates a URL from a URL and a url string
     * @param {string} url: the url to reach
     * @param {List<string>} delimiters: the variable delimiters (needed to format variables in the
     * fields)
     * @param {boolean} useDefault: whether to use the default values or not
     * @returns {URL} the resolved URL
     *
     * IMPORTANT: the from string must be using the same delimiters format as the one provided with
     * `delimiters`, otherwise the final result might have inconsistencies.
     */

  }, {
    key: 'resolve',
    value: function resolve(url) {
      var delimiters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _immutable.List)();
      var useDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      return methods.resolve(this, url, delimiters, useDefault);
    }

    /**
     * converts a URL Record into a urlObject
     * @param {List<string>} delimiters: the variable delimiters (needed to format variables in the
     * fields)
     * @param {boolean} useDefault: whether to use the default values or not
     * @returns {Object} the corresponding urlObject
     */

  }, {
    key: 'toURLObject',
    value: function toURLObject(delimiters, useDefault) {
      return methods.convertURLComponentsToURLObject(this, delimiters, useDefault);
    }
  }]);
  return URL;
}((0, _immutable.Record)(URLSpec));

methods.getURLComponents = function (url, variableDelimiters) {
  if (typeof url === 'string') {
    var urlObject = (0, _url.parse)(url);
    return methods.convertURLObjectToURLComponents(urlObject, variableDelimiters);
  }

  if (url && (typeof url === 'undefined' ? 'undefined' : (0, _typeof3.default)(url)) === 'object' && !(url.host instanceof _URLComponent2.default)) {
    return methods.convertURLObjectToURLComponents(url, variableDelimiters);
  }

  return url;
};

/**
 * converts all urlObject fields into their corresponding type used in the URL Record
 * @param {Object} _urlObject: the urlObject to convert
 * @param {List<string>} variableDelimiters: the variable delimiters (needed to detect variables in
 * the fields)
 * @returns {Object} an object containing the matching URL Record fields
 */
methods.convertURLObjectToURLComponents = function (_urlObject) {
  var variableDelimiters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _immutable.List)();

  var urlObject = methods.fixUrlObject(_urlObject);

  var components = {
    protocol: (0, _immutable.List)([urlObject.protocol]),
    slashes: urlObject.slashes,
    auth: urlObject.auth,
    host: urlObject.host,
    hostname: urlObject.hostname ? new _URLComponent2.default({
      componentName: 'hostname',
      string: urlObject.hostname,
      variableDelimiters: variableDelimiters
    }) : null,
    port: urlObject.port ? new _URLComponent2.default({
      componentName: 'port',
      string: urlObject.port,
      variableDelimiters: variableDelimiters
    }) : null,
    path: urlObject.path,
    pathname: urlObject.pathname ? new _URLComponent2.default({
      componentName: 'pathname',
      string: urlObject.pathname,
      variableDelimiters: variableDelimiters
    }) : null,
    search: urlObject.search,
    query: urlObject.query,
    hash: urlObject.hash,
    href: urlObject.href,
    secure: urlObject.secure || false
  };

  return components;
};

methods.formatHostFromHostnameAndPort = function (hostname, port) {
  if (hostname && port) {
    return hostname + ':' + port;
  }

  if (hostname) {
    return hostname;
  }

  return null;
};

/**
 * converts a URL Record into a urlObject
 * @param {URL} url: the URL Record to convert
 * @param {List<string>} delimiters: the variable delimiters (needed to format variables in the
 * fields)
 * @param {boolean} useDefault: whether to use the default values or not
 * @returns {Object} the corresponding urlObject
 */
methods.convertURLComponentsToURLObject = function (url) {
  var delimiters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _immutable.List)();
  var useDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var protocol = url.get('secure') ? url.get('protocol').filter(function (proto) {
    return proto.match(/[^w]s:?$/);
  }).get(0) : url.getIn(['protocol', 0]);

  var slashes = url.get('slashes');
  var hostname = url.get('hostname') ? url.get('hostname').generate(delimiters, useDefault) : null;
  var port = url.get('port') ? url.get('port').generate(delimiters, useDefault) : null;
  var host = methods.formatHostFromHostnameAndPort(hostname, port);
  var pathname = url.get('pathname') ? url.get('pathname').generate(delimiters, useDefault) : null;

  var urlObject = {
    protocol: protocol, slashes: slashes, hostname: hostname, port: port, host: host, pathname: pathname
  };

  return urlObject;
};

/**
 * generates an href from a URL
 * @param {URL} url: the URL Record to generate the href from
 * @param {List<string>} delimiters: the variable delimiters (needed to format variables in the
 * fields)
 * @param {boolean} useDefault: whether to use the default values or not
 * @returns {string} the url.href
 */
methods.generate = function (url) {
  var delimiters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _immutable.List)();
  var useDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var urlObject = methods.convertURLComponentsToURLObject(url, delimiters, useDefault);
  return (0, _url.format)(urlObject);
};

/**
 * generates a URL from a URL and a url string
 * @param {URL} from: the URL Record to that serves as a base reference
 * @param {string} to: the url to reach
 * @param {List<string>} delimiters: the variable delimiters (needed to format variables in the
 * fields)
 * @param {boolean} useDefault: whether to use the default values or not
 * @returns {URL} the resolved URL
 *
 * IMPORTANT: the from string must be using the same delimiters format as the one provided with
 * `delimiters`, otherwise the final result might have inconsistencies.
 */
methods.resolve = function (from, to, delimiters) {
  var useDefault = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  var fromString = methods.generate(from, delimiters, useDefault);
  var resolved = (0, _url.resolve)(fromString, to);

  // massive hack
  // FIXME
  resolved = resolved.replace('///', '//');

  return new URL({
    url: resolved,
    variableDelimiters: delimiters
  });
};

/**
 * urldecodes every field of a UrlObject
 * @param {UrlObject} urlObject: the urlObject to decode
 * @returns {UrlObject} the decoded urlObject
 */
methods.decodeUrlObject = function (urlObject) {
  var keys = (0, _keys2.default)(urlObject);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(keys), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (typeof urlObject[key] === 'string') {
        urlObject[key] = decodeURIComponent(urlObject[key]);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return urlObject;
};

/**
 * separates the host string into hostname and port
 * @param {string} host: the host string
 * @returns {Object} the hostname and port if they exist
 */
methods.splitHostInHostnameAndPort = function (host) {
  if (!host) {
    return { hostname: null, port: null };
  }

  var _host$split = host.split(':'),
      _host$split2 = (0, _slicedToArray3.default)(_host$split, 2),
      hostname = _host$split2[0],
      port = _host$split2[1];

  return { hostname: hostname || null, port: port || null };
};

/**
 * extracts the host from a pathname. Used when URL.parse failed to parse
 * the URL correctly (often due to the presence of brackets in the hostname)
 * @param {string} _pathname: the pathname to decompose
 * @returns {Object} the host and pathname, if they exist
 */
methods.splitPathnameInHostAndPathname = function (_pathname) {
  if (!_pathname) {
    return { host: null, pathname: null };
  }

  var m = _pathname.match(/([^/]*)(\/.*)/);

  if (m) {
    var host = m[1] || null;
    var pathname = m[2];
    return { host: host, pathname: pathname };
  }

  return { host: _pathname, pathname: null };
};

/**
 * creates a path from a pathname and a search field
 * @param {string} pathname: the pathname field of a UrlObject
 * @param {string} search: the search field of a UrlObject
 * @returns {string} the url.path
 */
methods.createPathFromPathNameAndSearch = function (pathname, search) {
  return (pathname || '') + (search || '') || null;
};

/**
 * generates an href from a base URL, a host and a path. This is used to update
 * the href field of a UrlObject, when the URL.parse failed.
 * @param {URL} base: the base URL Record to generate the href from
 * @param {?string} host: the host to use in place of the base URL's host
 * @param {?string} pathname: the pathname to use in place of the base URL's pathname
 * @returns {string} the url.href
 */
methods.createHrefFromBaseAndHostAndPathName = function (base, host, pathname) {
  return (0, _url.format)({
    protocol: base.protocol || null,
    slashes: base.slashes,
    auth: base.auth || null,
    host: host || null,
    pathname: pathname || '/',
    search: base.search || null,
    hash: base.hash || null
  });
};

/**
 * tries to fix a UrlObject that has no host by searching the pathname for a host
 * and updating the related fields
 * @param {UrlObject} urlObject: the UrlObject to fix
 * @returns {UrlObject} the fixed urlObject
 */
methods.fixUrlObject = function (urlObject) {
  var decoded = methods.decodeUrlObject(urlObject);
  if (decoded.host || !decoded.pathname) {
    return decoded;
  }

  var _methods$splitPathnam = methods.splitPathnameInHostAndPathname(decoded.pathname),
      host = _methods$splitPathnam.host,
      pathname = _methods$splitPathnam.pathname;

  var _methods$splitHostInH = methods.splitHostInHostnameAndPort(host),
      hostname = _methods$splitHostInH.hostname,
      port = _methods$splitHostInH.port;

  var path = methods.createPathFromPathNameAndSearch(pathname, decoded.search);
  var href = methods.createHrefFromBaseAndHostAndPathName(decoded, host, pathname);

  return (0, _extends3.default)({}, urlObject, { host: host, pathname: pathname, hostname: hostname, port: port, path: path, href: href });
};

var __internals__ = exports.__internals__ = methods;
exports.default = URL;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.URLComponent = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(10);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

var _Parameter = __webpack_require__(53);

var _fpUtils = __webpack_require__(20);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the URLComponent Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'url-component.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the URLComponent Record.
 */
var URLComponentSpec = {
  _model: model,
  componentName: null,
  string: null,
  parameter: null,
  variableDelimiters: (0, _immutable.List)()
};

/**
 * Holds all the internal methods used in tandem with a URLComponent
 */
var methods = {};

/**
 * The URLComponent Record
 */

var URLComponent = exports.URLComponent = function (_Record) {
  (0, _inherits3.default)(URLComponent, _Record);

  /**
   * @constructor
   * @param {Object} component: the url component to represent as a URLComponent Record.
   */
  function URLComponent(component) {
    var _ret;

    (0, _classCallCheck3.default)(this, URLComponent);

    if (component && component.string && !component.parameter) {
      component.parameter = methods.convertStringToParameter(component.componentName, component.string, component.variableDelimiters);
    }

    var _this = (0, _possibleConstructorReturn3.default)(this, (URLComponent.__proto__ || (0, _getPrototypeOf2.default)(URLComponent)).call(this, component));

    return _ret = _this, (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  /**
   * adds a constraint to the parameter of a URLComponent
   * @param {Constraint} constraint: the constraint to add
   * @returns {URLComponent} the updated URLComponent
   */


  (0, _createClass3.default)(URLComponent, [{
    key: 'addConstraint',
    value: function addConstraint(constraint) {
      return methods.addConstraintToURLComponent(this, constraint);
    }

    /**
     * generates a string representing a URLComponent, with variables wrapped based on the
     * variableDelimiters.
     * @param {List<string>} variableDelimiters: the variable delimiters. like List([ '{{', '}}' ])
     * @param {boolean} useDefault: whether to use the default value or to generate from the JSON
     * schema
     * @returns {Parameter} the updated Parameter
     */

  }, {
    key: 'generate',
    value: function generate() {
      var variableDelimiters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _immutable.List)();
      var useDefault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      return methods.generateURLComponent(this, variableDelimiters, useDefault);
    }
  }]);
  return URLComponent;
}((0, _immutable.Record)(URLComponentSpec));

/**
 * creates a simple Parameter from a key, value pair
 * @param {string} key: the key of the pair
 * @param {string} value: the value of the pair
 * @returns {Parameter} the corresponding Parameter
 */


methods.convertSimpleStringToParameter = function () {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var value = arguments[1];

  return new _Parameter.Parameter({
    key: key,
    name: key,
    type: 'string',
    default: value
  });
};

/**
 * a Map function to convert a string in a Parameter based on its index in the array.
 * A Parameter without a key is simply a string waiting to be generated, while a Parameter with a
 * key is a `variable` that could be referred to. We assume that the array is an alternating list of
 * var/non-var elements, starting with a non-var string
 * @param {string} section: the string to convert to a Parameter
 * @param {string} index: the index in the array of the string
 * @returns {Parameter} the corresponding Parameter
 */
methods.sectionMapper = function (section, index) {
  var key = index % 2 ? section : null;
  return methods.convertSimpleStringToParameter(key, section);
};

/**
 * transforms a string into a List<string> based on the variable delimiters
 * @param {string} string: the string to split
 * @param {List<string>} delimiters: the variable delimiters used to separate variables from
 * non-variables. like List([ '{{', '}}' ])
 * @returns {List<string>} the list containing all the variable/non-variable strings, in order
 *
 * NOTE: this will fail to behave correctly if the delimiters are special parts of a regex, like '$'
 */
methods.extractSectionsFromString = function (string, delimiters) {
  var regex = new RegExp(delimiters.slice(0, 2).join('(.+?)'));
  var sections = string.split(regex);
  if (delimiters.size <= 2) {
    return sections;
  }

  var subRegex = new RegExp(delimiters.slice(2).join('(.+?)'));
  return sections.map(function (section) {
    return section.split(subRegex);
  }).reduce(_fpUtils.flatten, []);
};

/**
 * converts a url component into a SequenceParameter, with its variables extracted based on
 * the delimiters provided
 * @param {string} key: the type of URL component (hostname, pathname, etc.)
 * @param {string} string: the string to transform into a sequence
 * @param {List<string>} delimiters: the variable delimiters. like List([ '{{', '}}' ])
 * @returns {Parameter} the corresponding Parameter
 */
methods.convertComplexStringToSequenceParameter = function (key, string, delimiters) {
  var sections = methods.extractSectionsFromString(string, delimiters);
  var sequence = sections.map(methods.sectionMapper);

  if (sequence.length === 1) {
    return sequence[0].set('key', key).set('name', key);
  }

  return new _Parameter.Parameter({
    key: key,
    name: key,
    type: 'string',
    superType: 'sequence',
    value: (0, _immutable.List)(sequence)
  });
};

/**
 * converts a url component into a Parameter, with its variables extracted based on
 * the delimiters provided
 * @param {string} key: the type of URL component (hostname, pathname, etc.)
 * @param {string} string: the string to transform into a Parameter
 * @param {List<string>} delimiters: the variable delimiters. like List([ '{{', '}}' ])
 * @returns {Parameter} the corresponding Parameter
 */
methods.convertStringToParameter = function (key, string) {
  var delimiters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (0, _immutable.List)();

  if (delimiters.size === 0) {
    return methods.convertSimpleStringToParameter(key, string);
  }

  return methods.convertComplexStringToSequenceParameter(key, string, delimiters);
};

/**
 * adds a constraint to the parameter of a URLComponent
 * @param {URLComponent} urlComponent: the URLComponent to update
 * @param {Constraint} constraint: the constraint to add
 * @returns {URLComponent} the updated URLComponent
 */
methods.addConstraintToURLComponent = function (urlComponent, constraint) {
  var parameter = urlComponent.get('parameter');
  if (!parameter) {
    parameter = methods.convertStringToParameter(urlComponent.get('componentName'), urlComponent.get('string'), urlComponent.get('variableDelimiters'));
  }
  var constraints = parameter.get('constraints');

  constraints = constraints.push(constraint);
  parameter = parameter.set('constraints', constraints);
  return urlComponent.set('parameter', parameter);
};

/**
 * wraps a variable with handles.
 * @param {string} variable: the variable to wrap
 * @param {List<string>} delimiters: the variable delimiters. like List([ '{{', '}}' ])
 * @returns {string} the wrapped variable
 */
methods.addHandlesToVariable = function (variable, delimiters) {
  var handles = (0, _immutable.List)([delimiters.get(0), typeof delimiters.get(1) !== 'undefined' ? delimiters.get(1) : delimiters.get(0)]);

  return handles.join(variable);
};

/**
 * wraps with handles all variables in the sequence of a SequenceParameter.
 * @param {Parameter} param: the SequenceParameter to update
 * @param {List<string>} delimiters: the variable delimiters. like List([ '{{', '}}' ])
 * @returns {Parameter} the updated Parameter
 */
methods.addVarHandlesToVariablesInSequenceParameter = function (param, delimiters) {
  var sequence = param.get('value');
  var sequenceWithVars = sequence.map(function (section, index) {
    if (index % 2 === 0) {
      return section;
    }

    var variable = methods.addHandlesToVariable(section.get('key'), delimiters);
    return section.set('default', variable);
  });

  return param.set('value', sequenceWithVars);
};

/**
 * generates a string representing a URLComponent, with variables wrapped based on the
 * variableDelimiters.
 * @param {URLComponent} urlComponent: the URLComponent to transform in a string
 * @param {List<string>} variableDelimiters: the variable delimiters. like List([ '{{', '}}' ])
 * @param {boolean} useDefault: whether to use the default value or to generate from the JSON schema
 * @returns {Parameter} the updated Parameter
 */
methods.generateURLComponent = function (urlComponent) {
  var variableDelimiters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _immutable.List)();
  var useDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var parameter = urlComponent.get('parameter');
  if (variableDelimiters.size !== 0 && parameter.get('superType') === 'sequence') {
    parameter = methods.addVarHandlesToVariablesInSequenceParameter(parameter, variableDelimiters);
  }

  return parameter.generate(useDefault);
};

var __internals__ = exports.__internals__ = methods;
exports.default = URLComponent;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(118), __esModule: true };

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(123), __esModule: true };

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(58);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _isIterable2 = __webpack_require__(105);

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = __webpack_require__(28);

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
})();

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(33)
  , getNames  = __webpack_require__(8).getNames
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames(toIObject(it));
};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(23);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(16)
  , ITERATOR   = __webpack_require__(9)('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(13);
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY        = __webpack_require__(44)
  , $export        = __webpack_require__(14)
  , redefine       = __webpack_require__(47)
  , hide           = __webpack_require__(43)
  , has            = __webpack_require__(42)
  , Iterators      = __webpack_require__(16)
  , $iterCreate    = __webpack_require__(133)
  , setToStringTag = __webpack_require__(32)
  , getProto       = __webpack_require__(8).getProto
  , ITERATOR       = __webpack_require__(9)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , methods, key;
  // Fix native
  if($native){
    var IteratorPrototype = getProto($default.call(new Base));
    // Set @@toStringTag to native iterators
    setToStringTag(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    // fix Array#{values, @@iterator}.name in V8 / FF
    if(DEF_VALUES && $native.name !== VALUES){
      VALUES_BUG = true;
      $default = function values(){ return $native.call(this); };
    }
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES  ? $default : getMethod(VALUES),
      keys:    IS_SET      ? $default : getMethod(KEYS),
      entries: !DEF_VALUES ? $default : getMethod('entries')
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR     = __webpack_require__(9)('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = __webpack_require__(8).getDesc
  , isObject = __webpack_require__(31)
  , anObject = __webpack_require__(13);
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = __webpack_require__(15)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(11)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 70 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(70)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 72 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 73 */
/***/ (function(module, exports) {



/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Standard YAML's Core schema.
// http://www.yaml.org/spec/1.2/spec.html#id2804923
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, Core schema has no distinctions from JSON schema is JS-YAML.





var Schema = __webpack_require__(18);


module.exports = new Schema({
  include: [
    __webpack_require__(75)
  ]
});


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Standard YAML's JSON schema.
// http://www.yaml.org/spec/1.2/spec.html#id2803231
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, this schema is not such strict as defined in the YAML specification.
// It allows numbers in binary notaion, use `Null` and `NULL` as `null`, etc.





var Schema = __webpack_require__(18);


module.exports = new Schema({
  include: [
    __webpack_require__(49)
  ],
  implicit: [
    __webpack_require__(171),
    __webpack_require__(163),
    __webpack_require__(165),
    __webpack_require__(164)
  ]
});


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var punycode = __webpack_require__(178);
var util = __webpack_require__(182);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(181);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.DefaultApiFlow = undefined;

var _promise = __webpack_require__(59);

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(10);

var _createClass3 = _interopRequireDefault(_createClass2);

var _environment = __webpack_require__(78);

var _environment2 = _interopRequireDefault(_environment);

var _loaders = __webpack_require__(80);

var _loaders2 = _interopRequireDefault(_loaders);

var _parsers = __webpack_require__(100);

var _parsers2 = _interopRequireDefault(_parsers);

var _serializers = __webpack_require__(103);

var _serializers2 = _interopRequireDefault(_serializers);

var _fpUtils = __webpack_require__(20);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var methods = {};

/**
 * @class DefaultApiFlow
 * @description The default core class of API-Flow.
 * It holds all the necessary methods used to convert a file from one format to another.
 */
// TODO this is not what we want (this should happen in ./loaders/loaders, ./parsers/parsers, etc.)

var DefaultApiFlow = exports.DefaultApiFlow = function () {
  function DefaultApiFlow() {
    (0, _classCallCheck3.default)(this, DefaultApiFlow);
  }

  (0, _createClass3.default)(DefaultApiFlow, null, [{
    key: 'detectFormat',

    /**
     * detects the format of a given content
     * @param {string} content: the content whose format needs to be found
     * @returns {{format: string, version: string}} the corresponding format object
     * @static
     */
    value: function detectFormat(content) {
      // TODO implement this
      return methods.detect(content);
    }

    /**
     * detects the name of a given API from a given content
     * @param {string} content: the content whose name needs to be guessed
     * @returns {string?} the corresponding API name, if it exists
     * @static
     */

  }, {
    key: 'detectName',
    value: function detectName(content) {
      // TODO implement this
      return methods.detectName(content);
    }

    /**
     * updates an environment cache with a set of resolved uris
     * @param {Object<URIString, string>} cache: an object where each key-value pair is a uri string
     * and its associated content
     * @returns {void}
     * @static
     */

  }, {
    key: 'setCache',
    value: function setCache(cache) {
      _environment2.default.setCache(cache);
    }

    /**
     * sets an environment up based on options
     * @param {Object} args: the named args of this method
     * @param {Object} args.options: a set of options containing settings relevant to the set-up of
     * the converter
     * @returns {void}
     * @static
     */

  }, {
    key: 'setup',
    value: function setup() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          options = _ref.options;

      // TODO implement this
      return methods.setup({ options: options });
    }

    /**
     * finds a primaryUri from an array of multiple items. A primaryUri is the root uri from which
     * all the other files are resolved. For instance, in a RAML document, there exists a root
     * document (with the header `#%RAML 1.0`) which can refer to multiple other subcomponents such as
     * RAML libraries. The root document's uri would be the primary uri.
     * @param {Object} args: the named args of this method
     * @param {Object} args.options: a set of options containing settings relevant to the behavior of
     * the converter
     * @param {Array<{uri: string}>} items: an array of uris from which one should be chosen as the
     * Primary URI
     * @returns {string?} the corresponding API name, if it exists
     * @static
     */

  }, {
    key: 'findPrimaryUri',
    value: function findPrimaryUri(_ref2) {
      var options = _ref2.options,
          items = _ref2.items;

      return methods.findPrimaryUri({ options: options, items: items });
    }

    /**
     * resolves a uri to a file and normalizes it based on the loader selected from the options object
     * @param {Object} args: the named args of this method
     * @param {Object} args.options: a set of options containing settings relevant to the loading of
     * the uri and it's normalization
     * @param {Object} args.uri: the uri to resolve
     * @returns {Promise} a promise that resolves if the uri is successfully loaded and normalized.
     * It resolves to the object { options, item }, where options are the options passed to the load
     * method, and item contains the normalized content of the uri.
     * @static
     */

  }, {
    key: 'load',
    value: function load(_ref3) {
      var options = _ref3.options,
          uri = _ref3.uri;

      return methods.load({ options: options, uri: uri });
    }

    /**
     * converts a normalized item in a specific format into the intermediate model.
     * @param {Object} args: the named args of this method
     * @param {Object} args.options: a set of options containing settings relevant to the parsing of
     * the item
     * @param {Object} args.item: the item to parse
     * @returns {Promise} a promise that resolves if the item is successfully parsed.
     * It resolves to the object { options, api }, where options are the options passed to the parse
     * method, and api contains the intermediate model representing the item.
     * @static
     */

  }, {
    key: 'parse',
    value: function parse(_ref4) {
      var options = _ref4.options,
          item = _ref4.item;

      return methods.parse({ options: options, item: item });
    }

    /**
     * converts an intermediate model api into a specific format.
     * @param {Object} args: the named args of this method
     * @param {Object} args.options: a set of options containing settings relevant to the
     * serialization of the model
     * @param {Object} args.api: the model to serialize
     * @returns {Promise} a promise that resolves if the item is successfully parsed.
     * It resolves to the string representation of the api in the target format
     * @static
     */

  }, {
    key: 'serialize',
    value: function serialize(_ref5) {
      var options = _ref5.options,
          api = _ref5.api;

      return methods.serialize({ options: options, api: api });
    }

    /**
     * resolves a uri to a file, loads, parses and converts it based on the provided options object.
     * It is a shorthand method for the successive calls of `load`, `parse` and `serialize`.
     * @param {Object} args: the named args of this method
     * @param {Object} args.options: a set of options containing settings relevant to the conversion
     * of the file at the given uri
     * @param {Object} args.uri: the uri of the file to convert
     * @returns {Promise} a promise that resolves if the uri is successfully loaded and converted.
     * It resolves to the string representation of the api in the target format.
     * @static
     */

  }, {
    key: 'transform',
    value: function transform(_ref6) {
      var options = _ref6.options,
          uri = _ref6.uri;

      return methods.transform({ options: options, uri: uri });
    }
  }]);
  return DefaultApiFlow;
}();

// TODO implement this


methods.findPrimaryUri = function (_ref7) {
  var items = _ref7.items;

  var candidate = items.filter(function (item) {
    return _loaders2.default.filter(function (loader) {
      return loader.isParsable(item);
    }).length > 0;
  })[0];

  if (!candidate) {
    return null;
  }

  return candidate.uri;
};

methods.setup = function () {
  var _ref8 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref8$options = _ref8.options,
      options = _ref8$options === undefined ? {} : _ref8$options;

  options.fsResolver = _environment2.default.fsResolver;
  options.httpResolver = _environment2.default.httpResolver;

  return options;
};

/**
 * finds a loader for the source format, or infers one from the extension of the primary file
 * @param {Object} args: the named arguments of the methods
 * @param {Object} args.options: the settings to use to convert this ensemble of items
 * @param {Object} args.primary: the primary file of this conversion, it is used as a starting point
 * by the loader to extract all required dependencies, and fix files if needed
 * @returns {Loader?} the loader that is required to prepare the primary file and its associated
 * items, if one was found.
 */
methods.getLoader = function (_ref9) {
  var _ref9$options = _ref9.options,
      options = _ref9$options === undefined ? {} : _ref9$options,
      uri = _ref9.uri;

  var _ref10 = options.source || {},
      format = _ref10.format;

  if (!format) {
    var _loader = _loaders2.default.getLoaderByExtension(uri, true);
    return _loader;
  }

  var loader = _loaders2.default.getLoaderByFormat(format);
  return loader;
};

/**
 * load a primary file and associated items in memory, with all the required dependencies that can
 * be resolved, and fixes the files to remove external information
 * @param {Object} args: the named arguments of the methods
 * @param {Object} args.options: the settings to use to convert this ensemble of items
 * @param {string} args.uri: the uri of the primary file
 * @param {Item?} args.primary: the primary file to load, if there is one.
 * @returns {Promise} a promise that resolves once everything needed has been loaded into memory.
 */
methods.load = function (_ref11) {
  var options = _ref11.options,
      uri = _ref11.uri;

  var $options = options;
  if (!options || !options.fsResolver || !options.httpResolver) {
    $options = methods.setup({ options: options });
  }

  var loader = methods.getLoader({ options: $options, uri: uri });

  if (!loader) {
    return _promise2.default.reject(new Error('could not load file(s): missing source format'));
  }

  return loader.load({ options: $options, uri: uri });
};

/**
 * iteratively (reduce) finds the best parser for a given item
 * @param {Item} item: the item to test the parser against
 * @param {{score: number, format: string, version: string}} best: the best parser found yet
 * @param {Parser} parser: the parser to test
 * @returns {{score: number, format: string, version: string}} best: the updated best parser
 */
methods.findBestParser = function (item, best, parser) {
  var _parser$detect = parser.detect(item),
      format = _parser$detect.format,
      version = _parser$detect.version,
      score = _parser$detect.score;

  if (best.score < score) {
    return { format: format, version: version, score: score };
  }

  return best;
};

/**
 * groups item results by format and version, iff the associated score is above 0.9
 * @param {Object} acc: the accumulator that holds the items grouped by format and version
 * @param {{score: number, format: string, version: string}} toGroup: the best parser associated
 * with an item
 * @return {Object} acc: the updated accumulator
 */
methods.groupByFormatAndVersion = function (acc, toGroup) {
  var version = toGroup.version,
      format = toGroup.format,
      score = toGroup.score;


  if (score < 0.9) {
    return acc;
  }

  var key = format + '@' + version;
  acc[key] = acc[key] || [];
  acc[key].push(toGroup);
  return acc;
};

/**
 * infers the version of the format that should be used for the items
 * @param {string} format: the format of the items
 * @param {Item} item: the item to use to find the version of the format
 * @returns {{format: string, version: string?}} the infered format and version
 */
methods.inferVersion = function (format, item) {
  var potentialParsers = _parsers2.default.getParsersByFormat(format);

  var findBestParser = (0, _fpUtils.currify)(methods.findBestParser, item);
  var candidate = potentialParsers.reduce(findBestParser, { format: format, version: null, score: -1 });

  if (candidate.format && candidate.version) {
    return { format: format, version: candidate.version };
  }

  return { format: format, version: null };
};

/**
 * infers the format and version that should be used for the items
 * @param {Item} item: the items to use to find the version of the format
 * @returns {{format: string?, version: string?}} the infered format and version
 */
methods.inferBestFormatAndBestVersion = function (item) {
  var potentialParsers = _parsers2.default.getParsers();

  var findBestParser = (0, _fpUtils.currify)(methods.findBestParser, item);
  var candidate = potentialParsers.reduce(findBestParser, { format: null, version: null, score: -1 });

  if (candidate.format && candidate.version) {
    return { format: candidate.format, version: candidate.version };
  }

  return { format: null, version: null };
};

/**
 * complements format and version with infered format and version from items
 * @param {Object} args: the named arguments of the method
 * @param {string?} args.format: the parse format of the loaded items, if it was provided,
 * @param {string?} args.version: the version of the format of the primary file, if it was provided.
 * @param {Array<Item>} args.items: the items to use to infer the missing format and/or the missing
 * version of the loader
 * @returns {{ format: string?, version: string? }} the resulting format and version
 */
methods.inferFormatAndVersion = function (_ref12) {
  var format = _ref12.format,
      version = _ref12.version,
      item = _ref12.item;

  if (format && version) {
    return { format: format, version: version };
  }

  if (format) {
    return methods.inferVersion(format, item);
  }

  return methods.inferBestFormatAndBestVersion(item);
};

/**
 * finds the parser corresponding to a set of items or infers it.
 * @param {Object} args: the named arguments of the method
 * @param {Object} args.options: the settings to use to parse the items
 * @param {Array<Item>} items: the loaded items.
 * @returns {Parser?} the corresponding parser
 */
methods.getParser = function (_ref13) {
  var _ref13$options = _ref13.options,
      options = _ref13$options === undefined ? {} : _ref13$options,
      item = _ref13.item;

  var _ref14 = options.source || {},
      format = _ref14.format,
      version = _ref14.version;

  if (!format || !version) {
    var infered = methods.inferFormatAndVersion({ format: format, version: version, item: item });

    format = infered.version;
    version = infered.version;
  }

  if (!format || !version) {
    return null;
  }

  var parser = _parsers2.default.getParserByFormatAndVersion({ format: format, version: version });
  return parser;
};

/**
 * parses an array of loaded items into Apis
 * @param {Object} args: the named arguments of the method
 * @param {Object} args.options: the settings to use to parse the items
 * @param {Array<Item>} items: the loaded items to parse
 * @returns {Promise} a promise that resolves with an array of Apis and options if it successfully
 * parses the items
 */
methods.parse = function (_ref15) {
  var options = _ref15.options,
      item = _ref15.item;

  var parser = methods.getParser({ options: options, item: item });

  if (!parser) {
    return _promise2.default.reject(new Error('could not parse file(s): missing source format'));
  }

  return parser.parse({ options: options, item: item });
};

/**
 * finds the serializer to use for the Apis.
 * @param {Object} args: the named arguments of the method
 * @param {Object} args.options: the settings to use to serialize the Apis
 * @returns {Serializer?} the corresponding serializer
 */
methods.getSerializer = function (_ref16) {
  var _ref16$options = _ref16.options,
      options = _ref16$options === undefined ? {} : _ref16$options;

  var _ref17 = options.target || {},
      format = _ref17.format,
      version = _ref17.version;

  if (!format) {
    return null;
  }

  if (!version) {
    return _serializers2.default.getNewestSerializerByFormat(format);
  }

  return _serializers2.default.getSerializerByFormatAndVersion({ format: format, version: version });
};

/**
 * parses an array of loaded Apis into their expected format
 * @param {Object} args: the named arguments of the method
 * @param {Object} args.options: the settings to use to serialize the items
 * @param {Array<Item>} items: the Apis to serialize
 * @returns {Promise} a promise that resolves with an array of Items if it successfully
 * serializes the items
 */
methods.serialize = function (_ref18) {
  var options = _ref18.options,
      api = _ref18.api;

  var serializer = methods.getSerializer({ options: options });

  if (!serializer) {
    return _promise2.default.reject(new Error('could not convert Api(s): missing target format'));
  }

  var serialized = serializer.serialize({ options: options, api: api });
  return serialized;
};

methods.transform = function (_ref19) {
  var options = _ref19.options,
      uri = _ref19.uri;

  return methods.load({ options: options, uri: uri }).then(methods.parse, methods.handleLoadError).then(methods.serialize, methods.handleParseError).catch(methods.handleSerializeError);
};

var __internals__ = exports.__internals__ = methods;
exports.default = DefaultApiFlow;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.environment = undefined;

var _apiFlowConfig = __webpack_require__(19);

var environment = exports.environment = _apiFlowConfig.environment;
exports.default = environment;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = undefined;

var _promise = __webpack_require__(59);

var _promise2 = _interopRequireDefault(_promise);

var _assign = __webpack_require__(21);

var _assign2 = _interopRequireDefault(_assign);

var _PawShims = __webpack_require__(50);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cache = {};

var methods = {};

methods.setCache = function ($cache) {
  if ($cache) {
    (0, _assign2.default)(cache, $cache);
  } else {
    cache = {};
  }
};

methods.fsResolve = function (uri) {
  var cleanUri = decodeURIComponent(uri.split('#')[0]);

  if (cache[cleanUri]) {
    return _promise2.default.resolve(cache[cleanUri]);
  }

  if (cache['file://' + cleanUri]) {
    return _promise2.default.resolve(cache['file://' + cleanUri]);
  }

  var msg = 'Sandbox error: include ' + cleanUri + ' in your import by dragging it along with the main file.';

  return _promise2.default.reject(new Error(msg));
};

methods.httpResolve = function (uri) {
  var cleanUri = uri.split('#')[0];

  if (cache[cleanUri]) {
    return _promise2.default.resolve(cache[cleanUri]);
  }

  return new _promise2.default(function (resolve, reject) {
    var request = new _PawShims.NetworkHTTPRequest();
    request.requestUrl = uri;
    request.requestMethod = 'GET';
    request.requestTimeout = 20 * 1000;
    var status = request.send();

    if (status && request.responseStatusCode < 300) {
      resolve(request.responseBody);
    } else {
      var msg = 'Failed to fetch ' + uri + '. Got code: ' + request.responseStatusCode;
      reject(new Error(msg));
    }
  });
};

var PawEnvironment = {
  setCache: methods.setCache,
  cache: cache,
  fsResolver: { resolve: methods.fsResolve },
  httpResolver: { resolve: methods.httpResolve }
};

var __internals__ = exports.__internals__ = methods;
exports.default = PawEnvironment;

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLoaderByFormat = exports.getLoaderByExtension = undefined;

var _apiFlowConfig = __webpack_require__(19);

var methods = {};

methods.extractExtension = function (uri) {
  if (uri) {
    var extension = uri.split('.').slice(-1)[0];
    if (!extension || extension === uri) {
      return null;
    }

    return extension;
  }

  return null;
};

methods.getLoaderByExtension = function (item) {
  var onlyParsableLoaders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var extension = methods.extractExtension(item);

  if (!extension) {
    return null;
  }

  var usableLoaders = _apiFlowConfig.loaders.filter(function (loader) {
    return loader.extensions.indexOf(extension) !== -1;
  });

  if (onlyParsableLoaders) {
    return usableLoaders.filter(function (loader) {
      return loader.parsable === true;
    })[0] || null;
  }

  return usableLoaders[0] || null;
};

methods.getLoaderByFormat = function (format) {
  return _apiFlowConfig.loaders.filter(function (loader) {
    return loader.format === format;
  })[0] || null;
};

methods.filter = function () {
  return _apiFlowConfig.loaders.filter.apply(_apiFlowConfig.loaders, arguments);
};

var getLoaderByExtension = exports.getLoaderByExtension = methods.getLoaderByExtension;
var getLoaderByFormat = exports.getLoaderByFormat = methods.getLoaderByFormat;

exports.default = methods;

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PawLoader = undefined;

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(10);

var _createClass3 = _interopRequireDefault(_createClass2);

var _class, _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var methods = {};

var __meta__ = {
  extensions: [],
  parsable: true,
  format: 'paw'
};

/**
 * @class PawLoader
 * @description a dummy associated with paw.
 * This is a hack around the options passed to the Parser, as Paw directly exposes a context object
 * as well as a list of items to export
 */
var PawLoader = exports.PawLoader = (_temp = _class = function () {
  function PawLoader() {
    (0, _classCallCheck3.default)(this, PawLoader);
  }

  (0, _createClass3.default)(PawLoader, null, [{
    key: 'load',


    /**
     * Resolves a URI and fixes it if necessary.
     * @param {Object} namedParams - an object holding the named parameters used for the resolution of
     * the URI.
     * @param {Object} namedParams.options - an object holding all the settings necessary for
     * resolving, loading, parsing and serializing a uri and its dependencies.
     * @param {string} uri - the URI to resolve to a file that will be used as the primary file for
     * this loader
     * @returns {Promise} a Promise containing the `options` and normalized `item` in an object. See
     * `methods.fixPrimary` for more information.
     * @static
     */
    value: function load(_ref) {
      var options = _ref.options,
          uri = _ref.uri;

      return methods.load({ options: options, uri: uri });
    }

    /**
     * Tests whether the content of a file is parsable by this loader and associated parser. This is
     * used to tell which loader/parser combo should be used.
     * @param {string?} content - the content of the file to test
     * @returns {boolean} whether it is parsable or not
     * @static
     */

  }, {
    key: 'isParsable',
    value: function isParsable(_ref2) {
      var content = _ref2.content;

      return methods.isParsable(content);
    }
  }]);
  return PawLoader;
}(), _class.extensions = __meta__.extensions, _class.parsable = __meta__.parsable, _class.format = __meta__.format, _temp);


methods.isParsable = function () {
  return false;
};
methods.load = function (_ref3) {
  var options = _ref3.options;
  return { options: options };
};

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCodeGenerator = exports.registerImporter = exports.RecordParameter = exports.NetworkHTTPRequest = exports.InputField = exports.DynamicString = exports.DynamicValue = exports.PawRequestMock = exports.PawContextMock = exports.ClassMock = exports.Mock = undefined;

var _assign = __webpack_require__(21);

var _assign2 = _interopRequireDefault(_assign);

var _getIterator2 = __webpack_require__(28);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _getOwnPropertyNames = __webpack_require__(107);

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * sets up a spy on functions of a object
 * @param {Object} $this: the object to add spies to
 * @param {string} field: the field for which to add a spy
 * @param {string} prefix: the prefix to use for the spy object
 * @returns {Function} a hook function that updates the state of the spy before calling the spied-on
 * function.
 */
var setupFuncSpy = function setupFuncSpy($this, field, prefix) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    $this[prefix + 'spy'][field].count += 1;
    $this[prefix + 'spy'][field].calls.push(args);
    return $this[prefix + 'spy'][field].func.apply($this, args);
  };
};

/**
 * creates a spies object that holds all the relevant information for a field
 * @param {Object} spies: the spies object to update
 * @param {Object} obj: the object to spy on
 * @returns {Object} the updated spies object
 */
var createSpies = function createSpies(spies, obj) {
  for (var field in obj) {
    if (obj.hasOwnProperty(field) && typeof obj[field] === 'function') {
      spies[field] = {
        count: 0,
        calls: [],
        func: obj[field]
      };
    }
  }

  return spies;
};

/**
 * binds spies from an instance to an object methods
 * @param {Object} $this: the instance to which the spies should be bound
 * @param {Object} obj: the object to spy on
 * @param {string} prefix: the prefix to use for the spy methods and fields
 * @returns {void}
 */
var bindSpies = function bindSpies($this, obj, prefix) {
  for (var field in obj) {
    // TODO maybe go up the prototype chain to spoof not-owned properties
    if (obj.hasOwnProperty(field)) {
      if (typeof obj[field] === 'function') {
        $this[field] = setupFuncSpy($this, field, prefix);
      } else {
        $this[field] = obj[field];
      }
    }
  }
};

/**
 * @class Mock
 * @description wraps an arbitrary object and exposes spies on its methods.
 */

var Mock =
/**
 * creates a Mock instance based on an object
 * @constructor
 * @param {Object} obj: the object to spy on
 * @param {string} prefix: the prefix to use for the spy methods and fields.
 */
exports.Mock = function Mock(obj) {
  var _this = this;

  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '$$_';
  (0, _classCallCheck3.default)(this, Mock);

  var spies = createSpies({}, obj);
  this[prefix + 'spy'] = spies;

  bindSpies(this, obj, prefix);

  this[prefix + 'spyOn'] = function (field, func) {
    _this[prefix + 'spy'][field].func = func;
    return _this;
  };

  this[prefix + 'getSpy'] = function (field) {
    return _this[prefix + 'spy'][field];
  };
};

/**
 * @class ClassMock
 * @description wraps a class instance and exposes spies on its methods.
 */


var ClassMock = exports.ClassMock = function (_Mock) {
  (0, _inherits3.default)(ClassMock, _Mock);

  /**
   * creates a ClassMock instance based on a class instance
   * @constructor
   * @param {Object} instance: the class instance to spy on
   * @param {string} prefix: the prefix to use for the spy methods and fields.
   */
  function ClassMock(instance) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '$$_';
    (0, _classCallCheck3.default)(this, ClassMock);

    var properties = (0, _getOwnPropertyNames2.default)((0, _getPrototypeOf2.default)(instance));

    var obj = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator3.default)(properties), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var property = _step.value;

        if (property !== 'constructor') {
          obj[property] = _getPrototypeOf2.default.call(Object, instance)[property];
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return (0, _possibleConstructorReturn3.default)(this, (ClassMock.__proto__ || (0, _getPrototypeOf2.default)(ClassMock)).call(this, obj, prefix));
  }

  return ClassMock;
}(Mock);

/**
 * @class PawContextMock
 * @description creates a mock of a Paw Context.
 */


var PawContextMock = exports.PawContextMock = function (_Mock2) {
  (0, _inherits3.default)(PawContextMock, _Mock2);

  /**
   * creates a fake Paw Context
   * @constructor
   * @param {Object} baseObj: a base object to use for the spies
   * @param {string} prefix: the prefix to use for the spy methods and fields
   */
  function PawContextMock(baseObj, prefix) {
    (0, _classCallCheck3.default)(this, PawContextMock);

    var obj = {
      getCurrentRequest: function getCurrentRequest() {},
      getRequestByName: function getRequestByName() {},
      getRequestGroupByName: function getRequestGroupByName() {},
      getRootRequestTreeItems: function getRootRequestTreeItems() {},
      getRootRequests: function getRootRequests() {},
      getAllRequests: function getAllRequests() {},
      getAllGroups: function getAllGroups() {},
      getEnvironmentDomainByName: function getEnvironmentDomainByName() {},
      getEnvironmentVariableByName: function getEnvironmentVariableByName() {},
      getRequestById: function getRequestById() {},
      getRequestGroupById: function getRequestGroupById() {},
      getEnvironmentDomainById: function getEnvironmentDomainById() {},
      getEnvironmentVariableById: function getEnvironmentVariableById() {},
      getEnvironmentById: function getEnvironmentById() {},
      createRequest: function createRequest() {},
      createRequestGroup: function createRequestGroup() {},
      createEnvironmentDomain: function createEnvironmentDomain() {}
    };
    (0, _assign2.default)(obj, baseObj);
    return (0, _possibleConstructorReturn3.default)(this, (PawContextMock.__proto__ || (0, _getPrototypeOf2.default)(PawContextMock)).call(this, obj, prefix));
  }

  return PawContextMock;
}(Mock);

/**
 * @class PawContextMock
 * @description creates a mock of a Paw Request.
 */


var PawRequestMock = exports.PawRequestMock = function (_Mock3) {
  (0, _inherits3.default)(PawRequestMock, _Mock3);

  /**
   * creates a fake Paw Request
   * @constructor
   * @param {Object} baseObj: a base object to use for the spies
   * @param {string} prefix: the prefix to use for the spy methods and fields
   */
  function PawRequestMock(baseObj, prefix) {
    (0, _classCallCheck3.default)(this, PawRequestMock);

    var obj = {
      id: null,
      name: null,
      order: null,
      parent: null,
      url: null,
      method: null,
      headers: null,
      httpBasicAuth: null,
      oauth1: null,
      oauth2: null,
      body: null,
      urlEncodedBody: null,
      multipartBody: null,
      jsonBody: null,
      timeout: null,
      followRedirects: null,
      redirectAuthorization: null,
      redirectMethod: null,
      sendCookies: null,
      storeCookies: null,
      getUrl: function getUrl() {},
      getUrlBase: function getUrlBase() {},
      getUrlParams: function getUrlParams() {},
      getUrlParameters: function getUrlParameters() {},
      getHeaders: function getHeaders() {},
      getHeaderByName: function getHeaderByName() {},
      setHeader: function setHeader() {},
      getHttpBasicAuth: function getHttpBasicAuth() {},
      getOAuth1: function getOAuth1() {},
      getOAuth2: function getOAuth2() {},
      getBody: function getBody() {},
      getUrlEncodedBody: function getUrlEncodedBody() {},
      getMultipartBody: function getMultipartBody() {},
      getLastExchange: function getLastExchange() {}
    };
    (0, _assign2.default)(obj, baseObj);
    return (0, _possibleConstructorReturn3.default)(this, (PawRequestMock.__proto__ || (0, _getPrototypeOf2.default)(PawRequestMock)).call(this, obj, prefix));
  }

  return PawRequestMock;
}(Mock);

/**
 * @class DynamicValue
 * @description creates a mock of a DynamicValue.
 */


var DynamicValue = exports.DynamicValue = function (_Mock4) {
  (0, _inherits3.default)(DynamicValue, _Mock4);

  /**
   * creates a fake DynamicValue
   * @constructor
   * @param {string} type: the type of the DynamicValue
   * @param {Object} baseObj: a base object to use for the spies
   * @param {string} prefix: the prefix to use for the spy methods and fields
   */
  function DynamicValue(type, baseObj) {
    var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '$$_';
    (0, _classCallCheck3.default)(this, DynamicValue);

    var obj = {
      type: type,
      toString: function toString() {},
      getEvaluatedString: function getEvaluatedString() {}
    };
    (0, _assign2.default)(obj, baseObj);
    return (0, _possibleConstructorReturn3.default)(this, (DynamicValue.__proto__ || (0, _getPrototypeOf2.default)(DynamicValue)).call(this, obj, prefix));
  }

  return DynamicValue;
}(Mock);

/**
 * @class DynamicString
 * @description creates a mock of a DynamicString.
 */


var DynamicString = exports.DynamicString = function (_Mock5) {
  (0, _inherits3.default)(DynamicString, _Mock5);

  /**
   * creates a fake DynamicString
   * @constructor
   * @param {Array} items: the items in a DynamicString
   */
  function DynamicString() {
    for (var _len2 = arguments.length, items = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      items[_key2] = arguments[_key2];
    }

    (0, _classCallCheck3.default)(this, DynamicString);

    var obj = {
      length: null,
      components: items,
      toString: function toString() {},
      getComponentAtIndex: function getComponentAtIndex() {},
      getSimpleString: function getSimpleString() {},
      getOnlyString: function getOnlyString() {},
      getOnlyDynamicValue: function getOnlyDynamicValue() {},
      getEvaluatedString: function getEvaluatedString() {},
      copy: function copy() {},
      appendString: function appendString() {},
      appendDynamicValue: function appendDynamicValue() {},
      appendDynamicString: function appendDynamicString() {}
    };
    return (0, _possibleConstructorReturn3.default)(this, (DynamicString.__proto__ || (0, _getPrototypeOf2.default)(DynamicString)).call(this, obj, '$$_'));
  }

  return DynamicString;
}(Mock);

/**
 * @class InputField
 * @description creates a mock of an InputField.
 */


var InputField = exports.InputField = function (_Mock6) {
  (0, _inherits3.default)(InputField, _Mock6);

  /**
   * creates a fake InputField
   * @constructor
   * @param {string} key: the key of an InputField
   * @param {string} name: the name of an InputField
   * @param {string} type: the type of an InputField
   * @param {Object} options: the options of an InputField
   * @param {string} prefix: the prefix to use for the spy methods and fields
   */
  function InputField(key, name, type, options) {
    var prefix = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
    (0, _classCallCheck3.default)(this, InputField);

    var obj = {
      key: key,
      name: name,
      type: type,
      options: options
    };
    return (0, _possibleConstructorReturn3.default)(this, (InputField.__proto__ || (0, _getPrototypeOf2.default)(InputField)).call(this, obj, prefix));
  }

  return InputField;
}(Mock);

/**
 * @class NetworkHTTPRequest
 * @description creates a mock of a NetworkHTTPRequest.
 */


var NetworkHTTPRequest = exports.NetworkHTTPRequest = function (_Mock7) {
  (0, _inherits3.default)(NetworkHTTPRequest, _Mock7);

  /**
   * creates a fake InputField
   * @constructor
   * @param {string} prefix: the prefix to use for the spy methods and fields
   */
  function NetworkHTTPRequest() {
    var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    (0, _classCallCheck3.default)(this, NetworkHTTPRequest);

    var obj = {
      requestUrl: null,
      requestMethod: null,
      requestTimeout: null,
      requestBody: null,
      responseStatusCode: null,
      responseHeaders: null,
      responseBody: null,
      setRequestHeader: function setRequestHeader() {},
      getRequestHeader: function getRequestHeader() {},
      getResponseHeader: function getResponseHeader() {},
      send: function send() {}
    };
    return (0, _possibleConstructorReturn3.default)(this, (NetworkHTTPRequest.__proto__ || (0, _getPrototypeOf2.default)(NetworkHTTPRequest)).call(this, obj, prefix));
  }

  return NetworkHTTPRequest;
}(Mock);

/**
 * @class RecordParameter
 * @description creates a mock of a RecordParameter.
 */


var RecordParameter = exports.RecordParameter = function (_Mock8) {
  (0, _inherits3.default)(RecordParameter, _Mock8);

  /**
   * creates a fake RecordParameter
   * @constructor
   * @param {string} key: the key of an RecordParameter
   * @param {string} value: the value of an RecordParameter
   * @param {boolean?} enabled: whether a RecordParameter is enabled
   * @param {string} prefix: the prefix to use for the spy methods and fields
   */
  function RecordParameter(key, value, enabled) {
    var prefix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    (0, _classCallCheck3.default)(this, RecordParameter);

    var obj = {
      key: key, value: value, enabled: enabled,
      toString: function toString() {}
    };

    return (0, _possibleConstructorReturn3.default)(this, (RecordParameter.__proto__ || (0, _getPrototypeOf2.default)(RecordParameter)).call(this, obj, prefix));
  }

  return RecordParameter;
}(Mock);

/**
 * a simple mock around a class that does nothing
 * @param {Object} _class: the class to wrap with nothing
 * @returns {Object} the same _class, with nothing changed
 */


var registerImporter = exports.registerImporter = function registerImporter(_class) {
  return _class;
};

/**
 * a simple mock around a class that does nothing
 * @param {Object} _class: the class to wrap with nothing
 * @returns {Object} the same _class, with nothing changed
 */
var registerCodeGenerator = exports.registerCodeGenerator = function registerCodeGenerator(_class) {
  return _class;
};

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Api = undefined;

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

var _Info = __webpack_require__(52);

var _Info2 = _interopRequireDefault(_Info);

var _Store = __webpack_require__(55);

var _Store2 = _interopRequireDefault(_Store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Api Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'api.core.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Api Record.
 */
var ApiSpec = {
  _model: model,
  resources: new _immutable.OrderedMap(),
  group: null,
  store: new _Store2.default(),
  info: new _Info2.default()
};

/**
 * The Api Record
 */
var Api = exports.Api = (0, _immutable.Record)(ApiSpec);
exports.default = Api;

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XMLSchemaConstraint = exports.JSONSchemaConstraint = exports.EnumConstraint = exports.MinimumPropertiesConstraint = exports.MaximumPropertiesConstraint = exports.UniqueItemsConstraint = exports.MinimumItemsConstraint = exports.MaximumItemsConstraint = exports.PatternConstraint = exports.MinimumLengthConstraint = exports.MaximumLengthConstraint = exports.ExclusiveMinimumConstraint = exports.MinimumConstraint = exports.ExclusiveMaximumConstraint = exports.MaximumConstraint = exports.MultipleOfConstraint = exports.Constraint = undefined;

var _keys = __webpack_require__(22);

var _keys2 = _interopRequireDefault(_keys);

var _stringify = __webpack_require__(37);

var _stringify2 = _interopRequireDefault(_stringify);

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(10);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _immutable2 = _interopRequireDefault(_immutable);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Constraint Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'constraint.constraint.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the BasicAuth Record.
 * - `name` is the name of the Constraint
 * - `value` is the context used by the `expression` field to validate an object
 * - `expression` is used to test whether an object is valid or not
 */
var ConstraintSpec = {
  _model: model,
  name: null,
  value: null,
  expression: function expression() {
    return false;
  }
};

/**
 * The base Constraint class
 */

var Constraint = exports.Constraint = function (_Immutable$Record) {
  (0, _inherits3.default)(Constraint, _Immutable$Record);

  function Constraint() {
    (0, _classCallCheck3.default)(this, Constraint);
    return (0, _possibleConstructorReturn3.default)(this, (Constraint.__proto__ || (0, _getPrototypeOf2.default)(Constraint)).apply(this, arguments));
  }

  (0, _createClass3.default)(Constraint, [{
    key: 'evaluate',

    /**
     * @param {any} d: a value to test against the expression of this Constraint
     * @returns {boolean} true if the value is valid against the expression.
     */
    value: function evaluate(d) {
      return this.get('expression')(d);
    }

    /**
     * @returns {Object} the JSON Schema corresponding to this Constraint
     */

  }, {
    key: 'toJSONSchema',
    value: function toJSONSchema() {
      var obj = {};
      var key = this.get('name');
      var value = this.get('value');
      obj[key] = value;
      return obj;
    }
  }]);
  return Constraint;
}(_immutable2.default.Record(ConstraintSpec));

/**
 * A MultipleOf Constraint.
 * evaluate returns true if and only if the object to test is a multiple of
 * the value passed to the constructor
 */


var MultipleOfConstraint = exports.MultipleOfConstraint = function (_Constraint2) {
  (0, _inherits3.default)(MultipleOfConstraint, _Constraint2);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function MultipleOfConstraint(value) {
    (0, _classCallCheck3.default)(this, MultipleOfConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'multiple-of.constraint.models',
        version: '0.1.0'
      }),
      name: 'multipleOf',
      value: value,
      expression: function expression(d) {
        return d % value === 0;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (MultipleOfConstraint.__proto__ || (0, _getPrototypeOf2.default)(MultipleOfConstraint)).call(this, obj));
  }

  return MultipleOfConstraint;
}(Constraint);

/**
 * A Maximum Constraint.
 * evaluate returns true if and only if the object to test is smaller than
 * the value passed to the constructor
 */


var MaximumConstraint = exports.MaximumConstraint = function (_Constraint3) {
  (0, _inherits3.default)(MaximumConstraint, _Constraint3);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function MaximumConstraint(value) {
    (0, _classCallCheck3.default)(this, MaximumConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'maximum.constraint.models',
        version: '0.1.0'
      }),
      name: 'maximum',
      value: value,
      expression: function expression(d) {
        return d <= value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (MaximumConstraint.__proto__ || (0, _getPrototypeOf2.default)(MaximumConstraint)).call(this, obj));
  }

  return MaximumConstraint;
}(Constraint);

/**
 * An ExclusiveMaximum Constraint.
 * evaluate returns true if and only if the object to test is strictly smaller
 * the value passed to the constructor
 */


var ExclusiveMaximumConstraint = exports.ExclusiveMaximumConstraint = function (_Constraint4) {
  (0, _inherits3.default)(ExclusiveMaximumConstraint, _Constraint4);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function ExclusiveMaximumConstraint(value) {
    (0, _classCallCheck3.default)(this, ExclusiveMaximumConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'exclusive-maximum.constraint.models',
        version: '0.1.0'
      }),
      name: 'exclusiveMaximum',
      value: value,
      expression: function expression(d) {
        return d < value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (ExclusiveMaximumConstraint.__proto__ || (0, _getPrototypeOf2.default)(ExclusiveMaximumConstraint)).call(this, obj));
  }

  /**
   * @returns {Object} the JSON Schema corresponding to this Constraint
   */


  (0, _createClass3.default)(ExclusiveMaximumConstraint, [{
    key: 'toJSONSchema',
    value: function toJSONSchema() {
      var obj = {};
      var key = this.get('name');
      var value = this.get('value');
      obj.maximum = value;
      obj[key] = true;
      return obj;
    }
  }]);
  return ExclusiveMaximumConstraint;
}(Constraint);

/**
 * A Minimum Constraint
 * evaluate returns true if and only if the object to test is larger than
 * the value passed to the constructor
 */


var MinimumConstraint = exports.MinimumConstraint = function (_Constraint5) {
  (0, _inherits3.default)(MinimumConstraint, _Constraint5);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function MinimumConstraint(value) {
    (0, _classCallCheck3.default)(this, MinimumConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'minimum.constraint.models',
        version: '0.1.0'
      }),
      name: 'minimum',
      value: value,
      expression: function expression(d) {
        return d >= value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (MinimumConstraint.__proto__ || (0, _getPrototypeOf2.default)(MinimumConstraint)).call(this, obj));
  }

  return MinimumConstraint;
}(Constraint);

/**
 * An ExclusiveMinimum Constraint.
 * evaluate returns true if and only if the object to test is strictly larger than
 * the value passed to the constructor
 */


var ExclusiveMinimumConstraint = exports.ExclusiveMinimumConstraint = function (_Constraint6) {
  (0, _inherits3.default)(ExclusiveMinimumConstraint, _Constraint6);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function ExclusiveMinimumConstraint(value) {
    (0, _classCallCheck3.default)(this, ExclusiveMinimumConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'exclusive-minimum.constraint.models',
        version: '0.1.0'
      }),
      name: 'exclusiveMinimum',
      value: value,
      expression: function expression(d) {
        return d > value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (ExclusiveMinimumConstraint.__proto__ || (0, _getPrototypeOf2.default)(ExclusiveMinimumConstraint)).call(this, obj));
  }

  /**
   * @returns {Object} the JSON Schema corresponding to this Constraint
   */


  (0, _createClass3.default)(ExclusiveMinimumConstraint, [{
    key: 'toJSONSchema',
    value: function toJSONSchema() {
      var obj = {};
      var key = this.get('name');
      var value = this.get('value');
      obj.minimum = value;
      obj[key] = true;
      return obj;
    }
  }]);
  return ExclusiveMinimumConstraint;
}(Constraint);

/**
 * A MaximumLength Constraint.
 * evaluate returns true if and only if the object to test has a length smaller than
 * the value passed to the constructor
 */


var MaximumLengthConstraint = exports.MaximumLengthConstraint = function (_Constraint7) {
  (0, _inherits3.default)(MaximumLengthConstraint, _Constraint7);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function MaximumLengthConstraint(value) {
    (0, _classCallCheck3.default)(this, MaximumLengthConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'maximum-length.constraint.models',
        version: '0.1.0'
      }),
      name: 'maxLength',
      value: value,
      expression: function expression(d) {
        return d.length <= value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (MaximumLengthConstraint.__proto__ || (0, _getPrototypeOf2.default)(MaximumLengthConstraint)).call(this, obj));
  }

  return MaximumLengthConstraint;
}(Constraint);

/**
 * A MinimumLength Constraint.
 * evaluate returns true if and only if the object to test has a length larger than
 * the value passed to the constructor
 */


var MinimumLengthConstraint = exports.MinimumLengthConstraint = function (_Constraint8) {
  (0, _inherits3.default)(MinimumLengthConstraint, _Constraint8);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function MinimumLengthConstraint(value) {
    (0, _classCallCheck3.default)(this, MinimumLengthConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'minimum-length.constraint.models',
        version: '0.1.0'
      }),
      name: 'minLength',
      value: value,
      expression: function expression(d) {
        return d.length >= value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (MinimumLengthConstraint.__proto__ || (0, _getPrototypeOf2.default)(MinimumLengthConstraint)).call(this, obj));
  }

  return MinimumLengthConstraint;
}(Constraint);

/**
 * A Pattern Constraint.
 * evaluate returns true if and only if the object to test matches
 * the pattern passed to the constructor
 */


var PatternConstraint = exports.PatternConstraint = function (_Constraint9) {
  (0, _inherits3.default)(PatternConstraint, _Constraint9);

  /**
   * @constructor
   * @param {string} value: the value to use as a basis for the Constraint
   */
  function PatternConstraint(value) {
    (0, _classCallCheck3.default)(this, PatternConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'pattern.constraint.models',
        version: '0.1.0'
      }),
      name: 'pattern',
      value: value,
      expression: function expression(d) {
        return d.match(value) !== null;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (PatternConstraint.__proto__ || (0, _getPrototypeOf2.default)(PatternConstraint)).call(this, obj));
  }

  return PatternConstraint;
}(Constraint);

/**
 * A MaximumItems Constraint.
 * evaluate returns true if and only if the object to test has less items than
 * the value passed to the constructor
 */


var MaximumItemsConstraint = exports.MaximumItemsConstraint = function (_Constraint10) {
  (0, _inherits3.default)(MaximumItemsConstraint, _Constraint10);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function MaximumItemsConstraint(value) {
    (0, _classCallCheck3.default)(this, MaximumItemsConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'maximum-items.constraint.models',
        version: '0.1.0'
      }),
      name: 'maxItems',
      value: value,
      expression: function expression(d) {
        if (typeof value === 'undefined' || value === null) {
          return true;
        }
        return (d.length || d.size) <= value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (MaximumItemsConstraint.__proto__ || (0, _getPrototypeOf2.default)(MaximumItemsConstraint)).call(this, obj));
  }

  return MaximumItemsConstraint;
}(Constraint);

/**
 * A MinimumItems Constraint.
 * evaluate returns true if and only if the object to test has more items than
 * the value passed to the constructor
 */


var MinimumItemsConstraint = exports.MinimumItemsConstraint = function (_Constraint11) {
  (0, _inherits3.default)(MinimumItemsConstraint, _Constraint11);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function MinimumItemsConstraint() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    (0, _classCallCheck3.default)(this, MinimumItemsConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'minimum-items.constraint.models',
        version: '0.1.0'
      }),
      name: 'minItems',
      value: value,
      expression: function expression(d) {
        return (d.length || d.size) >= value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (MinimumItemsConstraint.__proto__ || (0, _getPrototypeOf2.default)(MinimumItemsConstraint)).call(this, obj));
  }

  return MinimumItemsConstraint;
}(Constraint);

/**
 * A UniqueItems Constraint.
 * evaluate returns true if and only if the object to test contains only
 * unique values
 */


var UniqueItemsConstraint = exports.UniqueItemsConstraint = function (_Constraint12) {
  (0, _inherits3.default)(UniqueItemsConstraint, _Constraint12);

  /**
   * @constructor
   * @param {boolean} value: the value to use as a basis for the Constraint
   */
  function UniqueItemsConstraint() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    (0, _classCallCheck3.default)(this, UniqueItemsConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'unique-items.constraint.models',
        version: '0.1.0'
      }),
      name: 'uniqueItems',
      value: value,
      expression: function expression(d) {
        if (!value) {
          return true;
        }
        var valueSet = d.reduce(function (_obj, item) {
          var itemKey = (0, _stringify2.default)(item);
          _obj[itemKey] = true;
          return _obj;
        }, {});
        return (d.length || d.size) === (0, _keys2.default)(valueSet).length;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (UniqueItemsConstraint.__proto__ || (0, _getPrototypeOf2.default)(UniqueItemsConstraint)).call(this, obj));
  }

  return UniqueItemsConstraint;
}(Constraint);

/**
 * A MaximumProperties Constraint.
 * evaluate returns true if and only if the object to test has less properties than
 * the value passed to the constructor
 */


var MaximumPropertiesConstraint = exports.MaximumPropertiesConstraint = function (_Constraint13) {
  (0, _inherits3.default)(MaximumPropertiesConstraint, _Constraint13);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function MaximumPropertiesConstraint(value) {
    (0, _classCallCheck3.default)(this, MaximumPropertiesConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'maximum-properties.constraint.models',
        version: '0.1.0'
      }),
      name: 'maxProperties',
      value: value,
      expression: function expression(d) {
        if (typeof value === 'undefined' || value === null) {
          return true;
        }
        return (0, _keys2.default)(d).length <= value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (MaximumPropertiesConstraint.__proto__ || (0, _getPrototypeOf2.default)(MaximumPropertiesConstraint)).call(this, obj));
  }

  return MaximumPropertiesConstraint;
}(Constraint);

/**
 * A MinimumProperties Constraint.
 * evaluate returns true if and only if the object to test has more properties than
 * the value passed to the constructor
 */


var MinimumPropertiesConstraint = exports.MinimumPropertiesConstraint = function (_Constraint14) {
  (0, _inherits3.default)(MinimumPropertiesConstraint, _Constraint14);

  /**
   * @constructor
   * @param {number} value: the value to use as a basis for the Constraint
   */
  function MinimumPropertiesConstraint() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    (0, _classCallCheck3.default)(this, MinimumPropertiesConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'minimum-properties.constraint.models',
        version: '0.1.0'
      }),
      name: 'minProperties',
      value: value,
      expression: function expression(d) {
        return (0, _keys2.default)(d).length >= value;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (MinimumPropertiesConstraint.__proto__ || (0, _getPrototypeOf2.default)(MinimumPropertiesConstraint)).call(this, obj));
  }

  return MinimumPropertiesConstraint;
}(Constraint);

/**
 * An Enum Constraint.
 * evaluate returns true if and only if the object to test is in
 * the list of values passed to the constructor
 */


var EnumConstraint = exports.EnumConstraint = function (_Constraint15) {
  (0, _inherits3.default)(EnumConstraint, _Constraint15);

  /**
   * @constructor
   * @param {Array} value: the value to use as a basis for the Constraint
   */
  function EnumConstraint() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    (0, _classCallCheck3.default)(this, EnumConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'enum.constraint.models',
        version: '0.1.0'
      }),
      name: 'enum',
      value: value,
      expression: function expression(d) {
        return value.indexOf(d) >= 0;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (EnumConstraint.__proto__ || (0, _getPrototypeOf2.default)(EnumConstraint)).call(this, obj));
  }

  return EnumConstraint;
}(Constraint);

/**
 * A JSON Schema Constraint.
 * evaluate returns true. (Unimplemented)
 * TODO: implement evaluate
 */


var JSONSchemaConstraint = exports.JSONSchemaConstraint = function (_Constraint16) {
  (0, _inherits3.default)(JSONSchemaConstraint, _Constraint16);

  /**
   * @constructor
   * @param {Object} value: the value to use as a basis for the Constraint
   */
  function JSONSchemaConstraint() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, JSONSchemaConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'json.constraint.models',
        version: '0.1.0'
      }),
      name: 'json',
      value: value,
      expression: function expression() {
        return true;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (JSONSchemaConstraint.__proto__ || (0, _getPrototypeOf2.default)(JSONSchemaConstraint)).call(this, obj));
  }

  /**
   * @returns {Object} the JSON Schema corresponding to this Constraint
   */


  (0, _createClass3.default)(JSONSchemaConstraint, [{
    key: 'toJSONSchema',
    value: function toJSONSchema() {
      return this.get('value');
    }
  }]);
  return JSONSchemaConstraint;
}(Constraint);

/**
 * An XML Schema Constraint.
 * evaluate returns true. (Unimplemented)
 * TODO: implement evaluate
 */


var XMLSchemaConstraint = exports.XMLSchemaConstraint = function (_Constraint17) {
  (0, _inherits3.default)(XMLSchemaConstraint, _Constraint17);

  /**
   * @constructor
   * @param {string} value: the value to use as a basis for the Constraint
   */
  function XMLSchemaConstraint() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    (0, _classCallCheck3.default)(this, XMLSchemaConstraint);

    var obj = {
      _model: new _ModelInfo2.default({
        name: 'xml.constraint.models',
        version: '0.1.0'
      }),
      name: 'xml',
      value: value,
      expression: function expression() {
        return true;
      }
    };
    return (0, _possibleConstructorReturn3.default)(this, (XMLSchemaConstraint.__proto__ || (0, _getPrototypeOf2.default)(XMLSchemaConstraint)).call(this, obj));
  }

  /**
   * @returns {Object} the JSON Schema corresponding to this Constraint
   */


  (0, _createClass3.default)(XMLSchemaConstraint, [{
    key: 'toJSONSchema',
    value: function toJSONSchema() {
      return {
        'x-xml': this.get('value')
      };
    }
  }]);
  return XMLSchemaConstraint;
}(Constraint);

var _Constraint = {
  Constraint: Constraint,
  MultipleOf: MultipleOfConstraint,
  Maximum: MaximumConstraint,
  ExclusiveMaximum: ExclusiveMaximumConstraint,
  Minimum: MinimumConstraint,
  ExclusiveMinimum: ExclusiveMinimumConstraint,
  MaximumLength: MaximumLengthConstraint,
  MinimumLength: MinimumLengthConstraint,
  Pattern: PatternConstraint,
  MaximumItems: MaximumItemsConstraint,
  MinimumItems: MinimumItemsConstraint,
  UniqueItems: UniqueItemsConstraint,
  MaximumProperties: MaximumPropertiesConstraint,
  MinimumProperties: MinimumPropertiesConstraint,
  Enum: EnumConstraint,
  JSONSchema: JSONSchemaConstraint,
  XMLSchema: XMLSchemaConstraint
};

exports.default = _Constraint;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Contact = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Contact Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'contact.utils.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Contact Record.
 */
var ContactSpec = {
  _model: model,
  name: null,
  url: null,
  email: null
};

/**
 * The Contact Record
 */

var Contact = exports.Contact = function (_Record) {
  (0, _inherits3.default)(Contact, _Record);

  function Contact() {
    (0, _classCallCheck3.default)(this, Contact);
    return (0, _possibleConstructorReturn3.default)(this, (Contact.__proto__ || (0, _getPrototypeOf2.default)(Contact)).apply(this, arguments));
  }

  return Contact;
}((0, _immutable.Record)(ContactSpec));

exports.default = Contact;

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.Group = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(10);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Group Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'group.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Group Record.
 */
var GroupSpec = {
  _model: model,
  id: null,
  name: null,
  description: null,
  children: (0, _immutable.OrderedMap)()
};

/**
 * Holds all the internal methods used in tandem with a Group
 */
var methods = {};

/**
 * The Group Record
 */

var Group = exports.Group = function (_Record) {
  (0, _inherits3.default)(Group, _Record);

  function Group() {
    (0, _classCallCheck3.default)(this, Group);
    return (0, _possibleConstructorReturn3.default)(this, (Group.__proto__ || (0, _getPrototypeOf2.default)(Group)).apply(this, arguments));
  }

  (0, _createClass3.default)(Group, [{
    key: 'getRequestIds',

    /**
     * Returns the list of all request Ids in the group and its sub groups
     * @returns {List<(string | number)>} a List with all the request Ids from the group
     * and its sub groups
     */
    value: function getRequestIds() {
      return methods.getRequestIds(this);
    }

    /**
     * Returns the list of all Requests in the group and its sub groups, if they are
     * present in a Request Map
     * WARNING: numerical ids are cast to strings
     * @param {?Map<Request>} requestMap: the Map from which to get the requests by
     * their ids
     * @returns {List<Request>} a List with all the existing Request from the group
     * and its sub groups
     */

  }, {
    key: 'getRequests',
    value: function getRequests(requestMap) {
      return methods.getRequests(this, requestMap);
    }
  }]);
  return Group;
}((0, _immutable.Record)(GroupSpec));

/**
 * Checks if an object is an Id or not
 * @param {string | number | Group} idOrGroup: the object to test
 * @returns {boolean} whether the object is an Id or not
 */


methods.isId = function (idOrGroup) {
  return typeof idOrGroup === 'string' || typeof idOrGroup === 'number';
};

/**
 * Checks if an object is a Group or not
 * @param {string | number | Group} idOrGroup: the object to test
 * @returns {boolean} whether the object is a Group or not
 */
methods.isGroup = function (idOrGroup) {
  return idOrGroup instanceof Group;
};

/**
 * a reducer to flatten a List of List into a List
 * @param {List<A>} flatList: the flattened List
 * @param {List<A>} list: the List to add to the flat list
 * @returns {List<A>} the updated flat List
 */
methods.flattenReducer = function (flatList, list) {
  return flatList.concat(list);
};

/**
 * Returns the list of all request Ids in the group and its sub groups
 * @param {Group} group: the group to extract the request Ids from
 * @returns {List<(string | number)>} a List with all the request Ids from the group
 * and its sub groups
 */
methods.getRequestIds = function (group) {
  if (!group || typeof group.get !== 'function' || !group.get('children')) {
    return (0, _immutable.List)();
  }

  var children = group.get('children').valueSeq();
  var requestsIds = children.filter(methods.isId);
  var groups = children.filter(methods.isGroup);

  var nestedRequestIds = groups.map(methods.getRequestIds);

  return nestedRequestIds.reduce(methods.flattenReducer, (0, _immutable.List)()).concat(requestsIds);
};

/**
 * Checks if an object is a Request or not
 * @param {any} request: the object to test
 * @returns {boolean} whether the object is a Request or not
 */
methods.isRequest = function (request) {
  return !!request;
};

/**
 * Returns the list of all Requests in the group and its sub groups, if they are
 * present in a Request Map
 * WARNING: numerical ids are cast to strings
 * @param {Group} group: the group to extract the request Ids from
 * @param {?Map<Request>} requestMap: the Map from which to get the requests by
 * their ids
 * @returns {List<Request>} a List with all the existing Request from the group
 * and its sub groups
 */
methods.getRequests = function (group, requestMap) {
  if (!requestMap || typeof requestMap.get !== 'function') {
    return (0, _immutable.List)();
  }

  var ids = methods.getRequestIds(group);

  return ids.map(function (id) {
    return requestMap.get(id + '');
  }).filter(methods.isRequest);
};

var __internals__ = exports.__internals__ = methods;
exports.default = Group;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Request = undefined;

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

var _ParameterContainer = __webpack_require__(54);

var _ParameterContainer2 = _interopRequireDefault(_ParameterContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Request Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'request.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Request Record.
 */
var RequestSpec = {
  _model: model,
  id: null,
  endpoints: (0, _immutable.Map)(),
  name: null,
  description: null,
  method: null,
  parameters: new _ParameterContainer2.default(),
  contexts: (0, _immutable.List)(),
  auths: (0, _immutable.List)(),
  responses: (0, _immutable.Map)(),
  timeout: null,
  tags: (0, _immutable.List)(),
  interfaces: (0, _immutable.Map)()
};

var Request = exports.Request = (0, _immutable.Record)(RequestSpec);

exports.default = Request;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Resource = undefined;

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Resource Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'resource.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Resource Record.
 */
var ResourceSpec = {
  _model: model,
  name: null,
  uuid: null,
  endpoints: (0, _immutable.OrderedMap)(),
  path: null,
  methods: (0, _immutable.Map)(),
  description: null,
  interfaces: (0, _immutable.Map)()
};

/**
 * The Resource Record
 */
var Resource = exports.Resource = (0, _immutable.Record)(ResourceSpec);

exports.default = Resource;

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Variable = undefined;

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the Variable Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'variable.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the Variable Record.
 */
var VariableSpec = {
  _model: model,
  name: null,
  values: (0, _immutable.Map)(),
  defaultEnvironment: null
};

/**
 * The Variable Record
 */
var Variable = exports.Variable = (0, _immutable.Record)(VariableSpec);

exports.default = Variable;

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AWSSig4Auth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the AWSSig4Auth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'aws-sig-4.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the AWSSig4Auth Record.
 */
var AWSSig4AuthSpec = {
  _model: model,
  description: null,
  authName: null,
  key: null,
  secret: null,
  region: null,
  service: null
};

/**
 * The AWSSig4Auth Record
 */

var AWSSig4Auth = exports.AWSSig4Auth = function (_Record) {
  (0, _inherits3.default)(AWSSig4Auth, _Record);

  function AWSSig4Auth() {
    (0, _classCallCheck3.default)(this, AWSSig4Auth);
    return (0, _possibleConstructorReturn3.default)(this, (AWSSig4Auth.__proto__ || (0, _getPrototypeOf2.default)(AWSSig4Auth)).apply(this, arguments));
  }

  return AWSSig4Auth;
}((0, _immutable.Record)(AWSSig4AuthSpec));

exports.default = AWSSig4Auth;

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApiKeyAuth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the ApiKeyAuth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'api-key.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the ApiKeyAuth Record.
 */
var ApiKeyAuthSpec = {
  _model: model,
  description: null,
  authName: null,
  name: null,
  in: null,
  key: null
};

/**
 * The ApiKeyAuth Record
 */

var ApiKeyAuth = exports.ApiKeyAuth = function (_Record) {
  (0, _inherits3.default)(ApiKeyAuth, _Record);

  function ApiKeyAuth() {
    (0, _classCallCheck3.default)(this, ApiKeyAuth);
    return (0, _possibleConstructorReturn3.default)(this, (ApiKeyAuth.__proto__ || (0, _getPrototypeOf2.default)(ApiKeyAuth)).apply(this, arguments));
  }

  return ApiKeyAuth;
}((0, _immutable.Record)(ApiKeyAuthSpec));

exports.default = ApiKeyAuth;

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasicAuth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the BasicAuth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'basic.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the BasicAuth Record.
 */
var BasicAuthSpec = {
  _model: model,
  description: null,
  authName: null,
  username: null,
  password: null,
  raw: null,
  interfaces: (0, _immutable.OrderedMap)()
};

/**
 * The BasicAuth Record
 */

var BasicAuth = exports.BasicAuth = function (_Record) {
  (0, _inherits3.default)(BasicAuth, _Record);

  function BasicAuth() {
    (0, _classCallCheck3.default)(this, BasicAuth);
    return (0, _possibleConstructorReturn3.default)(this, (BasicAuth.__proto__ || (0, _getPrototypeOf2.default)(BasicAuth)).apply(this, arguments));
  }

  return BasicAuth;
}((0, _immutable.Record)(BasicAuthSpec));

exports.default = BasicAuth;

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomAuth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the BasicAuth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'custom.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the BasicAuth Record.
 */
var CustomAuthSpec = {
  _model: model,
  description: null,
  authName: null,
  setup: null,
  interfaces: (0, _immutable.OrderedMap)()
};

/**
 * The BasicAuth Record
 */

var CustomAuth = exports.CustomAuth = function (_Record) {
  (0, _inherits3.default)(CustomAuth, _Record);

  function CustomAuth() {
    (0, _classCallCheck3.default)(this, CustomAuth);
    return (0, _possibleConstructorReturn3.default)(this, (CustomAuth.__proto__ || (0, _getPrototypeOf2.default)(CustomAuth)).apply(this, arguments));
  }

  return CustomAuth;
}((0, _immutable.Record)(CustomAuthSpec));

exports.default = CustomAuth;

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DigestAuth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the DigestAuth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'digest.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the DigestAuth Record.
 */
var DigestAuthSpec = {
  _model: model,
  description: null,
  authName: null,
  username: null,
  password: null
};

/**
 * The DigestAuth Record
 */

var DigestAuth = exports.DigestAuth = function (_Record) {
  (0, _inherits3.default)(DigestAuth, _Record);

  function DigestAuth() {
    (0, _classCallCheck3.default)(this, DigestAuth);
    return (0, _possibleConstructorReturn3.default)(this, (DigestAuth.__proto__ || (0, _getPrototypeOf2.default)(DigestAuth)).apply(this, arguments));
  }

  return DigestAuth;
}((0, _immutable.Record)(DigestAuthSpec));

exports.default = DigestAuth;

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HawkAuth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the HawkAuth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'hawk.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the HawkAuth Record.
 */
var HawkAuthSpec = {
  _model: model,
  description: null,
  authName: null,
  id: null,
  key: null,
  algorithm: null
};

/**
 * The HawkAuth Record
 */

var HawkAuth = exports.HawkAuth = function (_Record) {
  (0, _inherits3.default)(HawkAuth, _Record);

  function HawkAuth() {
    (0, _classCallCheck3.default)(this, HawkAuth);
    return (0, _possibleConstructorReturn3.default)(this, (HawkAuth.__proto__ || (0, _getPrototypeOf2.default)(HawkAuth)).apply(this, arguments));
  }

  return HawkAuth;
}((0, _immutable.Record)(HawkAuthSpec));

exports.default = HawkAuth;

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NTLMAuth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the NTLMAuth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'ntlm.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the NTLMAuth Record.
 */
var NTLMAuthSpec = {
  _model: model,
  description: null,
  authName: null,
  username: null,
  password: null
};

/**
 * The NTLMAuth Record
 */

var NTLMAuth = exports.NTLMAuth = function (_Record) {
  (0, _inherits3.default)(NTLMAuth, _Record);

  function NTLMAuth() {
    (0, _classCallCheck3.default)(this, NTLMAuth);
    return (0, _possibleConstructorReturn3.default)(this, (NTLMAuth.__proto__ || (0, _getPrototypeOf2.default)(NTLMAuth)).apply(this, arguments));
  }

  return NTLMAuth;
}((0, _immutable.Record)(NTLMAuthSpec));

exports.default = NTLMAuth;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NegotiateAuth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the NegotiateAuth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'negotiate.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the NegotiateAuth Record.
 */
var NegotiateAuthSpec = {
  _model: model,
  description: null,
  authName: null,
  username: null,
  password: null
};

/**
 * The NegotiateAuth Record
 */

var NegotiateAuth = exports.NegotiateAuth = function (_Record) {
  (0, _inherits3.default)(NegotiateAuth, _Record);

  function NegotiateAuth() {
    (0, _classCallCheck3.default)(this, NegotiateAuth);
    return (0, _possibleConstructorReturn3.default)(this, (NegotiateAuth.__proto__ || (0, _getPrototypeOf2.default)(NegotiateAuth)).apply(this, arguments));
  }

  return NegotiateAuth;
}((0, _immutable.Record)(NegotiateAuthSpec));

exports.default = NegotiateAuth;

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OAuth1Auth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the OAuth1Auth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'oauth-1.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the OAuth1Auth Record.
 */
var OAuth1AuthSpec = {
  _model: model,
  description: null,
  authName: null,
  callback: null,
  consumerSecret: null,
  tokenSecret: null,
  consumerKey: null,
  algorithm: null,
  nonce: null,
  additionalParameters: null,
  timestamp: null,
  token: null,
  version: null,
  signature: null,
  tokenCredentialsUri: null,
  requestTokenUri: null,
  authorizationUri: null
};

/**
 * The OAuth1Auth Record
 */

var OAuth1Auth = exports.OAuth1Auth = function (_Record) {
  (0, _inherits3.default)(OAuth1Auth, _Record);

  function OAuth1Auth() {
    (0, _classCallCheck3.default)(this, OAuth1Auth);
    return (0, _possibleConstructorReturn3.default)(this, (OAuth1Auth.__proto__ || (0, _getPrototypeOf2.default)(OAuth1Auth)).apply(this, arguments));
  }

  return OAuth1Auth;
}((0, _immutable.Record)(OAuth1AuthSpec));

exports.default = OAuth1Auth;

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OAuth2Auth = undefined;

var _getPrototypeOf = __webpack_require__(3);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(5);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(4);

var _inherits3 = _interopRequireDefault(_inherits2);

var _immutable = __webpack_require__(0);

var _ModelInfo = __webpack_require__(2);

var _ModelInfo2 = _interopRequireDefault(_ModelInfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Metadata about the OAuth2Auth Record.
 * Used for internal serialization and deserialization
 */
var modelInstance = {
  name: 'oauth-2.auth.models',
  version: '0.1.0'
};
var model = new _ModelInfo2.default(modelInstance);

/**
 * Default Spec for the OAuth2Auth Record.
 * flowMap: {
 *    'accessCode': 'authorization_code',
 *    'implicit': 'implicit',
 *    'application': 'client_credentials',
 *    'password': 'password' or 'resource_owner'
 * }
 *
 *
 */
var OAuth2AuthSpec = {
  _model: model,
  description: null,
  authName: null,
  flow: null,
  authorizationUrl: null,
  tokenUrl: null,
  scopes: (0, _immutable.List)()
};

/**
 * The OAuth2Auth Record
 */

var OAuth2Auth = exports.OAuth2Auth = function (_Record) {
  (0, _inherits3.default)(OAuth2Auth, _Record);

  function OAuth2Auth() {
    (0, _classCallCheck3.default)(this, OAuth2Auth);
    return (0, _possibleConstructorReturn3.default)(this, (OAuth2Auth.__proto__ || (0, _getPrototypeOf2.default)(OAuth2Auth)).apply(this, arguments));
  }

  return OAuth2Auth;
}((0, _immutable.Record)(OAuth2AuthSpec));

exports.default = OAuth2Auth;

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getParsers = exports.getParserByFormatAndVersion = exports.getParsersByFormat = undefined;

var _apiFlowConfig = __webpack_require__(19);

var methods = {};

methods.getParsersByFormat = function (format) {
  return _apiFlowConfig.parsers.filter(function (parser) {
    return parser.format === format;
  });
};

methods.getParserByFormatAndVersion = function (_ref) {
  var format = _ref.format,
      version = _ref.version;

  var match = _apiFlowConfig.parsers.filter(function (parser) {
    return parser.__meta__.format === format && parser.__meta__.version === version;
  })[0] || null;
  return match;
};

methods.getParsers = function () {
  return _apiFlowConfig.parsers;
};

var getParsersByFormat = exports.getParsersByFormat = methods.getParsersByFormat;
var getParserByFormatAndVersion = exports.getParserByFormatAndVersion = methods.getParserByFormatAndVersion;
var getParsers = exports.getParsers = methods.getParsers;

exports.default = methods;

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.PawParser = undefined;

var _defineProperty2 = __webpack_require__(60);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _typeof2 = __webpack_require__(12);

var _typeof3 = _interopRequireDefault(_typeof2);

var _toConsumableArray2 = __webpack_require__(38);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(10);

var _createClass3 = _interopRequireDefault(_createClass2);

var _class, _temp;

var _url = __webpack_require__(76);

var _immutable = __webpack_require__(0);

var _Api = __webpack_require__(83);

var _Api2 = _interopRequireDefault(_Api);

var _Info = __webpack_require__(52);

var _Info2 = _interopRequireDefault(_Info);

var _Contact = __webpack_require__(85);

var _Contact2 = _interopRequireDefault(_Contact);

var _Group = __webpack_require__(86);

var _Group2 = _interopRequireDefault(_Group);

var _Variable = __webpack_require__(89);

var _Variable2 = _interopRequireDefault(_Variable);

var _Parameter = __webpack_require__(53);

var _Parameter2 = _interopRequireDefault(_Parameter);

var _URLComponent = __webpack_require__(57);

var _URLComponent2 = _interopRequireDefault(_URLComponent);

var _Resource = __webpack_require__(88);

var _Resource2 = _interopRequireDefault(_Resource);

var _Reference = __webpack_require__(27);

var _Reference2 = _interopRequireDefault(_Reference);

var _Constraint = __webpack_require__(84);

var _Constraint2 = _interopRequireDefault(_Constraint);

var _ParameterContainer = __webpack_require__(54);

var _ParameterContainer2 = _interopRequireDefault(_ParameterContainer);

var _Auth = __webpack_require__(51);

var _Auth2 = _interopRequireDefault(_Auth);

var _Store = __webpack_require__(55);

var _Store2 = _interopRequireDefault(_Store);

var _URL = __webpack_require__(56);

var _URL2 = _interopRequireDefault(_URL);

var _Request = __webpack_require__(87);

var _Request2 = _interopRequireDefault(_Request);

var _fpUtils = __webpack_require__(20);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __meta__ = {
  format: 'paw',
  version: 'v3.0'
};

var methods = {};

/**
 * A Parser that converts a PawContext and an array of items into an Api Record
 */
var PawParser = exports.PawParser = (_temp = _class = function () {
  function PawParser() {
    (0, _classCallCheck3.default)(this, PawParser);
  }

  (0, _createClass3.default)(PawParser, null, [{
    key: 'parse',


    /**
     * converts an item into an intermediate model representation
     * @returns {Api} the corresponding Api Record
     */
    value: function parse() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          options = _ref.options;

      return methods.parse({ options: options });
    }
  }]);
  return PawParser;
}(), _class.__meta__ = __meta__, _class.identifier = 'com.luckymarmot.PawExtensions.API-Flow', _class.title = 'Api-Flow', _class.help = 'https://github.com/luckymarmot/API-Flow', _class.languageHighlighter = null, _class.fileExtension = null, _temp);

/**
 * creates a message with information about the state of the document when this was generated
 * @param {PawContext} context: the paw context from which to get the state of the document.
 * @returns {string?} the string describing the state of the project, if it is a cloud project.
 */

methods.addGenerationMessage = function (context) {
  if (context.document.cloudProject && context.document.cloudProject.currentBranch) {
    var branchName = context.document.cloudProject.currentBranch;
    var commitSha = context.document.cloudProject.commitSha;
    var commitMsg = commitSha ? ' on commit ' + commitSha : '';

    var msg = 'This document was generated from the branch ' + branchName + commitMsg + '.';

    return msg;
  }

  return null;
};

/**
 * creates a message about how to contribute to the project, if it is a cloud porject
 * @param {PawContext} context: the paw context from which to get the info.
 * @returns {string?} the string explaining how to contribute, if it is a cloud project.
 */
methods.addContributionMessage = function (context) {
  if (context.document.isCloudProject) {
    var cloudProject = context.document.cloudProject || {};
    var cloudTeam = context.document.cloudTeam || {};

    if (typeof cloudProject.id === 'undefined' || typeof cloudTeam.id === 'undefined') {
      return null;
    }

    var msg = 'If you are a contributor to this project, you may access it here: ' + 'https://paw.cloud/account/teams/' + cloudTeam.id + '/projects/' + cloudProject.id;

    return msg;
  }

  return null;
};

/**
 * creates a description of the state of the document.
 * @param {PawContext} context: the paw context from which to get the state of the document.
 * @returns {string?} the string describing the state of the project, if it is a cloud project.
 */
methods.extractDescription = function (context) {
  var description = [methods.addGenerationMessage(context), methods.addContributionMessage(context)].filter(function (value) {
    return !!value;
  });

  return description.join('\n\n') || null;
};

/**
 * extracts a Contact from a context
 * @param {PawContext} context: the context from which to get the contact information.
 * @returns {Contact?} the corresponding contact, if it exists
 */
methods.extractContact = function (context) {
  if (context.document.cloudTeam && context.document.cloudTeam.id) {
    return new _Contact2.default({
      url: 'https://paw.cloud/account/teams/' + context.document.cloudTeam.id,
      name: context.document.cloudTeam.name || null
    });
  }

  return null;
};

/**
 * extracts a version from a context. By default, it is v0.0.0, but a shortened commit sha will be
 * appended if it is possible.
 * @param {PawContext} context: the context from which to extract a version
 * @returns {string} the corresponding version.
 */
methods.extractVersion = function (context) {
  var version = 'v0.0.0';

  if (context.document.cloudProject && context.document.cloudProject.commitSha) {
    return version + '-' + context.document.cloudProject.commitSha.slice(0, 10);
  }

  return version;
};

/**
 * extracts the project title from a context.
 * @param {PawContext} context: the context from which to extract a title.
 * @returns {string} the corresponding title
 */
methods.extractTitle = function (context) {
  var title = context.document.name;
  return title || null;
};

/**
 * creates an Info record from a context
 * @param {PawContext} context: the context to extract information from.
 * @returns {Info} the corresponding Info record
 */
methods.extractInfo = function (context) {
  var title = methods.extractTitle(context);
  var version = methods.extractVersion(context);
  var description = methods.extractDescription(context);
  var contact = methods.extractContact(context);

  return new _Info2.default({
    title: title, version: version, description: description, contact: contact
  });
};

/**
 * traverses a tree from a request leaf to the root group and returns the hierarchy from the root
 * to the leaf.
 * @param {Array<(PawRequest|PawRequestGroup)>} path: the accumulator that holds the path up to this
 * request or group
 * @param {PawRequest|PawRequestGroup} reqOrGroup: the request or group to find the parent of.
 * @returns {Array<(PawRequest|PawRequestGroup)>} the ordered sequence of parents of the reqOrGroup
 */
methods.getPathForRequestOrGroup = function (path, reqOrGroup) {
  if (!reqOrGroup) {
    return path;
  }

  var newPath = [reqOrGroup].concat((0, _toConsumableArray3.default)(path));
  return methods.getPathForRequestOrGroup(newPath, reqOrGroup.parent);
};

/**
 * gets the ordered sequence of parents of a request, from the root group to itself.
 * @param {PawRequest} request: the request to get the parents from.
 * @returns {Array<(PawRequest|PawRequestGroup)>} the corresponding sequence of parents.
 */
methods.getPathForRequest = function (request) {
  return methods.getPathForRequestOrGroup([], request);
};

/**
 * converts a paw group into a Group record
 * @param {PawRequestGroup} pawGroup: the paw group to converts
 * @returns {Group} the corresponding Group record
 */
methods.convertPawGroupIntoGroup = function (pawGroup) {
  return new _Group2.default({
    name: pawGroup.name || null,
    id: pawGroup.id || null
  });
};

/**
 * gets the id from a PawRequest or PawRequestGroup and appends it to a list of ids. This is used to
 * transform a sequence of request groups into a path that allows us to access the corresponding
 * Group.
 * @param {Array<string>} path: the current list of 'children' and `id` values
 * @param {string} id: the id of the PawRequest or PawRequestGroup.
 * @returns {Array<string>} the updated path.
 */
methods.convertPawPathIntoGroupPath = function (path, _ref2) {
  var id = _ref2.id;
  return [].concat((0, _toConsumableArray3.default)(path), ['children', id]);
};

/**
 * creates a nested group at the expected location in an accumulator, if it does not already exist.
 * This method is designed to be used in a reducer, and allows us to fully construct all groups that
 * correspond to an ordered sequence of groups and subgroups. Since the reducer iterates over an
 * array in orderly fashion, this ensures that at any point in time, the path we are trying to
 * access is clearly defined.
 * @param {Group} acc: the root group which all path should use as a base.
 * @param {PawRequest|PawRequestGroup} item: an item from the ordered sequence of parents
 * @param {integer} index: the index at which the item is located in the sequence
 * @param {Array<PawRequest|PawRequestGroup>} fullPath: the complete ordered sequence of parents
 * @returns {Group} the updated root Group
 */
methods.createNestedGroups = function (acc, item, index, fullPath) {
  var path = fullPath.slice(0, index + 1).reduce(methods.convertPawPathIntoGroupPath, []);

  // leaf object (i.e. a paw request)
  if (index === fullPath.length - 1) {
    return acc.setIn(path, item.id);
  }

  // node object (i.e. a paw group)
  var group = acc.getIn(path);

  if (!group) {
    return acc.setIn(path, methods.convertPawGroupIntoGroup(item));
  }

  return acc;
};

/**
 * stores a request id in the expected group based on a sequence of parents, creating the groupd and
 * all of its parents if necessary.
 * @param {Group} rootGroup: the group to update with the request id
 * @param {Array<PawRequest|PawRequestGroup>} path: the ordered sequence of parents of the request
 * @returns {Group} the upated group
 */
methods.storeRequest = function (rootGroup, path) {
  return path.reduce(methods.createNestedGroups, rootGroup);
};

/**
 * extract the hierarchy of groups and requests from a list of requests.
 * @param {Array<PawRequest>} reqs: the list of requests from which to get the hierarchy.
 * @returns {Group} the corresponding Group hierarchy
 */
methods.extractGroup = function (reqs) {
  return reqs.map(methods.getPathForRequest).reduce(methods.storeRequest, new _Group2.default());
};

/**
 * traverses two strings to find the longest common path, which is similar to the longest common
 * starting string, except that we don't compare character by character but '/'-separated block
 * by '/'-separated block, as /example/pets and /example/pet/:petId have /example as a common path
 * and not /example/pet.
 * @param {Array<string>} lcPathname: the current longest common pathname, in blocks.
 * @param {string} pathname: the pathname to compare
 * @returns {Array<string>} the updated lcPathname
 */
methods.findLongestCommonPath = function (lcPathname, pathname) {
  var sections = pathname.split('/');

  var length = Math.min(lcPathname.length, sections.length);

  var index = 0;
  while (index < length) {
    if (lcPathname[index] !== sections[index]) {
      return lcPathname.slice(0, index);
    }

    index += 1;
  }

  return lcPathname.slice(0, index);
};

/**
 * @typedef hostMapType
 * @type {Object<string, {
 *   entries: Array<{ key: string, value: PawRequest, urlObject: Object}>,
 *   lcPathname: Array<string>
 * }>}
 */

/**
 *
 * updates a hostmap with data about a request, grouping it with other requests that share a common
 * host.
 * @param {hostMapType} hostMap: the host map to update.
 * @param {object} entry: the entry to add to the host map
 * @param {string} entry.key: the generated string corresponding to the url of the request
 * @param {PawRequest} entry.value: the request to add to the host map
 * @returns {hostMapType} the updated hostMap
 */
methods.addHostEntryToHostMap = function (hostMap, _ref3) {
  var key = _ref3.key,
      value = _ref3.value;

  var urlObject = (0, _url.parse)(key);
  var host = urlObject.host;

  if (!hostMap[host]) {
    hostMap[host] = { entries: [], lcPathname: urlObject.pathname.split('/') };
  }

  var lcPathname = hostMap[host].lcPathname;
  // TODO what fields are used ?
  hostMap[host].entries.push({ key: key, value: value, urlObject: urlObject });
  hostMap[host].lcPathname = methods.findLongestCommonPath(lcPathname, urlObject.pathname);
  return hostMap;
};

/**
 * converts a longest common pathname array into a longest common pathname string
 * @param {Array<string>} lcPathname: the array to convert into a string
 * @returns {string} the corresponding string
 */
methods.getLongestCommonPathnameAsString = function (lcPathname) {
  if (lcPathname.length === 1) {
    return '/' + lcPathname[0];
  }

  return lcPathname.join('/');
};

/**
 * converts a hostMapEntry into a regular Entry
 * @param {object} hostMapEntry: the entry to convert
 * @param {Array<*>} hostMapEntry.entries: the entries corresponding to this specific host.
 * @param {Array<string>} hostMapEntry.lcPathname: the array that contains the longest common
 * pathname of all the entries belonging to this hostMapEntry
 * @param {string} key: the host string
 * @returns {Entry<string, *>} the corresponding Entry
 */
methods.updateHostKeyWithLongestCommonPathname = function (_ref4, key) {
  var entries = _ref4.entries,
      lcPathname = _ref4.lcPathname;

  var lcString = methods.getLongestCommonPathnameAsString(lcPathname);
  return {
    key: key + lcString,
    value: entries
  };
};

/**
 * extracts common hosts from a list of requests, and assigns each request to its corresponding host
 * @param {Array<PawRequest>} requests: the requests to group by host
 * @returns {Seq<Entry<string, *>>} the corresponding sequence of entries.
 */
methods.extractCommonHostsFromRequests = function (requests) {
  var hosts = requests.map(function (request) {
    return { key: request.getUrlBase(), value: request };
  }).reduce(methods.addHostEntryToHostMap, {});

  return new _immutable.OrderedMap(hosts).map(methods.updateHostKeyWithLongestCommonPathname).valueSeq();
};

/**
 * converts a DynamicValue or a string into an Entry.
 * @param {DynamicValue|string} component: the component of a DynamicString to convert into an Entry
 * @return {Entry<string, DynamicValue|string>} the corresponding entry
 */
methods.convertDynamicStringComponentIntoEntry = function (component) {
  if (typeof component === 'string') {
    return { key: component, value: component };
  }

  return { key: component.getEvaluatedString(), value: component };
};

/**
 * tests whether a part of a url is entirely present in a default Url or its secure version
 * @param {string} defaultUrl: the default url to test against.
 * @param {string} defaultSecureUrl: the default secure url to test against.
 * @param {string} urlPart: the part of url to test
 * @returns {boolean} true if it is a part of either urls, false otherwise.
 */
methods.isPartOfBaseUrl = function (defaultUrl, defaultSecureUrl, urlPart) {
  return defaultUrl.indexOf(urlPart) >= 0 || defaultSecureUrl.indexOf(urlPart) >= 0;
};

// NOTE: we assume that the urlPart is after the protocol
methods.findIntersection = function (defaultUrl, urlPart) {
  var match = (defaultUrl + '####' + urlPart).match(/^.*?(.*)####\1(.*)$/);

  // always matches
  return { inside: match[1], outside: match[2] };
};

/**
 * assigns a component to either a sequence of components representing the baseUrl, or to a sequence
 * of components that represents the path that is specific to this request. If the component is
 * split between the two sequences, we split its evaluated string in such way that as much as
 * possible is put in the base sequence.
 * @param {string} defaultUrl: the non-secure url for a given host
 * @param {string} defaultSecureUrl: the secure url for a given host
 * @param {object} acc: the accumulator that holds the base and path sequences
 * @param {Array<Entry<string, string|DynamicValue>>} acc.baseComponents: the sequence of components
 * that belong to the host url
 * @param {Array<Entry<string, string|DynamicValue>>} acc.pathComponents: the sequence of components
 * that belong to the path of the request
 * @param {object} entry: the entry that represents the component
 * @param {string} entry.key: the evaluated string of the component
 * @param {string|DynamicValue} entry.value: the component
 * @returns {object} acc: the updated accumulator
 */
methods.addComponentToBaseOrPath = function (defaultUrl, defaultSecureUrl, _ref5, _ref6) {
  var baseComponents = _ref5.baseComponents,
      pathComponents = _ref5.pathComponents;
  var urlPart = _ref6.key,
      component = _ref6.value;

  if (methods.isPartOfBaseUrl(defaultUrl, defaultSecureUrl, urlPart)) {
    // component is member of base url
    baseComponents.push({ key: urlPart, value: component });
    return { baseComponents: baseComponents, pathComponents: pathComponents };
  }

  if (pathComponents.length === 0) {
    // component may be split between base url and path
    var _methods$findIntersec = methods.findIntersection(defaultUrl, urlPart),
        inside = _methods$findIntersec.inside,
        outside = _methods$findIntersec.outside;

    baseComponents.push({ key: inside, value: inside });
    pathComponents.push({ key: outside, value: outside });
  } else {
    // component is not a member of base url
    pathComponents.push({ key: urlPart, value: component });
  }

  return { baseComponents: baseComponents, pathComponents: pathComponents };
};

/**
 * tests whether a string or dynamic value is an environment variable
 * @param {string|DynamicValue} stringOrDV: the string or dynamic value to test
 * @returns {boolean} true if it an environment variable, false otherwise
 */
methods.isEnvironmentVariable = function (stringOrDV) {
  return (typeof stringOrDV === 'undefined' ? 'undefined' : (0, _typeof3.default)(stringOrDV)) === 'object' && stringOrDV.type === 'com.luckymarmot.EnvironmentVariableDynamicValue';
};

/**
 * extracts all possible values from an environment variable.
 * @param {PawContext} context: the context from which to get the environment variable.
 * @param {DynamicValue} dv: the dv that holds a reference to the environmentVariable.
 * @returns {Array<Entry<string, string>>} the array that holds all possible values as Entries.
 */
methods.extractPossibleValuesFromEnvironmentVariableDV = function (context, dv) {
  var variableId = dv.environmentVariable;
  var variable = context.getEnvironmentVariableById(variableId);
  var domain = variable.domain;
  var environments = domain.environments;
  var values = environments.map(function (env) {
    var rawValue = variable.getValue(env, true);
    // NOTE: this should not be needed anymore
    var value = null;
    if (typeof rawValue === 'string') {
      value = rawValue;
    } else {
      value = rawValue.getEvaluatedString();
    }
    return { key: env.name, value: value };
  });

  return values;
};

/**
 * extracts all possible values from a DV Entry.
 * @param {PawContext} context: the context from which to get environment variables
 * @param {Object} entry: the component entry
 * @param {string} entry.key: the part of the url that this component represents
 * @param {string|DynamicValue} entry.value: the component itself
 * @returns {Array<Entry<string, string>>} the corresponding array of possible values for a DV Entry
 */
methods.extractPossibleValuesFromDVEntry = function (context, _ref7) {
  var urlPart = _ref7.key,
      stringOrDV = _ref7.value;

  if (!methods.isEnvironmentVariable(stringOrDV)) {
    return [{ key: '', value: urlPart }];
  }

  return methods.extractPossibleValuesFromEnvironmentVariableDV(context, stringOrDV);
};

/**
 * combines all possible values from a list of combinations and entries, using a cartesian product
 * of the two arrays, which is then flattened
 * @param {Array<Entry<string, string>>} combinations: the current combinations
 * @param {Array<Entry<string, string>>} entries: the values to combine the combinations with.
 * @returns {Array<Entry<string,string>>} the updated combinations
 */
methods.combinePossibleValues = function (combinations, entries) {
  return combinations.map(function (combination) {
    var updated = entries.map(function (entry) {
      return { key: combination.key + entry.key, value: combination.value + entry.value };
    });

    return updated;
  }).reduce(function (finalList, list) {
    return finalList.concat(list);
  }, []);
};

/**
 * converts an array of components belonging to a base url into a variable, if suitable.
 * It only tries to convert it into a variable if there is a single environment variable in the
 * array of components. It otherwise returns null.
 * @param {PawContext} context: the context used to resolve environment variables
 * @param {string} defaultHost: the host associated to the baseComponents
 * @param {Array<Entry<string, string|DynamicValue>>} baseComponents: the array of components to
 * convert into a variable.
 * @returns {Variable?} the corresponding variable for this array of variables
 */
methods.convertBaseComponentsIntoVariable = function (context, defaultHost, baseComponents) {
  var environmentDVCount = baseComponents.filter(function (_ref8) {
    var value = _ref8.value;

    return methods.isEnvironmentVariable(value);
  }).length;

  if (environmentDVCount !== 1) {
    return null;
  }

  var extractValuesFromDVEntry = (0, _fpUtils.currify)(methods.extractPossibleValuesFromDVEntry, context);

  var variableValues = baseComponents.map(extractValuesFromDVEntry).reduce(methods.combinePossibleValues, [{ key: '', value: '' }]).reduce(_fpUtils.convertEntryListInMap, {});

  return new _Variable2.default({
    name: defaultHost,
    values: (0, _immutable.OrderedMap)(variableValues)
  });
};

/**
 * extracts the variable corresponding to the host, and the path components from a request.
 * @param {PawContext} context: the context in which to resolve the environment variable
 * @param {string} defaultHost: the host of the request
 * @param {function} reducer: the reducer to apply to the components of the request.url
 * @param {Entry<*, PawRequest>} entry: the request entry
 * @param {PawRequest} entry.value: the request
 * @returns {{ request: PawRequest, baseVariable: Variable?, pathComponents: Array<*> }} the
 * corresponding entry with the request, the base variable and the path components
 */
methods.extractBaseVariableAndPathComponentsFromRequest = function (context, defaultHost, reducer, _ref9) {
  var request = _ref9.value;

  var assignComponentToBaseOrPath = reducer;
  var ds = request.getUrlBase(true);

  var _ds$components$map$re = ds.components.map(methods.convertDynamicStringComponentIntoEntry).reduce(assignComponentToBaseOrPath, { baseComponents: [], pathComponents: [] }),
      baseComponents = _ds$components$map$re.baseComponents,
      pathComponents = _ds$components$map$re.pathComponents;

  var baseVariable = methods.convertBaseComponentsIntoVariable(context, defaultHost, baseComponents);
  return { request: request, baseVariable: baseVariable, pathComponents: pathComponents };
};

/**
 * A reducer to set the host variable with the first Variable that has been produced from a request
 * @param {Object} acc: the accumulator for the reducer
 * @param {Variable?} acc.hostVariable: the Variable that represents the host
 * @param {Array<ResourceEntry>} acc.requestEntries: the list of requests and their associated path
 * components that belong to this host
 * @param {object} entry: the entry to use to update the accumulator
 * @param {PawRequest} entry.request: the request to convert
 * @param {Variable?} entry.baseVariable: the host variable that was extracted from the request
 * @param {Array<Entry<string, (string|DynamicValue)>>} entry.pathComponents: the components that
 * make up the path of the request
 * @returns {object} acc: the updated accumulator
 */
methods.findBaseVariableForRequestEntries = function (_ref10, _ref11) {
  var hostVariable = _ref10.hostVariable,
      requestEntries = _ref10.requestEntries;
  var request = _ref11.request,
      baseVariable = _ref11.baseVariable,
      pathComponents = _ref11.pathComponents;

  requestEntries.push({ request: request, pathComponents: pathComponents });

  if (!hostVariable && baseVariable) {
    return { hostVariable: baseVariable, requestEntries: requestEntries };
  }

  return { hostVariable: hostVariable, requestEntries: requestEntries };
};

/**
 * converts a component entry into a string, or a parameter if the component is a request variable.
 * @param {PawRequest} request: the request to extract the request variable from.
 * @param {Object} entry: the component entry
 * @param {string} entry.key: the evaluated string of the component, used as a key
 * @param {string|DynamicString} entry.value: the component itself
 * @returns {string|Parameter} the corresponding string or parameter
 */
methods.convertComponentEntryIntoStringOrParam = function (request, _ref12) {
  var key = _ref12.key,
      value = _ref12.value;

  if (typeof value === 'string') {
    return value;
  }

  if (value.type !== 'com.luckymarmot.RequestVariableDynamicValue') {
    return key;
  }

  var _methods$convertReque = methods.convertRequestVariableDVIntoParameter(request, 'path', (0, _immutable.List)(), value, key),
      param = _methods$convertReque.value;

  return param;
};

/**
 * a reducer to merge sequencial strings together.
 * For instance, if in an array, you have
 *   [ "abc", "def", "ghi", param, "qwe", "asd" ]
 * the corresponding merge produced by using this function as a reducer will be
 *   [ "abcdefghi", param, "qweasd" ]
 * @param {Array<string|Parameter>} aggregated: the merged array
 * @param {string|Parameter} stringOrParam: the string or parameter to add to the merged array
 * @returns {Array<string|Parameter>} the updated array
 */
methods.mergeSequencialStrings = function (aggregated, stringOrParam) {
  var previous = aggregated[aggregated.length - 1];

  if (typeof previous === 'string' && typeof stringOrParam === 'string') {
    aggregated[aggregated.length - 1] = previous + stringOrParam;
    return aggregated;
  }

  aggregated.push(stringOrParam);
  return aggregated;
};

/**
 * converts a string into a parameter, or returns it as is, if it's already a parameter
 * @param {string|Parameter} stringOrParam: the string or parameter to convert
 * @returns {Parameter} the corresponding parameter
 */
methods.convertStringOrParameterIntoParameter = function (stringOrParam) {
  if (typeof stringOrParam === 'string') {
    return new _Parameter2.default({
      type: 'string',
      default: stringOrParam
    });
  }

  return stringOrParam;
};

/**
 * creates a default Path endpoint used in a resource.
 * @returns {URL} the default path endpoint
 */
methods.createDefaultPathEndpoint = function () {
  var pathnameComponent = new _URLComponent2.default({
    componentName: 'pathname',
    string: '',
    parameter: new _Parameter2.default({
      key: 'pathname',
      in: 'path',
      type: 'string',
      default: '/'
    })
  });
  return new _URL2.default().set('pathname', pathnameComponent);
};

/**
 * inserts an Empty Parameter at the beginning of a sequence if it begins with a url variable
 * instead of a standard string parameter. This is necessary, as our definition of a sequence
 * parameter specifies that it should start with a non parameter value (for ease of reading
 * afterwards)
 * @param {Array<Parameter>} sequence: the sequence to fix if needed
 * @returns {Array<Parameter>} the fixed sequence
 */
methods.insertEmptyParameterIfNeeded = function (sequence) {
  if (sequence[0].get('key') !== null) {
    sequence.splice(0, 0, new _Parameter2.default({ type: 'string', default: '' }));
  }

  return sequence;
};

/**
 * creates a Path Endpoint for a resource from a sequence of parameters.
 * @param {Array<Parameter>} sequence: the sequence to use in the sequence Parameter of the endpoint
 * @returns {URL} the corresponding path endpoint
 */
methods.createPathEndpoint = function (sequence) {
  var pathnameComponent = new _URLComponent2.default({
    componentName: 'pathname',
    string: '',
    parameter: new _Parameter2.default({
      key: 'pathname',
      in: 'path',
      type: 'string',
      superType: 'sequence',
      value: (0, _immutable.List)(sequence)
    })
  });

  var path = new _URL2.default().set('pathname', pathnameComponent);
  return path;
};

/**
 * converts a sequence of path components into a path endpoint to use in a resource.
 * @param {PawRequest} request: the request to use for request variable resolution
 * @param {Array<Entry<string, (string|DynamicValue)>>} components: a list of components that
 * represent the path of the resource
 * @returns {URL} the corresponding endpoint
 */
methods.convertPathComponentsIntoPathEndpoint = function (request, components) {
  var convertComponentEntryIntoStringOrParam = (0, _fpUtils.currify)(methods.convertComponentEntryIntoStringOrParam, request);

  var sequence = components.map(convertComponentEntryIntoStringOrParam).reduce(methods.mergeSequencialStrings, []).map(methods.convertStringOrParameterIntoParameter);

  if (!sequence.length) {
    return methods.createDefaultPathEndpoint();
  }

  var normalizedSequence = methods.insertEmptyParameterIfNeeded(sequence);
  return methods.createPathEndpoint(normalizedSequence);
};

/**
 * converts a paw request into an endpoint that holds a single request (which is the conversion of
 * the paw request)
 * @param {PawContext} context: the context in which to resolve environment variables
 * @param {Reference} reference: the reference to the endpoint being used
 * @param {Object} resourceEntry: the entry to use to create the resource
 * @param {PawRequest} resourceEntry.request: the request to convert
 * @param {Array<Entry<string, (string|Parameter)>>} resourceEntry.pathComponents: the array of
 * components that represent the path of the request
 * @returns {Entry<string, Resource>} the newly created Resource
 */
methods.extractResourceFromPawRequest = function (context, reference, _ref13) {
  var request = _ref13.request,
      pathComponents = _ref13.pathComponents;

  var path = methods.convertPathComponentsIntoPathEndpoint(request, pathComponents);
  var endpoints = (0, _defineProperty3.default)({}, reference.get('uuid'), reference);

  return {
    key: request.id,
    value: new _Resource2.default({
      name: (request.parent || {}).name || null,
      description: (request.parent || {}).description || null,
      endpoints: (0, _immutable.OrderedMap)(endpoints),
      path: path,
      methods: methods.extractRequestMapFromPawRequest(context, request, endpoints)
    })
  };
};

/**
 * converts an array of host entry into a host Variable and an array of request entry
 * @param {PawContext} context: the context in which to resolve environment variables
 * @param {string} defaultHost: the host string that we need to improve on
 * @param {Array<{ key: string, value: PawRequest, urlObject: object }>} hostEntries: the requests
 * associated with this host
 * @returns {object} hostObject: the containing object that holds the host variable and the requests
 * @returns {Variable?} hostObject.hostVariable: the variable representing this host, if it exists.
 * @returns {Array<ResourceEntry>} hostObject.requestEntries: the list of requests and their
 * associated path components that belong to this host
 */
methods.convertHostEntriesIntoHostVariableAndRequestEntries = function (context, defaultHost, hostEntries) {
  var defaultUrl = 'http://' + defaultHost;
  var defaultSecureUrl = 'https://' + defaultHost;

  var assignComponentToBaseOrPath = (0, _fpUtils.currify)(methods.addComponentToBaseOrPath, defaultUrl, defaultSecureUrl);

  var extractBaseVariableAndPathComponentsFromRequest = (0, _fpUtils.currify)(methods.extractBaseVariableAndPathComponentsFromRequest, context, defaultHost, assignComponentToBaseOrPath);

  return hostEntries.map(extractBaseVariableAndPathComponentsFromRequest).reduce(methods.findBaseVariableForRequestEntries, { hostVariable: null, requestEntries: [] });
};

/**
 * creates a default host endpoint. The hostEntries are used to extract the possible protocols for
 * this endpoint
 * @param {string} defaultHost: the host string
 * @param {Array<{ key: string, value: PawRequest, urlObject: object }>} hostEntries: the requests
 * associated with this host
 * @returns {Entry} entry: the endpoint as an entry
 * @returns {string} entry.key: the host string. this will be used as a unique identifier
 * @returns {URL} entry.value: the endpoint
 */
methods.createDefaultHostEndpoint = function (defaultHost, hostEntries) {
  var defaultUrl = 'http://' + defaultHost;

  var endpointValue = new _URL2.default({
    url: defaultUrl
  });

  var protocols = (0, _immutable.Set)(hostEntries.map(function (_ref14) {
    var urlObject = _ref14.urlObject;
    return urlObject.protocol;
  })).toList();

  endpointValue = endpointValue.set('protocol', protocols);
  return { key: defaultHost, value: endpointValue };
};

/**
 * creates an Array of Resources from an array of requests
 * @param {PawContext} context: the context in which to resolve environment variables
 * @param {string} defaultHost: the host that is shared by all the request entries
 * @param {Variable?} hostVariable: the variable that represents the host, if it exists
 * @param {Array<{ key: string, value: PawRequest, urlObject: object }>} requestEntries: the list of
 * requests associated with this host
 * @returns {Array<Entry<Resources>>} the corresponding list of resources
 */
methods.getResourcesFromRequestEntries = function (context, defaultHost, hostVariable, requestEntries) {
  var reference = new _Reference2.default({
    type: hostVariable ? 'variable' : 'endpoint',
    uuid: defaultHost
  });

  var extractResourceFromPawRequest = (0, _fpUtils.currify)(methods.extractResourceFromPawRequest, context, reference);

  return requestEntries.map(extractResourceFromPawRequest);
};

/**
 * converts a host object into a resources, and a variable or an endpoint
 * @param {PawContext} context: the context in which to resolve environment variables
 * @param {Entry} entry: the entry describing a host
 * @param {string} entry.key: the host string
 * @param {Array<Entry<string, *>>} entry.value: the array of objects describing requests associated
 * with this host
 * @returns {Object} container: the container holding the resources, and the variable or the
 * endpoint
 * @returns {Array<Entry<string, Resource>>} container.resources: the array holding all the
 * resources associated with this host
 * @return {Variable?} container.variable: the Variable record describing this host, if it exists
 * @return {Endpoint?} container.endpoint: the Endpoint record describing this host.
 *
 * NOTE: container.variable and container.endpoint are mutually exclusive
 */
methods.convertHostIntoResources = function (context, _ref15) {
  var defaultHost = _ref15.key,
      hostEntries = _ref15.value;

  var _methods$convertHostE = methods.convertHostEntriesIntoHostVariableAndRequestEntries(context, defaultHost, hostEntries),
      hostVariable = _methods$convertHostE.hostVariable,
      requestEntries = _methods$convertHostE.requestEntries;

  var variable = void 0;
  var endpoint = void 0;
  if (hostVariable) {
    variable = { key: defaultHost, value: hostVariable };
    endpoint = null;
  } else {
    variable = null;
    endpoint = methods.createDefaultHostEndpoint(defaultHost, hostEntries);
  }

  var resources = methods.getResourcesFromRequestEntries(context, defaultHost, hostVariable, requestEntries);

  return { resources: resources, variable: variable, endpoint: endpoint };
};

/**
 * returns a request variable from its uuid
 * @param {PawRequest} request: the request to get the variable from
 * @param {string} uuid: the uuid of the variable to resolved
 * @returns {PawRequestVariable?} the corresponding request variable, if it exists
 */
methods.getVariableFromUuid = function (request, uuid) {
  return request.getVariableById(uuid) || null;
};

/**
 * tests whether a DynamicString component is a request variable
 * @param {string|DynamicValue} component: the component to test
 * @returns {boolean} true if it is a request variable, false otherwise
 */
methods.isRequestVariableDynamicValue = function (component) {
  return (typeof component === 'undefined' ? 'undefined' : (0, _typeof3.default)(component)) === 'object' && component.type === 'com.luckymarmot.RequestVariableDynamicValue';
};

/**
 * tests whether the DynamicString holds a single DynamicString that is a request variable
 * @param {DynamicString} ds: the dynamic string to test
 * @returns {boolean} true if it only holds a request variable, false otherwise
 */
methods.isRequestVariableDS = function (ds) {
  return ds.length === 1 && methods.isRequestVariableDynamicValue(ds.components[0]);
};

/**
 * converts a request variable DynamicValue into a Parameter
 * @param {PawRequest} request: the request to use to resolve variable parameters
 * @param {string} location: location of the parameter (e.g. 'headers', 'queries')
 * @param {List<Parameter>} contexts: the contexts in which this Parameter is applicable
 * @param {DynamicValue} paramDV: the dynamic string to convert
 * @param {string} paramName: the name of the parameter
 * @returns {Parameter} the corresponding parameter
 */
methods.convertRequestVariableDVIntoParameter = function (request, location, contexts, paramDV, paramName) {
  var variableId = paramDV.variableUUID;
  var variable = request.getVariableById(variableId);

  if (!variable) {
    return { key: paramName, value: new _Parameter2.default({
        in: location,
        key: paramName,
        name: paramName,
        type: 'string',
        applicableContexts: contexts
      }) };
  }

  var name = variable.name,
      value = variable.value,
      schema = variable.schema,
      type = variable.type,
      description = variable.description;


  var param = new _Parameter2.default({
    in: location,
    key: name || paramName,
    name: name || paramName,
    type: type || 'string',
    description: description || null,
    default: value.getEvaluatedString(),
    constraints: (0, _immutable.List)([new _Constraint2.default.JSONSchema(schema)]),
    applicableContexts: contexts
  });

  return { key: paramName, value: param };
};

/**
 * converts a request variable DynamicString into a Parameter
 * @param {PawRequest} request: the request to use to resolve variable parameters
 * @param {string} location: location of the parameter (e.g. 'headers', 'queries')
 * @param {List<Parameter>} contexts: the contexts in which this Parameter is applicable
 * @param {DynamicString} paramDS: the dynamic string to convert
 * @param {string} paramName: the name of the parameter
 * @returns {Parameter} the corresponding parameter
 */
methods.convertRequestVariableDSIntoParameter = function (request, location, contexts, paramDS, paramName) {
  var paramDV = paramDS.components[0];
  return methods.convertRequestVariableDVIntoParameter(request, location, contexts, paramDV, paramName);
};

/**
 * Converts a standard dynamic string (i.e. not a request variable) into a Parameter
 * @param {string} location: the location of the parameter (e.g. 'headers', 'queries')
 * @param {List<Parameter>} contexts: the contexts in which the parameter is applicable
 * @param {DynamicString} paramDS: the dynamic string to converts
 * @param {string} paramName: the name of the parameter
 * @returns {Parameter} the corresponding parameter
 */
methods.convertStandardDSIntoParameter = function (location, contexts, paramDS, paramName) {
  var value = paramDS.getEvaluatedString();
  var param = new _Parameter2.default({
    in: location,
    key: paramName,
    name: paramName,
    type: 'string',
    default: value,
    applicableContexts: contexts
  });

  return { key: paramName, value: param };
};

/**
 * converts a DynamicString associated with a parameter into a Parameter record
 * @param {PawRequest} request: the request to use to resolve variable parameters
 * @param {string} location: location of the parameter (e.g. 'headers', 'queries')
 * @param {List<Parameter>} contexts: the contexts in which this Parameter is applicable
 * @param {DynamicString} paramDS: the dynamic string to convert
 * @param {string} paramName: the name of the parameter
 * @returns {Parameter} the corresponding parameter
 */
methods.convertParameterDynamicStringIntoParameter = function (request, location, contexts, paramDS, paramName) {
  if (methods.isRequestVariableDS(paramDS)) {
    return methods.convertRequestVariableDSIntoParameter(request, location, contexts, paramDS, paramName);
  }

  return methods.convertStandardDSIntoParameter(location, contexts, paramDS, paramName);
};

/**
 * tests whether the request has a url encoded body or not
 * @param {PawRequest} request: the request to test
 * @returns {boolean} true if its body is urlEncoded, false otherwise
 */
methods.isRequestBodyUrlEncoded = function (request) {
  return !!(request.getHeaderByName('Content-Type') || '').match(/application\/x-www-form-urlencoded/);
};

/**
 * tests whether the request has a multipart body or not
 * @param {PawRequest} request: the request to test
 * @returns {boolean} true if its body is multipart, false otherwise
 */
methods.isRequestBodyMultipart = function (request) {
  return !!(request.getHeaderByName('Content-Type') || '').match(/multipart\/form-data/);
};

/**
 * converts a content type into a list of Parameter, to use as applicable contexts in a Parameter.
 * @param {string} contentType: the content type of the request
 * @returns {Array<Parameter>} the corresponding applicable contexts
 */
methods.getContentTypeContexts = function (contentType) {
  return (0, _immutable.List)([new _Parameter2.default({
    key: 'Content-Type',
    name: 'Content-Type',
    in: 'headers',
    type: 'string',
    constraints: (0, _immutable.List)([new _Constraint2.default.Enum([contentType])])
  })]);
};

/**
 * creates a default array parameter.
 * @param {List<Parameter>} contexts: the list of contexts in which the parameter is applicable
 * @param {string} name: the name of the parameter
 * @returns {Parameter} a default Parameter of type Array
 */
methods.createDefaultArrayParameter = function (contexts, name) {
  var param = new _Parameter2.default({
    key: name,
    name: name,
    in: 'body',
    type: 'array',
    format: 'multi',
    value: new _Parameter2.default({
      type: 'string'
    }),
    applicableContexts: contexts
  });

  return { key: name, value: param };
};

/**
 * extracts the Parameters from a UrlEncoded or Multipart body
 * @param {Object<string, DynamicString|Array<DynamicString>>} dsMap: an object containing all
 * DynamicString by name of parameter
 * @param {Array<Parameter>} contexts: the contexts in which the parameters are applicable
 * @param {PawRequest} request: the request from which to get the body parameters
 * @returns {OrderedMap<string, Parameter>} the corresponding OrderedMap of body Parameters
 */
methods.createUrlEncodedOrMultipartBodyParameters = function (dsMap, contexts, request) {
  var bodyParams = (0, _immutable.OrderedMap)(dsMap).map(function (value, name) {
    if (Array.isArray(value)) {
      return methods.createDefaultArrayParameter(contexts, name);
    }

    return methods.convertParameterDynamicStringIntoParameter(request, 'body', contexts, value, name);
  }).reduce(_fpUtils.convertEntryListInMap, {});

  return (0, _immutable.OrderedMap)(bodyParams);
};

/**
 * extracts the Parameters from a UrlEncoded body
 * @param {PawRequest} request: the request from which to get the body parameters
 * @returns {OrderedMap<string, Parameter>} the corresponding OrderedMap of body Parameters
 */
methods.createUrlEncodedBodyParameters = function (request) {
  var dsMap = request.getUrlEncodedBody(true);
  var contexts = methods.getContentTypeContexts('application/x-www-form-urlencoded');

  return methods.createUrlEncodedOrMultipartBodyParameters(dsMap, contexts, request);
};

/**
 * extracts the Parameters from a Multipart body
 * @param {PawRequest} request: the request from which to get the body parameters
 * @returns {OrderedMap<string, Parameter>} the corresponding OrderedMap of body Parameters
 */
methods.createMultipartBodyParameters = function (request) {
  var dsMap = request.getMultipartBody(true);
  var contexts = methods.getContentTypeContexts('multipart/form-data');

  return methods.createUrlEncodedOrMultipartBodyParameters(dsMap, contexts, request);
};

/**
 * extracts the single body Parameter from a request if the request is not url-encoded or multipart
 * @param {PawRequest} request: the request from which to get the body
 * @returns {OrderedMap<string, Parameter>} the corresponding OrderedMap of body parameters
 */
methods.createStandardBodyParameters = function (request) {
  var bodyDS = request.getBody(true);

  if (!bodyDS) {
    return (0, _immutable.OrderedMap)();
  }

  var _methods$convertParam = methods.convertParameterDynamicStringIntoParameter(request, 'body', (0, _immutable.List)(), bodyDS, null),
      key = _methods$convertParam.key,
      value = _methods$convertParam.value;

  var body = (0, _defineProperty3.default)({}, key, value);
  return (0, _immutable.OrderedMap)(body);
};

/**
 * extracts all body Parameters from a request
 * @param {PawRequest} request: the request from which to get the body parameters
 * @returns {OrderedMap<string, Parameter>} the corresponding OrderedMap of body parameters
 */
methods.getBodyParameters = function (request) {
  if (methods.isRequestBodyUrlEncoded(request)) {
    return methods.createUrlEncodedBodyParameters(request);
  }

  if (methods.isRequestBodyMultipart(request)) {
    return methods.createMultipartBodyParameters(request);
  }

  return methods.createStandardBodyParameters(request);
};

/**
 * extracts all header parameters from a request
 * @param {PawRequest} request: the request from which to get the headers
 * @returns {OrderedMap<string, Parameter>} the corresponding OrderedMap of header parameters
 */
methods.getHeadersMapFromRequest = function (request) {
  var extractHeaders = (0, _fpUtils.currify)(methods.convertParameterDynamicStringIntoParameter, request, 'headers', (0, _immutable.List)());

  var headers = (0, _immutable.OrderedMap)(request.getHeaders(true)).filter(function (_, name) {
    return name !== 'Authorization';
  }).map(extractHeaders).reduce(_fpUtils.convertEntryListInMap, {});

  return (0, _immutable.OrderedMap)(headers);
};

/**
 * extracts all query parameters from a request
 * @param {PawRequest} request: the request from which to get the query params
 * @returns {OrderedMap<string, Parameter>} the corresponding OrderedMap of query parameters
 */
methods.getQueriesMapFromRequest = function (request) {
  var extractUrlParams = (0, _fpUtils.currify)(methods.convertParameterDynamicStringIntoParameter, request, 'queries', (0, _immutable.List)());

  var queryParams = (0, _immutable.OrderedMap)(request.getUrlParameters(true)).map(extractUrlParams).reduce(_fpUtils.convertEntryListInMap, {});

  return (0, _immutable.OrderedMap)(queryParams);
};

/**
 * extracts all parameters from a request into a ParameterContainer
 * @param {PawRequest} request: the request from which to get the parameters
 * @returns {ParameterContainer} the corresponding ParameterContainer
 */
methods.extractParameterContainerFromRequest = function (request) {
  var headers = methods.getHeadersMapFromRequest(request);
  var queries = methods.getQueriesMapFromRequest(request);
  var body = methods.getBodyParameters(request);

  return new _ParameterContainer2.default({
    headers: headers, queries: queries, body: body
  });
};

methods.updateIdentifiersWithAuthURL = function (identifiers, authURL) {
  var host = authURL.getEvaluatedString().split('/')[2];
  var hostArray = host ? host.split('.') : [];
  var domain = hostArray[hostArray.length - 2];
  if (domain) {
    identifiers.push(domain);
  }

  return identifiers;
};

/**
 * extracts an authName from an OAuth2 DynamicValue.
 * @param {DynamicValue} authDV: the oauth2 DynamicValue
 * @returns {string} the authName
 */
methods.getAuthNameFromOAuth2DV = function (authDV) {
  var identifiers = ['oauth_2'];
  var authURL = authDV.authorizationURL;
  if (authURL) {
    identifiers = methods.updateIdentifiersWithAuthURL(identifiers, authURL);
  }

  var grantMap = {
    '0': 'code',
    '1': 'implicit',
    '2': 'resource_owner',
    '3': 'client_credentials'
  };

  if (grantMap[authDV.grantType]) {
    identifiers.push(grantMap[authDV.grantType]);
  }

  identifiers.push('auth');

  return identifiers.join('_');
};

/**
 * extracts an authName from a DynamicValue.
 * @param {PawContext} context: the context from which to resolve environment variables
 * @param {PawRequest} request: the request from which to resolve request variables
 * @param {DynamicValue} authDV: the DynamicValue to get the name of
 * @returns {string?} the authName, if the authDV is supported by API-Flow.
 */
methods.getAuthNameFromAuthDV = function (context, request, authDV) {
  if (methods.isEnvironmentVariable(authDV)) {
    var name = context.getEnvironmentVariableById(authDV.environmentVariable).name;
    return name;
  }

  if (methods.isRequestVariableDynamicValue(authDV)) {
    var variable = request.getVariableById(authDV.variableUUID);
    return methods.getAuthNameFromAuth(context, request, variable.value);
  }

  if (authDV.type === 'com.luckymarmot.OAuth2DynamicValue') {
    return methods.getAuthNameFromOAuth2DV(authDV);
  }

  return null;
};

/**
 * extracts an authName from the evaluation of a DynamicString
 * @param {DynamicString} authDS: the DynamicString to get the evaluated string of, for the purpose
 * of name extractVersion
 * @returns {string?} the name of the authentication DynamicString, if it is supported by API-Flow.
 */
methods.getAuthNameFromAuthString = function (authDS) {
  var scheme = authDS.getEvaluatedString().split(' ')[0];
  var nameMap = {
    Basic: 'basic_auth',
    Digest: 'digest_auth',
    Hawk: 'hawk_auth',
    'AWS4-HMAC-SHA256': 'aws_sig4_auth',
    OAuth: 'oauth_1_auth',
    Bearer: 'oauth_2_auth'
  };

  if (nameMap[scheme]) {
    return nameMap[scheme];
  }

  return null;
};

/**
 * extracts an authName from an authentication DynamicString.
 * @param {PawContext} context: the context in which to resolve the environment variable
 * @param {PawRequest} request: the request in which to resolve the request variable
 * @param {DynamicString} authDS: the authentication DynamicString to get the name of
 * @returns {string?} the extracted authName, if the authentication method is supported by API-Flow
 */
methods.getAuthNameFromAuth = function (context, request, authDS) {
  var authDV = authDS.getOnlyDynamicValue();

  if (authDV) {
    var name = methods.getAuthNameFromAuthDV(context, request, authDV);
    if (name) {
      return name;
    }
  }

  return methods.getAuthNameFromAuthString(authDS);
};

/**
 * extracts Auth References from a Request
 * @param {PawContext} context: the context in which to resolve environment variables
 * @param {PawRequest} request: the request from which to get the authentication header
 * @returns {List<References>} the corresponding list of References
 */
methods.extractAuthReferencesFromRequest = function (context, request) {
  var auth = request.getHeaderByName('Authorization', true);
  if (!auth) {
    return (0, _immutable.List)();
  }

  var authName = methods.getAuthNameFromAuth(context, request, auth);

  return (0, _immutable.List)([new _Reference2.default({
    type: 'auth',
    uuid: authName
  })]);
};

/**
 * converts a paw request into a Request record and stores it in an OrderedMap.
 * @param {PawContext} context: the context in which to resolve the environment variables
 * @param {PawRequest} pawReq: the request to convert
 * @param {OrderedMap<string, Reference>} endpoints: a map of references to endpoints
 * @returns {OrderedMap<string, Request>} the converted Request saved in an OrderedMap
 */
methods.extractRequestMapFromPawRequest = function (context, pawReq, endpoints) {
  var method = pawReq.getMethod();
  var parameters = methods.extractParameterContainerFromRequest(pawReq);
  var auths = methods.extractAuthReferencesFromRequest(context, pawReq);

  var request = new _Request2.default({
    id: pawReq.id,
    endpoints: (0, _immutable.OrderedMap)(endpoints),
    name: pawReq.name,
    description: pawReq.description,
    method: method,
    parameters: parameters,
    auths: auths
  });

  return (0, _immutable.OrderedMap)((0, _defineProperty3.default)({}, method, request));
};

/**
 * a reducer to group resources, variables, and endpoints together
 * @param {object} acc: the accumulator of the reducer
 * @param {Array<Entry<string, Resources>>} acc.resources: an aggregation of resources over multiple
 * endpoints/hosts
 * @param {Array<Entry<string, Variable>>} acc.variables: an aggregation of variables over multiple
 * endpoints/hosts
 * @param {Array<Entry<string, URL>>} acc.endpoints: an aggregation of endpoints over multiple hosts
 * @param {object} entry: the entry to add to the reducer
 * @param {Array<Entry<string, Resources>>} entry.resources: all the resources associated with a
 * host
 * @param {Variable?} entry.variable: the variable associated with the host, if it exists
 * @param {URL?} entry.endpoint: the endpoint associated with the host, if it exists
 * @returns {object} acc, the updated accumulator
 */
methods.groupResourcesVariablesAndEndpoints = function (_ref16, _ref17) {
  var resources = _ref16.resources,
      variables = _ref16.variables,
      endpoints = _ref16.endpoints;
  var hostResources = _ref17.resources,
      variable = _ref17.variable,
      endpoint = _ref17.endpoint;

  if (variable) {
    variables.push(variable);
  }

  if (endpoint) {
    endpoints.push(endpoint);
  }

  return {
    resources: resources.concat(hostResources),
    variables: variables,
    endpoints: endpoints
  };
};

methods.addAuthorizationAndTokenUrlToOAuth2Auth = function (authDV) {
  var authInstance = {};
  var authURL = authDV.authorizationURL;
  if (authURL) {
    authInstance.authorizationUrl = authURL.getEvaluatedString();
  }

  var tokenURL = authDV.tokenURL;
  if (tokenURL) {
    authInstance.tokenUrl = tokenURL.getEvaluatedString();
  }

  return authInstance;
};

/**
 * extracts an Auth record from an OAuth2 DynamicValue
 * @param {PawContext} context: the context in which to resolve environment variables
 * @param {PawRequest} request: the request in which to resolve request variables
 * @param {DynamicString} authDS: the authentication DynamicString
 * @param {DynamicValue} authDV: the authentication DynamicValue
 * @return {Entry<string, Auth>} the corresponding Auth record
 */
methods.extractAuthFromOAuth2DV = function (context, request, authDS, authDV) {
  var authInstance = methods.addAuthorizationAndTokenUrlToOAuth2Auth(authDV);

  var authName = methods.getAuthNameFromAuth(context, request, authDS);
  authInstance.authName = authName;

  var grantMap = {
    '0': 'accessCode',
    '1': 'implicit',
    '2': 'password',
    '3': 'application'
  };

  authInstance.flow = grantMap[authDV.grantType] || 'implicit';

  return { key: authName, value: new _Auth2.default.OAuth2(authInstance) };
};

/**
 * extract an Auth from DynamicValue
 * @param {PawContext} context: the context in which to resolve environment variables
 * @param {PawRequest} request: the request in which to resolve request variables
 * @param {DynamicString} authDS: the authentication DynamicString
 * @param {DynamicValue} authDV: the authentication DynamicValue
 * @return {Entry<string, Auth>} the corresponding Auth record
 */
methods.extractAuthFromDV = function (context, request, authDS, authDV) {
  if (methods.isEnvironmentVariable(authDV)) {
    var value = context.getEnvironmentVariableById(authDV.environmentVariable).getCurrentValue(true);
    return methods.extractAuthsFromRequest(context, request, value);
  }

  if (methods.isRequestVariableDynamicValue(authDV)) {
    var variable = request.getVariableById(authDV.variableUUID);
    return methods.extractAuthsFromRequest(context, request, variable.value);
  }

  if (authDV.type === 'com.luckymarmot.OAuth2DynamicValue') {
    return methods.extractAuthFromOAuth2DV(context, request, authDS, authDV);
  }

  return methods.extractAuthFromAuthString(authDS);
};

/**
 * extracts an Auth from the evaluated string of an authentication DynamicString
 * @param {DynamicString} authDS: the authentication DynamicString to get the evaluated string of
 * @returns {Entry<string, Auth>} the corresponding Auth record
 */
methods.extractAuthFromAuthString = function (authDS) {
  var scheme = authDS.getEvaluatedString().split(' ')[0];
  var nameMap = {
    Basic: function Basic() {
      return { key: 'basic_auth', value: new _Auth2.default.Basic({ authName: 'basic_auth' }) };
    },
    Digest: function Digest() {
      return { key: 'digest_auth', value: new _Auth2.default.Digest({ authName: 'digest_auth' }) };
    },
    Hawk: function Hawk() {
      return { key: 'hawk_auth', value: new _Auth2.default.Hawk({ authName: 'hawk_auth' }) };
    },
    'AWS4-HMAC-SHA256': function AWS4HMACSHA256() {
      return {
        key: 'aws_sig4_auth',
        value: new _Auth2.default.AWSSig4({ authName: 'aws_sig4_auth' })
      };
    },
    OAuth: function OAuth() {
      return { key: 'oauth_1_auth', value: new _Auth2.default.OAuth1({ authName: 'oauth_1_auth' }) };
    },
    Bearer: function Bearer() {
      return { key: 'oauth_2_auth', value: new _Auth2.default.OAuth2({ authName: 'oauth_2_auth' }) };
    }
  };

  if (nameMap[scheme]) {
    return nameMap[scheme]();
  }

  return { key: null, value: null };
};

/**
 * extract auths from a request or dynamic string
 * @param {PawContext} context: the context to use to resolve environment variables
 * @param {PawRequest} request: the request to use to resolve request variables, or to get the
 * authentication DynamicString
 * @param {DynamicString} _authDS: an optional authentication DynamicString to resolve instead of
 * the authentication DynamicString
 * @returns {Entry<string?, Auth?>} the corresponding auth DynamicValue
 */
methods.extractAuthsFromRequest = function (context, request, _authDS) {
  // potential infinite loop ?
  var authDS = _authDS || request.getHeaderByName('Authorization', true);
  var authDV = authDS.getOnlyDynamicValue();

  if (authDV) {
    return methods.extractAuthFromDV(context, request, authDS, authDV);
  }

  return methods.extractAuthFromAuthString(authDS);
};

/**
 * converts an array of PawRequests into Resources
 * @param {PawContext} context: the context to use to resolve environment variables
 * @param {Array<PawRequest>} reqs: the array of requests to convert into resources
 * @returns {{
 *   resources: Object<string, Resources>,
 *   variables: Array<Entry<string, Variable>>,
 *   endpoints: Array<Entry<string, URL>>
 * }} the corresponding resource map, and the associated variables and endpoints
 */
methods.extractResources = function (context, reqs) {
  var hosts = methods.extractCommonHostsFromRequests(reqs);
  var convertHostIntoResources = (0, _fpUtils.currify)(methods.convertHostIntoResources, context);

  var _hosts$map$reduce = hosts.map(convertHostIntoResources).reduce(methods.groupResourcesVariablesAndEndpoints, { resources: [], variables: [], endpoints: [] }),
      resources = _hosts$map$reduce.resources,
      variables = _hosts$map$reduce.variables,
      endpoints = _hosts$map$reduce.endpoints;

  var resourceMap = (0, _immutable.OrderedMap)(resources.reduce(_fpUtils.convertEntryListInMap, {}));

  return { resources: resourceMap, variables: variables, endpoints: endpoints };
};

/**
 * creates a Store from variables, endpoints, and auths
 * @param {PawContext} context: the context to use to resolve environment variables
 * @param {Array<Entry<string, Variable>>} variables: the variables to save in the store
 * @param {Array<Entry<string, URL>>} endpoints: the endpoints to save in the store
 * @param {Array<PawRequest>} reqs: the array of paw requests to use to extract shared auth methods
 * @returns {Store} the corresponding store
 */
methods.extractStore = function (context, variables, endpoints, reqs) {
  var auths = reqs.filter(function (request) {
    return request.getHeaderByName('Authorization', true);
  }).map(function (request) {
    return methods.extractAuthsFromRequest(context, request);
  }).filter(function (_ref18) {
    var key = _ref18.key;
    return !!key;
  });

  var variableStore = (0, _immutable.OrderedMap)(variables.reduce(_fpUtils.convertEntryListInMap, {}));
  var endpointStore = (0, _immutable.OrderedMap)(endpoints.reduce(_fpUtils.convertEntryListInMap, {}));
  var authStore = (0, _immutable.OrderedMap)(auths.reduce(_fpUtils.convertEntryListInMap, {}));

  var store = new _Store2.default({
    variable: variableStore,
    endpoint: endpointStore,
    auth: authStore
  });

  return store;
};

/**
 * extracts Resources and a Store of shared objects from an array of requests
 * @param {PawContext} context: the context to use to resolve environment variables
 * @param {Array<PawRequest>} reqs: the array of request from which to extract resources and shared
 * objects
 * @returns {object} result
 * @returns {OrderedMap<string, Resource>} result.resources: the extracted resources
 * @returns {Store} result.store: the store containing shared objects from resources
 */
methods.extractResourcesAndStore = function (context, reqs) {
  var _methods$extractResou = methods.extractResources(context, reqs),
      resources = _methods$extractResou.resources,
      variables = _methods$extractResou.variables,
      endpoints = _methods$extractResou.endpoints;

  var store = methods.extractStore(context, variables, endpoints, reqs);

  return { resources: resources, store: store };
};

// NOTE: we're cheating in this method, as we're not using the standard Item interface, but rather
// passing the requests and context as options to the parser.
/**
 * imports a list of requests, as well as metadata into an Api
 * @param {object} parserOptions: the parser options
 * @param {PawContext} parserOptions.context: the paw context
 * @param {PawRequest} parserOptions.reqs: the array of requests to import
 * @returns {Api} the corresponding Api
 */
methods.parse = function (_ref19) {
  var options = _ref19.options;
  var context = options.context,
      reqs = options.reqs;

  var info = methods.extractInfo(context);
  var group = methods.extractGroup(reqs);

  var _methods$extractResou2 = methods.extractResourcesAndStore(context, reqs),
      resources = _methods$extractResou2.resources,
      store = _methods$extractResou2.store;

  var api = new _Api2.default({
    info: info, store: store, group: group, resources: resources
  });

  return { options: options, api: api };
};

var __internals__ = exports.__internals__ = methods;
exports.default = PawParser;

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__internals__ = exports.RAMLSerializer = undefined;

var _getIterator2 = __webpack_require__(28);

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = __webpack_require__(38);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = __webpack_require__(60);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _stringify = __webpack_require__(37);

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = __webpack_require__(21);

var _assign2 = _interopRequireDefault(_assign);

var _typeof2 = __webpack_require__(12);

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = __webpack_require__(22);

var _keys2 = _interopRequireDefault(_keys);

var _iterator3 = __webpack_require__(110);

var _iterator4 = _interopRequireDefault(_iterator3);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(10);

var _createClass3 = _interopRequireDefault(_createClass2);

var _class, _temp;

var _immutable = __webpack_require__(0);

var _jsYaml = __webpack_require__(157);

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _fpUtils = __webpack_require__(20);

var _Auth = __webpack_require__(51);

var _Auth2 = _interopRequireDefault(_Auth);

var _Reference = __webpack_require__(27);

var _Reference2 = _interopRequireDefault(_Reference);

var _URL = __webpack_require__(56);

var _URL2 = _interopRequireDefault(_URL);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __meta__ = {
  format: 'raml',
  version: 'v1.0'
};

var methods = {};

// TODO move this to a better place
methods.getKeysFromRecord = function (keyMap, record) {
  return (0, _fpUtils.entries)(keyMap).map(function (_ref) {
    var key = _ref.key,
        value = _ref.value;
    return { key: key, value: record.get(value) };
  }).filter(function (_ref2) {
    var value = _ref2.value;
    return !!value;
  }).reduce(_fpUtils.convertEntryListInMap, {});
};

/**
 * A Serializer to convert Api Records into RAML v1.0.
 */
var RAMLSerializer = exports.RAMLSerializer = (_temp = _class = function () {
  function RAMLSerializer() {
    (0, _classCallCheck3.default)(this, RAMLSerializer);
  }

  (0, _createClass3.default)(RAMLSerializer, null, [{
    key: 'serialize',


    /**
     * serializes an Api into a RAML v1.0 formatted string
     * @param {Api} api: the api to convert
     * @returns {string} the corresponding postman collection, as a string
     */
    value: function serialize(api) {
      return methods.serialize(api);
    }

    /**
     * returns a quality score for a content string wrt. to the RAML v1.0 format.
     * @param {String} content: the content of the file to analyze
     * @returns {number} the quality of the content
     */

  }, {
    key: 'validate',
    value: function validate(content) {
      return methods.validate(content);
    }
  }]);
  return RAMLSerializer;
}(), _class.__meta__ = __meta__, _temp);


methods.validate = function () {
  return true;
};

/**
 * extracts refs from an object field, given a key name. (used iteratively over all keys of an obj)
 * @param {Object} schema: the schema to extract the refs from.
 * @param {string} key: the key to test if it is a reference
 * @returns {Array<string>} the corresponding array of references
 */
methods.extractRefsFromObject = function (schema, key) {
  if (key === '$ref') {
    return [schema[key]];
  }

  return methods.getRefsFromSchema(schema[key]);
};

/**
 * tests whether a schema object is array (or iterable)
 * @param {Object} schema: the schema to test whether it is an array or not
 * @returns {boolean} true if it is an array, false otherwise
 */
methods.isArray = function (schema) {
  return Array.isArray(schema) || typeof schema !== 'string' && typeof schema[_iterator4.default] === 'function';
};

/**
 * iterates over an array to extract refs from items.
 * @param {Array<*>} schema: the schema (array) to extract the references from
 * @returns {Array<string>} the corresponding references
 */
methods.getRefsFromArray = function (schema) {
  return schema.map(methods.getRefsFromSchema).reduce(_fpUtils.flatten, []);
};

/**
 * extract refs from an object by iterating over every key
 * @param {Object} schema: the schema to extract refs from
 * @returns {Array<string>} the corresponding array of references
 */
methods.getRefsFromObject = function (schema) {
  var keys = (0, _keys2.default)(schema);
  return keys.map((0, _fpUtils.currify)(methods.extractRefsFromObject, schema)).reduce(_fpUtils.flatten, []);
};

/**
 * tests whether a schema is an object or not. (considers null as not an object)
 * @param {Object} schema: the schema to test the type of
 * @returns {boolean} true if it is null or not an object, false otherwise
 */
methods.isNonObjectType = function (schema) {
  return !schema || (typeof schema === 'undefined' ? 'undefined' : (0, _typeof3.default)(schema)) !== 'object';
};

/**
 * returns the references associated with non object types.
 * @returns {Array<string>} the corresponding array of references
 */
methods.getRefsFromNonObjectTypes = function () {
  return [];
};

/**
 * extracts the references from a schema.
 * @param {any} schema: the schema to extract references from. It can actually by a subset of a
 * schema. Hence the `any` type.
 * @returns {Array<string>} the corresponding array of references
 */
methods.getRefsFromSchema = function (schema) {
  if (methods.isNonObjectType(schema)) {
    return methods.getRefsFromNonObjectTypes(schema);
  }

  if (methods.isArray(schema)) {
    return methods.getRefsFromArray(schema);
  }

  return methods.getRefsFromObject(schema);
};

/**
 * (recursively) tests whether a schema is convertible to a dataType, without checking the validity
 * of its references.
 * @param {any} schema: the schema to test the convertibilty of.
 * @returns {boolean} whether the schema itself is convertible or not
 */
methods.isConvertible = function (schema) {
  if (methods.isNonObjectType(schema)) {
    return true;
  }

  if (methods.isArray(schema)) {
    return schema.map(methods.isConvertible).reduce(function (acc, bool) {
      return acc && bool;
    }, true);
  }

  var keys = (0, _keys2.default)(schema);
  var isValid = keys.map(function (key) {
    return ['exclusiveMaximum', 'exclusiveMinimum', 'additionalItems', 'patternProperties', 'dependencies', 'oneOf', 'not'].indexOf(key) < 0;
  }).reduce(function (acc, bool) {
    return acc && bool;
  }, true);

  if (!isValid) {
    return false;
  }

  return keys.map(function (key) {
    return methods.isConvertible(schema[key]);
  }).reduce(function (acc, bool) {
    return acc && bool;
  }, true);
};

/**
 * infers wether an schema is of type object or not.
 * @param {Object} schema: the schema to infer the type of
 * @returns {boolean} whether it is a schema describing an object or not
 */
methods.isObjectType = function (schema) {
  return typeof schema.properties !== 'undefined' || typeof schema.minProperties !== 'undefined' || typeof schema.maxProperties !== 'undefined' || typeof schema.discriminator !== 'undefined' || typeof schema.discriminatorValue !== 'undefined';
};

/**
 * infers wether an schema is of type array or not.
 * @param {Object} schema: the schema to infer the type of
 * @returns {boolean} whether it is a schema describing an array or not
 */
methods.isArrayType = function (schema) {
  return typeof schema.items !== 'undefined' || typeof schema.uniqueItems !== 'undefined' || typeof schema.minItems !== 'undefined' || typeof schema.maxItems !== 'undefined';
};

/**
 * infers wether an schema is of type string or not.
 * @param {Object} schema: the schema to infer the type of
 * @returns {boolean} whether it is a schema describing a string or not
 */
methods.isStringType = function (schema) {
  return typeof schema.pattern !== 'undefined' || typeof schema.maxLength !== 'undefined' || typeof schema.minLength !== 'undefined';
};

/**
 * infers wether an schema is of type number or not.
 * @param {Object} schema: the schema to infer the type of
 * @returns {boolean} whether it is a schema describing a number or not
 */
methods.isNumberType = function (schema) {
  return typeof schema.minimum !== 'undefined' || typeof schema.maximum !== 'undefined' || typeof schema.multipleOf !== 'undefined';
};

/* eslint-disable max-statements */
/**
 * extracts the RAML Basic type from a schema, infering it if necessary
 * @param {Object} schema: the schema to extract the type of
 * @returns {string} the corresponding RAML basic type
 */
methods.getType = function (schema) {
  if (schema.type && schema.type !== 'null') {
    return schema.type;
  }

  if (schema.type === 'null') {
    return 'nil';
  }

  if (methods.isObjectType(schema)) {
    return 'object';
  }

  if (methods.isArrayType(schema)) {
    return 'array';
  }

  if (methods.isStringType(schema)) {
    return 'string';
  }

  if (methods.isNumberType(schema)) {
    return 'number';
  }

  return 'any';
};
/* eslint-enable max-statements */

/**
 * converts the items array of schemas of an array-typed schema into an array of DataTypes
 * @param {Array<Object>} items: the schemas that the items can respect in the array-typed schema
 * @returns {Array<string>} the corresponding array of DataTypes
 */
methods.convertSchemaItemsArrayIntoTypes = function (items) {
  return items.map(methods.getTypes).reduce(_fpUtils.flatten, []).map(function (type) {
    return '(' + type + ')[]';
  });
};

/**
 * converts the items schema of an array-typed schema into an array of DataTypes
 * @param {Object} items: the schema that the items must respect in the array-typed schema
 * @returns {Array<string>} the corresponding array of DataTypes
 */
methods.convertSchemaItemsObjectIntoTypes = function (items) {
  return methods.getTypes(items).map(function (type) {
    if (type.match(/\|/)) {
      return '(' + type + ')[]';
    }
    return type + '[]';
  });
};

/**
 * extracts the DataTypes from a schema with an items property
 * @param {Array<Object> | Object} items: the items property of the schema
 * @returns {Array<string>} the corresponding DataTypes
 */
methods.convertSchemaItemsIntoTypes = function (items) {
  if (methods.isArray(items)) {
    return methods.convertSchemaItemsArrayIntoTypes(items);
  }

  return methods.convertSchemaItemsObjectIntoTypes(items);
};

/**
 * converts a schema allOf property into an array of DataTypes
 * @param {Array<Object>} allOf: the allOf property of the schema
 * @returns {Array<string>} the corresponding DataTypes
 */
methods.convertSchemaAllOfIntoTypes = function (allOf) {
  return allOf.map(methods.getTypes).reduce(_fpUtils.flatten, []);
};

/**
 * converts a schema anyOf property into an Array of DataTypes
 * @param {Array<Object>} anyOf: the anyOf property of the schema
 * @returns {Array<string>} the corresponding DataTypes
 */
methods.convertSchemaAnyOfIntoTypes = function (anyOf) {
  var anyOfType = anyOf.map(methods.getTypes).reduce(_fpUtils.flatten, []).join(' | ');
  return [anyOfType];
};

/**
 * extracts the types out of a schema
 * @param {JSONSchema} schema: the schema to get the types of
 * @returns {Array<string>} the corresponding types
 */
methods.getTypes = function (schema) {
  var baseType = methods.getType(schema);

  if (schema.$ref) {
    return [schema.$ref.split('/')[2]];
  }

  var types = [baseType];
  if (schema.items) {
    types = methods.convertSchemaItemsIntoTypes(schema.items);
  }

  if (schema.allOf) {
    types = methods.convertSchemaAllOfIntoTypes(schema.allOf);
  } else if (schema.anyOf) {
    types = methods.convertSchemaAnyOfIntoTypes(schema.anyOf);
  }

  return types;
};

/**
 * applies simple common properties from the schema to the dataType, if they exists
 * @param {RamlDataType} dataType: the dataType to update with common properties
 * @param {JSONSchema} schema: the schema to get the common properties from
 * @returns {RamlDataType} the updated RAML dataType
 */
methods.applyCommonProps = function (dataType, schema) {
  var commonProps = ['minProperties', 'maxProperties', 'discriminator', 'discriminatorValue', 'additionalProperties', 'uniqueItems', 'minItems', 'maxItems', 'pattern', 'minLength', 'maxLength', 'maximum', 'minimum', 'multipleOf', 'enum', 'description'];

  var keys = (0, _keys2.default)(schema);
  return keys.filter(function (key) {
    return commonProps.indexOf(key) >= 0;
  }).map(function (key) {
    return { key: key, value: schema[key] };
  }).reduce(function ($data, _ref3) {
    var key = _ref3.key,
        value = _ref3.value;

    $data[key] = value;
    return $data;
  }, dataType);
};

/**
 * adds the `items` properties to a RAML dataType if the schema has one.
 * @param {RamlDataType} dataType: the dataType to update
 * @param {JSONSchema} schema: the schema to extract the items properties from
 * @returns {RamlDataType} the updated RAML dataType
 */
methods.addItemsProp = function (dataType, schema) {
  if (!schema.items || dataType.type.indexOf('array') < 0) {
    return dataType;
  }

  var types = methods.getTypes(schema.items);
  if (types.length) {
    dataType.items = types[0];
  } else {
    dataType.items = types;
  }

  return dataType;
};

/**
 * adds the `propertes` properties to a RAML dataType if the schema has one.
 * @param {RamlDataType} dataType: the dataType to update
 * @param {JSONSchema} schema: the schema to extract the `properties` properties from
 * @returns {RamlDataType} the updated RAML dataType
 */
methods.addPropertiesProp = function (dataType, schema) {
  if (!schema.properties) {
    return dataType;
  }

  var props = (0, _keys2.default)(schema.properties);

  if (!props.length) {
    return dataType;
  }

  dataType.properties = props.map(function (prop) {
    return { key: prop, value: methods.convertSchemaToDataType(schema.properties[prop]) };
  }).reduce(function ($data, _ref4) {
    var key = _ref4.key,
        value = _ref4.value;

    if ((schema.required || []).indexOf(key) < 0) {
      value.required = false;
    }

    $data[key] = value;
    return $data;
  }, {});

  return dataType;
};

/**
 * converts a schema into a RAML dataType
 * @param {JSONSchema} schema: the schema to convert
 * @returns {RamlDataType} the corresponding RAML dataType
 */
methods.convertSchemaToDataType = function (schema) {
  var dataType = {};

  var types = methods.getTypes(schema);
  if (types.length === 1) {
    dataType.type = types[0];
  } else {
    dataType.type = types;
  }

  dataType = methods.applyCommonProps(dataType, schema);

  dataType = methods.addItemsProp(dataType, schema);
  dataType = methods.addPropertiesProp(dataType, schema);
  // dataType = methods.addRequiredProp(dataType, schema)

  return dataType;
};

/**
 * dumps all dependencies of a schema in the `definitions` field of the schema, and stringifies it.
 * This is done for JSON Schemas that cannot be converted into dataTypes
 * @param {JSONSchema} _schema: the schema to dump as a string
 * @param {Array<string>} deps: an array representing the dependencies of the schema
 * @param {Map<string, { schema: JSONSchema }>} coreInfoMap: a Map containing all the schemas in the
 * Api.
 * @returns {string|JSONSchema} the corresponding string, except if the stringification failed, in
 * which case the object itself is dumped (this should not happen)
 */
methods.dumpJSONIntoDataType = function (_schema, deps, coreInfoMap) {
  var schema = (0, _assign2.default)({}, _schema);

  if (deps.length) {
    schema.definitions = deps.map(function (dep) {
      var _ref5 = coreInfoMap.get(dep) || { schema: {} },
          _ref5$schema = _ref5.schema,
          depSchema = _ref5$schema === undefined ? {} : _ref5$schema;

      return { key: dep, value: depSchema };
    }).reduce(function ($defs, _ref6) {
      var key = _ref6.key,
          value = _ref6.value;

      $defs[key] = value;
      return $defs;
    }, {});
  }

  try {
    return (0, _stringify2.default)(schema, null, 2);
  } catch (e) {
    return schema;
  }
};

/**
 * recursively extracts all dependencies from the coreInfoMap based on the name of a schema or an
 * array of dependencies. (follows sub-dependencies until no new found)
 * @param {Map<string, { deps: Array<string> }>} coreInfoMap: a Map containing all the dependencies
 * for each schema
 * @param {Object<string, boolean>} depsMap: an accumulator that saves already found dependencies
 * (helps avoiding dependency cycles)
 * @param {string?} name: the name of the schema to get the dependencies of
 * @param {Array<string>?} $deps: an array of dependencies to use as a starting point
 * @returns {Object<string, boolean>} the updated accumulator (depsMap)
 */
methods.getAllDependencies = function (coreInfoMap, depsMap, name, $deps) {
  var deps = $deps || (coreInfoMap.get(name) || {}).deps;
  depsMap[name] = true;

  if (!deps || !deps.length) {
    return depsMap;
  }

  return deps.map(function (dep) {
    return dep.split('/')[2];
  }).filter(function (dep) {
    return !depsMap[dep];
  }).reduce(function (d, n) {
    return methods.getAllDependencies(coreInfoMap, d, n);
  }, depsMap);
};

/*
 * Second Strategy (more advanced):
 * tries to find all the schemas that can't be converted or depend on a schema that can't
 */
/**
 * marks a schema in a schema map, based on the name of the schema
 * @param {Map<string, { marked: boolean? }>} schemaMap: the map of schemas to update
 * @param {string} name: the name of the schema to mark
 * @returns {Map<string, { marked: boolean? }>} the updated schema map
 */
methods.markSchema = function (schemaMap, name) {
  schemaMap.get(name).marked = true;
  return schemaMap;
};

/**
 * unmarks all schemas in a schema map
 * @param {Object<string, { marked: boolean? }> } schemaMap: the map of schemas to update
 * @returns {Object<string, {marked: undefined }> } the updated schema map
 */
methods.unmarkSchemas = function (schemaMap) {
  schemaMap.forEach(function (v) {
    delete v.marked;
  });

  return schemaMap;
};

/**
 * tests whether a schema and all its dependencies are convertible into dataTypes
 * @param {Map<string, { convertible: boolean, deps: Array<string>?} >} coreInfoMap: a map
 * containing informations about each schemas to convert.
 * @param {string?} name: the name of the schema to test
 * @param {{ convertible: boolean, deps: Array<string>? }?} optionalCoreInfo: an optional set of
 * information to use. If it is provided, it supersedes the data obtained from the name of the
 * schema.
 * @returns {boolean} whether the schema and all its dependencies are convertible
 */
methods.areSchemaAndDepsConvertible = function (coreInfoMap, name, optionalCoreInfo) {
  var _ref7 = optionalCoreInfo ? optionalCoreInfo : coreInfoMap.get(name) || {},
      convertible = _ref7.convertible,
      _ref7$deps = _ref7.deps,
      deps = _ref7$deps === undefined ? [] : _ref7$deps;

  if (!convertible) {
    return false;
  }

  return deps.map(function (dep) {
    return dep.split('/')[2];
  }).map(function (depName) {
    if (typeof coreInfoMap.get(depName) === 'undefined') {
      return true;
    }

    if (coreInfoMap.get(depName).marked) {
      return coreInfoMap.get(depName).convertible;
    }

    var updatedCoreInfoMap = methods.markSchema(coreInfoMap, depName);
    return methods.areSchemaAndDepsConvertible(updatedCoreInfoMap, depName);
  }).reduce(function (acc, bool) {
    return acc && bool;
  }, true);
};

/**
 * extract core information from a schema, e.g. its convertibility into dataType, and its
 * dependencies
 * @param {JSONSchema} schema: the schema to get the core information from
 * @returns {{ deps: Array<string>?, convertible: boolean }} the corresponding core information
 */
methods.extractCoreInformationFromSchema = function (schema) {
  var deps = methods.getRefsFromSchema(schema);
  var convertible = methods.isConvertible(schema);

  return { deps: deps, convertible: convertible };
};

/**
 * extracts core information from a constraint. (e.g. itself, its corresponding schema, its
 * dependencies, its name and whether it is convertible into a dataType)
 * @param {Constraint} constraint: the constraint to extract the core information from
 * @param {string?} name: the name of the constraint, if it exists
 * @returns {{
 *   constraint: Constraint,
 *   schema: JSONSchema,
 *   deps: Array<string>?,
 *   convertible: boolean,
 *   name: string?
 * }} the corresponding core information about the constraint
 */
methods.extractCoreInformationFromConstraint = function (constraint, name) {
  var schema = constraint.toJSONSchema();

  var _methods$extractCoreI = methods.extractCoreInformationFromSchema(schema),
      deps = _methods$extractCoreI.deps,
      convertible = _methods$extractCoreI.convertible;

  return { constraint: constraint, schema: schema, deps: deps, convertible: convertible, name: name };
};

/**
 * converts a core information about a constraint into a dataType
 * @param {{
 *   schema: JSONSchema,
 *   deps: Array<string>?,
 *   convertible: boolean,
 *   name: string?
 * }} coreInfo: the core information about a constraint
 * @param {string} key: the key of the coreInfo in the coreInfoMap. This is only present because
 * we are using this method in tandem with the standard `map` method.
 * @param {Map<string, coreInfo>} coreInfoMap: the coreInfo map from which to extract the data to
 * create the dataType
 * @returns {Entry<string, RamlDataType>} the corresponding dataType, as an Entry
 */
methods.extractDataTypeFromCoreInformation = function (_ref8, key, coreInfoMap) {
  var schema = _ref8.schema,
      name = _ref8.name,
      deps = _ref8.deps,
      convertible = _ref8.convertible;

  var isConvertible = methods.areSchemaAndDepsConvertible(coreInfoMap, name, { deps: deps, convertible: convertible });
  var updatedCoreInfoMap = methods.unmarkSchemas(coreInfoMap);

  var dataType = void 0;
  if (isConvertible) {
    dataType = methods.convertSchemaToDataType(schema);
  } else {
    var depsMap = methods.getAllDependencies(updatedCoreInfoMap, {}, name, deps);
    delete depsMap[name];
    var $deps = (0, _keys2.default)(depsMap);
    dataType = methods.dumpJSONIntoDataType(schema, $deps, coreInfoMap);
  }

  return {
    key: name,
    value: dataType
  };
};

/**
 * extracts core information for each shared constraint in an Api.
 * @param {Api} api: the api to get the core information about shared constraints from
 * @returns {Map<string, coreInfo>} the corresponding coreInfo map
 */
methods.extractCoreInformationMapFromApi = function (api) {
  var constraints = api.getIn(['store', 'constraint']);

  var coreInfoMap = constraints.map(methods.extractCoreInformationFromConstraint);

  return coreInfoMap;
};

/**
 * extracts dataTypes from a coreInfoMap that represents all the shared constraints of an Api
 * @param {Map<string, coreInfo>} coreInfoMap: the coreInfo map that holds all the necessary
 * information about each constraint to create dataTypes
 * @returns {Entry<string, Object<string, RamlDataType>>} the shared dataTypes, in Entry format
 */
methods.extractDataTypesFromApi = function (coreInfoMap) {
  var types = coreInfoMap.map(methods.extractDataTypeFromCoreInformation).reduce(_fpUtils.convertEntryListInMap, {});

  return { key: 'types', value: types };
};

/**
 * extract the title from an Api
 * @param {Api} api: the api from which to get the title
 * @returns {Entry<string, string>?} the corresponding title, if it exists, in Entry format
 */
methods.extractTitleFromApi = function (api) {
  var title = api.getIn(['info', 'title']) || null;

  if (!title) {
    return null;
  }

  return { key: 'title', value: title };
};

/**
 * extract the description from an Api
 * @param {Api} api: the api from which to get the description
 * @returns {Entry<string, string>?} the corresponding description, if it exists, in Entry format
 */
methods.extractDescriptionFromApi = function (api) {
  var description = api.getIn(['info', 'description']) || null;

  if (!description) {
    return null;
  }

  return { key: 'description', value: description };
};

/**
 * extract the version from an Api
 * @param {Api} api: the api from which to get the version
 * @returns {Entry<string, string>?} the corresponding version, if it exists, in Entry format
 */
methods.extractVersionFromApi = function (api) {
  var version = api.getIn(['info', 'version']) || null;

  if (!version) {
    return null;
  }

  return { key: 'version', value: version };
};

methods.getBaseUriEndpoint = function (api) {
  var endpoint = api.getIn(['store', 'endpoint']).valueSeq().get(0);

  if (endpoint) {
    return endpoint;
  }

  var variable = api.getIn(['store', 'variable']).valueSeq().get(0);
  if (!variable) {
    return null;
  }

  var firstValue = variable.get('values').valueSeq().get(0);
  if (!firstValue) {
    return null;
  }

  return new _URL2.default({ url: firstValue });
};

/**
 * extract the baseUri from an Api
 * @param {Api} api: the api from which to get the baseUri
 * @returns {Entry<string, string>?} the corresponding baseUri, if it exists, in Entry format
 */
methods.extractBaseUriFromApi = function (api) {
  var endpoint = methods.getBaseUriEndpoint(api);
  if (!endpoint) {
    return null;
  }

  var url = endpoint.generate((0, _immutable.List)(['{', '}']));

  if (!url) {
    return null;
  }

  return { key: 'baseUri', value: url };
};

/**
 * extract the parameters from a urlComponent
 * @param {URLComponent} urlComponent: the component from which to get the parameters
 * @returns {List<Parameter>?} the corresponding list of parameters, if applicable
 */
methods.extractParametersFromURLComponent = function (urlComponent) {
  if (!urlComponent) {
    return null;
  }

  var param = urlComponent.get('parameter');
  if (!param || param.get('superType') !== 'sequence') {
    return null;
  }

  var sequence = param.get('value');
  if (!sequence) {
    return null;
  }

  var params = sequence.filter(function ($param) {
    return $param.get('key');
  });
  return params;
};

/**
 * converts a JSONSchema into a Named Parameter (aka: dataType)
 * @param {Map<string, coreInfo>} coreInfoMap: the map containing all information necessary to the
 * creation of DataTypes
 * @param {string} name: the name of the named parameter
 * @param {JSONSchema} schema: the schema to convert into a named parameter / dataType
 * @returns {Entry<string, RamlDataType>} the corresponding dataType, in Entry format
 */
methods.convertJSONSchemaIntoNamedParameter = function (coreInfoMap, name, schema) {
  var _methods$extractCoreI2 = methods.extractCoreInformationFromSchema(schema),
      deps = _methods$extractCoreI2.deps,
      convertible = _methods$extractCoreI2.convertible;

  return methods.extractDataTypeFromCoreInformation({ deps: deps, convertible: convertible, schema: schema, name: name }, null, coreInfoMap);
};

/**
 * converts a Parameter into a NamedParameter / dataType.
 * @param {Map<string, coreInfo>} coreInfoMap: the map containing all information necessary to the
 * creation of DataTypes
 * @param {Parameter} param: the parameter to convert
 * @returns {Entry<string, string>?} the corresponding dataType, if it exists, in Entry format
 */
methods.convertParameterIntoNamedParameter = function (coreInfoMap, param) {
  if (!param) {
    return null;
  }

  var key = param.get('key');
  var schema = param.getJSONSchema(false, false);

  var namedParameter = methods.convertJSONSchemaIntoNamedParameter(coreInfoMap, key, schema);
  return namedParameter;
};

/**
 * extracts the base uri parameters from an Api.
 * @param {Map<string, coreInfo>} coreInfoMap: the map containing all information necessary to the
 * creation of DataTypes
 * @param {Api} api: the api to get the base uri and its parameter from
 * @returns {Entry<string, Object<string, RamlDataType>>?} the corresponding dataType, if it exists,
 * in Entry format.
 */
methods.extractBaseUriParametersFromApi = function (coreInfoMap, api) {
  var endpoint = methods.getBaseUriEndpoint(api);
  if (!endpoint) {
    return null;
  }

  var urlComponentNames = ['hostname', 'port', 'pathname'];
  var params = urlComponentNames.map(function (name) {
    return methods.extractParametersFromURLComponent(endpoint.get(name));
  }).filter(function (v) {
    return !!v;
  }).reduce(_fpUtils.flatten, []).map(function (param) {
    return methods.convertParameterIntoNamedParameter(coreInfoMap, param);
  }).filter(function (_ref9) {
    var key = _ref9.key;
    return key.toLowerCase() !== 'version';
  });

  if (!params.length) {
    return null;
  }

  var paramMap = params.reduce(_fpUtils.convertEntryListInMap, {});

  return { key: 'baseUriParameters', value: paramMap };
};

/**
 * extracts the protocols from an Api
 * @param {Api} api: the api from which to get the shared protocols
 * @returns {Entry<string, Array<string>>?} the corresponding dataType, if it exists, in Entry
 * format
 */
methods.extractProtocolsFromApi = function (api) {
  var endpoint = methods.getBaseUriEndpoint(api);
  if (!endpoint) {
    return null;
  }

  var protocols = endpoint.get('protocol');
  if (!protocols || !protocols.size) {
    return null;
  }

  var validProtocols = protocols.filter(function (protocol) {
    return protocol.match(/https?:?/i);
  }).map(function (protocol) {
    return protocol.match(/(https?)/i)[1].toUpperCase();
  }).toJS();

  if (!validProtocols || !validProtocols.length) {
    return null;
  }

  return { key: 'protocols', value: validProtocols };
};

/**
 * extracts the shared media type uuid from an Api. This uuid is defined iff there is exactly
 * one shared Content-Type header for requests in the whole Api.
 * @param {Api} api: the api to extract the global media type uuid from
 * @returns {string?} the corresponding uuid, if it exists
 */
methods.extractMediaTypeUUIDfromApi = function (api) {
  var params = api.getIn(['store', 'parameter']);
  var contentTypeParams = params.filter(function (param) {
    return param.get('key') === 'Content-Type' && param.get('usedIn') === 'request';
  });

  if (contentTypeParams.size !== 1) {
    return null;
  }

  var uuid = contentTypeParams.map(function (_, key) {
    return key;
  }).valueSeq().get(0);
  return uuid;
};

methods.extractMediaTypeFromContentTypeParameter = function (contentTypeParam) {
  var defaultValue = contentTypeParam.get('default');
  if (defaultValue) {
    return { key: 'mediaType', value: defaultValue };
  }

  var enumValue = contentTypeParam.getJSONSchema().enum;
  if (enumValue) {
    return { key: 'mediaType', value: [].concat(enumValue) };
  }

  return null;
};

/**
 * extracts the shared media type from an Api. This media type is defined iff there is exactly
 * one shared Content-Type header for requests in the whole Api.
 * @param {Api} api: the api to extract the global media type from
 * @returns {Entry<string, string|Array<string>>?} the corresponding media type, if it exists, in
 * Entry format
 */
methods.extractMediaTypeFromApi = function (api) {
  var params = api.getIn(['store', 'parameter']);
  var contentTypeParams = params.filter(function (param) {
    return param.get('key') === 'Content-Type' && param.get('usedIn') === 'request';
  });

  if (contentTypeParams.size !== 1) {
    return null;
  }

  var contentTypeParam = contentTypeParams.valueSeq().get(0);
  return methods.extractMediaTypeFromContentTypeParameter(contentTypeParam);
};

/**
 * extracts a RAMLMethodBase object from a request, with the help of a coreInfo map and of the
 * global mediaTypeUUID.
 * @param {string?} mediaTypeUUID: the uuid of the globalMediaType, if it exists
 * @param {Map<string, coreInfo>} coreInfoMap: a Map of coreInfo that holds all that is necessary
 * to convert a schema into a RamlDataType
 * @param {Request} request: the request to convert into a RAMLMethodBase
 * @returns {RAMLMethodBase?} the corresponding RAMLMethodBase, if it exists
 */
methods.extractMethodBaseFromRequest = function (mediaTypeUUID, coreInfoMap, request) {
  var kvs = [methods.extractDisplayNameFromRequest(request), methods.extractDescriptionFromRequest(request), methods.extractQueryParametersFromRequest(coreInfoMap, request), methods.extractHeadersFromRequest(coreInfoMap, request), methods.extractBodyFromRequest(coreInfoMap, request), methods.extractProtocolsFromRequest(request), methods.extractIsFromRequest(mediaTypeUUID, request), methods.extractSecuredByFromRequest(request), methods.extractResponsesFromRequest(coreInfoMap, request)].filter(function (v) {
    return !!v;
  });

  if (!kvs.length) {
    return null;
  }

  return kvs.reduce(_fpUtils.convertEntryListInMap, {});
};

/**
 * extracts a Traits from an Api, with the help of a coreInfo map and of the global mediaTypeUUID.
 * @param {string?} mediaTypeUUID: the uuid of the globalMediaType, if it exists
 * @param {Map<string, coreInfo>} coreInfoMap: a Map of coreInfo that holds all that is necessary
 * to convert a schema into a RamlDataType
 * @param {Api} api: the api to get the shared request level interfaces to convert into RAMLTraits
 * @returns {Array<Entry<string, RAMLTrait>>} the corresponding array of Traits
 */
methods.extractTraitsFromInterfaces = function (mediaTypeUUID, coreInfoMap, api) {
  var itfs = api.getIn(['store', 'interface']).filter(function (itf) {
    return itf.get('level') === 'request';
  });

  var traits = itfs.map(function (itf) {
    if (!itf.get('underlay')) {
      return {
        key: itf.get('uuid'),
        value: {}
      };
    }

    return {
      key: itf.get('uuid'),
      value: methods.extractMethodBaseFromRequest(mediaTypeUUID, coreInfoMap, itf.get('underlay'))
    };
  }).filter(function (_ref10) {
    var value = _ref10.value;
    return !!value;
  });

  return traits.valueSeq().toJS();
};

/* eslint-disable max-statements */
/**
 * extracts a RAMLMethodBase from a Parameter, with the help of a coreInfo map and of the global
 * mediaTypeUUID. This is done to represent shared Parameters (which do not have an exact match in
 * RAML)
 * @param {Map<string, coreInfo>} coreInfoMap: a Map of coreInfo that holds all that is necessary
 * to convert a schema into a RamlDataType
 * @param {Parameter} parameter: the parameter to convert into a RAMLMethodBase
 * @returns {RAMLMethodBase?} the corresponding RAMLMethodBase if it exists
 */
methods.extractMethodBaseFromParameter = function (coreInfoMap, parameter) {
  var location = parameter.get('in');
  var locationMap = {
    headers: 'headers',
    queries: 'queryParameters'
  };

  var kv = methods.convertParameterIntoNamedParameter(coreInfoMap, parameter);

  if (!kv) {
    return null;
  }

  if (locationMap[location]) {
    return (0, _defineProperty3.default)({}, locationMap[location], (0, _defineProperty3.default)({}, kv.key, kv.value));
  }

  if (location === 'body') {
    if (kv.key) {
      return { body: (0, _defineProperty3.default)({}, kv.key, kv.value) };
    }

    return { body: kv.value };
  }

  return null;
};
/* eslint-disable max-statements */

/**
 * extracts Traits from shared Parameters, with the help of a coreInfo map and of the global
 * mediaTypeUUID.
 * @param {string?} mediaTypeUUID: the uuid of the global mediaType, if it exists
 * @param {Map<string, coreInfo>} coreInfoMap: a Map of coreInfo that holds all that is necessary
 * to convert a schema into a RamlDataType
 * @param {Api} api: the api from which to get the shared parameters
 * @returns {Array<Entry<string, RAMLMethodBase>>} the corresponding traits, as an array of Entries
 */
methods.extractTraitsFromParameters = function (mediaTypeUUID, coreInfoMap, api) {
  var params = api.getIn(['store', 'parameter']);
  var traits = params.filter(function (_, key) {
    return key !== mediaTypeUUID;
  }).map(function (param, key) {
    return {
      key: key,
      value: methods.extractMethodBaseFromParameter(coreInfoMap, param)
    };
  }).filter(function (_ref12) {
    var key = _ref12.key,
        value = _ref12.value;
    return !!key && !!value;
  });

  return traits.valueSeq().toJS();
};

/**
 * extracts a MethodBase from a response
 * @param {Map<string, coreInfo>} coreInfoMap: a Map of coreInfo that holds all that is necessary to
 * convert a schema into a RamlDataType
 * @param {Response} response: the response to convert into a MethodBase
 * @returns {RAMLMethodBase} the corresponding RAMLMethodBase, if it exists
 */
methods.extractMethodBaseFromResponse = function (coreInfoMap, response) {
  var responseEntry = methods.extractResponsesFromRequest(coreInfoMap, (0, _immutable.OrderedMap)({
    responses: (0, _immutable.OrderedMap)((0, _defineProperty3.default)({}, response.get('code'), response))
  }));

  if (!responseEntry) {
    return null;
  }

  return (0, _defineProperty3.default)({}, responseEntry.key, responseEntry.value);
};

/**
 * extract Traits from shared responses
 * @param {Map<string, coreInfo>} coreInfoMap: a Map of coreInfo that holds all that is necessary to
 * convert a schema into a RamlDataType
 * @param {Api} api: the api from which to get the shared responses
 * @returns {Array<RAMLMethodBase>} the corresponding array of traits
 */
methods.extractTraitsFromSharedResponses = function (coreInfoMap, api) {
  var responses = api.getIn(['store', 'response']);
  var traits = responses.map(function (response, key) {
    return {
      key: 'response_' + key,
      value: methods.extractMethodBaseFromResponse(coreInfoMap, response)
    };
  }).filter(function (_ref14) {
    var key = _ref14.key,
        value = _ref14.value;
    return !!key && !!value;
  });

  return traits.valueSeq().toJS();
};

/**
 * extracts all possible Traits from an Api, with the help of a coreInfo map and of the global
 * mediaTypeUUID. This is done to represent shared Parameters (which do not have an exact match in
 * RAML)
 * @param {string?} mediaTypeUUID: the uuid of the global mediaType, if it exists
 * @param {Map<string, coreInfo>} coreInfoMap: a Map of coreInfo that holds all that is necessary
 * to convert a schema into a RamlDataType
 * @param {Api} api: the api from which to get all possible Traits (from shared interfaces and
 * shared parameters)
 * @returns {Entry<string, Object<string, RAMLMethodBase>>?} the corresponding traits object,
 * if it exists, as an Entry
 */
methods.extractTraitsFromApi = function (mediaTypeUUID, coreInfoMap, api) {
  var itfsTraits = methods.extractTraitsFromInterfaces(mediaTypeUUID, coreInfoMap, api);
  var paramTraits = methods.extractTraitsFromParameters(mediaTypeUUID, coreInfoMap, api);
  var responseTraits = methods.extractTraitsFromSharedResponses(coreInfoMap, api);

  if (!itfsTraits.length && !paramTraits.length && !responseTraits.length) {
    return null;
  }

  var traits = [].concat(itfsTraits, paramTraits, responseTraits);

  var traitMap = traits.reduce(_fpUtils.convertEntryListInMap, {});

  return { key: 'traits', value: traitMap };
};

/**
 * extracts all ResourceTypes from an Api, with the help of a coreInfo map and of the global
 * mediaTypeUUID. This is done to represent shared Parameters (which do not have an exact match in
 * RAML)
 * @param {string?} mediaTypeUUID: the uuid of the global mediaType, if it exists
 * @param {Map<string, coreInfo>} coreInfoMap: a Map of coreInfo that holds all that is necessary
 * to convert a schema into a RamlDataType
 * @param {Api} api: the api from which to get all possible ResourceTypes.
 * @returns {Entry<string, Object<string, RAMLMethodBase>>?} the corresponding resourceTypes object,
 * if it exists, as an Entry
 */
methods.extractResourceTypesFromApi = function (mediaTypeUUID, coreInfoMap, api) {
  var resourceTypeItfs = api.getIn(['store', 'interface']).filter(function (itf) {
    return itf.get('level') === 'resource';
  });

  if (!resourceTypeItfs.size) {
    return null;
  }

  var resourceTypes = resourceTypeItfs.map(function (itf) {
    if (!itf.get('underlay')) {
      /* eslint-disable no-undefined */
      return {
        key: itf.get('uuid'),
        value: undefined
      };
      /* eslint-enable no-undefined */
    }

    return {
      key: itf.get('uuid'),
      value: methods.extractResourceFromResourceRecord(mediaTypeUUID, coreInfoMap, itf.get('underlay'))
    };
  }).reduce(_fpUtils.convertEntryListInMap, {});

  return { key: 'resourceTypes', value: resourceTypes };
};

/**
 * extracts a Basic Auth securityScheme from an Auth
 * @param {Auth} auth: the auth to convert into a securityScheme
 * @returns {RAMLSecurityScheme} the corresponding securityScheme
 */
methods.extractSecuritySchemeFromBasicAuth = function (auth) {
  var securityScheme = {
    type: 'Basic Authentication'
  };

  var description = auth.get('description');
  if (description) {
    securityScheme.description = description;
  }

  return { key: auth.get('authName'), value: securityScheme };
};

/**
 * extracts a Digest Auth securityScheme from an Auth
 * @param {Auth} auth: the auth to convert into a securityScheme
 * @returns {RAMLSecurityScheme} the corresponding securityScheme
 */
methods.extractSecuritySchemeFromDigestAuth = function (auth) {
  var securityScheme = {
    type: 'Digest Authentication'
  };

  var description = auth.get('description');
  if (description) {
    securityScheme.description = description;
  }

  return { key: auth.get('authName'), value: securityScheme };
};

/**
 * extracts a describedBy section for a PassThroughSecurityScheme from an Auth
 * @param {Auth} auth: the auth to convert into a securityScheme
 * @returns {RAMLDescribedByObject?} the corresponding describedBy object, if applicable
 */
methods.extractDescribedByForApiKeyAuth = function (auth) {
  if (auth.get('in') === 'header') {
    return {
      headers: (0, _defineProperty3.default)({}, auth.get('name'), { type: 'string' })
    };
  }

  if (auth.get('in') === 'query') {
    return {
      queryParameters: (0, _defineProperty3.default)({}, auth.get('name'), { type: 'string' })
    };
  }

  return null;
};

/**
 * extracts an ApiKey Auth securityScheme from an Auth
 * @param {Auth} auth: the auth to convert into a securityScheme
 * @returns {RAMLSecurityScheme} the corresponding securityScheme
 */
methods.extractSecuritySchemeFromApiKeyAuth = function (auth) {
  var securityScheme = {
    type: 'Pass Through'
  };

  var description = auth.get('description');
  if (description) {
    securityScheme.description = description;
  }

  var describedBy = methods.extractDescribedByForApiKeyAuth(auth);
  if (describedBy) {
    securityScheme.describedBy = describedBy;
  }

  return { key: auth.get('authName'), value: securityScheme };
};

// TODO signature
/**
 * extracts an OAuth1 Auth securityScheme from an Auth
 * @param {Auth} auth: the auth to convert into a securityScheme
 * @returns {RAMLSecurityScheme} the corresponding securityScheme
 */
methods.extractSecuritySchemeFromOAuth1Auth = function (auth) {
  var securityScheme = {
    type: 'OAuth 1.0'
  };

  var description = auth.get('description');
  if (description) {
    securityScheme.description = description;
  }

  securityScheme.settings = {
    requestTokenUri: auth.get('requestTokenUri') || null,
    authorizationUri: auth.get('authorizationUri') || null,
    tokenCredentialsUri: auth.get('tokenCredentialsUri') || null
  };

  if (auth.get('signature') && ['HMAC-SHA1', 'RSA-SHA1', 'PLAINTEXT'].indexOf(auth.get('signature').toUpperCase()) >= 0) {
    securityScheme.settings.signatures = [auth.get('signature').toUpperCase()];
  }

  return { key: auth.get('authName'), value: securityScheme };
};

// TODO scopes
/**
 * extracts an OAuth2 Auth securityScheme from an Auth
 * @param {Auth} auth: the auth to convert into a securityScheme
 * @returns {RAMLSecurityScheme} the corresponding securityScheme
 */
methods.extractSecuritySchemeFromOAuth2Auth = function (auth) {
  var securityScheme = {
    type: 'OAuth 2.0'
  };

  var description = auth.get('description');
  if (description) {
    securityScheme.description = description;
  }

  var grantMap = {
    accessCode: 'authorization_code',
    implicit: 'implicit',
    application: 'client_credentials',
    password: 'password'
  };

  securityScheme.settings = {
    authorizationUri: auth.get('authorizationUrl') || null,
    accessTokenUri: auth.get('tokenUrl') || null,
    authorizationGrants: grantMap[auth.get('flow')] ? [grantMap[auth.get('flow')]] : []
  };

  if (auth.get('scopes') && auth.get('scopes').size) {
    securityScheme.settings.scopes = auth.get('scopes').map(function (_ref15) {
      var key = _ref15.key;
      return key;
    }).toJS();
  }

  return { key: auth.get('authName'), value: securityScheme };
};

/**
 * extracts an Hawk Auth securityScheme from an Auth
 * @param {Auth} auth: the auth to convert into a securityScheme
 * @returns {RAMLSecurityScheme} the corresponding securityScheme
 */
methods.extractSecuritySchemeFromHawkAuth = function (auth) {
  var securityScheme = {
    type: 'x-hawk'
  };

  var description = auth.get('description');
  if (description) {
    securityScheme.description = description;
  }

  securityScheme.settings = {
    id: auth.get('id') || null,
    algorithm: auth.get('algorithm') || null
  };

  return { key: auth.get('authName'), value: securityScheme };
};

/**
 * extracts an AWSSig4Auth securityScheme from an Auth
 * @param {Auth} auth: the auth to convert into a securityScheme
 * @returns {RAMLSecurityScheme} the corresponding securityScheme
 */
methods.extractSecuritySchemeFromAWSSig4Auth = function (auth) {
  var securityScheme = {
    type: 'x-aws-sig4'
  };

  var description = auth.get('description');
  if (description) {
    securityScheme.description = description;
  }

  securityScheme.settings = {
    region: auth.get('region') || null,
    service: auth.get('service') || null
  };

  return { key: auth.get('authName'), value: securityScheme };
};

/**
 * extracts a securityScheme from an Auth
 * @param {Auth} auth: the auth to convert into a securityScheme
 * @returns {RAMLSecurityScheme} the corresponding securityScheme
 */
methods.extractSecuritySchemeFromAuth = function (auth) {
  if (auth instanceof _Auth2.default.Basic) {
    return methods.extractSecuritySchemeFromBasicAuth(auth);
  }

  if (auth instanceof _Auth2.default.Digest) {
    return methods.extractSecuritySchemeFromDigestAuth(auth);
  }

  if (auth instanceof _Auth2.default.ApiKey) {
    return methods.extractSecuritySchemeFromApiKeyAuth(auth);
  }

  if (auth instanceof _Auth2.default.OAuth1) {
    return methods.extractSecuritySchemeFromOAuth1Auth(auth);
  }

  if (auth instanceof _Auth2.default.OAuth2) {
    return methods.extractSecuritySchemeFromOAuth2Auth(auth);
  }

  if (auth instanceof _Auth2.default.Hawk) {
    return methods.extractSecuritySchemeFromHawkAuth(auth);
  }

  if (auth instanceof _Auth2.default.AWSSig4) {
    return methods.extractSecuritySchemeFromAWSSig4Auth(auth);
  }

  return null;
};

/**
 * extracts securitySchemes from an Api
 * @param {Api} api: the api to get all the shared auths from
 * @returns {Entry<string, Object<string, RAMLSecurityScheme>>?} the corresponding securitySchemes,
 * if it exists, as an Entry
 */
methods.extractSecuritySchemesFromApi = function (api) {
  var auths = api.getIn(['store', 'auth']);

  var securitySchemes = auths.map(methods.extractSecuritySchemeFromAuth).filter(function (v) {
    return !!v;
  });

  if (!securitySchemes.size) {
    return null;
  }

  var securitySchemeMap = securitySchemes.reduce(_fpUtils.convertEntryListInMap, {});

  return { key: 'securitySchemes', value: securitySchemeMap };
};

// TODO implement this (args: api)
methods.extractSecuredByFromApi = function () {
  return null;
};

/**
 * extracts the displayName from a Request
 * @param {Request} request: the request to get the displayName from
 * @returns {Entry<string, string>?} the corresponding displayName, if it exists, as an Entry
 */
methods.extractDisplayNameFromRequest = function (request) {
  var displayName = request.get('name') || null;

  if (!displayName) {
    return null;
  }

  return { key: 'displayName', value: displayName };
};

/**
 * extracts the description from a Request
 * @param {Request} request: the request to get the description from
 * @returns {Entry<string, string>?} the corresponding description, if it exists, as an Entry
 */
methods.extractDescriptionFromRequest = function (request) {
  var description = request.get('description') || null;

  if (!description) {
    return null;
  }

  return { key: 'description', value: description };
};

/**
 * extracts the queryParameters from a Request
 * @param {Map<string, coreInfo>} coreInfoMap: a map of coreInfo, that contains all that is
 * necessary to create DataTypes
 * @param {Request} request: the request to get the queryParameters from
 * @returns {Entry<string, Object<string, RamlDataType>>?} the corresponding queryParameters, if
 * they exist, as an Entry
 */
methods.extractQueryParametersFromRequest = function (coreInfoMap, request) {
  var params = request.getIn(['parameters', 'queries']).filter(function (param) {
    return !(param instanceof _Reference2.default);
  }).map(function (param) {
    return methods.convertParameterIntoNamedParameter(coreInfoMap, param);
  }).valueSeq();

  if (!params.size) {
    return null;
  }

  var queryParameters = params.reduce(_fpUtils.convertEntryListInMap, {});

  return { key: 'queryParameters', value: queryParameters };
};

/**
 * extracts the headers from a Request
 * @param {Map<string, coreInfo>} coreInfoMap: a map of coreInfo, that contains all that is
 * necessary to create DataTypes
 * @param {Request} request: the request to get the headers from
 * @returns {Entry<string, Object<string, RamlDataType>>?} the corresponding headers, if they
 * exist, as an Entry
 */
methods.extractHeadersFromRequest = function (coreInfoMap, request) {
  var params = request.getIn(['parameters', 'headers']).filter(function (param) {
    return !(param instanceof _Reference2.default);
  }).map(function (param) {
    return methods.convertParameterIntoNamedParameter(coreInfoMap, param);
  }).valueSeq();

  if (!params.size) {
    return null;
  }

  var headers = params.reduce(_fpUtils.convertEntryListInMap, {});

  return { key: 'headers', value: headers };
};

/**
 * tests whether a Context is applicable to the body (i.e. has exactly one Content-Type constraint)
 * @param {Context} context: the context to test
 * @returns {boolean} true if it is applicable, false otherwise
 */
methods.isBodyContext = function (context) {
  return context.get('constraints').filter(function (param) {
    return param.get('key') === 'Content-Type' && param.get('usedIn') === 'request' && param.get('in') === 'headers';
  }).size === 1;
};

/**
 * extracts all contexts that are applicable to the body from a request
 * @param {Request} request: the request to get the body contexts from
 * @returns {List<Context>?} the corresponding list of contexts, if it exists
 */
methods.getBodyContextsFromRequest = function (request) {
  var bodyContexts = request.get('contexts').filter(methods.isBodyContext);
  if (bodyContexts.size === 0) {
    return null;
  }

  return bodyContexts;
};

/**
 * converts a single parameter body into a RAMLBody object (in the case where there are no contexts)
 * @param {Map<string, coreInfo>} coreInfoMap: a map of coreInfo containing all that is necessary
 * to create DataTypes
 * @param {Map<string, Parameter>} bodyParams: a map of body parameters to convert into a RAMLBody
 * object
 * @returns {Entry<string, RamlDataType>} the corresponding RAMLBody, as an Entry
 */
methods.extractSingleParameterFromRequestWithNoContext = function (coreInfoMap, bodyParams) {
  var value = methods.convertParameterIntoNamedParameter(coreInfoMap, bodyParams.valueSeq().get(0)).value;

  return { key: 'body', value: value };
};

/**
 * converts a multiple parameters body into a RAMLBody (in the case where there are no contexts)
 * @param {Map<string, coreInfo>} coreInfoMap: a map of coreInfo containing all that is necessary
 * to create DataTypes
 * @param {Map<string, Parameter>} bodyParams: a map of body parameters to convert into a RAMLBody
 * object
 * @returns {Entry<string, { properties: Object<string, RamlDataType> }>?} the corresponding
 * RAMLBody, if it exists, as an Entry
 */
methods.extractMultipleParametersFromRequestWithNoContext = function (coreInfoMap, bodyParams) {
  var propsEntries = bodyParams.map(function (param) {
    return methods.convertParameterIntoNamedParameter(coreInfoMap, param);
  });

  if (!propsEntries.size) {
    return null;
  }

  var properties = propsEntries.reduce(_fpUtils.convertEntryListInMap, {});
  var value = { properties: properties };

  return { key: 'body', value: value };
};

/**
 * converts a ParameterContainer `body` block into a RAMLBody (in the case where there are no
 * contexts)
 * @param {Map<string, coreInfo>} coreInfoMap: a map of coreInfo containing all that is necessary
 * to create DataTypes
 * @param {ParameterContainer} paramContainer: the ParameterContainer from which to get the body
 * parameters to convert
 * @returns {Entry<string, RAMLBody>?} the corresponding RAMLBody, if it exists, as an Entry
 */
methods.extractBodyParamsFromRequestWithNoContext = function (coreInfoMap, paramContainer) {
  var bodyParams = paramContainer.get('body');

  if (!bodyParams.size) {
    return null;
  }

  if (bodyParams.size === 1) {
    return methods.extractSingleParameterFromRequestWithNoContext(coreInfoMap, bodyParams);
  }

  return methods.extractMultipleParametersFromRequestWithNoContext(coreInfoMap, bodyParams);
};

/**
 * extracts the Content-Type from a context
 * @param {Context} context: the context from which to extract the Content-Type
 * @returns {string?} the corresponding Content-Type, if it exists
 */
methods.getContentTypeFromContext = function (context) {
  return context.get('constraints').filter(function (param) {
    return param.get('key') === 'Content-Type' && param.get('usedIn') === 'request' && param.get('in') === 'headers';
  }).map(function (param) {
    return param.get('default');
  }).valueSeq().get(0) || null;
};

/**
 * extracts the RAMLBody object for a specific Content-Type from a Parameter Container
 * @param {Map<string, coreInfo>} coreInfoMap: a map of coreInfo containing all that is necessary
 * to create DataTypes
 * @param {ParameterContainer} paramContainer: the ParameterContainer from which to get the body
 * parameters to convert
 * @param {Context} context: the context from which to extract the Content-Type
 * @returns {Entry<string, RAMLBody>?} the corresponding RAMLBody, if it exists, as an Entry
 */
methods.extractBodyParamsFromRequestForContext = function (coreInfoMap, paramContainer, context) {
  var contentType = methods.getContentTypeFromContext(context) || '*/*';

  var bodyParams = paramContainer.filter(context.get('constraints')).get('body').map(function (param) {
    return methods.convertParameterIntoNamedParameter(coreInfoMap, param);
  }).valueSeq();

  if (!bodyParams.size) {
    return null;
  }

  if (bodyParams.size === 1 && bodyParams.get(0).key === null) {
    return { key: contentType, value: bodyParams.get(0).value };
  }

  return { key: contentType, value: bodyParams.reduce(_fpUtils.convertEntryListInMap, {}) };
};

/**
 * extracts the RAMLBodies from a Request with (multiple) context(s)
 * @param {Map<string, coreInfo>} coreInfoMap: a map of coreInfo containing all that is necessary
 * to create DataTypes
 * @param {List<Context>} contexts: the contexts to use to generate the RAMLBodies
 * @param {ParameterContainer} paramContainer: the ParameterContainer from which to get the body
 * parameters to convert
 * @returns {Entry<string, RAMLBody | Object<string, RAMLBody>>?} the corresponding RAMLBody, if it
 * exists, as an Entry
 */
methods.extractBodyParamsFromRequestWithContexts = function (coreInfoMap, contexts, paramContainer) {
  var bodies = contexts.map(function (context) {
    return methods.extractBodyParamsFromRequestForContext(coreInfoMap, paramContainer, context);
  }).filter(function (v) {
    return !!v;
  });

  if (!bodies.size) {
    return null;
  }

  if (bodies.size === 1 && bodies.get(0).key === null) {
    return { key: 'body', value: bodies.get(0).value };
  }

  return { key: 'body', value: bodies.reduce(_fpUtils.convertEntryListInMap, {}) };
};

/**
 * extracts a RAMLBody from a request.
 * @param {Map<string, coreInfo>} coreInfoMap: a map of coreInfo containing all that is necessary
 * to create DataTypes
 * @param {Request} request: the request from which to extract the RAMLBody
 * @returns {Entry<string, RAMLBody>?} the corresponding RAMLBody if it exists, as an Entry
 */
methods.extractBodyFromRequest = function (coreInfoMap, request) {
  var paramContainer = request.get('parameters');
  var bodyContexts = methods.getBodyContextsFromRequest(request);

  if (!bodyContexts) {
    return methods.extractBodyParamsFromRequestWithNoContext(coreInfoMap, paramContainer);
  }

  return methods.extractBodyParamsFromRequestWithContexts(coreInfoMap, bodyContexts, paramContainer);
};

// TODO fix that ugly code
/**
 * extracts Protocols from a Request
 * @param {Request} request: the request to extract the protocols from
 * @returns {Entry<string, Array<string>>?} the extracted protocols, if they exist, as an Entry
 */
methods.extractProtocolsFromRequest = function (request) {
  var protocols = request.get('endpoints').map(function (endpoint) {
    if (endpoint instanceof _Reference2.default) {
      return endpoint.get('overlay');
    }

    return endpoint;
  }).filter(function (v) {
    return !!v;
  }).map(function (endpoint) {
    return endpoint.get('protocol');
  }).filter(function (v) {
    return !!v && v.filter(function (protocol) {
      return protocol.match(/https?:?/i);
    }).size !== 0;
  }).map(function (v) {
    return v.filter(function (protocol) {
      return protocol.match(/https?:?/i);
    }).map(function (protocol) {
      return protocol.match(/(https?):?/i)[1].toUpperCase();
    });
  }).valueSeq().get(0);

  if (!protocols) {
    return null;
  }

  return { key: 'protocols', value: protocols.toJS() };
};

/**
 * extracts TraitRefs from Request parameters (ignoring the global mediaType reference)
 * @param {string?} mediaTypeUUID: the uuid of the globalMediaType. Used to filter out the
 * potential globalMediaType reference in the headers
 * @param {Request} request: the request from which to get the parameters. Only the References
 * matter for TraitRef extraction.
 * @returns {Array<string>} the corresponding array of TraitRef
 */
methods.extractTraitsFromRequestParameters = function (mediaTypeUUID, request) {
  var paramContainer = request.get('parameters');

  var headerTraits = paramContainer.get('headers').filter(function (param) {
    return param instanceof _Reference2.default && param.get('uuid') !== mediaTypeUUID;
  }).map(function (param) {
    return param.get('uuid');
  }).valueSeq().toJS();

  var queryParamTraits = paramContainer.get('queries').filter(function (param) {
    return param instanceof _Reference2.default;
  }).map(function (param) {
    return param.get('uuid');
  }).valueSeq().toJS();

  var bodyTraits = paramContainer.get('body').filter(function (param) {
    return param instanceof _Reference2.default;
  }).map(function (param) {
    return param.get('uuid');
  }).valueSeq().toJS();

  return [].concat(headerTraits, queryParamTraits, bodyTraits);
};

/**
 * extracts TraitRefs from the responses of a request
 * @param {Request} request: the request to extract the response trait references from
 * @returns {Seq<string>} the corresponding TraitRefs
 */
methods.extractTraitsFromResponses = function (request) {
  var responses = request.get('responses').filter(function (response) {
    return response instanceof _Reference2.default;
  }).map(function (reference) {
    return 'response_' + (reference.get('uuid') || '').split('/').slice(-1);
  }).valueSeq().toList();

  return responses;
};

/**
 * extracts the RAML `is` field from a Request
 * @param {string?} mediaTypeUUID: the uuid of the globalMediaType. Used to filter out the unwanted
 * reference to the globalMediaType from the parameters of the request
 * @param {Request} request: the request from which to extract the `is` field
 * @returns {Entry<string, Array<string>>?} the corresponding `is` field, if it exists, as an Entry
 */
methods.extractIsFromRequest = function (mediaTypeUUID, request) {
  var traits = request.get('interfaces').map(function (itf) {
    return itf.get('uuid');
  }).valueSeq().toList();

  var paramTraits = methods.extractTraitsFromRequestParameters(mediaTypeUUID, request);
  var responseTraits = methods.extractTraitsFromResponses(request);

  if (!traits.size && !paramTraits.length && !responseTraits.size) {
    return null;
  }

  return { key: 'is', value: [].concat(traits.toJS(), paramTraits, responseTraits.toJS()) };
};

// TODO deal with overlay
/**
 * extract securedBy from a Request
 * @param {Request} request: the request to extract the securedBy field from
 * @returns {Entry<string, Array<string|Object>>?} the corresponding securedBy field, if it exists,
 * as an Entry
 */
methods.extractSecuredByFromRequest = function (request) {
  var auths = request.get('auths').filter(function (auth) {
    return auth instanceof _Reference2.default || auth === null;
  }).map(function (authRef) {
    if (authRef === null) {
      return authRef;
    }

    var authRefName = authRef.get('uuid');
    if (!authRef.get('overlay') || !(authRef.get('overlay') instanceof _Auth2.default.OAuth2) || !authRef.getIn(['overlay', 'scopes']).size) {
      return authRefName;
    }

    return (0, _defineProperty3.default)({}, authRefName, {
      scopes: authRef.getIn(['overlay', 'scopes']).map(function (_ref16) {
        var key = _ref16.key;
        return key;
      }).toJS()
    });
  }).valueSeq();

  if (!auths.size) {
    return null;
  }

  return { key: 'securedBy', value: auths.toJS() };
};

/**
 * extracts the description from a Response
 * @param {Response} response: the response to get the description from
 * @returns {Entry<string, string>?} the corresponding description, if it exists, as an Entry
 */
methods.extractDescriptionFromResponse = function (response) {
  var description = response.get('description');

  if (!description) {
    return null;
  }

  return { key: 'description', value: description };
};

/**
 * extracts the headers from a Response
 * @param {Map<string, coreInfo>} coreInfoMap: a map of coreInfo, that contains all that is
 * necessary to create DataTypes
 * @param {Request} response: the response to get the headers from
 * @returns {Entry<string, Object<string, RamlDataType>>?} the corresponding headers, if they
 * exist, as an Entry
 */
methods.extractHeadersFromResponse = function (coreInfoMap, response) {
  return methods.extractHeadersFromRequest(coreInfoMap, response);
};

/**
 * extracts a RAMLBody from a response.
 * @param {Map<string, coreInfo>} coreInfoMap: a map of coreInfo containing all that is necessary
 * to create DataTypes
 * @param {Request} response: the response from which to extract the RAMLBody
 * @returns {Entry<string, RAMLBody>?} the corresponding RAMLBody if it exists, as an Entry
 */
methods.extractBodyFromResponse = function (coreInfoMap, response) {
  return methods.extractBodyFromRequest(coreInfoMap, response);
};

/**
 * extracts a RAMLResponse from a Response.
 * @param {Map<string, coreInfo>} coreInfoMap: a map of coreInfo containing all that is necessary
 * to create DataTypes
 * @param {Response} response: the response to convert
 * @returns {RAMLResponse?} the corresponding RAMLResponse, if it exists
 */
methods.extractResponseFromResponseRecord = function (coreInfoMap, response) {
  var kvs = [methods.extractDescriptionFromResponse(response), methods.extractHeadersFromResponse(coreInfoMap, response), methods.extractBodyFromResponse(coreInfoMap, response)].filter(function (v) {
    return !!v;
  });

  if (!kvs.length) {
    return null;
  }

  return kvs.reduce(_fpUtils.convertEntryListInMap, {});
};

/**
 * extract RAMLResponses from a Request
 * @param {Map<string, coreInfo>} coreInfoMap: a map of coreInfo containing all that is necessary
 * to create DataTypes
 * @param {Request} request: the request to get the responses from
 * @returns {Entry<string, Object<string, RAMLResponse>>?} the corresponding responses, it they
 * exist, as an Entry
 */
methods.extractResponsesFromRequest = function (coreInfoMap, request) {
  var responses = request.get('responses').filter(function (response) {
    return !(response instanceof _Reference2.default);
  }).map(function (response) {
    var code = response.get('code');
    var key = parseInt(code, 10) ? code : '200';
    var value = methods.extractResponseFromResponseRecord(coreInfoMap, response);

    if (!value) {
      return null;
    }

    return { key: key, value: value };
  }).filter(function (v) {
    return !!v;
  });

  if (!responses.size) {
    return null;
  }

  return { key: 'responses', value: responses.reduce(_fpUtils.convertEntryListInMap, {}) };
};

/**
 * extracts a RAMLMethod from a Request
 * @param {string?} mediaTypeUUID: the uuid of the globalMediaType, if it exists
 * @param {Map<string, coreInfo>} coreInfoMap: a Map of coreInfo that holds all that is necessary
 * to convert a schema into a RamlDataType
 * @param {Request} request: the request to convert into a RAMLMethodBase
 * @returns {RAMLMethod?} the corresponding RAMLMethod, if it exists
 */
methods.extractMethodFromRequest = function (mediaTypeUUID, coreInfoMap, request) {
  var methodBase = methods.extractMethodBaseFromRequest(mediaTypeUUID, coreInfoMap, request);
  return methodBase;
};

/**
 * extracts a RAMLMethod from a Request, in Entry format
 * @param {string?} mediaTypeUUID: the uuid of the globalMediaType, if it exists
 * @param {Map<string, coreInfo>} coreInfoMap: a Map of coreInfo that holds all that is necessary
 * to convert a schema into a RamlDataType
 * @param {Request} request: the request to convert into a RAMLMethodBase
 * @returns {Entry<string, RAMLMethod>?} the corresponding RAMLMethod, if it exists, as an Entry
 */
methods.extractMethodEntryFromRequest = function (mediaTypeUUID, coreInfoMap, request) {
  var key = request.get('method');
  var value = methods.extractMethodFromRequest(mediaTypeUUID, coreInfoMap, request);

  if (!value) {
    return null;
  }

  return { key: key, value: value };
};

/**
 * extract RAMLMethods from a Resource
 * @param {string?} mediaTypeUUID: the uuid of the globalMediaType, if it exists
 * @param {Map<string, coreInfo>} coreInfoMap: a Map of coreInfo that holds all that is necessary
 * to convert a schema into a RamlDataType
 * @param {Resource} resource: the resource from which to get the methods to convert
 * @returns {Array<RAMLMethod>} the corresponding array of RAMLMethod
 */
methods.extractMethodsFromResource = function (mediaTypeUUID, coreInfoMap, resource) {
  var requests = resource.get('methods').map(function (request) {
    return methods.extractMethodEntryFromRequest(mediaTypeUUID, coreInfoMap, request);
  }).filter(function (v) {
    return !!v;
  });

  if (!requests.size) {
    return [];
  }

  return requests.valueSeq().toJS();
};

/**
 * extracts the displayName from a Resource
 * @param {Resource} resource: the resource to get the displayName from
 * @returns {Entry<string, string>?} the corresponding displayName, if it exists, as an Entry
 */
methods.extractDisplayNameFromResource = function (resource) {
  var key = 'name';
  var value = resource.get(key) || null;

  if (!value) {
    return null;
  }

  return { key: 'displayName', value: value };
};

/**
 * extracts the description from a Resource
 * @param {Resource} resource: the resource to get the description from
 * @returns {Entry<string, string>?} the corresponding description, if it exists, as an Entry
 */
methods.extractDescriptionFromResource = function (resource) {
  var key = 'description';
  var value = resource.get(key) || null;

  if (!value) {
    return null;
  }

  return { key: key, value: value };
};

/**
 * extracts the resourceTypeRef from a Resource
 * @param {Resource} resource: the resource to get the resourceTypeRef from
 * @returns {Entry<string, string>?} the corresponding resourceTypeRef, if it exists, as an Entry
 */
methods.extractTypeFromResource = function (resource) {
  var type = resource.get('interfaces').filter(function (itf) {
    return itf instanceof _Reference2.default;
  }).map(function (itf) {
    return itf.get('uuid');
  }).valueSeq().get(0);

  if (!type) {
    return null;
  }

  return { key: 'type', value: type };
};

/**
 * extracts the uriParameters from a Resource
 * @param {Map<string, coreInfo>} coreInfoMap: a Map of coreInfo that holds all that is necessary
 * to convert a schema into a RamlDataType
 * @param {Resource} resource: the resource to get the uriParameters from
 * @returns {Entry<string, Object<string, RamlDataType>>?} the corresponding uriParameters, if they
 * exist, as an Entry
 */
methods.extractUriParametersFromResource = function (coreInfoMap, resource) {
  var pathParam = resource.getIn(['path', 'pathname', 'parameter']);

  if (!pathParam || pathParam.get('superType') !== 'sequence') {
    return null;
  }

  var sequence = pathParam.get('value');

  var uriParams = sequence.filter(function (param) {
    return !!param.get('key');
  }).map(function (param) {
    return methods.convertParameterIntoNamedParameter(coreInfoMap, param);
  }).reduce(_fpUtils.convertEntryListInMap, {});

  return { key: 'uriParameters', value: uriParams };
};

/**
 * extracts a RAMLResource from a Resource
 * @param {string?} mediaTypeUUID: the uuid of the globalMediaType, if it exists
 * @param {Map<string, coreInfo>} coreInfoMap: a Map of coreInfo that holds all that is necessary
 * to convert a schema into a RamlDataType
 * @param {Resource} resource: the resource to convert
 * @returns {RAMLResource} the corresponding RAMLResource
 */
methods.extractResourceFromResourceRecord = function (mediaTypeUUID, coreInfoMap, resource) {
  var kvs = [methods.extractDisplayNameFromResource(resource), methods.extractDescriptionFromResource(resource), methods.extractTypeFromResource(resource), methods.extractUriParametersFromResource(coreInfoMap, resource)].concat((0, _toConsumableArray3.default)(methods.extractMethodsFromResource(mediaTypeUUID, coreInfoMap, resource))).filter(function (v) {
    return !!v;
  });

  return kvs.reduce(_fpUtils.convertEntryListInMap, {});
};

/**
 * nests resources entries according to their key (which should be the evaluated path of the
 * resource)
 * @param {string?} mediaTypeUUID: the uuid of the globalMediaType, if it exists
 * @param {Map<string, coreInfo>} coreInfoMap: a Map of coreInfo that holds all that is necessary
 * to convert a schema into a RamlDataType
 * @param {Array<Entry<string, Resource>>} resources: the array of resource entries, where the keys
 * are the paths of the resources
 * @returns {RAMLResource} the corresponding nested resources
 */
methods.nestResources = function (mediaTypeUUID, coreInfoMap, resources) {
  var nested = {};
  var subResources = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(resources), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var resource = _step.value;

      if (!resource.key.length) {
        nested = methods.extractResourceFromResourceRecord(mediaTypeUUID, coreInfoMap, resource.value);
      } else {
        var relativeUri = '/' + (resource.key.shift() || '');
        subResources[relativeUri] = subResources[relativeUri] || [];
        subResources[relativeUri].push(resource);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var relativeUris = (0, _keys2.default)(subResources);
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = (0, _getIterator3.default)(relativeUris), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _relativeUri = _step2.value;

      nested[_relativeUri] = methods.nestResources(mediaTypeUUID, coreInfoMap, subResources[_relativeUri]);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return nested;
};

/**
 * extracts RAMLResources from an Api
 * @param {string?} mediaTypeUUID: the uuid of the globalMediaType, if it exists
 * @param {Map<string, coreInfo>} coreInfoMap: a Map of coreInfo that holds all that is necessary
 * to convert a schema into a RamlDataType
 * @param {Api} api: the api to get the resources from
 * @returns {Array<Entry<string, RAMLResource>>} the corresponding RAMLResources, as entries
 */
methods.extractResourcesFromApi = function (mediaTypeUUID, coreInfoMap, api) {
  var resourceKVs = api.get('resources').map(function (resource) {
    return {
      key: resource.get('path').get('pathname').generate((0, _immutable.List)(['{', '}'])).split('/').slice(1),
      value: resource
    };
  }).valueSeq().toJS();

  var nested = methods.nestResources(mediaTypeUUID, coreInfoMap, resourceKVs);
  return (0, _fpUtils.entries)(nested);
};

/**
 * converts an Api into a RAMLModel
 * @param {Api} api: the api to convert
 * @returns {RAMLModel} the corresponding converted model
 */
methods.createRAMLJSONModel = function (api) {
  var coreInfoMap = methods.extractCoreInformationMapFromApi(api);
  var mediaTypeUUID = methods.extractMediaTypeUUIDfromApi(api);

  var kvs = [methods.extractTitleFromApi(api), methods.extractDescriptionFromApi(api), methods.extractVersionFromApi(api), methods.extractBaseUriFromApi(api), methods.extractBaseUriParametersFromApi(coreInfoMap, api), methods.extractProtocolsFromApi(api), methods.extractMediaTypeFromApi(api), methods.extractDataTypesFromApi(coreInfoMap), methods.extractTraitsFromApi(mediaTypeUUID, coreInfoMap, api), methods.extractResourceTypesFromApi(mediaTypeUUID, coreInfoMap, api), methods.extractSecuritySchemesFromApi(api), methods.extractSecuredByFromApi(api)].concat((0, _toConsumableArray3.default)(methods.extractResourcesFromApi(mediaTypeUUID, coreInfoMap, api))).filter(function (v) {
    return !!v;
  });

  return kvs.reduce(_fpUtils.convertEntryListInMap, {});
};

/**
 * corrects responses codes not being integers in the ramlRaml string. This is due to RAML imposing
 * that response codes be integers, while it is impossible to have non-string keys in an object.
 * @param {string} rawRaml: the raml string to fix
 * @returns {string} the raml string, with integer codes, instead of string ones
 */
methods.fixResponseCodes = function (rawRaml) {
  return rawRaml.replace(/^(\s*)'([0-9]{3})':$/gm, '$1$2:');
};

/**
 * serializes an Api into a RAML document
 * @param {Object} args: the args passed to the serializer
 * @returns {string} the corresponding RAML document
 */
methods.serialize = function (_ref18) {
  var api = _ref18.api;

  var model = methods.createRAMLJSONModel(api);
  var raw = '#%RAML 1.0\n' + _jsYaml2.default.safeDump(JSON.parse((0, _stringify2.default)(model)));
  var serialized = methods.fixResponseCodes(raw);
  return serialized;
};

var __internals__ = exports.__internals__ = methods;
exports.default = RAMLSerializer;

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = __webpack_require__(61);

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _apiFlowConfig = __webpack_require__(19);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var methods = {};

methods.extractVersion = function (version) {
  var vStripped = version[0] === 'v' ? version.slice(1) : version;

  var _vStripped$split = vStripped.split('.'),
      _vStripped$split2 = (0, _slicedToArray3.default)(_vStripped$split, 3),
      major = _vStripped$split2[0],
      minor = _vStripped$split2[1],
      patch = _vStripped$split2[2];

  var strippedPatch = (patch || '0').split('-')[0];

  return {
    major: parseInt(major || '0', 10),
    minor: parseInt(minor || '0', 10),
    patch: parseInt(strippedPatch || '0', 10)
  };
};

/* eslint-disable max-statements */
methods.getNewestSerializerByFormat = function (format) {
  var newest = _apiFlowConfig.serializers.filter(function (serializer) {
    return serializer.format === format;
  }).reduce(function (best, serializer) {
    var bestVersion = methods.extractVersion(best.version);
    var formatVersion = methods.extractVersion(serializer.version);

    if (bestVersion.major < formatVersion.major) {
      return serializer;
    }

    if (bestVersion.major > formatVersion.major) {
      return best;
    }

    if (bestVersion.minor < formatVersion.minor) {
      return serializer;
    }

    if (bestVersion.minor > formatVersion.minor) {
      return best;
    }

    if (bestVersion.patch < formatVersion.patch) {
      return serializer;
    }

    if (bestVersion.patch > formatVersion.patch) {
      return best;
    }
  }, { version: 'v0.0.0' })[0];

  if (newest.serialize) {
    return newest;
  }

  return null;
};
/* eslint-enable max-statements */

methods.getSerializerByFormatAndVersion = function (_ref) {
  var format = _ref.format,
      version = _ref.version;

  return _apiFlowConfig.serializers.filter(function (serializer) {
    return serializer.__meta__.format === format && serializer.__meta__.version === version;
  })[0] || null;
};

exports.default = methods;

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(112), __esModule: true };

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(114), __esModule: true };

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(117), __esModule: true };

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(119), __esModule: true };

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(122), __esModule: true };

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(124), __esModule: true };

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(125), __esModule: true };

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(21);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(24);
__webpack_require__(147);
module.exports = __webpack_require__(7).Array.from;

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(35);
__webpack_require__(24);
module.exports = __webpack_require__(145);

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(35);
__webpack_require__(24);
module.exports = __webpack_require__(146);

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(7);
module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
  return (core.JSON && core.JSON.stringify || JSON.stringify).apply(JSON, arguments);
};

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(149);
module.exports = __webpack_require__(7).Object.assign;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(8);
module.exports = function create(P, D){
  return $.create(P, D);
};

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(8);
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(8);
__webpack_require__(150);
module.exports = function getOwnPropertyNames(it){
  return $.getNames(it);
};

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(151);
module.exports = __webpack_require__(7).Object.getPrototypeOf;

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(152);
module.exports = __webpack_require__(7).Object.keys;

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(153);
module.exports = __webpack_require__(7).Object.setPrototypeOf;

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(73);
__webpack_require__(24);
__webpack_require__(35);
__webpack_require__(154);
module.exports = __webpack_require__(7).Promise;

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(155);
__webpack_require__(73);
module.exports = __webpack_require__(7).Symbol;

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(24);
__webpack_require__(35);
module.exports = __webpack_require__(9)('iterator');

/***/ }),
/* 126 */
/***/ (function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(31)
  , document = __webpack_require__(11).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var $ = __webpack_require__(8);
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getSymbols = $.getSymbols;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = $.isEnum
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
  }
  return keys;
};

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

var ctx         = __webpack_require__(15)
  , call        = __webpack_require__(65)
  , isArrayIter = __webpack_require__(64)
  , anObject    = __webpack_require__(13)
  , toLength    = __webpack_require__(71)
  , getIterFn   = __webpack_require__(48);
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(11).document && document.documentElement;

/***/ }),
/* 131 */
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(23);
module.exports = Array.isArray || function(arg){
  return cof(arg) == 'Array';
};

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $              = __webpack_require__(8)
  , descriptor     = __webpack_require__(46)
  , setToStringTag = __webpack_require__(32)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(43)(IteratorPrototype, __webpack_require__(9)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 134 */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

var $         = __webpack_require__(8)
  , toIObject = __webpack_require__(33);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(11)
  , macrotask = __webpack_require__(144).set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = __webpack_require__(23)(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain, fn;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    fn     = head.fn;
    if(domain)domain.enter();
    fn(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
  } last = undefined;
  if(parent)parent.enter();
};

// Node.js
if(isNode){
  notify = function(){
    process.nextTick(flush);
  };
// browsers with MutationObserver
} else if(Observer){
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
  };
// environments with maybe non-completely correct, but existent Promise
} else if(Promise && Promise.resolve){
  notify = function(){
    Promise.resolve().then(flush);
  };
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
} else {
  notify = function(){
    // strange IE + webpack dev server bug - use .call(global)
    macrotask.call(global, flush);
  };
}

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.1 Object.assign(target, source, ...)
var $        = __webpack_require__(8)
  , toObject = __webpack_require__(34)
  , IObject  = __webpack_require__(63);

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = __webpack_require__(30)(function(){
  var a = Object.assign
    , A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , $$    = arguments
    , $$len = $$.length
    , index = 1
    , getKeys    = $.getKeys
    , getSymbols = $.getSymbols
    , isEnum     = $.isEnum;
  while($$len > index){
    var S      = IObject($$[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  }
  return T;
} : Object.assign;

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(47);
module.exports = function(target, src){
  for(var key in src)redefine(target, key, src[key]);
  return target;
};

/***/ }),
/* 139 */
/***/ (function(module, exports) {

// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var core        = __webpack_require__(7)
  , $           = __webpack_require__(8)
  , DESCRIPTORS = __webpack_require__(29)
  , SPECIES     = __webpack_require__(9)('species');

module.exports = function(KEY){
  var C = core[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = __webpack_require__(13)
  , aFunction = __webpack_require__(39)
  , SPECIES   = __webpack_require__(9)('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

/***/ }),
/* 142 */
/***/ (function(module, exports) {

module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(70)
  , defined   = __webpack_require__(41);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

var ctx                = __webpack_require__(15)
  , invoke             = __webpack_require__(131)
  , html               = __webpack_require__(130)
  , cel                = __webpack_require__(127)
  , global             = __webpack_require__(11)
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listner = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(__webpack_require__(23)(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(13)
  , get      = __webpack_require__(48);
module.exports = __webpack_require__(7).getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(40)
  , ITERATOR  = __webpack_require__(9)('iterator')
  , Iterators = __webpack_require__(16);
module.exports = __webpack_require__(7).isIterable = function(it){
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    || Iterators.hasOwnProperty(classof(O));
};

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx         = __webpack_require__(15)
  , $export     = __webpack_require__(14)
  , toObject    = __webpack_require__(34)
  , call        = __webpack_require__(65)
  , isArrayIter = __webpack_require__(64)
  , toLength    = __webpack_require__(71)
  , getIterFn   = __webpack_require__(48);
$export($export.S + $export.F * !__webpack_require__(67)(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , $$      = arguments
      , $$len   = $$.length
      , mapfn   = $$len > 1 ? $$[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        result[index] = mapping ? mapfn(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(126)
  , step             = __webpack_require__(134)
  , Iterators        = __webpack_require__(16)
  , toIObject        = __webpack_require__(33);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(66)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(14);

$export($export.S + $export.F, 'Object', {assign: __webpack_require__(137)});

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 Object.getOwnPropertyNames(O)
__webpack_require__(45)('getOwnPropertyNames', function(){
  return __webpack_require__(62).get;
});

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = __webpack_require__(34);

__webpack_require__(45)('getPrototypeOf', function($getPrototypeOf){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(34);

__webpack_require__(45)('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(14);
$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(68).set});

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $          = __webpack_require__(8)
  , LIBRARY    = __webpack_require__(44)
  , global     = __webpack_require__(11)
  , ctx        = __webpack_require__(15)
  , classof    = __webpack_require__(40)
  , $export    = __webpack_require__(14)
  , isObject   = __webpack_require__(31)
  , anObject   = __webpack_require__(13)
  , aFunction  = __webpack_require__(39)
  , strictNew  = __webpack_require__(142)
  , forOf      = __webpack_require__(129)
  , setProto   = __webpack_require__(68).set
  , same       = __webpack_require__(139)
  , SPECIES    = __webpack_require__(9)('species')
  , speciesConstructor = __webpack_require__(141)
  , asap       = __webpack_require__(136)
  , PROMISE    = 'Promise'
  , process    = global.process
  , isNode     = classof(process) == 'process'
  , P          = global[PROMISE]
  , empty      = function(){ /* empty */ }
  , Wrapper;

var testResolve = function(sub){
  var test = new P(empty), promise;
  if(sub)test.constructor = function(exec){
    exec(empty, empty);
  };
  (promise = P.resolve(test))['catch'](empty);
  return promise === test;
};

var USE_NATIVE = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = P && P.resolve && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && __webpack_require__(29)){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
var sameConstructor = function(a, b){
  // library wrapper special case
  if(LIBRARY && a === P && b === Wrapper)return true;
  return same(a, b);
};
var getConstructor = function(C){
  var S = anObject(C)[SPECIES];
  return S != undefined ? S : C;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var PromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve),
  this.reject  = aFunction(reject)
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(record, isReject){
  if(record.n)return;
  record.n = true;
  var chain = record.c;
  asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , result, then;
      try {
        if(handler){
          if(!ok)record.h = true;
          result = handler === true ? value : handler(value);
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
    record.n = false;
    if(isReject)setTimeout(function(){
      var promise = record.p
        , handler, console;
      if(isUnhandled(promise)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      } record.a = undefined;
    }, 1);
  });
};
var isUnhandled = function(promise){
  var record = promise._d
    , chain  = record.a || record.c
    , i      = 0
    , reaction;
  if(record.h)return false;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var $reject = function(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  notify(record, true);
};
var $resolve = function(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(record.p === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      asap(function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record, false);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    aFunction(executor);
    var record = this._d = {
      p: strictNew(this, P, PROMISE),         // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false,                               // <- handled rejection
      n: false                                // <- notify
    };
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  __webpack_require__(138)(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction = new PromiseCapability(speciesConstructor(this, P))
        , promise  = reaction.promise
        , record   = this._d;
      reaction.ok   = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      record.c.push(reaction);
      if(record.a)record.a.push(reaction);
      if(record.s)notify(record, false);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: P});
__webpack_require__(32)(P, PROMISE);
__webpack_require__(140)(PROMISE);
Wrapper = __webpack_require__(7)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = new PromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (!USE_NATIVE || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof P && sameConstructor(x.constructor, this))return x;
    var capability = new PromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(67)(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject
      , values     = [];
    var abrupt = perform(function(){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        var alreadyCalled = false;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled = true;
          results[index] = value;
          --remaining || resolve(results);
        }, reject);
      });
      else resolve(results);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var $              = __webpack_require__(8)
  , global         = __webpack_require__(11)
  , has            = __webpack_require__(42)
  , DESCRIPTORS    = __webpack_require__(29)
  , $export        = __webpack_require__(14)
  , redefine       = __webpack_require__(47)
  , $fails         = __webpack_require__(30)
  , shared         = __webpack_require__(69)
  , setToStringTag = __webpack_require__(32)
  , uid            = __webpack_require__(72)
  , wks            = __webpack_require__(9)
  , keyOf          = __webpack_require__(135)
  , $names         = __webpack_require__(62)
  , enumKeys       = __webpack_require__(128)
  , isArray        = __webpack_require__(132)
  , anObject       = __webpack_require__(13)
  , toIObject      = __webpack_require__(33)
  , createDesc     = __webpack_require__(46)
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(setDesc({}, 'a', {
    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = getDesc(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  setDesc(it, key, D);
  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
} : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var isSymbol = function(it){
  return typeof it == 'symbol';
};

var $defineProperty = function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toIObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};
var $stringify = function stringify(it){
  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
  var args = [it]
    , i    = 1
    , $$   = arguments
    , replacer, $replacer;
  while($$.length > i)args.push($$[i++]);
  replacer = args[1];
  if(typeof replacer == 'function')$replacer = replacer;
  if($replacer || !isArray(replacer))replacer = function(key, value){
    if($replacer)value = $replacer.call(this, key, value);
    if(!isSymbol(value))return value;
  };
  args[1] = replacer;
  return _stringify.apply($JSON, args);
};
var buggyJSON = $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
});

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
  };
  redefine($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  isSymbol = function(it){
    return it instanceof $Symbol;
  };

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(44)){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
  'species,split,toPrimitive,toStringTag,unscopables'
).split(','), function(it){
  var sym = wks(it);
  symbolStatics[it] = useNative ? sym : wrap(sym);
});

setter = true;

$export($export.G + $export.W, {Symbol: $Symbol});

$export($export.S, 'Symbol', symbolStatics);

$export($export.S + $export.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
  Copyright (c) jQuery Foundation, Inc. and Contributors, All Rights Reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function (root, factory) {
    'use strict';

    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
    // Rhino, and plain browser loading.

    /* istanbul ignore next */
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.esprima = {}));
    }
}(this, function (exports) {
    'use strict';

    var Token,
        TokenName,
        FnExprTokens,
        Syntax,
        PlaceHolders,
        Messages,
        Regex,
        source,
        strict,
        index,
        lineNumber,
        lineStart,
        hasLineTerminator,
        lastIndex,
        lastLineNumber,
        lastLineStart,
        startIndex,
        startLineNumber,
        startLineStart,
        scanning,
        length,
        lookahead,
        state,
        extra,
        isBindingElement,
        isAssignmentTarget,
        firstCoverInitializedNameError;

    Token = {
        BooleanLiteral: 1,
        EOF: 2,
        Identifier: 3,
        Keyword: 4,
        NullLiteral: 5,
        NumericLiteral: 6,
        Punctuator: 7,
        StringLiteral: 8,
        RegularExpression: 9,
        Template: 10
    };

    TokenName = {};
    TokenName[Token.BooleanLiteral] = 'Boolean';
    TokenName[Token.EOF] = '<end>';
    TokenName[Token.Identifier] = 'Identifier';
    TokenName[Token.Keyword] = 'Keyword';
    TokenName[Token.NullLiteral] = 'Null';
    TokenName[Token.NumericLiteral] = 'Numeric';
    TokenName[Token.Punctuator] = 'Punctuator';
    TokenName[Token.StringLiteral] = 'String';
    TokenName[Token.RegularExpression] = 'RegularExpression';
    TokenName[Token.Template] = 'Template';

    // A function following one of those tokens is an expression.
    FnExprTokens = ['(', '{', '[', 'in', 'typeof', 'instanceof', 'new',
                    'return', 'case', 'delete', 'throw', 'void',
                    // assignment operators
                    '=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '>>>=',
                    '&=', '|=', '^=', ',',
                    // binary/unary operators
                    '+', '-', '*', '/', '%', '++', '--', '<<', '>>', '>>>', '&',
                    '|', '^', '!', '~', '&&', '||', '?', ':', '===', '==', '>=',
                    '<=', '<', '>', '!=', '!=='];

    Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        AssignmentPattern: 'AssignmentPattern',
        ArrayExpression: 'ArrayExpression',
        ArrayPattern: 'ArrayPattern',
        ArrowFunctionExpression: 'ArrowFunctionExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ClassBody: 'ClassBody',
        ClassDeclaration: 'ClassDeclaration',
        ClassExpression: 'ClassExpression',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DoWhileStatement: 'DoWhileStatement',
        DebuggerStatement: 'DebuggerStatement',
        EmptyStatement: 'EmptyStatement',
        ExportAllDeclaration: 'ExportAllDeclaration',
        ExportDefaultDeclaration: 'ExportDefaultDeclaration',
        ExportNamedDeclaration: 'ExportNamedDeclaration',
        ExportSpecifier: 'ExportSpecifier',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForOfStatement: 'ForOfStatement',
        ForInStatement: 'ForInStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        ImportDeclaration: 'ImportDeclaration',
        ImportDefaultSpecifier: 'ImportDefaultSpecifier',
        ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
        ImportSpecifier: 'ImportSpecifier',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        MetaProperty: 'MetaProperty',
        MethodDefinition: 'MethodDefinition',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        ObjectPattern: 'ObjectPattern',
        Program: 'Program',
        Property: 'Property',
        RestElement: 'RestElement',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SpreadElement: 'SpreadElement',
        Super: 'Super',
        SwitchCase: 'SwitchCase',
        SwitchStatement: 'SwitchStatement',
        TaggedTemplateExpression: 'TaggedTemplateExpression',
        TemplateElement: 'TemplateElement',
        TemplateLiteral: 'TemplateLiteral',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement',
        YieldExpression: 'YieldExpression'
    };

    PlaceHolders = {
        ArrowParameterPlaceHolder: 'ArrowParameterPlaceHolder'
    };

    // Error messages should be identical to V8.
    Messages = {
        UnexpectedToken: 'Unexpected token %0',
        UnexpectedNumber: 'Unexpected number',
        UnexpectedString: 'Unexpected string',
        UnexpectedIdentifier: 'Unexpected identifier',
        UnexpectedReserved: 'Unexpected reserved word',
        UnexpectedTemplate: 'Unexpected quasi %0',
        UnexpectedEOS: 'Unexpected end of input',
        NewlineAfterThrow: 'Illegal newline after throw',
        InvalidRegExp: 'Invalid regular expression',
        UnterminatedRegExp: 'Invalid regular expression: missing /',
        InvalidLHSInAssignment: 'Invalid left-hand side in assignment',
        InvalidLHSInForIn: 'Invalid left-hand side in for-in',
        InvalidLHSInForLoop: 'Invalid left-hand side in for-loop',
        MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
        NoCatchOrFinally: 'Missing catch or finally after try',
        UnknownLabel: 'Undefined label \'%0\'',
        Redeclaration: '%0 \'%1\' has already been declared',
        IllegalContinue: 'Illegal continue statement',
        IllegalBreak: 'Illegal break statement',
        IllegalReturn: 'Illegal return statement',
        StrictModeWith: 'Strict mode code may not include a with statement',
        StrictCatchVariable: 'Catch variable may not be eval or arguments in strict mode',
        StrictVarName: 'Variable name may not be eval or arguments in strict mode',
        StrictParamName: 'Parameter name eval or arguments is not allowed in strict mode',
        StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
        StrictFunctionName: 'Function name may not be eval or arguments in strict mode',
        StrictOctalLiteral: 'Octal literals are not allowed in strict mode.',
        StrictDelete: 'Delete of an unqualified identifier in strict mode.',
        StrictLHSAssignment: 'Assignment to eval or arguments is not allowed in strict mode',
        StrictLHSPostfix: 'Postfix increment/decrement may not have eval or arguments operand in strict mode',
        StrictLHSPrefix: 'Prefix increment/decrement may not have eval or arguments operand in strict mode',
        StrictReservedWord: 'Use of future reserved word in strict mode',
        TemplateOctalLiteral: 'Octal literals are not allowed in template strings.',
        ParameterAfterRestParameter: 'Rest parameter must be last formal parameter',
        DefaultRestParameter: 'Unexpected token =',
        ObjectPatternAsRestParameter: 'Unexpected token {',
        DuplicateProtoProperty: 'Duplicate __proto__ fields are not allowed in object literals',
        ConstructorSpecialMethod: 'Class constructor may not be an accessor',
        DuplicateConstructor: 'A class may only have one constructor',
        StaticPrototype: 'Classes may not have static property named prototype',
        MissingFromClause: 'Unexpected token',
        NoAsAfterImportNamespace: 'Unexpected token',
        InvalidModuleSpecifier: 'Unexpected token',
        IllegalImportDeclaration: 'Unexpected token',
        IllegalExportDeclaration: 'Unexpected token',
        DuplicateBinding: 'Duplicate binding %0'
    };

    // See also tools/generate-unicode-regex.js.
    Regex = {
        // ECMAScript 6/Unicode v7.0.0 NonAsciiIdentifierStart:
        NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDE00-\uDE11\uDE13-\uDE2B\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDE00-\uDE2F\uDE44\uDE80-\uDEAA]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]/,

        // ECMAScript 6/Unicode v7.0.0 NonAsciiIdentifierPart:
        NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDD0-\uDDDA\uDE00-\uDE11\uDE13-\uDE37\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF01-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
    };

    // Ensure the condition is true, otherwise throw an error.
    // This is only to have a better contract semantic, i.e. another safety net
    // to catch a logic error. The condition shall be fulfilled in normal case.
    // Do NOT use this to enforce a certain condition on any user input.

    function assert(condition, message) {
        /* istanbul ignore if */
        if (!condition) {
            throw new Error('ASSERT: ' + message);
        }
    }

    function isDecimalDigit(ch) {
        return (ch >= 0x30 && ch <= 0x39);   // 0..9
    }

    function isHexDigit(ch) {
        return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
    }

    function isOctalDigit(ch) {
        return '01234567'.indexOf(ch) >= 0;
    }

    function octalToDecimal(ch) {
        // \0 is not octal escape sequence
        var octal = (ch !== '0'), code = '01234567'.indexOf(ch);

        if (index < length && isOctalDigit(source[index])) {
            octal = true;
            code = code * 8 + '01234567'.indexOf(source[index++]);

            // 3 digits are only allowed when string starts
            // with 0, 1, 2, 3
            if ('0123'.indexOf(ch) >= 0 &&
                    index < length &&
                    isOctalDigit(source[index])) {
                code = code * 8 + '01234567'.indexOf(source[index++]);
            }
        }

        return {
            code: code,
            octal: octal
        };
    }

    // ECMA-262 11.2 White Space

    function isWhiteSpace(ch) {
        return (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
            (ch >= 0x1680 && [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(ch) >= 0);
    }

    // ECMA-262 11.3 Line Terminators

    function isLineTerminator(ch) {
        return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029);
    }

    // ECMA-262 11.6 Identifier Names and Identifiers

    function fromCodePoint(cp) {
        return (cp < 0x10000) ? String.fromCharCode(cp) :
            String.fromCharCode(0xD800 + ((cp - 0x10000) >> 10)) +
            String.fromCharCode(0xDC00 + ((cp - 0x10000) & 1023));
    }

    function isIdentifierStart(ch) {
        return (ch === 0x24) || (ch === 0x5F) ||  // $ (dollar) and _ (underscore)
            (ch >= 0x41 && ch <= 0x5A) ||         // A..Z
            (ch >= 0x61 && ch <= 0x7A) ||         // a..z
            (ch === 0x5C) ||                      // \ (backslash)
            ((ch >= 0x80) && Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch)));
    }

    function isIdentifierPart(ch) {
        return (ch === 0x24) || (ch === 0x5F) ||  // $ (dollar) and _ (underscore)
            (ch >= 0x41 && ch <= 0x5A) ||         // A..Z
            (ch >= 0x61 && ch <= 0x7A) ||         // a..z
            (ch >= 0x30 && ch <= 0x39) ||         // 0..9
            (ch === 0x5C) ||                      // \ (backslash)
            ((ch >= 0x80) && Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch)));
    }

    // ECMA-262 11.6.2.2 Future Reserved Words

    function isFutureReservedWord(id) {
        switch (id) {
        case 'enum':
        case 'export':
        case 'import':
        case 'super':
            return true;
        default:
            return false;
        }
    }

    function isStrictModeReservedWord(id) {
        switch (id) {
        case 'implements':
        case 'interface':
        case 'package':
        case 'private':
        case 'protected':
        case 'public':
        case 'static':
        case 'yield':
        case 'let':
            return true;
        default:
            return false;
        }
    }

    function isRestrictedWord(id) {
        return id === 'eval' || id === 'arguments';
    }

    // ECMA-262 11.6.2.1 Keywords

    function isKeyword(id) {
        switch (id.length) {
        case 2:
            return (id === 'if') || (id === 'in') || (id === 'do');
        case 3:
            return (id === 'var') || (id === 'for') || (id === 'new') ||
                (id === 'try') || (id === 'let');
        case 4:
            return (id === 'this') || (id === 'else') || (id === 'case') ||
                (id === 'void') || (id === 'with') || (id === 'enum');
        case 5:
            return (id === 'while') || (id === 'break') || (id === 'catch') ||
                (id === 'throw') || (id === 'const') || (id === 'yield') ||
                (id === 'class') || (id === 'super');
        case 6:
            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
                (id === 'switch') || (id === 'export') || (id === 'import');
        case 7:
            return (id === 'default') || (id === 'finally') || (id === 'extends');
        case 8:
            return (id === 'function') || (id === 'continue') || (id === 'debugger');
        case 10:
            return (id === 'instanceof');
        default:
            return false;
        }
    }

    // ECMA-262 11.4 Comments

    function addComment(type, value, start, end, loc) {
        var comment;

        assert(typeof start === 'number', 'Comment must have valid position');

        state.lastCommentStart = start;

        comment = {
            type: type,
            value: value
        };
        if (extra.range) {
            comment.range = [start, end];
        }
        if (extra.loc) {
            comment.loc = loc;
        }
        extra.comments.push(comment);
        if (extra.attachComment) {
            extra.leadingComments.push(comment);
            extra.trailingComments.push(comment);
        }
        if (extra.tokenize) {
            comment.type = comment.type + 'Comment';
            if (extra.delegate) {
                comment = extra.delegate(comment);
            }
            extra.tokens.push(comment);
        }
    }

    function skipSingleLineComment(offset) {
        var start, loc, ch, comment;

        start = index - offset;
        loc = {
            start: {
                line: lineNumber,
                column: index - lineStart - offset
            }
        };

        while (index < length) {
            ch = source.charCodeAt(index);
            ++index;
            if (isLineTerminator(ch)) {
                hasLineTerminator = true;
                if (extra.comments) {
                    comment = source.slice(start + offset, index - 1);
                    loc.end = {
                        line: lineNumber,
                        column: index - lineStart - 1
                    };
                    addComment('Line', comment, start, index - 1, loc);
                }
                if (ch === 13 && source.charCodeAt(index) === 10) {
                    ++index;
                }
                ++lineNumber;
                lineStart = index;
                return;
            }
        }

        if (extra.comments) {
            comment = source.slice(start + offset, index);
            loc.end = {
                line: lineNumber,
                column: index - lineStart
            };
            addComment('Line', comment, start, index, loc);
        }
    }

    function skipMultiLineComment() {
        var start, loc, ch, comment;

        if (extra.comments) {
            start = index - 2;
            loc = {
                start: {
                    line: lineNumber,
                    column: index - lineStart - 2
                }
            };
        }

        while (index < length) {
            ch = source.charCodeAt(index);
            if (isLineTerminator(ch)) {
                if (ch === 0x0D && source.charCodeAt(index + 1) === 0x0A) {
                    ++index;
                }
                hasLineTerminator = true;
                ++lineNumber;
                ++index;
                lineStart = index;
            } else if (ch === 0x2A) {
                // Block comment ends with '*/'.
                if (source.charCodeAt(index + 1) === 0x2F) {
                    ++index;
                    ++index;
                    if (extra.comments) {
                        comment = source.slice(start + 2, index - 2);
                        loc.end = {
                            line: lineNumber,
                            column: index - lineStart
                        };
                        addComment('Block', comment, start, index, loc);
                    }
                    return;
                }
                ++index;
            } else {
                ++index;
            }
        }

        // Ran off the end of the file - the whole thing is a comment
        if (extra.comments) {
            loc.end = {
                line: lineNumber,
                column: index - lineStart
            };
            comment = source.slice(start + 2, index);
            addComment('Block', comment, start, index, loc);
        }
        tolerateUnexpectedToken();
    }

    function skipComment() {
        var ch, start;
        hasLineTerminator = false;

        start = (index === 0);
        while (index < length) {
            ch = source.charCodeAt(index);

            if (isWhiteSpace(ch)) {
                ++index;
            } else if (isLineTerminator(ch)) {
                hasLineTerminator = true;
                ++index;
                if (ch === 0x0D && source.charCodeAt(index) === 0x0A) {
                    ++index;
                }
                ++lineNumber;
                lineStart = index;
                start = true;
            } else if (ch === 0x2F) { // U+002F is '/'
                ch = source.charCodeAt(index + 1);
                if (ch === 0x2F) {
                    ++index;
                    ++index;
                    skipSingleLineComment(2);
                    start = true;
                } else if (ch === 0x2A) {  // U+002A is '*'
                    ++index;
                    ++index;
                    skipMultiLineComment();
                } else {
                    break;
                }
            } else if (start && ch === 0x2D) { // U+002D is '-'
                // U+003E is '>'
                if ((source.charCodeAt(index + 1) === 0x2D) && (source.charCodeAt(index + 2) === 0x3E)) {
                    // '-->' is a single-line comment
                    index += 3;
                    skipSingleLineComment(3);
                } else {
                    break;
                }
            } else if (ch === 0x3C) { // U+003C is '<'
                if (source.slice(index + 1, index + 4) === '!--') {
                    ++index; // `<`
                    ++index; // `!`
                    ++index; // `-`
                    ++index; // `-`
                    skipSingleLineComment(4);
                } else {
                    break;
                }
            } else {
                break;
            }
        }
    }

    function scanHexEscape(prefix) {
        var i, len, ch, code = 0;

        len = (prefix === 'u') ? 4 : 2;
        for (i = 0; i < len; ++i) {
            if (index < length && isHexDigit(source[index])) {
                ch = source[index++];
                code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
            } else {
                return '';
            }
        }
        return String.fromCharCode(code);
    }

    function scanUnicodeCodePointEscape() {
        var ch, code;

        ch = source[index];
        code = 0;

        // At least, one hex digit is required.
        if (ch === '}') {
            throwUnexpectedToken();
        }

        while (index < length) {
            ch = source[index++];
            if (!isHexDigit(ch)) {
                break;
            }
            code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
        }

        if (code > 0x10FFFF || ch !== '}') {
            throwUnexpectedToken();
        }

        return fromCodePoint(code);
    }

    function codePointAt(i) {
        var cp, first, second;

        cp = source.charCodeAt(i);
        if (cp >= 0xD800 && cp <= 0xDBFF) {
            second = source.charCodeAt(i + 1);
            if (second >= 0xDC00 && second <= 0xDFFF) {
                first = cp;
                cp = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
            }
        }

        return cp;
    }

    function getComplexIdentifier() {
        var cp, ch, id;

        cp = codePointAt(index);
        id = fromCodePoint(cp);
        index += id.length;

        // '\u' (U+005C, U+0075) denotes an escaped character.
        if (cp === 0x5C) {
            if (source.charCodeAt(index) !== 0x75) {
                throwUnexpectedToken();
            }
            ++index;
            if (source[index] === '{') {
                ++index;
                ch = scanUnicodeCodePointEscape();
            } else {
                ch = scanHexEscape('u');
                cp = ch.charCodeAt(0);
                if (!ch || ch === '\\' || !isIdentifierStart(cp)) {
                    throwUnexpectedToken();
                }
            }
            id = ch;
        }

        while (index < length) {
            cp = codePointAt(index);
            if (!isIdentifierPart(cp)) {
                break;
            }
            ch = fromCodePoint(cp);
            id += ch;
            index += ch.length;

            // '\u' (U+005C, U+0075) denotes an escaped character.
            if (cp === 0x5C) {
                id = id.substr(0, id.length - 1);
                if (source.charCodeAt(index) !== 0x75) {
                    throwUnexpectedToken();
                }
                ++index;
                if (source[index] === '{') {
                    ++index;
                    ch = scanUnicodeCodePointEscape();
                } else {
                    ch = scanHexEscape('u');
                    cp = ch.charCodeAt(0);
                    if (!ch || ch === '\\' || !isIdentifierPart(cp)) {
                        throwUnexpectedToken();
                    }
                }
                id += ch;
            }
        }

        return id;
    }

    function getIdentifier() {
        var start, ch;

        start = index++;
        while (index < length) {
            ch = source.charCodeAt(index);
            if (ch === 0x5C) {
                // Blackslash (U+005C) marks Unicode escape sequence.
                index = start;
                return getComplexIdentifier();
            } else if (ch >= 0xD800 && ch < 0xDFFF) {
                // Need to handle surrogate pairs.
                index = start;
                return getComplexIdentifier();
            }
            if (isIdentifierPart(ch)) {
                ++index;
            } else {
                break;
            }
        }

        return source.slice(start, index);
    }

    function scanIdentifier() {
        var start, id, type;

        start = index;

        // Backslash (U+005C) starts an escaped character.
        id = (source.charCodeAt(index) === 0x5C) ? getComplexIdentifier() : getIdentifier();

        // There is no keyword or literal with only one character.
        // Thus, it must be an identifier.
        if (id.length === 1) {
            type = Token.Identifier;
        } else if (isKeyword(id)) {
            type = Token.Keyword;
        } else if (id === 'null') {
            type = Token.NullLiteral;
        } else if (id === 'true' || id === 'false') {
            type = Token.BooleanLiteral;
        } else {
            type = Token.Identifier;
        }

        return {
            type: type,
            value: id,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }


    // ECMA-262 11.7 Punctuators

    function scanPunctuator() {
        var token, str;

        token = {
            type: Token.Punctuator,
            value: '',
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: index,
            end: index
        };

        // Check for most common single-character punctuators.
        str = source[index];
        switch (str) {

        case '(':
            if (extra.tokenize) {
                extra.openParenToken = extra.tokenValues.length;
            }
            ++index;
            break;

        case '{':
            if (extra.tokenize) {
                extra.openCurlyToken = extra.tokenValues.length;
            }
            state.curlyStack.push('{');
            ++index;
            break;

        case '.':
            ++index;
            if (source[index] === '.' && source[index + 1] === '.') {
                // Spread operator: ...
                index += 2;
                str = '...';
            }
            break;

        case '}':
            ++index;
            state.curlyStack.pop();
            break;
        case ')':
        case ';':
        case ',':
        case '[':
        case ']':
        case ':':
        case '?':
        case '~':
            ++index;
            break;

        default:
            // 4-character punctuator.
            str = source.substr(index, 4);
            if (str === '>>>=') {
                index += 4;
            } else {

                // 3-character punctuators.
                str = str.substr(0, 3);
                if (str === '===' || str === '!==' || str === '>>>' ||
                    str === '<<=' || str === '>>=') {
                    index += 3;
                } else {

                    // 2-character punctuators.
                    str = str.substr(0, 2);
                    if (str === '&&' || str === '||' || str === '==' || str === '!=' ||
                        str === '+=' || str === '-=' || str === '*=' || str === '/=' ||
                        str === '++' || str === '--' || str === '<<' || str === '>>' ||
                        str === '&=' || str === '|=' || str === '^=' || str === '%=' ||
                        str === '<=' || str === '>=' || str === '=>') {
                        index += 2;
                    } else {

                        // 1-character punctuators.
                        str = source[index];
                        if ('<>=!+-*%&|^/'.indexOf(str) >= 0) {
                            ++index;
                        }
                    }
                }
            }
        }

        if (index === token.start) {
            throwUnexpectedToken();
        }

        token.end = index;
        token.value = str;
        return token;
    }

    // ECMA-262 11.8.3 Numeric Literals

    function scanHexLiteral(start) {
        var number = '';

        while (index < length) {
            if (!isHexDigit(source[index])) {
                break;
            }
            number += source[index++];
        }

        if (number.length === 0) {
            throwUnexpectedToken();
        }

        if (isIdentifierStart(source.charCodeAt(index))) {
            throwUnexpectedToken();
        }

        return {
            type: Token.NumericLiteral,
            value: parseInt('0x' + number, 16),
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    function scanBinaryLiteral(start) {
        var ch, number;

        number = '';

        while (index < length) {
            ch = source[index];
            if (ch !== '0' && ch !== '1') {
                break;
            }
            number += source[index++];
        }

        if (number.length === 0) {
            // only 0b or 0B
            throwUnexpectedToken();
        }

        if (index < length) {
            ch = source.charCodeAt(index);
            /* istanbul ignore else */
            if (isIdentifierStart(ch) || isDecimalDigit(ch)) {
                throwUnexpectedToken();
            }
        }

        return {
            type: Token.NumericLiteral,
            value: parseInt(number, 2),
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    function scanOctalLiteral(prefix, start) {
        var number, octal;

        if (isOctalDigit(prefix)) {
            octal = true;
            number = '0' + source[index++];
        } else {
            octal = false;
            ++index;
            number = '';
        }

        while (index < length) {
            if (!isOctalDigit(source[index])) {
                break;
            }
            number += source[index++];
        }

        if (!octal && number.length === 0) {
            // only 0o or 0O
            throwUnexpectedToken();
        }

        if (isIdentifierStart(source.charCodeAt(index)) || isDecimalDigit(source.charCodeAt(index))) {
            throwUnexpectedToken();
        }

        return {
            type: Token.NumericLiteral,
            value: parseInt(number, 8),
            octal: octal,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    function isImplicitOctalLiteral() {
        var i, ch;

        // Implicit octal, unless there is a non-octal digit.
        // (Annex B.1.1 on Numeric Literals)
        for (i = index + 1; i < length; ++i) {
            ch = source[i];
            if (ch === '8' || ch === '9') {
                return false;
            }
            if (!isOctalDigit(ch)) {
                return true;
            }
        }

        return true;
    }

    function scanNumericLiteral() {
        var number, start, ch;

        ch = source[index];
        assert(isDecimalDigit(ch.charCodeAt(0)) || (ch === '.'),
            'Numeric literal must start with a decimal digit or a decimal point');

        start = index;
        number = '';
        if (ch !== '.') {
            number = source[index++];
            ch = source[index];

            // Hex number starts with '0x'.
            // Octal number starts with '0'.
            // Octal number in ES6 starts with '0o'.
            // Binary number in ES6 starts with '0b'.
            if (number === '0') {
                if (ch === 'x' || ch === 'X') {
                    ++index;
                    return scanHexLiteral(start);
                }
                if (ch === 'b' || ch === 'B') {
                    ++index;
                    return scanBinaryLiteral(start);
                }
                if (ch === 'o' || ch === 'O') {
                    return scanOctalLiteral(ch, start);
                }

                if (isOctalDigit(ch)) {
                    if (isImplicitOctalLiteral()) {
                        return scanOctalLiteral(ch, start);
                    }
                }
            }

            while (isDecimalDigit(source.charCodeAt(index))) {
                number += source[index++];
            }
            ch = source[index];
        }

        if (ch === '.') {
            number += source[index++];
            while (isDecimalDigit(source.charCodeAt(index))) {
                number += source[index++];
            }
            ch = source[index];
        }

        if (ch === 'e' || ch === 'E') {
            number += source[index++];

            ch = source[index];
            if (ch === '+' || ch === '-') {
                number += source[index++];
            }
            if (isDecimalDigit(source.charCodeAt(index))) {
                while (isDecimalDigit(source.charCodeAt(index))) {
                    number += source[index++];
                }
            } else {
                throwUnexpectedToken();
            }
        }

        if (isIdentifierStart(source.charCodeAt(index))) {
            throwUnexpectedToken();
        }

        return {
            type: Token.NumericLiteral,
            value: parseFloat(number),
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    // ECMA-262 11.8.4 String Literals

    function scanStringLiteral() {
        var str = '', quote, start, ch, unescaped, octToDec, octal = false;

        quote = source[index];
        assert((quote === '\'' || quote === '"'),
            'String literal must starts with a quote');

        start = index;
        ++index;

        while (index < length) {
            ch = source[index++];

            if (ch === quote) {
                quote = '';
                break;
            } else if (ch === '\\') {
                ch = source[index++];
                if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
                    switch (ch) {
                    case 'u':
                    case 'x':
                        if (source[index] === '{') {
                            ++index;
                            str += scanUnicodeCodePointEscape();
                        } else {
                            unescaped = scanHexEscape(ch);
                            if (!unescaped) {
                                throw throwUnexpectedToken();
                            }
                            str += unescaped;
                        }
                        break;
                    case 'n':
                        str += '\n';
                        break;
                    case 'r':
                        str += '\r';
                        break;
                    case 't':
                        str += '\t';
                        break;
                    case 'b':
                        str += '\b';
                        break;
                    case 'f':
                        str += '\f';
                        break;
                    case 'v':
                        str += '\x0B';
                        break;
                    case '8':
                    case '9':
                        str += ch;
                        tolerateUnexpectedToken();
                        break;

                    default:
                        if (isOctalDigit(ch)) {
                            octToDec = octalToDecimal(ch);

                            octal = octToDec.octal || octal;
                            str += String.fromCharCode(octToDec.code);
                        } else {
                            str += ch;
                        }
                        break;
                    }
                } else {
                    ++lineNumber;
                    if (ch === '\r' && source[index] === '\n') {
                        ++index;
                    }
                    lineStart = index;
                }
            } else if (isLineTerminator(ch.charCodeAt(0))) {
                break;
            } else {
                str += ch;
            }
        }

        if (quote !== '') {
            index = start;
            throwUnexpectedToken();
        }

        return {
            type: Token.StringLiteral,
            value: str,
            octal: octal,
            lineNumber: startLineNumber,
            lineStart: startLineStart,
            start: start,
            end: index
        };
    }

    // ECMA-262 11.8.6 Template Literal Lexical Components

    function scanTemplate() {
        var cooked = '', ch, start, rawOffset, terminated, head, tail, restore, unescaped;

        terminated = false;
        tail = false;
        start = index;
        head = (source[index] === '`');
        rawOffset = 2;

        ++index;

        while (index < length) {
            ch = source[index++];
            if (ch === '`') {
                rawOffset = 1;
                tail = true;
                terminated = true;
                break;
            } else if (ch === '$') {
                if (source[index] === '{') {
                    state.curlyStack.push('${');
                    ++index;
                    terminated = true;
                    break;
                }
                cooked += ch;
            } else if (ch === '\\') {
                ch = source[index++];
                if (!isLineTerminator(ch.charCodeAt(0))) {
                    switch (ch) {
                    case 'n':
                        cooked += '\n';
                        break;
                    case 'r':
                        cooked += '\r';
                        break;
                    case 't':
                        cooked += '\t';
                        break;
                    case 'u':
                    case 'x':
                        if (source[index] === '{') {
                            ++index;
                            cooked += scanUnicodeCodePointEscape();
                        } else {
                            restore = index;
                            unescaped = scanHexEscape(ch);
                            if (unescaped) {
                                cooked += unescaped;
                            } else {
                                index = restore;
                                cooked += ch;
                            }
                        }
                        break;
                    case 'b':
                        cooked += '\b';
                        break;
                    case 'f':
                        cooked += '\f';
                        break;
                    case 'v':
                        cooked += '\v';
                        break;

                    default:
                        if (ch === '0') {
                            if (isDecimalDigit(source.charCodeAt(index))) {
                                // Illegal: \01 \02 and so on
                                throwError(Messages.TemplateOctalLiteral);
                            }
                            cooked += '\0';
                        } else if (isOctalDigit(ch)) {
                            // Illegal: \1 \2
                            throwError(Messages.TemplateOctalLiteral);
                        } else {
                            cooked += ch;
                        }
                        break;
                    }
                } else {
                    ++lineNumber;
                    if (ch === '\r' && source[index] === '\n') {
                        ++index;
                    }
                    lineStart = index;
                }
            } else if (isLineTerminator(ch.charCodeAt(0))) {
                ++lineNumber;
                if (ch === '\r' && source[index] === '\n') {
                    ++index;
                }
                lineStart = index;
                cooked += '\n';
            } else {
                cooked += ch;
            }
        }

        if (!terminated) {
            throwUnexpectedToken();
        }

        if (!head) {
            state.curlyStack.pop();
        }

        return {
            type: Token.Template,
            value: {
                cooked: cooked,
                raw: source.slice(start + 1, index - rawOffset)
            },
            head: head,
            tail: tail,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
        };
    }

    // ECMA-262 11.8.5 Regular Expression Literals

    function testRegExp(pattern, flags) {
        // The BMP character to use as a replacement for astral symbols when
        // translating an ES6 "u"-flagged pattern to an ES5-compatible
        // approximation.
        // Note: replacing with '\uFFFF' enables false positives in unlikely
        // scenarios. For example, `[\u{1044f}-\u{10440}]` is an invalid
        // pattern that would not be detected by this substitution.
        var astralSubstitute = '\uFFFF',
            tmp = pattern;

        if (flags.indexOf('u') >= 0) {
            tmp = tmp
                // Replace every Unicode escape sequence with the equivalent
                // BMP character or a constant ASCII code point in the case of
                // astral symbols. (See the above note on `astralSubstitute`
                // for more information.)
                .replace(/\\u\{([0-9a-fA-F]+)\}|\\u([a-fA-F0-9]{4})/g, function ($0, $1, $2) {
                    var codePoint = parseInt($1 || $2, 16);
                    if (codePoint > 0x10FFFF) {
                        throwUnexpectedToken(null, Messages.InvalidRegExp);
                    }
                    if (codePoint <= 0xFFFF) {
                        return String.fromCharCode(codePoint);
                    }
                    return astralSubstitute;
                })
                // Replace each paired surrogate with a single ASCII symbol to
                // avoid throwing on regular expressions that are only valid in
                // combination with the "u" flag.
                .replace(
                    /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
                    astralSubstitute
                );
        }

        // First, detect invalid regular expressions.
        try {
            RegExp(tmp);
        } catch (e) {
            throwUnexpectedToken(null, Messages.InvalidRegExp);
        }

        // Return a regular expression object for this pattern-flag pair, or
        // `null` in case the current environment doesn't support the flags it
        // uses.
        try {
            return new RegExp(pattern, flags);
        } catch (exception) {
            /* istanbul ignore next */
            return null;
        }
    }

    function scanRegExpBody() {
        var ch, str, classMarker, terminated, body;

        ch = source[index];
        assert(ch === '/', 'Regular expression literal must start with a slash');
        str = source[index++];

        classMarker = false;
        terminated = false;
        while (index < length) {
            ch = source[index++];
            str += ch;
            if (ch === '\\') {
                ch = source[index++];
                // ECMA-262 7.8.5
                if (isLineTerminator(ch.charCodeAt(0))) {
                    throwUnexpectedToken(null, Messages.UnterminatedRegExp);
                }
                str += ch;
            } else if (isLineTerminator(ch.charCodeAt(0))) {
                throwUnexpectedToken(null, Messages.UnterminatedRegExp);
            } else if (classMarker) {
                if (ch === ']') {
                    classMarker = false;
                }
            } else {
                if (ch === '/') {
                    terminated = true;
                    break;
                } else if (ch === '[') {
                    classMarker = true;
                }
            }
        }

        if (!terminated) {
            throwUnexpectedToken(null, Messages.UnterminatedRegExp);
        }

        // Exclude leading and trailing slash.
        body = str.substr(1, str.length - 2);
        return {
            value: body,
            literal: str
        };
    }

    function scanRegExpFlags() {
        var ch, str, flags, restore;

        str = '';
        flags = '';
        while (index < length) {
            ch = source[index];
            if (!isIdentifierPart(ch.charCodeAt(0))) {
                break;
            }

            ++index;
            if (ch === '\\' && index < length) {
                ch = source[index];
                if (ch === 'u') {
                    ++index;
                    restore = index;
                    ch = scanHexEscape('u');
                    if (ch) {
                        flags += ch;
                        for (str += '\\u'; restore < index; ++restore) {
                            str += source[restore];
                        }
                    } else {
                        index = restore;
                        flags += 'u';
                        str += '\\u';
                    }
                    tolerateUnexpectedToken();
                } else {
                    str += '\\';
                    tolerateUnexpectedToken();
                }
            } else {
                flags += ch;
                str += ch;
            }
        }

        return {
            value: flags,
            literal: str
        };
    }

    function scanRegExp() {
        var start, body, flags, value;
        scanning = true;

        lookahead = null;
        skipComment();
        start = index;

        body = scanRegExpBody();
        flags = scanRegExpFlags();
        value = testRegExp(body.value, flags.value);
        scanning = false;
        if (extra.tokenize) {
            return {
                type: Token.RegularExpression,
                value: value,
                regex: {
                    pattern: body.value,
                    flags: flags.value
                },
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: start,
                end: index
            };
        }

        return {
            literal: body.literal + flags.literal,
            value: value,
            regex: {
                pattern: body.value,
                flags: flags.value
            },
            start: start,
            end: index
        };
    }

    function collectRegex() {
        var pos, loc, regex, token;

        skipComment();

        pos = index;
        loc = {
            start: {
                line: lineNumber,
                column: index - lineStart
            }
        };

        regex = scanRegExp();

        loc.end = {
            line: lineNumber,
            column: index - lineStart
        };

        /* istanbul ignore next */
        if (!extra.tokenize) {
            // Pop the previous token, which is likely '/' or '/='
            if (extra.tokens.length > 0) {
                token = extra.tokens[extra.tokens.length - 1];
                if (token.range[0] === pos && token.type === 'Punctuator') {
                    if (token.value === '/' || token.value === '/=') {
                        extra.tokens.pop();
                    }
                }
            }

            extra.tokens.push({
                type: 'RegularExpression',
                value: regex.literal,
                regex: regex.regex,
                range: [pos, index],
                loc: loc
            });
        }

        return regex;
    }

    function isIdentifierName(token) {
        return token.type === Token.Identifier ||
            token.type === Token.Keyword ||
            token.type === Token.BooleanLiteral ||
            token.type === Token.NullLiteral;
    }

    // Using the following algorithm:
    // https://github.com/mozilla/sweet.js/wiki/design

    function advanceSlash() {
        var regex, previous, check;

        function testKeyword(value) {
            return value && (value.length > 1) && (value[0] >= 'a') && (value[0] <= 'z');
        }

        previous = extra.tokenValues[extra.tokenValues.length - 1];
        regex = (previous !== null);

        switch (previous) {
        case 'this':
        case ']':
            regex = false;
            break;

        case ')':
            check = extra.tokenValues[extra.openParenToken - 1];
            regex = (check === 'if' || check === 'while' || check === 'for' || check === 'with');
            break;

        case '}':
            // Dividing a function by anything makes little sense,
            // but we have to check for that.
            regex = false;
            if (testKeyword(extra.tokenValues[extra.openCurlyToken - 3])) {
                // Anonymous function, e.g. function(){} /42
                check = extra.tokenValues[extra.openCurlyToken - 4];
                regex = check ? (FnExprTokens.indexOf(check) < 0) : false;
            } else if (testKeyword(extra.tokenValues[extra.openCurlyToken - 4])) {
                // Named function, e.g. function f(){} /42/
                check = extra.tokenValues[extra.openCurlyToken - 5];
                regex = check ? (FnExprTokens.indexOf(check) < 0) : true;
            }
        }

        return regex ? collectRegex() : scanPunctuator();
    }

    function advance() {
        var cp, token;

        if (index >= length) {
            return {
                type: Token.EOF,
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: index,
                end: index
            };
        }

        cp = source.charCodeAt(index);

        if (isIdentifierStart(cp)) {
            token = scanIdentifier();
            if (strict && isStrictModeReservedWord(token.value)) {
                token.type = Token.Keyword;
            }
            return token;
        }

        // Very common: ( and ) and ;
        if (cp === 0x28 || cp === 0x29 || cp === 0x3B) {
            return scanPunctuator();
        }

        // String literal starts with single quote (U+0027) or double quote (U+0022).
        if (cp === 0x27 || cp === 0x22) {
            return scanStringLiteral();
        }

        // Dot (.) U+002E can also start a floating-point number, hence the need
        // to check the next character.
        if (cp === 0x2E) {
            if (isDecimalDigit(source.charCodeAt(index + 1))) {
                return scanNumericLiteral();
            }
            return scanPunctuator();
        }

        if (isDecimalDigit(cp)) {
            return scanNumericLiteral();
        }

        // Slash (/) U+002F can also start a regex.
        if (extra.tokenize && cp === 0x2F) {
            return advanceSlash();
        }

        // Template literals start with ` (U+0060) for template head
        // or } (U+007D) for template middle or template tail.
        if (cp === 0x60 || (cp === 0x7D && state.curlyStack[state.curlyStack.length - 1] === '${')) {
            return scanTemplate();
        }

        // Possible identifier start in a surrogate pair.
        if (cp >= 0xD800 && cp < 0xDFFF) {
            cp = codePointAt(index);
            if (isIdentifierStart(cp)) {
                return scanIdentifier();
            }
        }

        return scanPunctuator();
    }

    function collectToken() {
        var loc, token, value, entry;

        loc = {
            start: {
                line: lineNumber,
                column: index - lineStart
            }
        };

        token = advance();
        loc.end = {
            line: lineNumber,
            column: index - lineStart
        };

        if (token.type !== Token.EOF) {
            value = source.slice(token.start, token.end);
            entry = {
                type: TokenName[token.type],
                value: value,
                range: [token.start, token.end],
                loc: loc
            };
            if (token.regex) {
                entry.regex = {
                    pattern: token.regex.pattern,
                    flags: token.regex.flags
                };
            }
            if (extra.tokenValues) {
                extra.tokenValues.push((entry.type === 'Punctuator' || entry.type === 'Keyword') ? entry.value : null);
            }
            if (extra.tokenize) {
                if (!extra.range) {
                    delete entry.range;
                }
                if (!extra.loc) {
                    delete entry.loc;
                }
                if (extra.delegate) {
                    entry = extra.delegate(entry);
                }
            }
            extra.tokens.push(entry);
        }

        return token;
    }

    function lex() {
        var token;
        scanning = true;

        lastIndex = index;
        lastLineNumber = lineNumber;
        lastLineStart = lineStart;

        skipComment();

        token = lookahead;

        startIndex = index;
        startLineNumber = lineNumber;
        startLineStart = lineStart;

        lookahead = (typeof extra.tokens !== 'undefined') ? collectToken() : advance();
        scanning = false;
        return token;
    }

    function peek() {
        scanning = true;

        skipComment();

        lastIndex = index;
        lastLineNumber = lineNumber;
        lastLineStart = lineStart;

        startIndex = index;
        startLineNumber = lineNumber;
        startLineStart = lineStart;

        lookahead = (typeof extra.tokens !== 'undefined') ? collectToken() : advance();
        scanning = false;
    }

    function Position() {
        this.line = startLineNumber;
        this.column = startIndex - startLineStart;
    }

    function SourceLocation() {
        this.start = new Position();
        this.end = null;
    }

    function WrappingSourceLocation(startToken) {
        this.start = {
            line: startToken.lineNumber,
            column: startToken.start - startToken.lineStart
        };
        this.end = null;
    }

    function Node() {
        if (extra.range) {
            this.range = [startIndex, 0];
        }
        if (extra.loc) {
            this.loc = new SourceLocation();
        }
    }

    function WrappingNode(startToken) {
        if (extra.range) {
            this.range = [startToken.start, 0];
        }
        if (extra.loc) {
            this.loc = new WrappingSourceLocation(startToken);
        }
    }

    WrappingNode.prototype = Node.prototype = {

        processComment: function () {
            var lastChild,
                innerComments,
                leadingComments,
                trailingComments,
                bottomRight = extra.bottomRightStack,
                i,
                comment,
                last = bottomRight[bottomRight.length - 1];

            if (this.type === Syntax.Program) {
                if (this.body.length > 0) {
                    return;
                }
            }
            /**
             * patch innnerComments for properties empty block
             * `function a() {/** comments **\/}`
             */

            if (this.type === Syntax.BlockStatement && this.body.length === 0) {
                innerComments = [];
                for (i = extra.leadingComments.length - 1; i >= 0; --i) {
                    comment = extra.leadingComments[i];
                    if (this.range[1] >= comment.range[1]) {
                        innerComments.unshift(comment);
                        extra.leadingComments.splice(i, 1);
                        extra.trailingComments.splice(i, 1);
                    }
                }
                if (innerComments.length) {
                    this.innerComments = innerComments;
                    //bottomRight.push(this);
                    return;
                }
            }

            if (extra.trailingComments.length > 0) {
                trailingComments = [];
                for (i = extra.trailingComments.length - 1; i >= 0; --i) {
                    comment = extra.trailingComments[i];
                    if (comment.range[0] >= this.range[1]) {
                        trailingComments.unshift(comment);
                        extra.trailingComments.splice(i, 1);
                    }
                }
                extra.trailingComments = [];
            } else {
                if (last && last.trailingComments && last.trailingComments[0].range[0] >= this.range[1]) {
                    trailingComments = last.trailingComments;
                    delete last.trailingComments;
                }
            }

            // Eating the stack.
            while (last && last.range[0] >= this.range[0]) {
                lastChild = bottomRight.pop();
                last = bottomRight[bottomRight.length - 1];
            }

            if (lastChild) {
                if (lastChild.leadingComments) {
                    leadingComments = [];
                    for (i = lastChild.leadingComments.length - 1; i >= 0; --i) {
                        comment = lastChild.leadingComments[i];
                        if (comment.range[1] <= this.range[0]) {
                            leadingComments.unshift(comment);
                            lastChild.leadingComments.splice(i, 1);
                        }
                    }

                    if (!lastChild.leadingComments.length) {
                        lastChild.leadingComments = undefined;
                    }
                }
            } else if (extra.leadingComments.length > 0) {
                leadingComments = [];
                for (i = extra.leadingComments.length - 1; i >= 0; --i) {
                    comment = extra.leadingComments[i];
                    if (comment.range[1] <= this.range[0]) {
                        leadingComments.unshift(comment);
                        extra.leadingComments.splice(i, 1);
                    }
                }
            }


            if (leadingComments && leadingComments.length > 0) {
                this.leadingComments = leadingComments;
            }
            if (trailingComments && trailingComments.length > 0) {
                this.trailingComments = trailingComments;
            }

            bottomRight.push(this);
        },

        finish: function () {
            if (extra.range) {
                this.range[1] = lastIndex;
            }
            if (extra.loc) {
                this.loc.end = {
                    line: lastLineNumber,
                    column: lastIndex - lastLineStart
                };
                if (extra.source) {
                    this.loc.source = extra.source;
                }
            }

            if (extra.attachComment) {
                this.processComment();
            }
        },

        finishArrayExpression: function (elements) {
            this.type = Syntax.ArrayExpression;
            this.elements = elements;
            this.finish();
            return this;
        },

        finishArrayPattern: function (elements) {
            this.type = Syntax.ArrayPattern;
            this.elements = elements;
            this.finish();
            return this;
        },

        finishArrowFunctionExpression: function (params, defaults, body, expression) {
            this.type = Syntax.ArrowFunctionExpression;
            this.id = null;
            this.params = params;
            this.defaults = defaults;
            this.body = body;
            this.generator = false;
            this.expression = expression;
            this.finish();
            return this;
        },

        finishAssignmentExpression: function (operator, left, right) {
            this.type = Syntax.AssignmentExpression;
            this.operator = operator;
            this.left = left;
            this.right = right;
            this.finish();
            return this;
        },

        finishAssignmentPattern: function (left, right) {
            this.type = Syntax.AssignmentPattern;
            this.left = left;
            this.right = right;
            this.finish();
            return this;
        },

        finishBinaryExpression: function (operator, left, right) {
            this.type = (operator === '||' || operator === '&&') ? Syntax.LogicalExpression : Syntax.BinaryExpression;
            this.operator = operator;
            this.left = left;
            this.right = right;
            this.finish();
            return this;
        },

        finishBlockStatement: function (body) {
            this.type = Syntax.BlockStatement;
            this.body = body;
            this.finish();
            return this;
        },

        finishBreakStatement: function (label) {
            this.type = Syntax.BreakStatement;
            this.label = label;
            this.finish();
            return this;
        },

        finishCallExpression: function (callee, args) {
            this.type = Syntax.CallExpression;
            this.callee = callee;
            this.arguments = args;
            this.finish();
            return this;
        },

        finishCatchClause: function (param, body) {
            this.type = Syntax.CatchClause;
            this.param = param;
            this.body = body;
            this.finish();
            return this;
        },

        finishClassBody: function (body) {
            this.type = Syntax.ClassBody;
            this.body = body;
            this.finish();
            return this;
        },

        finishClassDeclaration: function (id, superClass, body) {
            this.type = Syntax.ClassDeclaration;
            this.id = id;
            this.superClass = superClass;
            this.body = body;
            this.finish();
            return this;
        },

        finishClassExpression: function (id, superClass, body) {
            this.type = Syntax.ClassExpression;
            this.id = id;
            this.superClass = superClass;
            this.body = body;
            this.finish();
            return this;
        },

        finishConditionalExpression: function (test, consequent, alternate) {
            this.type = Syntax.ConditionalExpression;
            this.test = test;
            this.consequent = consequent;
            this.alternate = alternate;
            this.finish();
            return this;
        },

        finishContinueStatement: function (label) {
            this.type = Syntax.ContinueStatement;
            this.label = label;
            this.finish();
            return this;
        },

        finishDebuggerStatement: function () {
            this.type = Syntax.DebuggerStatement;
            this.finish();
            return this;
        },

        finishDoWhileStatement: function (body, test) {
            this.type = Syntax.DoWhileStatement;
            this.body = body;
            this.test = test;
            this.finish();
            return this;
        },

        finishEmptyStatement: function () {
            this.type = Syntax.EmptyStatement;
            this.finish();
            return this;
        },

        finishExpressionStatement: function (expression) {
            this.type = Syntax.ExpressionStatement;
            this.expression = expression;
            this.finish();
            return this;
        },

        finishForStatement: function (init, test, update, body) {
            this.type = Syntax.ForStatement;
            this.init = init;
            this.test = test;
            this.update = update;
            this.body = body;
            this.finish();
            return this;
        },

        finishForOfStatement: function (left, right, body) {
            this.type = Syntax.ForOfStatement;
            this.left = left;
            this.right = right;
            this.body = body;
            this.finish();
            return this;
        },

        finishForInStatement: function (left, right, body) {
            this.type = Syntax.ForInStatement;
            this.left = left;
            this.right = right;
            this.body = body;
            this.each = false;
            this.finish();
            return this;
        },

        finishFunctionDeclaration: function (id, params, defaults, body, generator) {
            this.type = Syntax.FunctionDeclaration;
            this.id = id;
            this.params = params;
            this.defaults = defaults;
            this.body = body;
            this.generator = generator;
            this.expression = false;
            this.finish();
            return this;
        },

        finishFunctionExpression: function (id, params, defaults, body, generator) {
            this.type = Syntax.FunctionExpression;
            this.id = id;
            this.params = params;
            this.defaults = defaults;
            this.body = body;
            this.generator = generator;
            this.expression = false;
            this.finish();
            return this;
        },

        finishIdentifier: function (name) {
            this.type = Syntax.Identifier;
            this.name = name;
            this.finish();
            return this;
        },

        finishIfStatement: function (test, consequent, alternate) {
            this.type = Syntax.IfStatement;
            this.test = test;
            this.consequent = consequent;
            this.alternate = alternate;
            this.finish();
            return this;
        },

        finishLabeledStatement: function (label, body) {
            this.type = Syntax.LabeledStatement;
            this.label = label;
            this.body = body;
            this.finish();
            return this;
        },

        finishLiteral: function (token) {
            this.type = Syntax.Literal;
            this.value = token.value;
            this.raw = source.slice(token.start, token.end);
            if (token.regex) {
                this.regex = token.regex;
            }
            this.finish();
            return this;
        },

        finishMemberExpression: function (accessor, object, property) {
            this.type = Syntax.MemberExpression;
            this.computed = accessor === '[';
            this.object = object;
            this.property = property;
            this.finish();
            return this;
        },

        finishMetaProperty: function (meta, property) {
            this.type = Syntax.MetaProperty;
            this.meta = meta;
            this.property = property;
            this.finish();
            return this;
        },

        finishNewExpression: function (callee, args) {
            this.type = Syntax.NewExpression;
            this.callee = callee;
            this.arguments = args;
            this.finish();
            return this;
        },

        finishObjectExpression: function (properties) {
            this.type = Syntax.ObjectExpression;
            this.properties = properties;
            this.finish();
            return this;
        },

        finishObjectPattern: function (properties) {
            this.type = Syntax.ObjectPattern;
            this.properties = properties;
            this.finish();
            return this;
        },

        finishPostfixExpression: function (operator, argument) {
            this.type = Syntax.UpdateExpression;
            this.operator = operator;
            this.argument = argument;
            this.prefix = false;
            this.finish();
            return this;
        },

        finishProgram: function (body, sourceType) {
            this.type = Syntax.Program;
            this.body = body;
            this.sourceType = sourceType;
            this.finish();
            return this;
        },

        finishProperty: function (kind, key, computed, value, method, shorthand) {
            this.type = Syntax.Property;
            this.key = key;
            this.computed = computed;
            this.value = value;
            this.kind = kind;
            this.method = method;
            this.shorthand = shorthand;
            this.finish();
            return this;
        },

        finishRestElement: function (argument) {
            this.type = Syntax.RestElement;
            this.argument = argument;
            this.finish();
            return this;
        },

        finishReturnStatement: function (argument) {
            this.type = Syntax.ReturnStatement;
            this.argument = argument;
            this.finish();
            return this;
        },

        finishSequenceExpression: function (expressions) {
            this.type = Syntax.SequenceExpression;
            this.expressions = expressions;
            this.finish();
            return this;
        },

        finishSpreadElement: function (argument) {
            this.type = Syntax.SpreadElement;
            this.argument = argument;
            this.finish();
            return this;
        },

        finishSwitchCase: function (test, consequent) {
            this.type = Syntax.SwitchCase;
            this.test = test;
            this.consequent = consequent;
            this.finish();
            return this;
        },

        finishSuper: function () {
            this.type = Syntax.Super;
            this.finish();
            return this;
        },

        finishSwitchStatement: function (discriminant, cases) {
            this.type = Syntax.SwitchStatement;
            this.discriminant = discriminant;
            this.cases = cases;
            this.finish();
            return this;
        },

        finishTaggedTemplateExpression: function (tag, quasi) {
            this.type = Syntax.TaggedTemplateExpression;
            this.tag = tag;
            this.quasi = quasi;
            this.finish();
            return this;
        },

        finishTemplateElement: function (value, tail) {
            this.type = Syntax.TemplateElement;
            this.value = value;
            this.tail = tail;
            this.finish();
            return this;
        },

        finishTemplateLiteral: function (quasis, expressions) {
            this.type = Syntax.TemplateLiteral;
            this.quasis = quasis;
            this.expressions = expressions;
            this.finish();
            return this;
        },

        finishThisExpression: function () {
            this.type = Syntax.ThisExpression;
            this.finish();
            return this;
        },

        finishThrowStatement: function (argument) {
            this.type = Syntax.ThrowStatement;
            this.argument = argument;
            this.finish();
            return this;
        },

        finishTryStatement: function (block, handler, finalizer) {
            this.type = Syntax.TryStatement;
            this.block = block;
            this.guardedHandlers = [];
            this.handlers = handler ? [handler] : [];
            this.handler = handler;
            this.finalizer = finalizer;
            this.finish();
            return this;
        },

        finishUnaryExpression: function (operator, argument) {
            this.type = (operator === '++' || operator === '--') ? Syntax.UpdateExpression : Syntax.UnaryExpression;
            this.operator = operator;
            this.argument = argument;
            this.prefix = true;
            this.finish();
            return this;
        },

        finishVariableDeclaration: function (declarations) {
            this.type = Syntax.VariableDeclaration;
            this.declarations = declarations;
            this.kind = 'var';
            this.finish();
            return this;
        },

        finishLexicalDeclaration: function (declarations, kind) {
            this.type = Syntax.VariableDeclaration;
            this.declarations = declarations;
            this.kind = kind;
            this.finish();
            return this;
        },

        finishVariableDeclarator: function (id, init) {
            this.type = Syntax.VariableDeclarator;
            this.id = id;
            this.init = init;
            this.finish();
            return this;
        },

        finishWhileStatement: function (test, body) {
            this.type = Syntax.WhileStatement;
            this.test = test;
            this.body = body;
            this.finish();
            return this;
        },

        finishWithStatement: function (object, body) {
            this.type = Syntax.WithStatement;
            this.object = object;
            this.body = body;
            this.finish();
            return this;
        },

        finishExportSpecifier: function (local, exported) {
            this.type = Syntax.ExportSpecifier;
            this.exported = exported || local;
            this.local = local;
            this.finish();
            return this;
        },

        finishImportDefaultSpecifier: function (local) {
            this.type = Syntax.ImportDefaultSpecifier;
            this.local = local;
            this.finish();
            return this;
        },

        finishImportNamespaceSpecifier: function (local) {
            this.type = Syntax.ImportNamespaceSpecifier;
            this.local = local;
            this.finish();
            return this;
        },

        finishExportNamedDeclaration: function (declaration, specifiers, src) {
            this.type = Syntax.ExportNamedDeclaration;
            this.declaration = declaration;
            this.specifiers = specifiers;
            this.source = src;
            this.finish();
            return this;
        },

        finishExportDefaultDeclaration: function (declaration) {
            this.type = Syntax.ExportDefaultDeclaration;
            this.declaration = declaration;
            this.finish();
            return this;
        },

        finishExportAllDeclaration: function (src) {
            this.type = Syntax.ExportAllDeclaration;
            this.source = src;
            this.finish();
            return this;
        },

        finishImportSpecifier: function (local, imported) {
            this.type = Syntax.ImportSpecifier;
            this.local = local || imported;
            this.imported = imported;
            this.finish();
            return this;
        },

        finishImportDeclaration: function (specifiers, src) {
            this.type = Syntax.ImportDeclaration;
            this.specifiers = specifiers;
            this.source = src;
            this.finish();
            return this;
        },

        finishYieldExpression: function (argument, delegate) {
            this.type = Syntax.YieldExpression;
            this.argument = argument;
            this.delegate = delegate;
            this.finish();
            return this;
        }
    };


    function recordError(error) {
        var e, existing;

        for (e = 0; e < extra.errors.length; e++) {
            existing = extra.errors[e];
            // Prevent duplicated error.
            /* istanbul ignore next */
            if (existing.index === error.index && existing.message === error.message) {
                return;
            }
        }

        extra.errors.push(error);
    }

    function constructError(msg, column) {
        var error = new Error(msg);
        try {
            throw error;
        } catch (base) {
            /* istanbul ignore else */
            if (Object.create && Object.defineProperty) {
                error = Object.create(base);
                Object.defineProperty(error, 'column', { value: column });
            }
        } finally {
            return error;
        }
    }

    function createError(line, pos, description) {
        var msg, column, error;

        msg = 'Line ' + line + ': ' + description;
        column = pos - (scanning ? lineStart : lastLineStart) + 1;
        error = constructError(msg, column);
        error.lineNumber = line;
        error.description = description;
        error.index = pos;
        return error;
    }

    // Throw an exception

    function throwError(messageFormat) {
        var args, msg;

        args = Array.prototype.slice.call(arguments, 1);
        msg = messageFormat.replace(/%(\d)/g,
            function (whole, idx) {
                assert(idx < args.length, 'Message reference must be in range');
                return args[idx];
            }
        );

        throw createError(lastLineNumber, lastIndex, msg);
    }

    function tolerateError(messageFormat) {
        var args, msg, error;

        args = Array.prototype.slice.call(arguments, 1);
        /* istanbul ignore next */
        msg = messageFormat.replace(/%(\d)/g,
            function (whole, idx) {
                assert(idx < args.length, 'Message reference must be in range');
                return args[idx];
            }
        );

        error = createError(lineNumber, lastIndex, msg);
        if (extra.errors) {
            recordError(error);
        } else {
            throw error;
        }
    }

    // Throw an exception because of the token.

    function unexpectedTokenError(token, message) {
        var value, msg = message || Messages.UnexpectedToken;

        if (token) {
            if (!message) {
                msg = (token.type === Token.EOF) ? Messages.UnexpectedEOS :
                    (token.type === Token.Identifier) ? Messages.UnexpectedIdentifier :
                    (token.type === Token.NumericLiteral) ? Messages.UnexpectedNumber :
                    (token.type === Token.StringLiteral) ? Messages.UnexpectedString :
                    (token.type === Token.Template) ? Messages.UnexpectedTemplate :
                    Messages.UnexpectedToken;

                if (token.type === Token.Keyword) {
                    if (isFutureReservedWord(token.value)) {
                        msg = Messages.UnexpectedReserved;
                    } else if (strict && isStrictModeReservedWord(token.value)) {
                        msg = Messages.StrictReservedWord;
                    }
                }
            }

            value = (token.type === Token.Template) ? token.value.raw : token.value;
        } else {
            value = 'ILLEGAL';
        }

        msg = msg.replace('%0', value);

        return (token && typeof token.lineNumber === 'number') ?
            createError(token.lineNumber, token.start, msg) :
            createError(scanning ? lineNumber : lastLineNumber, scanning ? index : lastIndex, msg);
    }

    function throwUnexpectedToken(token, message) {
        throw unexpectedTokenError(token, message);
    }

    function tolerateUnexpectedToken(token, message) {
        var error = unexpectedTokenError(token, message);
        if (extra.errors) {
            recordError(error);
        } else {
            throw error;
        }
    }

    // Expect the next token to match the specified punctuator.
    // If not, an exception will be thrown.

    function expect(value) {
        var token = lex();
        if (token.type !== Token.Punctuator || token.value !== value) {
            throwUnexpectedToken(token);
        }
    }

    /**
     * @name expectCommaSeparator
     * @description Quietly expect a comma when in tolerant mode, otherwise delegates
     * to <code>expect(value)</code>
     * @since 2.0
     */
    function expectCommaSeparator() {
        var token;

        if (extra.errors) {
            token = lookahead;
            if (token.type === Token.Punctuator && token.value === ',') {
                lex();
            } else if (token.type === Token.Punctuator && token.value === ';') {
                lex();
                tolerateUnexpectedToken(token);
            } else {
                tolerateUnexpectedToken(token, Messages.UnexpectedToken);
            }
        } else {
            expect(',');
        }
    }

    // Expect the next token to match the specified keyword.
    // If not, an exception will be thrown.

    function expectKeyword(keyword) {
        var token = lex();
        if (token.type !== Token.Keyword || token.value !== keyword) {
            throwUnexpectedToken(token);
        }
    }

    // Return true if the next token matches the specified punctuator.

    function match(value) {
        return lookahead.type === Token.Punctuator && lookahead.value === value;
    }

    // Return true if the next token matches the specified keyword

    function matchKeyword(keyword) {
        return lookahead.type === Token.Keyword && lookahead.value === keyword;
    }

    // Return true if the next token matches the specified contextual keyword
    // (where an identifier is sometimes a keyword depending on the context)

    function matchContextualKeyword(keyword) {
        return lookahead.type === Token.Identifier && lookahead.value === keyword;
    }

    // Return true if the next token is an assignment operator

    function matchAssign() {
        var op;

        if (lookahead.type !== Token.Punctuator) {
            return false;
        }
        op = lookahead.value;
        return op === '=' ||
            op === '*=' ||
            op === '/=' ||
            op === '%=' ||
            op === '+=' ||
            op === '-=' ||
            op === '<<=' ||
            op === '>>=' ||
            op === '>>>=' ||
            op === '&=' ||
            op === '^=' ||
            op === '|=';
    }

    function consumeSemicolon() {
        // Catch the very common case first: immediately a semicolon (U+003B).
        if (source.charCodeAt(startIndex) === 0x3B || match(';')) {
            lex();
            return;
        }

        if (hasLineTerminator) {
            return;
        }

        // FIXME(ikarienator): this is seemingly an issue in the previous location info convention.
        lastIndex = startIndex;
        lastLineNumber = startLineNumber;
        lastLineStart = startLineStart;

        if (lookahead.type !== Token.EOF && !match('}')) {
            throwUnexpectedToken(lookahead);
        }
    }

    // Cover grammar support.
    //
    // When an assignment expression position starts with an left parenthesis, the determination of the type
    // of the syntax is to be deferred arbitrarily long until the end of the parentheses pair (plus a lookahead)
    // or the first comma. This situation also defers the determination of all the expressions nested in the pair.
    //
    // There are three productions that can be parsed in a parentheses pair that needs to be determined
    // after the outermost pair is closed. They are:
    //
    //   1. AssignmentExpression
    //   2. BindingElements
    //   3. AssignmentTargets
    //
    // In order to avoid exponential backtracking, we use two flags to denote if the production can be
    // binding element or assignment target.
    //
    // The three productions have the relationship:
    //
    //   BindingElements ⊆ AssignmentTargets ⊆ AssignmentExpression
    //
    // with a single exception that CoverInitializedName when used directly in an Expression, generates
    // an early error. Therefore, we need the third state, firstCoverInitializedNameError, to track the
    // first usage of CoverInitializedName and report it when we reached the end of the parentheses pair.
    //
    // isolateCoverGrammar function runs the given parser function with a new cover grammar context, and it does not
    // effect the current flags. This means the production the parser parses is only used as an expression. Therefore
    // the CoverInitializedName check is conducted.
    //
    // inheritCoverGrammar function runs the given parse function with a new cover grammar context, and it propagates
    // the flags outside of the parser. This means the production the parser parses is used as a part of a potential
    // pattern. The CoverInitializedName check is deferred.
    function isolateCoverGrammar(parser) {
        var oldIsBindingElement = isBindingElement,
            oldIsAssignmentTarget = isAssignmentTarget,
            oldFirstCoverInitializedNameError = firstCoverInitializedNameError,
            result;
        isBindingElement = true;
        isAssignmentTarget = true;
        firstCoverInitializedNameError = null;
        result = parser();
        if (firstCoverInitializedNameError !== null) {
            throwUnexpectedToken(firstCoverInitializedNameError);
        }
        isBindingElement = oldIsBindingElement;
        isAssignmentTarget = oldIsAssignmentTarget;
        firstCoverInitializedNameError = oldFirstCoverInitializedNameError;
        return result;
    }

    function inheritCoverGrammar(parser) {
        var oldIsBindingElement = isBindingElement,
            oldIsAssignmentTarget = isAssignmentTarget,
            oldFirstCoverInitializedNameError = firstCoverInitializedNameError,
            result;
        isBindingElement = true;
        isAssignmentTarget = true;
        firstCoverInitializedNameError = null;
        result = parser();
        isBindingElement = isBindingElement && oldIsBindingElement;
        isAssignmentTarget = isAssignmentTarget && oldIsAssignmentTarget;
        firstCoverInitializedNameError = oldFirstCoverInitializedNameError || firstCoverInitializedNameError;
        return result;
    }

    // ECMA-262 13.3.3 Destructuring Binding Patterns

    function parseArrayPattern(params, kind) {
        var node = new Node(), elements = [], rest, restNode;
        expect('[');

        while (!match(']')) {
            if (match(',')) {
                lex();
                elements.push(null);
            } else {
                if (match('...')) {
                    restNode = new Node();
                    lex();
                    params.push(lookahead);
                    rest = parseVariableIdentifier(kind);
                    elements.push(restNode.finishRestElement(rest));
                    break;
                } else {
                    elements.push(parsePatternWithDefault(params, kind));
                }
                if (!match(']')) {
                    expect(',');
                }
            }

        }

        expect(']');

        return node.finishArrayPattern(elements);
    }

    function parsePropertyPattern(params, kind) {
        var node = new Node(), key, keyToken, computed = match('['), init;
        if (lookahead.type === Token.Identifier) {
            keyToken = lookahead;
            key = parseVariableIdentifier();
            if (match('=')) {
                params.push(keyToken);
                lex();
                init = parseAssignmentExpression();

                return node.finishProperty(
                    'init', key, false,
                    new WrappingNode(keyToken).finishAssignmentPattern(key, init), false, true);
            } else if (!match(':')) {
                params.push(keyToken);
                return node.finishProperty('init', key, false, key, false, true);
            }
        } else {
            key = parseObjectPropertyKey();
        }
        expect(':');
        init = parsePatternWithDefault(params, kind);
        return node.finishProperty('init', key, computed, init, false, false);
    }

    function parseObjectPattern(params, kind) {
        var node = new Node(), properties = [];

        expect('{');

        while (!match('}')) {
            properties.push(parsePropertyPattern(params, kind));
            if (!match('}')) {
                expect(',');
            }
        }

        lex();

        return node.finishObjectPattern(properties);
    }

    function parsePattern(params, kind) {
        if (match('[')) {
            return parseArrayPattern(params, kind);
        } else if (match('{')) {
            return parseObjectPattern(params, kind);
        } else if (matchKeyword('let')) {
            if (kind === 'const' || kind === 'let') {
                tolerateUnexpectedToken(lookahead, Messages.UnexpectedToken);
            }
        }

        params.push(lookahead);
        return parseVariableIdentifier(kind);
    }

    function parsePatternWithDefault(params, kind) {
        var startToken = lookahead, pattern, previousAllowYield, right;
        pattern = parsePattern(params, kind);
        if (match('=')) {
            lex();
            previousAllowYield = state.allowYield;
            state.allowYield = true;
            right = isolateCoverGrammar(parseAssignmentExpression);
            state.allowYield = previousAllowYield;
            pattern = new WrappingNode(startToken).finishAssignmentPattern(pattern, right);
        }
        return pattern;
    }

    // ECMA-262 12.2.5 Array Initializer

    function parseArrayInitializer() {
        var elements = [], node = new Node(), restSpread;

        expect('[');

        while (!match(']')) {
            if (match(',')) {
                lex();
                elements.push(null);
            } else if (match('...')) {
                restSpread = new Node();
                lex();
                restSpread.finishSpreadElement(inheritCoverGrammar(parseAssignmentExpression));

                if (!match(']')) {
                    isAssignmentTarget = isBindingElement = false;
                    expect(',');
                }
                elements.push(restSpread);
            } else {
                elements.push(inheritCoverGrammar(parseAssignmentExpression));

                if (!match(']')) {
                    expect(',');
                }
            }
        }

        lex();

        return node.finishArrayExpression(elements);
    }

    // ECMA-262 12.2.6 Object Initializer

    function parsePropertyFunction(node, paramInfo, isGenerator) {
        var previousStrict, body;

        isAssignmentTarget = isBindingElement = false;

        previousStrict = strict;
        body = isolateCoverGrammar(parseFunctionSourceElements);

        if (strict && paramInfo.firstRestricted) {
            tolerateUnexpectedToken(paramInfo.firstRestricted, paramInfo.message);
        }
        if (strict && paramInfo.stricted) {
            tolerateUnexpectedToken(paramInfo.stricted, paramInfo.message);
        }

        strict = previousStrict;
        return node.finishFunctionExpression(null, paramInfo.params, paramInfo.defaults, body, isGenerator);
    }

    function parsePropertyMethodFunction() {
        var params, method, node = new Node(),
            previousAllowYield = state.allowYield;

        state.allowYield = false;
        params = parseParams();
        state.allowYield = previousAllowYield;

        state.allowYield = false;
        method = parsePropertyFunction(node, params, false);
        state.allowYield = previousAllowYield;

        return method;
    }

    function parseObjectPropertyKey() {
        var token, node = new Node(), expr;

        token = lex();

        // Note: This function is called only from parseObjectProperty(), where
        // EOF and Punctuator tokens are already filtered out.

        switch (token.type) {
        case Token.StringLiteral:
        case Token.NumericLiteral:
            if (strict && token.octal) {
                tolerateUnexpectedToken(token, Messages.StrictOctalLiteral);
            }
            return node.finishLiteral(token);
        case Token.Identifier:
        case Token.BooleanLiteral:
        case Token.NullLiteral:
        case Token.Keyword:
            return node.finishIdentifier(token.value);
        case Token.Punctuator:
            if (token.value === '[') {
                expr = isolateCoverGrammar(parseAssignmentExpression);
                expect(']');
                return expr;
            }
            break;
        }
        throwUnexpectedToken(token);
    }

    function lookaheadPropertyName() {
        switch (lookahead.type) {
        case Token.Identifier:
        case Token.StringLiteral:
        case Token.BooleanLiteral:
        case Token.NullLiteral:
        case Token.NumericLiteral:
        case Token.Keyword:
            return true;
        case Token.Punctuator:
            return lookahead.value === '[';
        }
        return false;
    }

    // This function is to try to parse a MethodDefinition as defined in 14.3. But in the case of object literals,
    // it might be called at a position where there is in fact a short hand identifier pattern or a data property.
    // This can only be determined after we consumed up to the left parentheses.
    //
    // In order to avoid back tracking, it returns `null` if the position is not a MethodDefinition and the caller
    // is responsible to visit other options.
    function tryParseMethodDefinition(token, key, computed, node) {
        var value, options, methodNode, params,
            previousAllowYield = state.allowYield;

        if (token.type === Token.Identifier) {
            // check for `get` and `set`;

            if (token.value === 'get' && lookaheadPropertyName()) {
                computed = match('[');
                key = parseObjectPropertyKey();
                methodNode = new Node();
                expect('(');
                expect(')');

                state.allowYield = false;
                value = parsePropertyFunction(methodNode, {
                    params: [],
                    defaults: [],
                    stricted: null,
                    firstRestricted: null,
                    message: null
                }, false);
                state.allowYield = previousAllowYield;

                return node.finishProperty('get', key, computed, value, false, false);
            } else if (token.value === 'set' && lookaheadPropertyName()) {
                computed = match('[');
                key = parseObjectPropertyKey();
                methodNode = new Node();
                expect('(');

                options = {
                    params: [],
                    defaultCount: 0,
                    defaults: [],
                    firstRestricted: null,
                    paramSet: {}
                };
                if (match(')')) {
                    tolerateUnexpectedToken(lookahead);
                } else {
                    state.allowYield = false;
                    parseParam(options);
                    state.allowYield = previousAllowYield;
                    if (options.defaultCount === 0) {
                        options.defaults = [];
                    }
                }
                expect(')');

                state.allowYield = false;
                value = parsePropertyFunction(methodNode, options, false);
                state.allowYield = previousAllowYield;

                return node.finishProperty('set', key, computed, value, false, false);
            }
        } else if (token.type === Token.Punctuator && token.value === '*' && lookaheadPropertyName()) {
            computed = match('[');
            key = parseObjectPropertyKey();
            methodNode = new Node();

            state.allowYield = true;
            params = parseParams();
            state.allowYield = previousAllowYield;

            state.allowYield = false;
            value = parsePropertyFunction(methodNode, params, true);
            state.allowYield = previousAllowYield;

            return node.finishProperty('init', key, computed, value, true, false);
        }

        if (key && match('(')) {
            value = parsePropertyMethodFunction();
            return node.finishProperty('init', key, computed, value, true, false);
        }

        // Not a MethodDefinition.
        return null;
    }

    function parseObjectProperty(hasProto) {
        var token = lookahead, node = new Node(), computed, key, maybeMethod, proto, value;

        computed = match('[');
        if (match('*')) {
            lex();
        } else {
            key = parseObjectPropertyKey();
        }
        maybeMethod = tryParseMethodDefinition(token, key, computed, node);
        if (maybeMethod) {
            return maybeMethod;
        }

        if (!key) {
            throwUnexpectedToken(lookahead);
        }

        // Check for duplicated __proto__
        if (!computed) {
            proto = (key.type === Syntax.Identifier && key.name === '__proto__') ||
                (key.type === Syntax.Literal && key.value === '__proto__');
            if (hasProto.value && proto) {
                tolerateError(Messages.DuplicateProtoProperty);
            }
            hasProto.value |= proto;
        }

        if (match(':')) {
            lex();
            value = inheritCoverGrammar(parseAssignmentExpression);
            return node.finishProperty('init', key, computed, value, false, false);
        }

        if (token.type === Token.Identifier) {
            if (match('=')) {
                firstCoverInitializedNameError = lookahead;
                lex();
                value = isolateCoverGrammar(parseAssignmentExpression);
                return node.finishProperty('init', key, computed,
                    new WrappingNode(token).finishAssignmentPattern(key, value), false, true);
            }
            return node.finishProperty('init', key, computed, key, false, true);
        }

        throwUnexpectedToken(lookahead);
    }

    function parseObjectInitializer() {
        var properties = [], hasProto = {value: false}, node = new Node();

        expect('{');

        while (!match('}')) {
            properties.push(parseObjectProperty(hasProto));

            if (!match('}')) {
                expectCommaSeparator();
            }
        }

        expect('}');

        return node.finishObjectExpression(properties);
    }

    function reinterpretExpressionAsPattern(expr) {
        var i;
        switch (expr.type) {
        case Syntax.Identifier:
        case Syntax.MemberExpression:
        case Syntax.RestElement:
        case Syntax.AssignmentPattern:
            break;
        case Syntax.SpreadElement:
            expr.type = Syntax.RestElement;
            reinterpretExpressionAsPattern(expr.argument);
            break;
        case Syntax.ArrayExpression:
            expr.type = Syntax.ArrayPattern;
            for (i = 0; i < expr.elements.length; i++) {
                if (expr.elements[i] !== null) {
                    reinterpretExpressionAsPattern(expr.elements[i]);
                }
            }
            break;
        case Syntax.ObjectExpression:
            expr.type = Syntax.ObjectPattern;
            for (i = 0; i < expr.properties.length; i++) {
                reinterpretExpressionAsPattern(expr.properties[i].value);
            }
            break;
        case Syntax.AssignmentExpression:
            expr.type = Syntax.AssignmentPattern;
            reinterpretExpressionAsPattern(expr.left);
            break;
        default:
            // Allow other node type for tolerant parsing.
            break;
        }
    }

    // ECMA-262 12.2.9 Template Literals

    function parseTemplateElement(option) {
        var node, token;

        if (lookahead.type !== Token.Template || (option.head && !lookahead.head)) {
            throwUnexpectedToken();
        }

        node = new Node();
        token = lex();

        return node.finishTemplateElement({ raw: token.value.raw, cooked: token.value.cooked }, token.tail);
    }

    function parseTemplateLiteral() {
        var quasi, quasis, expressions, node = new Node();

        quasi = parseTemplateElement({ head: true });
        quasis = [quasi];
        expressions = [];

        while (!quasi.tail) {
            expressions.push(parseExpression());
            quasi = parseTemplateElement({ head: false });
            quasis.push(quasi);
        }

        return node.finishTemplateLiteral(quasis, expressions);
    }

    // ECMA-262 12.2.10 The Grouping Operator

    function parseGroupExpression() {
        var expr, expressions, startToken, i, params = [];

        expect('(');

        if (match(')')) {
            lex();
            if (!match('=>')) {
                expect('=>');
            }
            return {
                type: PlaceHolders.ArrowParameterPlaceHolder,
                params: [],
                rawParams: []
            };
        }

        startToken = lookahead;
        if (match('...')) {
            expr = parseRestElement(params);
            expect(')');
            if (!match('=>')) {
                expect('=>');
            }
            return {
                type: PlaceHolders.ArrowParameterPlaceHolder,
                params: [expr]
            };
        }

        isBindingElement = true;
        expr = inheritCoverGrammar(parseAssignmentExpression);

        if (match(',')) {
            isAssignmentTarget = false;
            expressions = [expr];

            while (startIndex < length) {
                if (!match(',')) {
                    break;
                }
                lex();

                if (match('...')) {
                    if (!isBindingElement) {
                        throwUnexpectedToken(lookahead);
                    }
                    expressions.push(parseRestElement(params));
                    expect(')');
                    if (!match('=>')) {
                        expect('=>');
                    }
                    isBindingElement = false;
                    for (i = 0; i < expressions.length; i++) {
                        reinterpretExpressionAsPattern(expressions[i]);
                    }
                    return {
                        type: PlaceHolders.ArrowParameterPlaceHolder,
                        params: expressions
                    };
                }

                expressions.push(inheritCoverGrammar(parseAssignmentExpression));
            }

            expr = new WrappingNode(startToken).finishSequenceExpression(expressions);
        }


        expect(')');

        if (match('=>')) {
            if (expr.type === Syntax.Identifier && expr.name === 'yield') {
                return {
                    type: PlaceHolders.ArrowParameterPlaceHolder,
                    params: [expr]
                };
            }

            if (!isBindingElement) {
                throwUnexpectedToken(lookahead);
            }

            if (expr.type === Syntax.SequenceExpression) {
                for (i = 0; i < expr.expressions.length; i++) {
                    reinterpretExpressionAsPattern(expr.expressions[i]);
                }
            } else {
                reinterpretExpressionAsPattern(expr);
            }

            expr = {
                type: PlaceHolders.ArrowParameterPlaceHolder,
                params: expr.type === Syntax.SequenceExpression ? expr.expressions : [expr]
            };
        }
        isBindingElement = false;
        return expr;
    }


    // ECMA-262 12.2 Primary Expressions

    function parsePrimaryExpression() {
        var type, token, expr, node;

        if (match('(')) {
            isBindingElement = false;
            return inheritCoverGrammar(parseGroupExpression);
        }

        if (match('[')) {
            return inheritCoverGrammar(parseArrayInitializer);
        }

        if (match('{')) {
            return inheritCoverGrammar(parseObjectInitializer);
        }

        type = lookahead.type;
        node = new Node();

        if (type === Token.Identifier) {
            if (state.sourceType === 'module' && lookahead.value === 'await') {
                tolerateUnexpectedToken(lookahead);
            }
            expr = node.finishIdentifier(lex().value);
        } else if (type === Token.StringLiteral || type === Token.NumericLiteral) {
            isAssignmentTarget = isBindingElement = false;
            if (strict && lookahead.octal) {
                tolerateUnexpectedToken(lookahead, Messages.StrictOctalLiteral);
            }
            expr = node.finishLiteral(lex());
        } else if (type === Token.Keyword) {
            if (!strict && state.allowYield && matchKeyword('yield')) {
                return parseNonComputedProperty();
            }
            if (!strict && matchKeyword('let')) {
                return node.finishIdentifier(lex().value);
            }
            isAssignmentTarget = isBindingElement = false;
            if (matchKeyword('function')) {
                return parseFunctionExpression();
            }
            if (matchKeyword('this')) {
                lex();
                return node.finishThisExpression();
            }
            if (matchKeyword('class')) {
                return parseClassExpression();
            }
            throwUnexpectedToken(lex());
        } else if (type === Token.BooleanLiteral) {
            isAssignmentTarget = isBindingElement = false;
            token = lex();
            token.value = (token.value === 'true');
            expr = node.finishLiteral(token);
        } else if (type === Token.NullLiteral) {
            isAssignmentTarget = isBindingElement = false;
            token = lex();
            token.value = null;
            expr = node.finishLiteral(token);
        } else if (match('/') || match('/=')) {
            isAssignmentTarget = isBindingElement = false;
            index = startIndex;

            if (typeof extra.tokens !== 'undefined') {
                token = collectRegex();
            } else {
                token = scanRegExp();
            }
            lex();
            expr = node.finishLiteral(token);
        } else if (type === Token.Template) {
            expr = parseTemplateLiteral();
        } else {
            throwUnexpectedToken(lex());
        }

        return expr;
    }

    // ECMA-262 12.3 Left-Hand-Side Expressions

    function parseArguments() {
        var args = [], expr;

        expect('(');

        if (!match(')')) {
            while (startIndex < length) {
                if (match('...')) {
                    expr = new Node();
                    lex();
                    expr.finishSpreadElement(isolateCoverGrammar(parseAssignmentExpression));
                } else {
                    expr = isolateCoverGrammar(parseAssignmentExpression);
                }
                args.push(expr);
                if (match(')')) {
                    break;
                }
                expectCommaSeparator();
            }
        }

        expect(')');

        return args;
    }

    function parseNonComputedProperty() {
        var token, node = new Node();

        token = lex();

        if (!isIdentifierName(token)) {
            throwUnexpectedToken(token);
        }

        return node.finishIdentifier(token.value);
    }

    function parseNonComputedMember() {
        expect('.');

        return parseNonComputedProperty();
    }

    function parseComputedMember() {
        var expr;

        expect('[');

        expr = isolateCoverGrammar(parseExpression);

        expect(']');

        return expr;
    }

    // ECMA-262 12.3.3 The new Operator

    function parseNewExpression() {
        var callee, args, node = new Node();

        expectKeyword('new');

        if (match('.')) {
            lex();
            if (lookahead.type === Token.Identifier && lookahead.value === 'target') {
                if (state.inFunctionBody) {
                    lex();
                    return node.finishMetaProperty('new', 'target');
                }
            }
            throwUnexpectedToken(lookahead);
        }

        callee = isolateCoverGrammar(parseLeftHandSideExpression);
        args = match('(') ? parseArguments() : [];

        isAssignmentTarget = isBindingElement = false;

        return node.finishNewExpression(callee, args);
    }

    // ECMA-262 12.3.4 Function Calls

    function parseLeftHandSideExpressionAllowCall() {
        var quasi, expr, args, property, startToken, previousAllowIn = state.allowIn;

        startToken = lookahead;
        state.allowIn = true;

        if (matchKeyword('super') && state.inFunctionBody) {
            expr = new Node();
            lex();
            expr = expr.finishSuper();
            if (!match('(') && !match('.') && !match('[')) {
                throwUnexpectedToken(lookahead);
            }
        } else {
            expr = inheritCoverGrammar(matchKeyword('new') ? parseNewExpression : parsePrimaryExpression);
        }

        for (;;) {
            if (match('.')) {
                isBindingElement = false;
                isAssignmentTarget = true;
                property = parseNonComputedMember();
                expr = new WrappingNode(startToken).finishMemberExpression('.', expr, property);
            } else if (match('(')) {
                isBindingElement = false;
                isAssignmentTarget = false;
                args = parseArguments();
                expr = new WrappingNode(startToken).finishCallExpression(expr, args);
            } else if (match('[')) {
                isBindingElement = false;
                isAssignmentTarget = true;
                property = parseComputedMember();
                expr = new WrappingNode(startToken).finishMemberExpression('[', expr, property);
            } else if (lookahead.type === Token.Template && lookahead.head) {
                quasi = parseTemplateLiteral();
                expr = new WrappingNode(startToken).finishTaggedTemplateExpression(expr, quasi);
            } else {
                break;
            }
        }
        state.allowIn = previousAllowIn;

        return expr;
    }

    // ECMA-262 12.3 Left-Hand-Side Expressions

    function parseLeftHandSideExpression() {
        var quasi, expr, property, startToken;
        assert(state.allowIn, 'callee of new expression always allow in keyword.');

        startToken = lookahead;

        if (matchKeyword('super') && state.inFunctionBody) {
            expr = new Node();
            lex();
            expr = expr.finishSuper();
            if (!match('[') && !match('.')) {
                throwUnexpectedToken(lookahead);
            }
        } else {
            expr = inheritCoverGrammar(matchKeyword('new') ? parseNewExpression : parsePrimaryExpression);
        }

        for (;;) {
            if (match('[')) {
                isBindingElement = false;
                isAssignmentTarget = true;
                property = parseComputedMember();
                expr = new WrappingNode(startToken).finishMemberExpression('[', expr, property);
            } else if (match('.')) {
                isBindingElement = false;
                isAssignmentTarget = true;
                property = parseNonComputedMember();
                expr = new WrappingNode(startToken).finishMemberExpression('.', expr, property);
            } else if (lookahead.type === Token.Template && lookahead.head) {
                quasi = parseTemplateLiteral();
                expr = new WrappingNode(startToken).finishTaggedTemplateExpression(expr, quasi);
            } else {
                break;
            }
        }
        return expr;
    }

    // ECMA-262 12.4 Postfix Expressions

    function parsePostfixExpression() {
        var expr, token, startToken = lookahead;

        expr = inheritCoverGrammar(parseLeftHandSideExpressionAllowCall);

        if (!hasLineTerminator && lookahead.type === Token.Punctuator) {
            if (match('++') || match('--')) {
                // ECMA-262 11.3.1, 11.3.2
                if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                    tolerateError(Messages.StrictLHSPostfix);
                }

                if (!isAssignmentTarget) {
                    tolerateError(Messages.InvalidLHSInAssignment);
                }

                isAssignmentTarget = isBindingElement = false;

                token = lex();
                expr = new WrappingNode(startToken).finishPostfixExpression(token.value, expr);
            }
        }

        return expr;
    }

    // ECMA-262 12.5 Unary Operators

    function parseUnaryExpression() {
        var token, expr, startToken;

        if (lookahead.type !== Token.Punctuator && lookahead.type !== Token.Keyword) {
            expr = parsePostfixExpression();
        } else if (match('++') || match('--')) {
            startToken = lookahead;
            token = lex();
            expr = inheritCoverGrammar(parseUnaryExpression);
            // ECMA-262 11.4.4, 11.4.5
            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
                tolerateError(Messages.StrictLHSPrefix);
            }

            if (!isAssignmentTarget) {
                tolerateError(Messages.InvalidLHSInAssignment);
            }
            expr = new WrappingNode(startToken).finishUnaryExpression(token.value, expr);
            isAssignmentTarget = isBindingElement = false;
        } else if (match('+') || match('-') || match('~') || match('!')) {
            startToken = lookahead;
            token = lex();
            expr = inheritCoverGrammar(parseUnaryExpression);
            expr = new WrappingNode(startToken).finishUnaryExpression(token.value, expr);
            isAssignmentTarget = isBindingElement = false;
        } else if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
            startToken = lookahead;
            token = lex();
            expr = inheritCoverGrammar(parseUnaryExpression);
            expr = new WrappingNode(startToken).finishUnaryExpression(token.value, expr);
            if (strict && expr.operator === 'delete' && expr.argument.type === Syntax.Identifier) {
                tolerateError(Messages.StrictDelete);
            }
            isAssignmentTarget = isBindingElement = false;
        } else {
            expr = parsePostfixExpression();
        }

        return expr;
    }

    function binaryPrecedence(token, allowIn) {
        var prec = 0;

        if (token.type !== Token.Punctuator && token.type !== Token.Keyword) {
            return 0;
        }

        switch (token.value) {
        case '||':
            prec = 1;
            break;

        case '&&':
            prec = 2;
            break;

        case '|':
            prec = 3;
            break;

        case '^':
            prec = 4;
            break;

        case '&':
            prec = 5;
            break;

        case '==':
        case '!=':
        case '===':
        case '!==':
            prec = 6;
            break;

        case '<':
        case '>':
        case '<=':
        case '>=':
        case 'instanceof':
            prec = 7;
            break;

        case 'in':
            prec = allowIn ? 7 : 0;
            break;

        case '<<':
        case '>>':
        case '>>>':
            prec = 8;
            break;

        case '+':
        case '-':
            prec = 9;
            break;

        case '*':
        case '/':
        case '%':
            prec = 11;
            break;

        default:
            break;
        }

        return prec;
    }

    // ECMA-262 12.6 Multiplicative Operators
    // ECMA-262 12.7 Additive Operators
    // ECMA-262 12.8 Bitwise Shift Operators
    // ECMA-262 12.9 Relational Operators
    // ECMA-262 12.10 Equality Operators
    // ECMA-262 12.11 Binary Bitwise Operators
    // ECMA-262 12.12 Binary Logical Operators

    function parseBinaryExpression() {
        var marker, markers, expr, token, prec, stack, right, operator, left, i;

        marker = lookahead;
        left = inheritCoverGrammar(parseUnaryExpression);

        token = lookahead;
        prec = binaryPrecedence(token, state.allowIn);
        if (prec === 0) {
            return left;
        }
        isAssignmentTarget = isBindingElement = false;
        token.prec = prec;
        lex();

        markers = [marker, lookahead];
        right = isolateCoverGrammar(parseUnaryExpression);

        stack = [left, token, right];

        while ((prec = binaryPrecedence(lookahead, state.allowIn)) > 0) {

            // Reduce: make a binary expression from the three topmost entries.
            while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
                right = stack.pop();
                operator = stack.pop().value;
                left = stack.pop();
                markers.pop();
                expr = new WrappingNode(markers[markers.length - 1]).finishBinaryExpression(operator, left, right);
                stack.push(expr);
            }

            // Shift.
            token = lex();
            token.prec = prec;
            stack.push(token);
            markers.push(lookahead);
            expr = isolateCoverGrammar(parseUnaryExpression);
            stack.push(expr);
        }

        // Final reduce to clean-up the stack.
        i = stack.length - 1;
        expr = stack[i];
        markers.pop();
        while (i > 1) {
            expr = new WrappingNode(markers.pop()).finishBinaryExpression(stack[i - 1].value, stack[i - 2], expr);
            i -= 2;
        }

        return expr;
    }


    // ECMA-262 12.13 Conditional Operator

    function parseConditionalExpression() {
        var expr, previousAllowIn, consequent, alternate, startToken;

        startToken = lookahead;

        expr = inheritCoverGrammar(parseBinaryExpression);
        if (match('?')) {
            lex();
            previousAllowIn = state.allowIn;
            state.allowIn = true;
            consequent = isolateCoverGrammar(parseAssignmentExpression);
            state.allowIn = previousAllowIn;
            expect(':');
            alternate = isolateCoverGrammar(parseAssignmentExpression);

            expr = new WrappingNode(startToken).finishConditionalExpression(expr, consequent, alternate);
            isAssignmentTarget = isBindingElement = false;
        }

        return expr;
    }

    // ECMA-262 14.2 Arrow Function Definitions

    function parseConciseBody() {
        if (match('{')) {
            return parseFunctionSourceElements();
        }
        return isolateCoverGrammar(parseAssignmentExpression);
    }

    function checkPatternParam(options, param) {
        var i;
        switch (param.type) {
        case Syntax.Identifier:
            validateParam(options, param, param.name);
            break;
        case Syntax.RestElement:
            checkPatternParam(options, param.argument);
            break;
        case Syntax.AssignmentPattern:
            checkPatternParam(options, param.left);
            break;
        case Syntax.ArrayPattern:
            for (i = 0; i < param.elements.length; i++) {
                if (param.elements[i] !== null) {
                    checkPatternParam(options, param.elements[i]);
                }
            }
            break;
        case Syntax.YieldExpression:
            break;
        default:
            assert(param.type === Syntax.ObjectPattern, 'Invalid type');
            for (i = 0; i < param.properties.length; i++) {
                checkPatternParam(options, param.properties[i].value);
            }
            break;
        }
    }
    function reinterpretAsCoverFormalsList(expr) {
        var i, len, param, params, defaults, defaultCount, options, token;

        defaults = [];
        defaultCount = 0;
        params = [expr];

        switch (expr.type) {
        case Syntax.Identifier:
            break;
        case PlaceHolders.ArrowParameterPlaceHolder:
            params = expr.params;
            break;
        default:
            return null;
        }

        options = {
            paramSet: {}
        };

        for (i = 0, len = params.length; i < len; i += 1) {
            param = params[i];
            switch (param.type) {
            case Syntax.AssignmentPattern:
                params[i] = param.left;
                if (param.right.type === Syntax.YieldExpression) {
                    if (param.right.argument) {
                        throwUnexpectedToken(lookahead);
                    }
                    param.right.type = Syntax.Identifier;
                    param.right.name = 'yield';
                    delete param.right.argument;
                    delete param.right.delegate;
                }
                defaults.push(param.right);
                ++defaultCount;
                checkPatternParam(options, param.left);
                break;
            default:
                checkPatternParam(options, param);
                params[i] = param;
                defaults.push(null);
                break;
            }
        }

        if (strict || !state.allowYield) {
            for (i = 0, len = params.length; i < len; i += 1) {
                param = params[i];
                if (param.type === Syntax.YieldExpression) {
                    throwUnexpectedToken(lookahead);
                }
            }
        }

        if (options.message === Messages.StrictParamDupe) {
            token = strict ? options.stricted : options.firstRestricted;
            throwUnexpectedToken(token, options.message);
        }

        if (defaultCount === 0) {
            defaults = [];
        }

        return {
            params: params,
            defaults: defaults,
            stricted: options.stricted,
            firstRestricted: options.firstRestricted,
            message: options.message
        };
    }

    function parseArrowFunctionExpression(options, node) {
        var previousStrict, previousAllowYield, body;

        if (hasLineTerminator) {
            tolerateUnexpectedToken(lookahead);
        }
        expect('=>');

        previousStrict = strict;
        previousAllowYield = state.allowYield;
        state.allowYield = true;

        body = parseConciseBody();

        if (strict && options.firstRestricted) {
            throwUnexpectedToken(options.firstRestricted, options.message);
        }
        if (strict && options.stricted) {
            tolerateUnexpectedToken(options.stricted, options.message);
        }

        strict = previousStrict;
        state.allowYield = previousAllowYield;

        return node.finishArrowFunctionExpression(options.params, options.defaults, body, body.type !== Syntax.BlockStatement);
    }

    // ECMA-262 14.4 Yield expression

    function parseYieldExpression() {
        var argument, expr, delegate, previousAllowYield;

        argument = null;
        expr = new Node();
        delegate = false;

        expectKeyword('yield');

        if (!hasLineTerminator) {
            previousAllowYield = state.allowYield;
            state.allowYield = false;
            delegate = match('*');
            if (delegate) {
                lex();
                argument = parseAssignmentExpression();
            } else {
                if (!match(';') && !match('}') && !match(')') && lookahead.type !== Token.EOF) {
                    argument = parseAssignmentExpression();
                }
            }
            state.allowYield = previousAllowYield;
        }

        return expr.finishYieldExpression(argument, delegate);
    }

    // ECMA-262 12.14 Assignment Operators

    function parseAssignmentExpression() {
        var token, expr, right, list, startToken;

        startToken = lookahead;
        token = lookahead;

        if (!state.allowYield && matchKeyword('yield')) {
            return parseYieldExpression();
        }

        expr = parseConditionalExpression();

        if (expr.type === PlaceHolders.ArrowParameterPlaceHolder || match('=>')) {
            isAssignmentTarget = isBindingElement = false;
            list = reinterpretAsCoverFormalsList(expr);

            if (list) {
                firstCoverInitializedNameError = null;
                return parseArrowFunctionExpression(list, new WrappingNode(startToken));
            }

            return expr;
        }

        if (matchAssign()) {
            if (!isAssignmentTarget) {
                tolerateError(Messages.InvalidLHSInAssignment);
            }

            // ECMA-262 12.1.1
            if (strict && expr.type === Syntax.Identifier) {
                if (isRestrictedWord(expr.name)) {
                    tolerateUnexpectedToken(token, Messages.StrictLHSAssignment);
                }
                if (isStrictModeReservedWord(expr.name)) {
                    tolerateUnexpectedToken(token, Messages.StrictReservedWord);
                }
            }

            if (!match('=')) {
                isAssignmentTarget = isBindingElement = false;
            } else {
                reinterpretExpressionAsPattern(expr);
            }

            token = lex();
            right = isolateCoverGrammar(parseAssignmentExpression);
            expr = new WrappingNode(startToken).finishAssignmentExpression(token.value, expr, right);
            firstCoverInitializedNameError = null;
        }

        return expr;
    }

    // ECMA-262 12.15 Comma Operator

    function parseExpression() {
        var expr, startToken = lookahead, expressions;

        expr = isolateCoverGrammar(parseAssignmentExpression);

        if (match(',')) {
            expressions = [expr];

            while (startIndex < length) {
                if (!match(',')) {
                    break;
                }
                lex();
                expressions.push(isolateCoverGrammar(parseAssignmentExpression));
            }

            expr = new WrappingNode(startToken).finishSequenceExpression(expressions);
        }

        return expr;
    }

    // ECMA-262 13.2 Block

    function parseStatementListItem() {
        if (lookahead.type === Token.Keyword) {
            switch (lookahead.value) {
            case 'export':
                if (state.sourceType !== 'module') {
                    tolerateUnexpectedToken(lookahead, Messages.IllegalExportDeclaration);
                }
                return parseExportDeclaration();
            case 'import':
                if (state.sourceType !== 'module') {
                    tolerateUnexpectedToken(lookahead, Messages.IllegalImportDeclaration);
                }
                return parseImportDeclaration();
            case 'const':
                return parseLexicalDeclaration({inFor: false});
            case 'function':
                return parseFunctionDeclaration(new Node());
            case 'class':
                return parseClassDeclaration();
            }
        }

        if (matchKeyword('let') && isLexicalDeclaration()) {
            return parseLexicalDeclaration({inFor: false});
        }

        return parseStatement();
    }

    function parseStatementList() {
        var list = [];
        while (startIndex < length) {
            if (match('}')) {
                break;
            }
            list.push(parseStatementListItem());
        }

        return list;
    }

    function parseBlock() {
        var block, node = new Node();

        expect('{');

        block = parseStatementList();

        expect('}');

        return node.finishBlockStatement(block);
    }

    // ECMA-262 13.3.2 Variable Statement

    function parseVariableIdentifier(kind) {
        var token, node = new Node();

        token = lex();

        if (token.type === Token.Keyword && token.value === 'yield') {
            if (strict) {
                tolerateUnexpectedToken(token, Messages.StrictReservedWord);
            } if (!state.allowYield) {
                throwUnexpectedToken(token);
            }
        } else if (token.type !== Token.Identifier) {
            if (strict && token.type === Token.Keyword && isStrictModeReservedWord(token.value)) {
                tolerateUnexpectedToken(token, Messages.StrictReservedWord);
            } else {
                if (strict || token.value !== 'let' || kind !== 'var') {
                    throwUnexpectedToken(token);
                }
            }
        } else if (state.sourceType === 'module' && token.type === Token.Identifier && token.value === 'await') {
            tolerateUnexpectedToken(token);
        }

        return node.finishIdentifier(token.value);
    }

    function parseVariableDeclaration(options) {
        var init = null, id, node = new Node(), params = [];

        id = parsePattern(params, 'var');

        // ECMA-262 12.2.1
        if (strict && isRestrictedWord(id.name)) {
            tolerateError(Messages.StrictVarName);
        }

        if (match('=')) {
            lex();
            init = isolateCoverGrammar(parseAssignmentExpression);
        } else if (id.type !== Syntax.Identifier && !options.inFor) {
            expect('=');
        }

        return node.finishVariableDeclarator(id, init);
    }

    function parseVariableDeclarationList(options) {
        var opt, list;

        opt = { inFor: options.inFor };
        list = [parseVariableDeclaration(opt)];

        while (match(',')) {
            lex();
            list.push(parseVariableDeclaration(opt));
        }

        return list;
    }

    function parseVariableStatement(node) {
        var declarations;

        expectKeyword('var');

        declarations = parseVariableDeclarationList({ inFor: false });

        consumeSemicolon();

        return node.finishVariableDeclaration(declarations);
    }

    // ECMA-262 13.3.1 Let and Const Declarations

    function parseLexicalBinding(kind, options) {
        var init = null, id, node = new Node(), params = [];

        id = parsePattern(params, kind);

        // ECMA-262 12.2.1
        if (strict && id.type === Syntax.Identifier && isRestrictedWord(id.name)) {
            tolerateError(Messages.StrictVarName);
        }

        if (kind === 'const') {
            if (!matchKeyword('in') && !matchContextualKeyword('of')) {
                expect('=');
                init = isolateCoverGrammar(parseAssignmentExpression);
            }
        } else if ((!options.inFor && id.type !== Syntax.Identifier) || match('=')) {
            expect('=');
            init = isolateCoverGrammar(parseAssignmentExpression);
        }

        return node.finishVariableDeclarator(id, init);
    }

    function parseBindingList(kind, options) {
        var list = [parseLexicalBinding(kind, options)];

        while (match(',')) {
            lex();
            list.push(parseLexicalBinding(kind, options));
        }

        return list;
    }


    function tokenizerState() {
        return {
            index: index,
            lineNumber: lineNumber,
            lineStart: lineStart,
            hasLineTerminator: hasLineTerminator,
            lastIndex: lastIndex,
            lastLineNumber: lastLineNumber,
            lastLineStart: lastLineStart,
            startIndex: startIndex,
            startLineNumber: startLineNumber,
            startLineStart: startLineStart,
            lookahead: lookahead,
            tokenCount: extra.tokens ? extra.tokens.length : 0
        };
    }

    function resetTokenizerState(ts) {
        index = ts.index;
        lineNumber = ts.lineNumber;
        lineStart = ts.lineStart;
        hasLineTerminator = ts.hasLineTerminator;
        lastIndex = ts.lastIndex;
        lastLineNumber = ts.lastLineNumber;
        lastLineStart = ts.lastLineStart;
        startIndex = ts.startIndex;
        startLineNumber = ts.startLineNumber;
        startLineStart = ts.startLineStart;
        lookahead = ts.lookahead;
        if (extra.tokens) {
            extra.tokens.splice(ts.tokenCount, extra.tokens.length);
        }
    }

    function isLexicalDeclaration() {
        var lexical, ts;

        ts = tokenizerState();

        lex();
        lexical = (lookahead.type === Token.Identifier) || match('[') || match('{') ||
            matchKeyword('let') || matchKeyword('yield');

        resetTokenizerState(ts);

        return lexical;
    }

    function parseLexicalDeclaration(options) {
        var kind, declarations, node = new Node();

        kind = lex().value;
        assert(kind === 'let' || kind === 'const', 'Lexical declaration must be either let or const');

        declarations = parseBindingList(kind, options);

        consumeSemicolon();

        return node.finishLexicalDeclaration(declarations, kind);
    }

    function parseRestElement(params) {
        var param, node = new Node();

        lex();

        if (match('{')) {
            throwError(Messages.ObjectPatternAsRestParameter);
        }

        params.push(lookahead);

        param = parseVariableIdentifier();

        if (match('=')) {
            throwError(Messages.DefaultRestParameter);
        }

        if (!match(')')) {
            throwError(Messages.ParameterAfterRestParameter);
        }

        return node.finishRestElement(param);
    }

    // ECMA-262 13.4 Empty Statement

    function parseEmptyStatement(node) {
        expect(';');
        return node.finishEmptyStatement();
    }

    // ECMA-262 12.4 Expression Statement

    function parseExpressionStatement(node) {
        var expr = parseExpression();
        consumeSemicolon();
        return node.finishExpressionStatement(expr);
    }

    // ECMA-262 13.6 If statement

    function parseIfStatement(node) {
        var test, consequent, alternate;

        expectKeyword('if');

        expect('(');

        test = parseExpression();

        expect(')');

        consequent = parseStatement();

        if (matchKeyword('else')) {
            lex();
            alternate = parseStatement();
        } else {
            alternate = null;
        }

        return node.finishIfStatement(test, consequent, alternate);
    }

    // ECMA-262 13.7 Iteration Statements

    function parseDoWhileStatement(node) {
        var body, test, oldInIteration;

        expectKeyword('do');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = parseStatement();

        state.inIteration = oldInIteration;

        expectKeyword('while');

        expect('(');

        test = parseExpression();

        expect(')');

        if (match(';')) {
            lex();
        }

        return node.finishDoWhileStatement(body, test);
    }

    function parseWhileStatement(node) {
        var test, body, oldInIteration;

        expectKeyword('while');

        expect('(');

        test = parseExpression();

        expect(')');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = parseStatement();

        state.inIteration = oldInIteration;

        return node.finishWhileStatement(test, body);
    }

    function parseForStatement(node) {
        var init, forIn, initSeq, initStartToken, test, update, left, right, kind, declarations,
            body, oldInIteration, previousAllowIn = state.allowIn;

        init = test = update = null;
        forIn = true;

        expectKeyword('for');

        expect('(');

        if (match(';')) {
            lex();
        } else {
            if (matchKeyword('var')) {
                init = new Node();
                lex();

                state.allowIn = false;
                declarations = parseVariableDeclarationList({ inFor: true });
                state.allowIn = previousAllowIn;

                if (declarations.length === 1 && matchKeyword('in')) {
                    init = init.finishVariableDeclaration(declarations);
                    lex();
                    left = init;
                    right = parseExpression();
                    init = null;
                } else if (declarations.length === 1 && declarations[0].init === null && matchContextualKeyword('of')) {
                    init = init.finishVariableDeclaration(declarations);
                    lex();
                    left = init;
                    right = parseAssignmentExpression();
                    init = null;
                    forIn = false;
                } else {
                    init = init.finishVariableDeclaration(declarations);
                    expect(';');
                }
            } else if (matchKeyword('const') || matchKeyword('let')) {
                init = new Node();
                kind = lex().value;

                if (!strict && lookahead.value === 'in') {
                    init = init.finishIdentifier(kind);
                    lex();
                    left = init;
                    right = parseExpression();
                    init = null;
                } else {
                    state.allowIn = false;
                    declarations = parseBindingList(kind, {inFor: true});
                    state.allowIn = previousAllowIn;

                    if (declarations.length === 1 && declarations[0].init === null && matchKeyword('in')) {
                        init = init.finishLexicalDeclaration(declarations, kind);
                        lex();
                        left = init;
                        right = parseExpression();
                        init = null;
                    } else if (declarations.length === 1 && declarations[0].init === null && matchContextualKeyword('of')) {
                        init = init.finishLexicalDeclaration(declarations, kind);
                        lex();
                        left = init;
                        right = parseAssignmentExpression();
                        init = null;
                        forIn = false;
                    } else {
                        consumeSemicolon();
                        init = init.finishLexicalDeclaration(declarations, kind);
                    }
                }
            } else {
                initStartToken = lookahead;
                state.allowIn = false;
                init = inheritCoverGrammar(parseAssignmentExpression);
                state.allowIn = previousAllowIn;

                if (matchKeyword('in')) {
                    if (!isAssignmentTarget) {
                        tolerateError(Messages.InvalidLHSInForIn);
                    }

                    lex();
                    reinterpretExpressionAsPattern(init);
                    left = init;
                    right = parseExpression();
                    init = null;
                } else if (matchContextualKeyword('of')) {
                    if (!isAssignmentTarget) {
                        tolerateError(Messages.InvalidLHSInForLoop);
                    }

                    lex();
                    reinterpretExpressionAsPattern(init);
                    left = init;
                    right = parseAssignmentExpression();
                    init = null;
                    forIn = false;
                } else {
                    if (match(',')) {
                        initSeq = [init];
                        while (match(',')) {
                            lex();
                            initSeq.push(isolateCoverGrammar(parseAssignmentExpression));
                        }
                        init = new WrappingNode(initStartToken).finishSequenceExpression(initSeq);
                    }
                    expect(';');
                }
            }
        }

        if (typeof left === 'undefined') {

            if (!match(';')) {
                test = parseExpression();
            }
            expect(';');

            if (!match(')')) {
                update = parseExpression();
            }
        }

        expect(')');

        oldInIteration = state.inIteration;
        state.inIteration = true;

        body = isolateCoverGrammar(parseStatement);

        state.inIteration = oldInIteration;

        return (typeof left === 'undefined') ?
                node.finishForStatement(init, test, update, body) :
                forIn ? node.finishForInStatement(left, right, body) :
                    node.finishForOfStatement(left, right, body);
    }

    // ECMA-262 13.8 The continue statement

    function parseContinueStatement(node) {
        var label = null, key;

        expectKeyword('continue');

        // Optimize the most common form: 'continue;'.
        if (source.charCodeAt(startIndex) === 0x3B) {
            lex();

            if (!state.inIteration) {
                throwError(Messages.IllegalContinue);
            }

            return node.finishContinueStatement(null);
        }

        if (hasLineTerminator) {
            if (!state.inIteration) {
                throwError(Messages.IllegalContinue);
            }

            return node.finishContinueStatement(null);
        }

        if (lookahead.type === Token.Identifier) {
            label = parseVariableIdentifier();

            key = '$' + label.name;
            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
                throwError(Messages.UnknownLabel, label.name);
            }
        }

        consumeSemicolon();

        if (label === null && !state.inIteration) {
            throwError(Messages.IllegalContinue);
        }

        return node.finishContinueStatement(label);
    }

    // ECMA-262 13.9 The break statement

    function parseBreakStatement(node) {
        var label = null, key;

        expectKeyword('break');

        // Catch the very common case first: immediately a semicolon (U+003B).
        if (source.charCodeAt(lastIndex) === 0x3B) {
            lex();

            if (!(state.inIteration || state.inSwitch)) {
                throwError(Messages.IllegalBreak);
            }

            return node.finishBreakStatement(null);
        }

        if (hasLineTerminator) {
            if (!(state.inIteration || state.inSwitch)) {
                throwError(Messages.IllegalBreak);
            }
        } else if (lookahead.type === Token.Identifier) {
            label = parseVariableIdentifier();

            key = '$' + label.name;
            if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
                throwError(Messages.UnknownLabel, label.name);
            }
        }

        consumeSemicolon();

        if (label === null && !(state.inIteration || state.inSwitch)) {
            throwError(Messages.IllegalBreak);
        }

        return node.finishBreakStatement(label);
    }

    // ECMA-262 13.10 The return statement

    function parseReturnStatement(node) {
        var argument = null;

        expectKeyword('return');

        if (!state.inFunctionBody) {
            tolerateError(Messages.IllegalReturn);
        }

        // 'return' followed by a space and an identifier is very common.
        if (source.charCodeAt(lastIndex) === 0x20) {
            if (isIdentifierStart(source.charCodeAt(lastIndex + 1))) {
                argument = parseExpression();
                consumeSemicolon();
                return node.finishReturnStatement(argument);
            }
        }

        if (hasLineTerminator) {
            // HACK
            return node.finishReturnStatement(null);
        }

        if (!match(';')) {
            if (!match('}') && lookahead.type !== Token.EOF) {
                argument = parseExpression();
            }
        }

        consumeSemicolon();

        return node.finishReturnStatement(argument);
    }

    // ECMA-262 13.11 The with statement

    function parseWithStatement(node) {
        var object, body;

        if (strict) {
            tolerateError(Messages.StrictModeWith);
        }

        expectKeyword('with');

        expect('(');

        object = parseExpression();

        expect(')');

        body = parseStatement();

        return node.finishWithStatement(object, body);
    }

    // ECMA-262 13.12 The switch statement

    function parseSwitchCase() {
        var test, consequent = [], statement, node = new Node();

        if (matchKeyword('default')) {
            lex();
            test = null;
        } else {
            expectKeyword('case');
            test = parseExpression();
        }
        expect(':');

        while (startIndex < length) {
            if (match('}') || matchKeyword('default') || matchKeyword('case')) {
                break;
            }
            statement = parseStatementListItem();
            consequent.push(statement);
        }

        return node.finishSwitchCase(test, consequent);
    }

    function parseSwitchStatement(node) {
        var discriminant, cases, clause, oldInSwitch, defaultFound;

        expectKeyword('switch');

        expect('(');

        discriminant = parseExpression();

        expect(')');

        expect('{');

        cases = [];

        if (match('}')) {
            lex();
            return node.finishSwitchStatement(discriminant, cases);
        }

        oldInSwitch = state.inSwitch;
        state.inSwitch = true;
        defaultFound = false;

        while (startIndex < length) {
            if (match('}')) {
                break;
            }
            clause = parseSwitchCase();
            if (clause.test === null) {
                if (defaultFound) {
                    throwError(Messages.MultipleDefaultsInSwitch);
                }
                defaultFound = true;
            }
            cases.push(clause);
        }

        state.inSwitch = oldInSwitch;

        expect('}');

        return node.finishSwitchStatement(discriminant, cases);
    }

    // ECMA-262 13.14 The throw statement

    function parseThrowStatement(node) {
        var argument;

        expectKeyword('throw');

        if (hasLineTerminator) {
            throwError(Messages.NewlineAfterThrow);
        }

        argument = parseExpression();

        consumeSemicolon();

        return node.finishThrowStatement(argument);
    }

    // ECMA-262 13.15 The try statement

    function parseCatchClause() {
        var param, params = [], paramMap = {}, key, i, body, node = new Node();

        expectKeyword('catch');

        expect('(');
        if (match(')')) {
            throwUnexpectedToken(lookahead);
        }

        param = parsePattern(params);
        for (i = 0; i < params.length; i++) {
            key = '$' + params[i].value;
            if (Object.prototype.hasOwnProperty.call(paramMap, key)) {
                tolerateError(Messages.DuplicateBinding, params[i].value);
            }
            paramMap[key] = true;
        }

        // ECMA-262 12.14.1
        if (strict && isRestrictedWord(param.name)) {
            tolerateError(Messages.StrictCatchVariable);
        }

        expect(')');
        body = parseBlock();
        return node.finishCatchClause(param, body);
    }

    function parseTryStatement(node) {
        var block, handler = null, finalizer = null;

        expectKeyword('try');

        block = parseBlock();

        if (matchKeyword('catch')) {
            handler = parseCatchClause();
        }

        if (matchKeyword('finally')) {
            lex();
            finalizer = parseBlock();
        }

        if (!handler && !finalizer) {
            throwError(Messages.NoCatchOrFinally);
        }

        return node.finishTryStatement(block, handler, finalizer);
    }

    // ECMA-262 13.16 The debugger statement

    function parseDebuggerStatement(node) {
        expectKeyword('debugger');

        consumeSemicolon();

        return node.finishDebuggerStatement();
    }

    // 13 Statements

    function parseStatement() {
        var type = lookahead.type,
            expr,
            labeledBody,
            key,
            node;

        if (type === Token.EOF) {
            throwUnexpectedToken(lookahead);
        }

        if (type === Token.Punctuator && lookahead.value === '{') {
            return parseBlock();
        }
        isAssignmentTarget = isBindingElement = true;
        node = new Node();

        if (type === Token.Punctuator) {
            switch (lookahead.value) {
            case ';':
                return parseEmptyStatement(node);
            case '(':
                return parseExpressionStatement(node);
            default:
                break;
            }
        } else if (type === Token.Keyword) {
            switch (lookahead.value) {
            case 'break':
                return parseBreakStatement(node);
            case 'continue':
                return parseContinueStatement(node);
            case 'debugger':
                return parseDebuggerStatement(node);
            case 'do':
                return parseDoWhileStatement(node);
            case 'for':
                return parseForStatement(node);
            case 'function':
                return parseFunctionDeclaration(node);
            case 'if':
                return parseIfStatement(node);
            case 'return':
                return parseReturnStatement(node);
            case 'switch':
                return parseSwitchStatement(node);
            case 'throw':
                return parseThrowStatement(node);
            case 'try':
                return parseTryStatement(node);
            case 'var':
                return parseVariableStatement(node);
            case 'while':
                return parseWhileStatement(node);
            case 'with':
                return parseWithStatement(node);
            default:
                break;
            }
        }

        expr = parseExpression();

        // ECMA-262 12.12 Labelled Statements
        if ((expr.type === Syntax.Identifier) && match(':')) {
            lex();

            key = '$' + expr.name;
            if (Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
                throwError(Messages.Redeclaration, 'Label', expr.name);
            }

            state.labelSet[key] = true;
            labeledBody = parseStatement();
            delete state.labelSet[key];
            return node.finishLabeledStatement(expr, labeledBody);
        }

        consumeSemicolon();

        return node.finishExpressionStatement(expr);
    }

    // ECMA-262 14.1 Function Definition

    function parseFunctionSourceElements() {
        var statement, body = [], token, directive, firstRestricted,
            oldLabelSet, oldInIteration, oldInSwitch, oldInFunctionBody,
            node = new Node();

        expect('{');

        while (startIndex < length) {
            if (lookahead.type !== Token.StringLiteral) {
                break;
            }
            token = lookahead;

            statement = parseStatementListItem();
            body.push(statement);
            if (statement.expression.type !== Syntax.Literal) {
                // this is not directive
                break;
            }
            directive = source.slice(token.start + 1, token.end - 1);
            if (directive === 'use strict') {
                strict = true;
                if (firstRestricted) {
                    tolerateUnexpectedToken(firstRestricted, Messages.StrictOctalLiteral);
                }
            } else {
                if (!firstRestricted && token.octal) {
                    firstRestricted = token;
                }
            }
        }

        oldLabelSet = state.labelSet;
        oldInIteration = state.inIteration;
        oldInSwitch = state.inSwitch;
        oldInFunctionBody = state.inFunctionBody;

        state.labelSet = {};
        state.inIteration = false;
        state.inSwitch = false;
        state.inFunctionBody = true;

        while (startIndex < length) {
            if (match('}')) {
                break;
            }
            body.push(parseStatementListItem());
        }

        expect('}');

        state.labelSet = oldLabelSet;
        state.inIteration = oldInIteration;
        state.inSwitch = oldInSwitch;
        state.inFunctionBody = oldInFunctionBody;

        return node.finishBlockStatement(body);
    }

    function validateParam(options, param, name) {
        var key = '$' + name;
        if (strict) {
            if (isRestrictedWord(name)) {
                options.stricted = param;
                options.message = Messages.StrictParamName;
            }
            if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
                options.stricted = param;
                options.message = Messages.StrictParamDupe;
            }
        } else if (!options.firstRestricted) {
            if (isRestrictedWord(name)) {
                options.firstRestricted = param;
                options.message = Messages.StrictParamName;
            } else if (isStrictModeReservedWord(name)) {
                options.firstRestricted = param;
                options.message = Messages.StrictReservedWord;
            } else if (Object.prototype.hasOwnProperty.call(options.paramSet, key)) {
                options.stricted = param;
                options.message = Messages.StrictParamDupe;
            }
        }
        options.paramSet[key] = true;
    }

    function parseParam(options) {
        var token, param, params = [], i, def;

        token = lookahead;
        if (token.value === '...') {
            param = parseRestElement(params);
            validateParam(options, param.argument, param.argument.name);
            options.params.push(param);
            options.defaults.push(null);
            return false;
        }

        param = parsePatternWithDefault(params);
        for (i = 0; i < params.length; i++) {
            validateParam(options, params[i], params[i].value);
        }

        if (param.type === Syntax.AssignmentPattern) {
            def = param.right;
            param = param.left;
            ++options.defaultCount;
        }

        options.params.push(param);
        options.defaults.push(def);

        return !match(')');
    }

    function parseParams(firstRestricted) {
        var options;

        options = {
            params: [],
            defaultCount: 0,
            defaults: [],
            firstRestricted: firstRestricted
        };

        expect('(');

        if (!match(')')) {
            options.paramSet = {};
            while (startIndex < length) {
                if (!parseParam(options)) {
                    break;
                }
                expect(',');
            }
        }

        expect(')');

        if (options.defaultCount === 0) {
            options.defaults = [];
        }

        return {
            params: options.params,
            defaults: options.defaults,
            stricted: options.stricted,
            firstRestricted: options.firstRestricted,
            message: options.message
        };
    }

    function parseFunctionDeclaration(node, identifierIsOptional) {
        var id = null, params = [], defaults = [], body, token, stricted, tmp, firstRestricted, message, previousStrict,
            isGenerator, previousAllowYield;

        previousAllowYield = state.allowYield;

        expectKeyword('function');

        isGenerator = match('*');
        if (isGenerator) {
            lex();
        }

        if (!identifierIsOptional || !match('(')) {
            token = lookahead;
            id = parseVariableIdentifier();
            if (strict) {
                if (isRestrictedWord(token.value)) {
                    tolerateUnexpectedToken(token, Messages.StrictFunctionName);
                }
            } else {
                if (isRestrictedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictFunctionName;
                } else if (isStrictModeReservedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictReservedWord;
                }
            }
        }

        state.allowYield = !isGenerator;
        tmp = parseParams(firstRestricted);
        params = tmp.params;
        defaults = tmp.defaults;
        stricted = tmp.stricted;
        firstRestricted = tmp.firstRestricted;
        if (tmp.message) {
            message = tmp.message;
        }


        previousStrict = strict;
        body = parseFunctionSourceElements();
        if (strict && firstRestricted) {
            throwUnexpectedToken(firstRestricted, message);
        }
        if (strict && stricted) {
            tolerateUnexpectedToken(stricted, message);
        }

        strict = previousStrict;
        state.allowYield = previousAllowYield;

        return node.finishFunctionDeclaration(id, params, defaults, body, isGenerator);
    }

    function parseFunctionExpression() {
        var token, id = null, stricted, firstRestricted, message, tmp,
            params = [], defaults = [], body, previousStrict, node = new Node(),
            isGenerator, previousAllowYield;

        previousAllowYield = state.allowYield;

        expectKeyword('function');

        isGenerator = match('*');
        if (isGenerator) {
            lex();
        }

        state.allowYield = !isGenerator;
        if (!match('(')) {
            token = lookahead;
            id = (!strict && !isGenerator && matchKeyword('yield')) ? parseNonComputedProperty() : parseVariableIdentifier();
            if (strict) {
                if (isRestrictedWord(token.value)) {
                    tolerateUnexpectedToken(token, Messages.StrictFunctionName);
                }
            } else {
                if (isRestrictedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictFunctionName;
                } else if (isStrictModeReservedWord(token.value)) {
                    firstRestricted = token;
                    message = Messages.StrictReservedWord;
                }
            }
        }

        tmp = parseParams(firstRestricted);
        params = tmp.params;
        defaults = tmp.defaults;
        stricted = tmp.stricted;
        firstRestricted = tmp.firstRestricted;
        if (tmp.message) {
            message = tmp.message;
        }

        previousStrict = strict;
        body = parseFunctionSourceElements();
        if (strict && firstRestricted) {
            throwUnexpectedToken(firstRestricted, message);
        }
        if (strict && stricted) {
            tolerateUnexpectedToken(stricted, message);
        }
        strict = previousStrict;
        state.allowYield = previousAllowYield;

        return node.finishFunctionExpression(id, params, defaults, body, isGenerator);
    }

    // ECMA-262 14.5 Class Definitions

    function parseClassBody() {
        var classBody, token, isStatic, hasConstructor = false, body, method, computed, key;

        classBody = new Node();

        expect('{');
        body = [];
        while (!match('}')) {
            if (match(';')) {
                lex();
            } else {
                method = new Node();
                token = lookahead;
                isStatic = false;
                computed = match('[');
                if (match('*')) {
                    lex();
                } else {
                    key = parseObjectPropertyKey();
                    if (key.name === 'static' && (lookaheadPropertyName() || match('*'))) {
                        token = lookahead;
                        isStatic = true;
                        computed = match('[');
                        if (match('*')) {
                            lex();
                        } else {
                            key = parseObjectPropertyKey();
                        }
                    }
                }
                method = tryParseMethodDefinition(token, key, computed, method);
                if (method) {
                    method['static'] = isStatic; // jscs:ignore requireDotNotation
                    if (method.kind === 'init') {
                        method.kind = 'method';
                    }
                    if (!isStatic) {
                        if (!method.computed && (method.key.name || method.key.value.toString()) === 'constructor') {
                            if (method.kind !== 'method' || !method.method || method.value.generator) {
                                throwUnexpectedToken(token, Messages.ConstructorSpecialMethod);
                            }
                            if (hasConstructor) {
                                throwUnexpectedToken(token, Messages.DuplicateConstructor);
                            } else {
                                hasConstructor = true;
                            }
                            method.kind = 'constructor';
                        }
                    } else {
                        if (!method.computed && (method.key.name || method.key.value.toString()) === 'prototype') {
                            throwUnexpectedToken(token, Messages.StaticPrototype);
                        }
                    }
                    method.type = Syntax.MethodDefinition;
                    delete method.method;
                    delete method.shorthand;
                    body.push(method);
                } else {
                    throwUnexpectedToken(lookahead);
                }
            }
        }
        lex();
        return classBody.finishClassBody(body);
    }

    function parseClassDeclaration(identifierIsOptional) {
        var id = null, superClass = null, classNode = new Node(), classBody, previousStrict = strict;
        strict = true;

        expectKeyword('class');

        if (!identifierIsOptional || lookahead.type === Token.Identifier) {
            id = parseVariableIdentifier();
        }

        if (matchKeyword('extends')) {
            lex();
            superClass = isolateCoverGrammar(parseLeftHandSideExpressionAllowCall);
        }
        classBody = parseClassBody();
        strict = previousStrict;

        return classNode.finishClassDeclaration(id, superClass, classBody);
    }

    function parseClassExpression() {
        var id = null, superClass = null, classNode = new Node(), classBody, previousStrict = strict;
        strict = true;

        expectKeyword('class');

        if (lookahead.type === Token.Identifier) {
            id = parseVariableIdentifier();
        }

        if (matchKeyword('extends')) {
            lex();
            superClass = isolateCoverGrammar(parseLeftHandSideExpressionAllowCall);
        }
        classBody = parseClassBody();
        strict = previousStrict;

        return classNode.finishClassExpression(id, superClass, classBody);
    }

    // ECMA-262 15.2 Modules

    function parseModuleSpecifier() {
        var node = new Node();

        if (lookahead.type !== Token.StringLiteral) {
            throwError(Messages.InvalidModuleSpecifier);
        }
        return node.finishLiteral(lex());
    }

    // ECMA-262 15.2.3 Exports

    function parseExportSpecifier() {
        var exported, local, node = new Node(), def;
        if (matchKeyword('default')) {
            // export {default} from 'something';
            def = new Node();
            lex();
            local = def.finishIdentifier('default');
        } else {
            local = parseVariableIdentifier();
        }
        if (matchContextualKeyword('as')) {
            lex();
            exported = parseNonComputedProperty();
        }
        return node.finishExportSpecifier(local, exported);
    }

    function parseExportNamedDeclaration(node) {
        var declaration = null,
            isExportFromIdentifier,
            src = null, specifiers = [];

        // non-default export
        if (lookahead.type === Token.Keyword) {
            // covers:
            // export var f = 1;
            switch (lookahead.value) {
                case 'let':
                case 'const':
                    declaration = parseLexicalDeclaration({inFor: false});
                    return node.finishExportNamedDeclaration(declaration, specifiers, null);
                case 'var':
                case 'class':
                case 'function':
                    declaration = parseStatementListItem();
                    return node.finishExportNamedDeclaration(declaration, specifiers, null);
            }
        }

        expect('{');
        while (!match('}')) {
            isExportFromIdentifier = isExportFromIdentifier || matchKeyword('default');
            specifiers.push(parseExportSpecifier());
            if (!match('}')) {
                expect(',');
                if (match('}')) {
                    break;
                }
            }
        }
        expect('}');

        if (matchContextualKeyword('from')) {
            // covering:
            // export {default} from 'foo';
            // export {foo} from 'foo';
            lex();
            src = parseModuleSpecifier();
            consumeSemicolon();
        } else if (isExportFromIdentifier) {
            // covering:
            // export {default}; // missing fromClause
            throwError(lookahead.value ?
                    Messages.UnexpectedToken : Messages.MissingFromClause, lookahead.value);
        } else {
            // cover
            // export {foo};
            consumeSemicolon();
        }
        return node.finishExportNamedDeclaration(declaration, specifiers, src);
    }

    function parseExportDefaultDeclaration(node) {
        var declaration = null,
            expression = null;

        // covers:
        // export default ...
        expectKeyword('default');

        if (matchKeyword('function')) {
            // covers:
            // export default function foo () {}
            // export default function () {}
            declaration = parseFunctionDeclaration(new Node(), true);
            return node.finishExportDefaultDeclaration(declaration);
        }
        if (matchKeyword('class')) {
            declaration = parseClassDeclaration(true);
            return node.finishExportDefaultDeclaration(declaration);
        }

        if (matchContextualKeyword('from')) {
            throwError(Messages.UnexpectedToken, lookahead.value);
        }

        // covers:
        // export default {};
        // export default [];
        // export default (1 + 2);
        if (match('{')) {
            expression = parseObjectInitializer();
        } else if (match('[')) {
            expression = parseArrayInitializer();
        } else {
            expression = parseAssignmentExpression();
        }
        consumeSemicolon();
        return node.finishExportDefaultDeclaration(expression);
    }

    function parseExportAllDeclaration(node) {
        var src;

        // covers:
        // export * from 'foo';
        expect('*');
        if (!matchContextualKeyword('from')) {
            throwError(lookahead.value ?
                    Messages.UnexpectedToken : Messages.MissingFromClause, lookahead.value);
        }
        lex();
        src = parseModuleSpecifier();
        consumeSemicolon();

        return node.finishExportAllDeclaration(src);
    }

    function parseExportDeclaration() {
        var node = new Node();
        if (state.inFunctionBody) {
            throwError(Messages.IllegalExportDeclaration);
        }

        expectKeyword('export');

        if (matchKeyword('default')) {
            return parseExportDefaultDeclaration(node);
        }
        if (match('*')) {
            return parseExportAllDeclaration(node);
        }
        return parseExportNamedDeclaration(node);
    }

    // ECMA-262 15.2.2 Imports

    function parseImportSpecifier() {
        // import {<foo as bar>} ...;
        var local, imported, node = new Node();

        imported = parseNonComputedProperty();
        if (matchContextualKeyword('as')) {
            lex();
            local = parseVariableIdentifier();
        }

        return node.finishImportSpecifier(local, imported);
    }

    function parseNamedImports() {
        var specifiers = [];
        // {foo, bar as bas}
        expect('{');
        while (!match('}')) {
            specifiers.push(parseImportSpecifier());
            if (!match('}')) {
                expect(',');
                if (match('}')) {
                    break;
                }
            }
        }
        expect('}');
        return specifiers;
    }

    function parseImportDefaultSpecifier() {
        // import <foo> ...;
        var local, node = new Node();

        local = parseNonComputedProperty();

        return node.finishImportDefaultSpecifier(local);
    }

    function parseImportNamespaceSpecifier() {
        // import <* as foo> ...;
        var local, node = new Node();

        expect('*');
        if (!matchContextualKeyword('as')) {
            throwError(Messages.NoAsAfterImportNamespace);
        }
        lex();
        local = parseNonComputedProperty();

        return node.finishImportNamespaceSpecifier(local);
    }

    function parseImportDeclaration() {
        var specifiers = [], src, node = new Node();

        if (state.inFunctionBody) {
            throwError(Messages.IllegalImportDeclaration);
        }

        expectKeyword('import');

        if (lookahead.type === Token.StringLiteral) {
            // import 'foo';
            src = parseModuleSpecifier();
        } else {

            if (match('{')) {
                // import {bar}
                specifiers = specifiers.concat(parseNamedImports());
            } else if (match('*')) {
                // import * as foo
                specifiers.push(parseImportNamespaceSpecifier());
            } else if (isIdentifierName(lookahead) && !matchKeyword('default')) {
                // import foo
                specifiers.push(parseImportDefaultSpecifier());
                if (match(',')) {
                    lex();
                    if (match('*')) {
                        // import foo, * as foo
                        specifiers.push(parseImportNamespaceSpecifier());
                    } else if (match('{')) {
                        // import foo, {bar}
                        specifiers = specifiers.concat(parseNamedImports());
                    } else {
                        throwUnexpectedToken(lookahead);
                    }
                }
            } else {
                throwUnexpectedToken(lex());
            }

            if (!matchContextualKeyword('from')) {
                throwError(lookahead.value ?
                        Messages.UnexpectedToken : Messages.MissingFromClause, lookahead.value);
            }
            lex();
            src = parseModuleSpecifier();
        }

        consumeSemicolon();
        return node.finishImportDeclaration(specifiers, src);
    }

    // ECMA-262 15.1 Scripts

    function parseScriptBody() {
        var statement, body = [], token, directive, firstRestricted;

        while (startIndex < length) {
            token = lookahead;
            if (token.type !== Token.StringLiteral) {
                break;
            }

            statement = parseStatementListItem();
            body.push(statement);
            if (statement.expression.type !== Syntax.Literal) {
                // this is not directive
                break;
            }
            directive = source.slice(token.start + 1, token.end - 1);
            if (directive === 'use strict') {
                strict = true;
                if (firstRestricted) {
                    tolerateUnexpectedToken(firstRestricted, Messages.StrictOctalLiteral);
                }
            } else {
                if (!firstRestricted && token.octal) {
                    firstRestricted = token;
                }
            }
        }

        while (startIndex < length) {
            statement = parseStatementListItem();
            /* istanbul ignore if */
            if (typeof statement === 'undefined') {
                break;
            }
            body.push(statement);
        }
        return body;
    }

    function parseProgram() {
        var body, node;

        peek();
        node = new Node();

        body = parseScriptBody();
        return node.finishProgram(body, state.sourceType);
    }

    function filterTokenLocation() {
        var i, entry, token, tokens = [];

        for (i = 0; i < extra.tokens.length; ++i) {
            entry = extra.tokens[i];
            token = {
                type: entry.type,
                value: entry.value
            };
            if (entry.regex) {
                token.regex = {
                    pattern: entry.regex.pattern,
                    flags: entry.regex.flags
                };
            }
            if (extra.range) {
                token.range = entry.range;
            }
            if (extra.loc) {
                token.loc = entry.loc;
            }
            tokens.push(token);
        }

        extra.tokens = tokens;
    }

    function tokenize(code, options, delegate) {
        var toString,
            tokens;

        toString = String;
        if (typeof code !== 'string' && !(code instanceof String)) {
            code = toString(code);
        }

        source = code;
        index = 0;
        lineNumber = (source.length > 0) ? 1 : 0;
        lineStart = 0;
        startIndex = index;
        startLineNumber = lineNumber;
        startLineStart = lineStart;
        length = source.length;
        lookahead = null;
        state = {
            allowIn: true,
            allowYield: true,
            labelSet: {},
            inFunctionBody: false,
            inIteration: false,
            inSwitch: false,
            lastCommentStart: -1,
            curlyStack: []
        };

        extra = {};

        // Options matching.
        options = options || {};

        // Of course we collect tokens here.
        options.tokens = true;
        extra.tokens = [];
        extra.tokenValues = [];
        extra.tokenize = true;
        extra.delegate = delegate;

        // The following two fields are necessary to compute the Regex tokens.
        extra.openParenToken = -1;
        extra.openCurlyToken = -1;

        extra.range = (typeof options.range === 'boolean') && options.range;
        extra.loc = (typeof options.loc === 'boolean') && options.loc;

        if (typeof options.comment === 'boolean' && options.comment) {
            extra.comments = [];
        }
        if (typeof options.tolerant === 'boolean' && options.tolerant) {
            extra.errors = [];
        }

        try {
            peek();
            if (lookahead.type === Token.EOF) {
                return extra.tokens;
            }

            lex();
            while (lookahead.type !== Token.EOF) {
                try {
                    lex();
                } catch (lexError) {
                    if (extra.errors) {
                        recordError(lexError);
                        // We have to break on the first error
                        // to avoid infinite loops.
                        break;
                    } else {
                        throw lexError;
                    }
                }
            }

            tokens = extra.tokens;
            if (typeof extra.errors !== 'undefined') {
                tokens.errors = extra.errors;
            }
        } catch (e) {
            throw e;
        } finally {
            extra = {};
        }
        return tokens;
    }

    function parse(code, options) {
        var program, toString;

        toString = String;
        if (typeof code !== 'string' && !(code instanceof String)) {
            code = toString(code);
        }

        source = code;
        index = 0;
        lineNumber = (source.length > 0) ? 1 : 0;
        lineStart = 0;
        startIndex = index;
        startLineNumber = lineNumber;
        startLineStart = lineStart;
        length = source.length;
        lookahead = null;
        state = {
            allowIn: true,
            allowYield: true,
            labelSet: {},
            inFunctionBody: false,
            inIteration: false,
            inSwitch: false,
            lastCommentStart: -1,
            curlyStack: [],
            sourceType: 'script'
        };
        strict = false;

        extra = {};
        if (typeof options !== 'undefined') {
            extra.range = (typeof options.range === 'boolean') && options.range;
            extra.loc = (typeof options.loc === 'boolean') && options.loc;
            extra.attachComment = (typeof options.attachComment === 'boolean') && options.attachComment;

            if (extra.loc && options.source !== null && options.source !== undefined) {
                extra.source = toString(options.source);
            }

            if (typeof options.tokens === 'boolean' && options.tokens) {
                extra.tokens = [];
            }
            if (typeof options.comment === 'boolean' && options.comment) {
                extra.comments = [];
            }
            if (typeof options.tolerant === 'boolean' && options.tolerant) {
                extra.errors = [];
            }
            if (extra.attachComment) {
                extra.range = true;
                extra.comments = [];
                extra.bottomRightStack = [];
                extra.trailingComments = [];
                extra.leadingComments = [];
            }
            if (options.sourceType === 'module') {
                // very restrictive condition for now
                state.sourceType = options.sourceType;
                strict = true;
            }
        }

        try {
            program = parseProgram();
            if (typeof extra.comments !== 'undefined') {
                program.comments = extra.comments;
            }
            if (typeof extra.tokens !== 'undefined') {
                filterTokenLocation();
                program.tokens = extra.tokens;
            }
            if (typeof extra.errors !== 'undefined') {
                program.errors = extra.errors;
            }
        } catch (e) {
            throw e;
        } finally {
            extra = {};
        }

        return program;
    }

    // Sync with *.json manifests.
    exports.version = '2.7.3';

    exports.tokenize = tokenize;

    exports.parse = parse;

    // Deep copy.
    /* istanbul ignore next */
    exports.Syntax = (function () {
        var name, types = {};

        if (typeof Object.create === 'function') {
            types = Object.create(null);
        }

        for (name in Syntax) {
            if (Syntax.hasOwnProperty(name)) {
                types[name] = Syntax[name];
            }
        }

        if (typeof Object.freeze === 'function') {
            Object.freeze(types);
        }

        return types;
    }());

}));
/* vim: set sw=4 ts=4 et tw=80 : */


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var yaml = __webpack_require__(158);


module.exports = yaml;


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var loader = __webpack_require__(160);
var dumper = __webpack_require__(159);


function deprecated(name) {
  return function () {
    throw new Error('Function ' + name + ' is deprecated and cannot be used.');
  };
}


module.exports.Type                = __webpack_require__(6);
module.exports.Schema              = __webpack_require__(18);
module.exports.FAILSAFE_SCHEMA     = __webpack_require__(49);
module.exports.JSON_SCHEMA         = __webpack_require__(75);
module.exports.CORE_SCHEMA         = __webpack_require__(74);
module.exports.DEFAULT_SAFE_SCHEMA = __webpack_require__(26);
module.exports.DEFAULT_FULL_SCHEMA = __webpack_require__(36);
module.exports.load                = loader.load;
module.exports.loadAll             = loader.loadAll;
module.exports.safeLoad            = loader.safeLoad;
module.exports.safeLoadAll         = loader.safeLoadAll;
module.exports.dump                = dumper.dump;
module.exports.safeDump            = dumper.safeDump;
module.exports.YAMLException       = __webpack_require__(25);

// Deprecated schema names from JS-YAML 2.0.x
module.exports.MINIMAL_SCHEMA = __webpack_require__(49);
module.exports.SAFE_SCHEMA    = __webpack_require__(26);
module.exports.DEFAULT_SCHEMA = __webpack_require__(36);

// Deprecated functions from JS-YAML 1.x.x
module.exports.scan           = deprecated('scan');
module.exports.parse          = deprecated('parse');
module.exports.compose        = deprecated('compose');
module.exports.addConstructor = deprecated('addConstructor');


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*eslint-disable no-use-before-define*/

var common              = __webpack_require__(17);
var YAMLException       = __webpack_require__(25);
var DEFAULT_FULL_SCHEMA = __webpack_require__(36);
var DEFAULT_SAFE_SCHEMA = __webpack_require__(26);

var _toString       = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;

var CHAR_TAB                  = 0x09; /* Tab */
var CHAR_LINE_FEED            = 0x0A; /* LF */
var CHAR_CARRIAGE_RETURN      = 0x0D; /* CR */
var CHAR_SPACE                = 0x20; /* Space */
var CHAR_EXCLAMATION          = 0x21; /* ! */
var CHAR_DOUBLE_QUOTE         = 0x22; /* " */
var CHAR_SHARP                = 0x23; /* # */
var CHAR_PERCENT              = 0x25; /* % */
var CHAR_AMPERSAND            = 0x26; /* & */
var CHAR_SINGLE_QUOTE         = 0x27; /* ' */
var CHAR_ASTERISK             = 0x2A; /* * */
var CHAR_COMMA                = 0x2C; /* , */
var CHAR_MINUS                = 0x2D; /* - */
var CHAR_COLON                = 0x3A; /* : */
var CHAR_GREATER_THAN         = 0x3E; /* > */
var CHAR_QUESTION             = 0x3F; /* ? */
var CHAR_COMMERCIAL_AT        = 0x40; /* @ */
var CHAR_LEFT_SQUARE_BRACKET  = 0x5B; /* [ */
var CHAR_RIGHT_SQUARE_BRACKET = 0x5D; /* ] */
var CHAR_GRAVE_ACCENT         = 0x60; /* ` */
var CHAR_LEFT_CURLY_BRACKET   = 0x7B; /* { */
var CHAR_VERTICAL_LINE        = 0x7C; /* | */
var CHAR_RIGHT_CURLY_BRACKET  = 0x7D; /* } */

var ESCAPE_SEQUENCES = {};

ESCAPE_SEQUENCES[0x00]   = '\\0';
ESCAPE_SEQUENCES[0x07]   = '\\a';
ESCAPE_SEQUENCES[0x08]   = '\\b';
ESCAPE_SEQUENCES[0x09]   = '\\t';
ESCAPE_SEQUENCES[0x0A]   = '\\n';
ESCAPE_SEQUENCES[0x0B]   = '\\v';
ESCAPE_SEQUENCES[0x0C]   = '\\f';
ESCAPE_SEQUENCES[0x0D]   = '\\r';
ESCAPE_SEQUENCES[0x1B]   = '\\e';
ESCAPE_SEQUENCES[0x22]   = '\\"';
ESCAPE_SEQUENCES[0x5C]   = '\\\\';
ESCAPE_SEQUENCES[0x85]   = '\\N';
ESCAPE_SEQUENCES[0xA0]   = '\\_';
ESCAPE_SEQUENCES[0x2028] = '\\L';
ESCAPE_SEQUENCES[0x2029] = '\\P';

var DEPRECATED_BOOLEANS_SYNTAX = [
  'y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON',
  'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'
];

function compileStyleMap(schema, map) {
  var result, keys, index, length, tag, style, type;

  if (map === null) return {};

  result = {};
  keys = Object.keys(map);

  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map[tag]);

    if (tag.slice(0, 2) === '!!') {
      tag = 'tag:yaml.org,2002:' + tag.slice(2);
    }

    type = schema.compiledTypeMap[tag];

    if (type && _hasOwnProperty.call(type.styleAliases, style)) {
      style = type.styleAliases[style];
    }

    result[tag] = style;
  }

  return result;
}

function encodeHex(character) {
  var string, handle, length;

  string = character.toString(16).toUpperCase();

  if (character <= 0xFF) {
    handle = 'x';
    length = 2;
  } else if (character <= 0xFFFF) {
    handle = 'u';
    length = 4;
  } else if (character <= 0xFFFFFFFF) {
    handle = 'U';
    length = 8;
  } else {
    throw new YAMLException('code point within a string may not be greater than 0xFFFFFFFF');
  }

  return '\\' + handle + common.repeat('0', length - string.length) + string;
}

function State(options) {
  this.schema       = options['schema'] || DEFAULT_FULL_SCHEMA;
  this.indent       = Math.max(1, (options['indent'] || 2));
  this.skipInvalid  = options['skipInvalid'] || false;
  this.flowLevel    = (common.isNothing(options['flowLevel']) ? -1 : options['flowLevel']);
  this.styleMap     = compileStyleMap(this.schema, options['styles'] || null);
  this.sortKeys     = options['sortKeys'] || false;
  this.lineWidth    = options['lineWidth'] || 80;
  this.noRefs       = options['noRefs'] || false;
  this.noCompatMode = options['noCompatMode'] || false;

  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;

  this.tag = null;
  this.result = '';

  this.duplicates = [];
  this.usedDuplicates = null;
}

function indentString(string, spaces) {
  var ind = common.repeat(' ', spaces),
      position = 0,
      next = -1,
      result = '',
      line,
      length = string.length;

  while (position < length) {
    next = string.indexOf('\n', position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }

    if (line.length && line !== '\n') result += ind;

    result += line;
  }

  return result;
}

function generateNextLine(state, level) {
  return '\n' + common.repeat(' ', state.indent * level);
}

function testImplicitResolving(state, str) {
  var index, length, type;

  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type = state.implicitTypes[index];

    if (type.resolve(str)) {
      return true;
    }
  }

  return false;
}

function StringBuilder(source) {
  this.source = source;
  this.result = '';
  this.checkpoint = 0;
}

StringBuilder.prototype.takeUpTo = function (position) {
  var er;

  if (position < this.checkpoint) {
    er = new Error('position should be > checkpoint');
    er.position = position;
    er.checkpoint = this.checkpoint;
    throw er;
  }

  this.result += this.source.slice(this.checkpoint, position);
  this.checkpoint = position;
  return this;
};

StringBuilder.prototype.escapeChar = function () {
  var character, esc;

  character = this.source.charCodeAt(this.checkpoint);
  esc = ESCAPE_SEQUENCES[character] || encodeHex(character);
  this.result += esc;
  this.checkpoint += 1;

  return this;
};

StringBuilder.prototype.finish = function () {
  if (this.source.length > this.checkpoint) {
    this.takeUpTo(this.source.length);
  }
};

function writeScalar(state, object, level, iskey) {
  var simple, first, spaceWrap, folded, literal, single, double,
      sawLineFeed, linePosition, longestLine, indent, max, character,
      position, escapeSeq, hexEsc, previous, lineLength, modifier,
      trailingLineBreaks, result;

  if (object.length === 0) {
    state.dump = "''";
    return;
  }

  if (!state.noCompatMode &&
      DEPRECATED_BOOLEANS_SYNTAX.indexOf(object) !== -1) {
    state.dump = "'" + object + "'";
    return;
  }

  simple = true;
  first = object.length ? object.charCodeAt(0) : 0;
  spaceWrap = (CHAR_SPACE === first ||
               CHAR_SPACE === object.charCodeAt(object.length - 1));

  // Simplified check for restricted first characters
  // http://www.yaml.org/spec/1.2/spec.html#ns-plain-first%28c%29
  if (CHAR_MINUS         === first ||
      CHAR_QUESTION      === first ||
      CHAR_COMMERCIAL_AT === first ||
      CHAR_GRAVE_ACCENT  === first) {
    simple = false;
  }

  // Can only use > and | if not wrapped in spaces or is not a key.
  // Also, don't use if in flow mode.
  if (spaceWrap || (state.flowLevel > -1 && state.flowLevel <= level)) {
    if (spaceWrap) simple = false;

    folded = false;
    literal = false;
  } else {
    folded = !iskey;
    literal = !iskey;
  }

  single = true;
  double = new StringBuilder(object);

  sawLineFeed = false;
  linePosition = 0;
  longestLine = 0;

  indent = state.indent * level;
  max = state.lineWidth;

  // Replace -1 with biggest ingeger number according to
  // http://ecma262-5.com/ELS5_HTML.htm#Section_8.5
  if (max === -1) max = 9007199254740991;

  if (indent < 40) max -= indent;
  else max = 40;

  for (position = 0; position < object.length; position++) {
    character = object.charCodeAt(position);
    if (simple) {
      // Characters that can never appear in the simple scalar
      if (!simpleChar(character)) {
        simple = false;
      } else {
        // Still simple.  If we make it all the way through like
        // this, then we can just dump the string as-is.
        continue;
      }
    }

    if (single && character === CHAR_SINGLE_QUOTE) {
      single = false;
    }

    escapeSeq = ESCAPE_SEQUENCES[character];
    hexEsc = needsHexEscape(character);

    if (!escapeSeq && !hexEsc) {
      continue;
    }

    if (character !== CHAR_LINE_FEED &&
        character !== CHAR_DOUBLE_QUOTE &&
        character !== CHAR_SINGLE_QUOTE) {
      folded = false;
      literal = false;
    } else if (character === CHAR_LINE_FEED) {
      sawLineFeed = true;
      single = false;
      if (position > 0) {
        previous = object.charCodeAt(position - 1);
        if (previous === CHAR_SPACE) {
          literal = false;
          folded = false;
        }
      }
      if (folded) {
        lineLength = position - linePosition;
        linePosition = position;
        if (lineLength > longestLine) longestLine = lineLength;
      }
    }

    if (character !== CHAR_DOUBLE_QUOTE) single = false;

    double.takeUpTo(position);
    double.escapeChar();
  }

  if (simple && testImplicitResolving(state, object)) simple = false;

  modifier = '';
  if (folded || literal) {
    trailingLineBreaks = 0;
    if (object.charCodeAt(object.length - 1) === CHAR_LINE_FEED) {
      trailingLineBreaks += 1;
      if (object.charCodeAt(object.length - 2) === CHAR_LINE_FEED) {
        trailingLineBreaks += 1;
      }
    }

    if (trailingLineBreaks === 0) modifier = '-';
    else if (trailingLineBreaks === 2) modifier = '+';
  }

  if (literal && longestLine < max || state.tag !== null) {
    folded = false;
  }

  // If it's literally one line, then don't bother with the literal.
  // We may still want to do a fold, though, if it's a super long line.
  if (!sawLineFeed) literal = false;

  if (simple) {
    state.dump = object;
  } else if (single) {
    state.dump = '\'' + object + '\'';
  } else if (folded) {
    result = fold(object, max);
    state.dump = '>' + modifier + '\n' + indentString(result, indent);
  } else if (literal) {
    if (!modifier) object = object.replace(/\n$/, '');
    state.dump = '|' + modifier + '\n' + indentString(object, indent);
  } else if (double) {
    double.finish();
    state.dump = '"' + double.result + '"';
  } else {
    throw new Error('Failed to dump scalar value');
  }

  return;
}

// The `trailing` var is a regexp match of any trailing `\n` characters.
//
// There are three cases we care about:
//
// 1. One trailing `\n` on the string.  Just use `|` or `>`.
//    This is the assumed default. (trailing = null)
// 2. No trailing `\n` on the string.  Use `|-` or `>-` to "chomp" the end.
// 3. More than one trailing `\n` on the string.  Use `|+` or `>+`.
//
// In the case of `>+`, these line breaks are *not* doubled (like the line
// breaks within the string), so it's important to only end with the exact
// same number as we started.
function fold(object, max) {
  var result = '',
      position = 0,
      length = object.length,
      trailing = /\n+$/.exec(object),
      newLine;

  if (trailing) {
    length = trailing.index + 1;
  }

  while (position < length) {
    newLine = object.indexOf('\n', position);
    if (newLine > length || newLine === -1) {
      if (result) result += '\n\n';
      result += foldLine(object.slice(position, length), max);
      position = length;

    } else {
      if (result) result += '\n\n';
      result += foldLine(object.slice(position, newLine), max);
      position = newLine + 1;
    }
  }

  if (trailing && trailing[0] !== '\n') result += trailing[0];

  return result;
}

function foldLine(line, max) {
  if (line === '') return line;

  var foldRe = /[^\s] [^\s]/g,
      result = '',
      prevMatch = 0,
      foldStart = 0,
      match = foldRe.exec(line),
      index,
      foldEnd,
      folded;

  while (match) {
    index = match.index;

    // when we cross the max len, if the previous match would've
    // been ok, use that one, and carry on.  If there was no previous
    // match on this fold section, then just have a long line.
    if (index - foldStart > max) {
      if (prevMatch !== foldStart) foldEnd = prevMatch;
      else foldEnd = index;

      if (result) result += '\n';
      folded = line.slice(foldStart, foldEnd);
      result += folded;
      foldStart = foldEnd + 1;
    }
    prevMatch = index + 1;
    match = foldRe.exec(line);
  }

  if (result) result += '\n';

  // if we end up with one last word at the end, then the last bit might
  // be slightly bigger than we wanted, because we exited out of the loop.
  if (foldStart !== prevMatch && line.length - foldStart > max) {
    result += line.slice(foldStart, prevMatch) + '\n' +
              line.slice(prevMatch + 1);
  } else {
    result += line.slice(foldStart);
  }

  return result;
}

// Returns true if character can be found in a simple scalar
function simpleChar(character) {
  return CHAR_TAB                  !== character &&
         CHAR_LINE_FEED            !== character &&
         CHAR_CARRIAGE_RETURN      !== character &&
         CHAR_COMMA                !== character &&
         CHAR_LEFT_SQUARE_BRACKET  !== character &&
         CHAR_RIGHT_SQUARE_BRACKET !== character &&
         CHAR_LEFT_CURLY_BRACKET   !== character &&
         CHAR_RIGHT_CURLY_BRACKET  !== character &&
         CHAR_SHARP                !== character &&
         CHAR_AMPERSAND            !== character &&
         CHAR_ASTERISK             !== character &&
         CHAR_EXCLAMATION          !== character &&
         CHAR_VERTICAL_LINE        !== character &&
         CHAR_GREATER_THAN         !== character &&
         CHAR_SINGLE_QUOTE         !== character &&
         CHAR_DOUBLE_QUOTE         !== character &&
         CHAR_PERCENT              !== character &&
         CHAR_COLON                !== character &&
         !ESCAPE_SEQUENCES[character]            &&
         !needsHexEscape(character);
}

// Returns true if the character code needs to be escaped.
function needsHexEscape(character) {
  return !((0x00020 <= character && character <= 0x00007E) ||
           (character === 0x00085)                         ||
           (0x000A0 <= character && character <= 0x00D7FF) ||
           (0x0E000 <= character && character <= 0x00FFFD) ||
           (0x10000 <= character && character <= 0x10FFFF));
}

function writeFlowSequence(state, level, object) {
  var _result = '',
      _tag    = state.tag,
      index,
      length;

  for (index = 0, length = object.length; index < length; index += 1) {
    // Write only valid elements.
    if (writeNode(state, level, object[index], false, false)) {
      if (index !== 0) _result += ', ';
      _result += state.dump;
    }
  }

  state.tag = _tag;
  state.dump = '[' + _result + ']';
}

function writeBlockSequence(state, level, object, compact) {
  var _result = '',
      _tag    = state.tag,
      index,
      length;

  for (index = 0, length = object.length; index < length; index += 1) {
    // Write only valid elements.
    if (writeNode(state, level + 1, object[index], true, true)) {
      if (!compact || index !== 0) {
        _result += generateNextLine(state, level);
      }
      _result += '- ' + state.dump;
    }
  }

  state.tag = _tag;
  state.dump = _result || '[]'; // Empty sequence if no valid values.
}

function writeFlowMapping(state, level, object) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      pairBuffer;

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';

    if (index !== 0) pairBuffer += ', ';

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (!writeNode(state, level, objectKey, false, false)) {
      continue; // Skip this pair because of invalid key;
    }

    if (state.dump.length > 1024) pairBuffer += '? ';

    pairBuffer += state.dump + ': ';

    if (!writeNode(state, level, objectValue, false, false)) {
      continue; // Skip this pair because of invalid value.
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = '{' + _result + '}';
}

function writeBlockMapping(state, level, object, compact) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      explicitPair,
      pairBuffer;

  // Allow sorting keys so that the output file is deterministic
  if (state.sortKeys === true) {
    // Default sorting
    objectKeyList.sort();
  } else if (typeof state.sortKeys === 'function') {
    // Custom sort function
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    // Something is wrong
    throw new YAMLException('sortKeys must be a boolean or a function');
  }

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';

    if (!compact || index !== 0) {
      pairBuffer += generateNextLine(state, level);
    }

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue; // Skip this pair because of invalid key.
    }

    explicitPair = (state.tag !== null && state.tag !== '?') ||
                   (state.dump && state.dump.length > 1024);

    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += '?';
      } else {
        pairBuffer += '? ';
      }
    }

    pairBuffer += state.dump;

    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }

    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue; // Skip this pair because of invalid value.
    }

    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ':';
    } else {
      pairBuffer += ': ';
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = _result || '{}'; // Empty mapping if no valid pairs.
}

function detectType(state, object, explicit) {
  var _result, typeList, index, length, type, style;

  typeList = explicit ? state.explicitTypes : state.implicitTypes;

  for (index = 0, length = typeList.length; index < length; index += 1) {
    type = typeList[index];

    if ((type.instanceOf  || type.predicate) &&
        (!type.instanceOf || ((typeof object === 'object') && (object instanceof type.instanceOf))) &&
        (!type.predicate  || type.predicate(object))) {

      state.tag = explicit ? type.tag : '?';

      if (type.represent) {
        style = state.styleMap[type.tag] || type.defaultStyle;

        if (_toString.call(type.represent) === '[object Function]') {
          _result = type.represent(object, style);
        } else if (_hasOwnProperty.call(type.represent, style)) {
          _result = type.represent[style](object, style);
        } else {
          throw new YAMLException('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
        }

        state.dump = _result;
      }

      return true;
    }
  }

  return false;
}

// Serializes `object` and writes it to global `result`.
// Returns true on success, or false on invalid object.
//
function writeNode(state, level, object, block, compact, iskey) {
  state.tag = null;
  state.dump = object;

  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }

  var type = _toString.call(state.dump);

  if (block) {
    block = (state.flowLevel < 0 || state.flowLevel > level);
  }

  var objectOrArray = type === '[object Object]' || type === '[object Array]',
      duplicateIndex,
      duplicate;

  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }

  if ((state.tag !== null && state.tag !== '?') || duplicate || (state.indent !== 2 && level > 0)) {
    compact = false;
  }

  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = '*ref_' + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type === '[object Object]') {
      if (block && (Object.keys(state.dump).length !== 0)) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object Array]') {
      if (block && (state.dump.length !== 0)) {
        writeBlockSequence(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object String]') {
      if (state.tag !== '?') {
        writeScalar(state, state.dump, level, iskey);
      }
    } else {
      if (state.skipInvalid) return false;
      throw new YAMLException('unacceptable kind of an object to dump ' + type);
    }

    if (state.tag !== null && state.tag !== '?') {
      state.dump = '!<' + state.tag + '> ' + state.dump;
    }
  }

  return true;
}

function getDuplicateReferences(object, state) {
  var objects = [],
      duplicatesIndexes = [],
      index,
      length;

  inspectNode(object, objects, duplicatesIndexes);

  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}

function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList,
      index,
      length;

  if (object !== null && typeof object === 'object') {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);

      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);

        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}

function dump(input, options) {
  options = options || {};

  var state = new State(options);

  if (!state.noRefs) getDuplicateReferences(input, state);

  if (writeNode(state, 0, input, true, true)) return state.dump + '\n';

  return '';
}

function safeDump(input, options) {
  return dump(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
}

module.exports.dump     = dump;
module.exports.safeDump = safeDump;


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*eslint-disable max-len,no-use-before-define*/

var common              = __webpack_require__(17);
var YAMLException       = __webpack_require__(25);
var Mark                = __webpack_require__(161);
var DEFAULT_SAFE_SCHEMA = __webpack_require__(26);
var DEFAULT_FULL_SCHEMA = __webpack_require__(36);


var _hasOwnProperty = Object.prototype.hasOwnProperty;


var CONTEXT_FLOW_IN   = 1;
var CONTEXT_FLOW_OUT  = 2;
var CONTEXT_BLOCK_IN  = 3;
var CONTEXT_BLOCK_OUT = 4;


var CHOMPING_CLIP  = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP  = 3;


var PATTERN_NON_PRINTABLE         = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS       = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE            = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI               = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;


function is_EOL(c) {
  return (c === 0x0A/* LF */) || (c === 0x0D/* CR */);
}

function is_WHITE_SPACE(c) {
  return (c === 0x09/* Tab */) || (c === 0x20/* Space */);
}

function is_WS_OR_EOL(c) {
  return (c === 0x09/* Tab */) ||
         (c === 0x20/* Space */) ||
         (c === 0x0A/* LF */) ||
         (c === 0x0D/* CR */);
}

function is_FLOW_INDICATOR(c) {
  return c === 0x2C/* , */ ||
         c === 0x5B/* [ */ ||
         c === 0x5D/* ] */ ||
         c === 0x7B/* { */ ||
         c === 0x7D/* } */;
}

function fromHexCode(c) {
  var lc;

  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  /*eslint-disable no-bitwise*/
  lc = c | 0x20;

  if ((0x61/* a */ <= lc) && (lc <= 0x66/* f */)) {
    return lc - 0x61 + 10;
  }

  return -1;
}

function escapedHexLen(c) {
  if (c === 0x78/* x */) { return 2; }
  if (c === 0x75/* u */) { return 4; }
  if (c === 0x55/* U */) { return 8; }
  return 0;
}

function fromDecimalCode(c) {
  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  return -1;
}

function simpleEscapeSequence(c) {
  return (c === 0x30/* 0 */) ? '\x00' :
        (c === 0x61/* a */) ? '\x07' :
        (c === 0x62/* b */) ? '\x08' :
        (c === 0x74/* t */) ? '\x09' :
        (c === 0x09/* Tab */) ? '\x09' :
        (c === 0x6E/* n */) ? '\x0A' :
        (c === 0x76/* v */) ? '\x0B' :
        (c === 0x66/* f */) ? '\x0C' :
        (c === 0x72/* r */) ? '\x0D' :
        (c === 0x65/* e */) ? '\x1B' :
        (c === 0x20/* Space */) ? ' ' :
        (c === 0x22/* " */) ? '\x22' :
        (c === 0x2F/* / */) ? '/' :
        (c === 0x5C/* \ */) ? '\x5C' :
        (c === 0x4E/* N */) ? '\x85' :
        (c === 0x5F/* _ */) ? '\xA0' :
        (c === 0x4C/* L */) ? '\u2028' :
        (c === 0x50/* P */) ? '\u2029' : '';
}

function charFromCodepoint(c) {
  if (c <= 0xFFFF) {
    return String.fromCharCode(c);
  }
  // Encode UTF-16 surrogate pair
  // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
  return String.fromCharCode(((c - 0x010000) >> 10) + 0xD800,
                             ((c - 0x010000) & 0x03FF) + 0xDC00);
}

var simpleEscapeCheck = new Array(256); // integer, for fast access
var simpleEscapeMap = new Array(256);
for (var i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}


function State(input, options) {
  this.input = input;

  this.filename  = options['filename']  || null;
  this.schema    = options['schema']    || DEFAULT_FULL_SCHEMA;
  this.onWarning = options['onWarning'] || null;
  this.legacy    = options['legacy']    || false;
  this.json      = options['json']      || false;
  this.listener  = options['listener']  || null;

  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap       = this.schema.compiledTypeMap;

  this.length     = input.length;
  this.position   = 0;
  this.line       = 0;
  this.lineStart  = 0;
  this.lineIndent = 0;

  this.documents = [];

  /*
  this.version;
  this.checkLineBreaks;
  this.tagMap;
  this.anchorMap;
  this.tag;
  this.anchor;
  this.kind;
  this.result;*/

}


function generateError(state, message) {
  return new YAMLException(
    message,
    new Mark(state.filename, state.input, state.position, state.line, (state.position - state.lineStart)));
}

function throwError(state, message) {
  throw generateError(state, message);
}

function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}


var directiveHandlers = {

  YAML: function handleYamlDirective(state, name, args) {

    var match, major, minor;

    if (state.version !== null) {
      throwError(state, 'duplication of %YAML directive');
    }

    if (args.length !== 1) {
      throwError(state, 'YAML directive accepts exactly one argument');
    }

    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);

    if (match === null) {
      throwError(state, 'ill-formed argument of the YAML directive');
    }

    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);

    if (major !== 1) {
      throwError(state, 'unacceptable YAML version of the document');
    }

    state.version = args[0];
    state.checkLineBreaks = (minor < 2);

    if (minor !== 1 && minor !== 2) {
      throwWarning(state, 'unsupported YAML version of the document');
    }
  },

  TAG: function handleTagDirective(state, name, args) {

    var handle, prefix;

    if (args.length !== 2) {
      throwError(state, 'TAG directive accepts exactly two arguments');
    }

    handle = args[0];
    prefix = args[1];

    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
    }

    if (_hasOwnProperty.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }

    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
    }

    state.tagMap[handle] = prefix;
  }
};


function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;

  if (start < end) {
    _result = state.input.slice(start, end);

    if (checkJson) {
      for (_position = 0, _length = _result.length;
           _position < _length;
           _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 0x09 ||
              (0x20 <= _character && _character <= 0x10FFFF))) {
          throwError(state, 'expected valid JSON character');
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, 'the stream contains non-printable characters');
    }

    state.result += _result;
  }
}

function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;

  if (!common.isObject(source)) {
    throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
  }

  sourceKeys = Object.keys(source);

  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];

    if (!_hasOwnProperty.call(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}

function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode) {
  var index, quantity;

  keyNode = String(keyNode);

  if (_result === null) {
    _result = {};
  }

  if (keyTag === 'tag:yaml.org,2002:merge') {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json &&
        !_hasOwnProperty.call(overridableKeys, keyNode) &&
        _hasOwnProperty.call(_result, keyNode)) {
      throwError(state, 'duplicated mapping key');
    }
    _result[keyNode] = valueNode;
    delete overridableKeys[keyNode];
  }

  return _result;
}

function readLineBreak(state) {
  var ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x0A/* LF */) {
    state.position++;
  } else if (ch === 0x0D/* CR */) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 0x0A/* LF */) {
      state.position++;
    }
  } else {
    throwError(state, 'a line break is expected');
  }

  state.line += 1;
  state.lineStart = state.position;
}

function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0,
      ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    if (allowComments && ch === 0x23/* # */) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0x0A/* LF */ && ch !== 0x0D/* CR */ && ch !== 0);
    }

    if (is_EOL(ch)) {
      readLineBreak(state);

      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;

      while (ch === 0x20/* Space */) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }

  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, 'deficient indentation');
  }

  return lineBreaks;
}

function testDocumentSeparator(state) {
  var _position = state.position,
      ch;

  ch = state.input.charCodeAt(_position);

  // Condition state.position === state.lineStart is tested
  // in parent on each call, for efficiency. No needs to test here again.
  if ((ch === 0x2D/* - */ || ch === 0x2E/* . */) &&
      ch === state.input.charCodeAt(_position + 1) &&
      ch === state.input.charCodeAt(_position + 2)) {

    _position += 3;

    ch = state.input.charCodeAt(_position);

    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }

  return false;
}

function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += ' ';
  } else if (count > 1) {
    state.result += common.repeat('\n', count - 1);
  }
}


function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding,
      following,
      captureStart,
      captureEnd,
      hasPendingContent,
      _line,
      _lineStart,
      _lineIndent,
      _kind = state.kind,
      _result = state.result,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (is_WS_OR_EOL(ch)      ||
      is_FLOW_INDICATOR(ch) ||
      ch === 0x23/* # */    ||
      ch === 0x26/* & */    ||
      ch === 0x2A/* * */    ||
      ch === 0x21/* ! */    ||
      ch === 0x7C/* | */    ||
      ch === 0x3E/* > */    ||
      ch === 0x27/* ' */    ||
      ch === 0x22/* " */    ||
      ch === 0x25/* % */    ||
      ch === 0x40/* @ */    ||
      ch === 0x60/* ` */) {
    return false;
  }

  if (ch === 0x3F/* ? */ || ch === 0x2D/* - */) {
    following = state.input.charCodeAt(state.position + 1);

    if (is_WS_OR_EOL(following) ||
        withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }

  state.kind = 'scalar';
  state.result = '';
  captureStart = captureEnd = state.position;
  hasPendingContent = false;

  while (ch !== 0) {
    if (ch === 0x3A/* : */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following) ||
          withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }

    } else if (ch === 0x23/* # */) {
      preceding = state.input.charCodeAt(state.position - 1);

      if (is_WS_OR_EOL(preceding)) {
        break;
      }

    } else if ((state.position === state.lineStart && testDocumentSeparator(state)) ||
               withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;

    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);

      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }

    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }

    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }

    ch = state.input.charCodeAt(++state.position);
  }

  captureSegment(state, captureStart, captureEnd, false);

  if (state.result) {
    return true;
  }

  state.kind = _kind;
  state.result = _result;
  return false;
}

function readSingleQuotedScalar(state, nodeIndent) {
  var ch,
      captureStart, captureEnd;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x27/* ' */) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x27/* ' */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (ch === 0x27/* ' */) {
        captureStart = captureEnd = state.position;
        state.position++;
      } else {
        return true;
      }

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a single quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a single quoted scalar');
}

function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart,
      captureEnd,
      hexLength,
      hexResult,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x22/* " */) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x22/* " */) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;

    } else if (ch === 0x5C/* \ */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);

        // TODO: rework to inline fn with no type cast?
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;

      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;

        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);

          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;

          } else {
            throwError(state, 'expected hexadecimal character');
          }
        }

        state.result += charFromCodepoint(hexResult);

        state.position++;

      } else {
        throwError(state, 'unknown escape sequence');
      }

      captureStart = captureEnd = state.position;

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a double quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a double quoted scalar');
}

function readFlowCollection(state, nodeIndent) {
  var readNext = true,
      _line,
      _tag     = state.tag,
      _result,
      _anchor  = state.anchor,
      following,
      terminator,
      isPair,
      isExplicitPair,
      isMapping,
      overridableKeys = {},
      keyNode,
      keyTag,
      valueNode,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x5B/* [ */) {
    terminator = 0x5D;/* ] */
    isMapping = false;
    _result = [];
  } else if (ch === 0x7B/* { */) {
    terminator = 0x7D;/* } */
    isMapping = true;
    _result = {};
  } else {
    return false;
  }

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(++state.position);

  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? 'mapping' : 'sequence';
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, 'missed comma between flow collection entries');
    }

    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;

    if (ch === 0x3F/* ? */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if ((isExplicitPair || state.line === _line) && ch === 0x3A/* : */) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }

    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode));
    } else {
      _result.push(keyNode);
    }

    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === 0x2C/* , */) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }

  throwError(state, 'unexpected end of the stream within a flow collection');
}

function readBlockScalar(state, nodeIndent) {
  var captureStart,
      folding,
      chomping       = CHOMPING_CLIP,
      detectedIndent = false,
      textIndent     = nodeIndent,
      emptyLines     = 0,
      atMoreIndented = false,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x7C/* | */) {
    folding = false;
  } else if (ch === 0x3E/* > */) {
    folding = true;
  } else {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';

  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);

    if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
      if (CHOMPING_CLIP === chomping) {
        chomping = (ch === 0x2B/* + */) ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, 'repeat of a chomping mode identifier');
      }

    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, 'repeat of an indentation width identifier');
      }

    } else {
      break;
    }
  }

  if (is_WHITE_SPACE(ch)) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (is_WHITE_SPACE(ch));

    if (ch === 0x23/* # */) {
      do { ch = state.input.charCodeAt(++state.position); }
      while (!is_EOL(ch) && (ch !== 0));
    }
  }

  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;

    ch = state.input.charCodeAt(state.position);

    while ((!detectedIndent || state.lineIndent < textIndent) &&
           (ch === 0x20/* Space */)) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }

    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }

    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }

    // End of the scalar.
    if (state.lineIndent < textIndent) {

      // Perform the chomping.
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat('\n', emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (detectedIndent) { // i.e. only if the scalar is not empty.
          state.result += '\n';
        }
      }

      // Break this `while` cycle and go to the funciton's epilogue.
      break;
    }

    // Folded style: use fancy rules to handle line breaks.
    if (folding) {

      // Lines starting with white space characters (more-indented lines) are not folded.
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        state.result += common.repeat('\n', emptyLines + 1);

      // End of more-indented block.
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat('\n', emptyLines + 1);

      // Just one line break - perceive as the same line.
      } else if (emptyLines === 0) {
        if (detectedIndent) { // i.e. only if we have already read some scalar content.
          state.result += ' ';
        }

      // Several line breaks - perceive as different lines.
      } else {
        state.result += common.repeat('\n', emptyLines);
      }

    // Literal style: just add exact number of line breaks between content lines.
    } else if (detectedIndent) {
      // If current line isn't the first one - count line break from the last content line.
      state.result += common.repeat('\n', emptyLines + 1);
    } else {
      // In case of the first content line - count only empty lines.
      state.result += common.repeat('\n', emptyLines);
    }

    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;

    while (!is_EOL(ch) && (ch !== 0)) {
      ch = state.input.charCodeAt(++state.position);
    }

    captureSegment(state, captureStart, state.position, false);
  }

  return true;
}

function readBlockSequence(state, nodeIndent) {
  var _line,
      _tag      = state.tag,
      _anchor   = state.anchor,
      _result   = [],
      following,
      detected  = false,
      ch;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {

    if (ch !== 0x2D/* - */) {
      break;
    }

    following = state.input.charCodeAt(state.position + 1);

    if (!is_WS_OR_EOL(following)) {
      break;
    }

    detected = true;
    state.position++;

    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
      throwError(state, 'bad indentation of a sequence entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'sequence';
    state.result = _result;
    return true;
  }
  return false;
}

function readBlockMapping(state, nodeIndent, flowIndent) {
  var following,
      allowCompact,
      _line,
      _tag          = state.tag,
      _anchor       = state.anchor,
      _result       = {},
      overridableKeys = {},
      keyTag        = null,
      keyNode       = null,
      valueNode     = null,
      atExplicitKey = false,
      detected      = false,
      ch;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line; // Save the current line.

    //
    // Explicit notation case. There are two separate blocks:
    // first for the key (denoted by "?") and second for the value (denoted by ":")
    //
    if ((ch === 0x3F/* ? */ || ch === 0x3A/* : */) && is_WS_OR_EOL(following)) {

      if (ch === 0x3F/* ? */) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
          keyTag = keyNode = valueNode = null;
        }

        detected = true;
        atExplicitKey = true;
        allowCompact = true;

      } else if (atExplicitKey) {
        // i.e. 0x3A/* : */ === character after the explicit key.
        atExplicitKey = false;
        allowCompact = true;

      } else {
        throwError(state, 'incomplete explicit mapping pair; a key node is missed');
      }

      state.position += 1;
      ch = following;

    //
    // Implicit notation case. Flow-style node as the key first, then ":", and the value.
    //
    } else if (composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {

      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);

        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }

        if (ch === 0x3A/* : */) {
          ch = state.input.charCodeAt(++state.position);

          if (!is_WS_OR_EOL(ch)) {
            throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
          }

          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
            keyTag = keyNode = valueNode = null;
          }

          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;

        } else if (detected) {
          throwError(state, 'can not read an implicit mapping pair; a colon is missed');

        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true; // Keep the result of `composeNode`.
        }

      } else if (detected) {
        throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');

      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true; // Keep the result of `composeNode`.
      }

    } else {
      break; // Reading is done. Go to the epilogue.
    }

    //
    // Common reading code for both explicit and implicit notations.
    //
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }

      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode);
        keyTag = keyNode = valueNode = null;
      }

      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }

    if (state.lineIndent > nodeIndent && (ch !== 0)) {
      throwError(state, 'bad indentation of a mapping entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  //
  // Epilogue.
  //

  // Special case: last mapping's node contains only the key in explicit notation.
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
  }

  // Expose the resulting mapping.
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'mapping';
    state.result = _result;
  }

  return detected;
}

function readTagProperty(state) {
  var _position,
      isVerbatim = false,
      isNamed    = false,
      tagHandle,
      tagName,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x21/* ! */) return false;

  if (state.tag !== null) {
    throwError(state, 'duplication of a tag property');
  }

  ch = state.input.charCodeAt(++state.position);

  if (ch === 0x3C/* < */) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);

  } else if (ch === 0x21/* ! */) {
    isNamed = true;
    tagHandle = '!!';
    ch = state.input.charCodeAt(++state.position);

  } else {
    tagHandle = '!';
  }

  _position = state.position;

  if (isVerbatim) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (ch !== 0 && ch !== 0x3E/* > */);

    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, 'unexpected end of the stream within a verbatim tag');
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {

      if (ch === 0x21/* ! */) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);

          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, 'named tag handle cannot contain such characters');
          }

          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, 'tag suffix cannot contain exclamation marks');
        }
      }

      ch = state.input.charCodeAt(++state.position);
    }

    tagName = state.input.slice(_position, state.position);

    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, 'tag suffix cannot contain flow indicator characters');
    }
  }

  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, 'tag name cannot contain such characters: ' + tagName);
  }

  if (isVerbatim) {
    state.tag = tagName;

  } else if (_hasOwnProperty.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;

  } else if (tagHandle === '!') {
    state.tag = '!' + tagName;

  } else if (tagHandle === '!!') {
    state.tag = 'tag:yaml.org,2002:' + tagName;

  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }

  return true;
}

function readAnchorProperty(state) {
  var _position,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x26/* & */) return false;

  if (state.anchor !== null) {
    throwError(state, 'duplication of an anchor property');
  }

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an anchor node must contain at least one character');
  }

  state.anchor = state.input.slice(_position, state.position);
  return true;
}

function readAlias(state) {
  var _position, alias,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x2A/* * */) return false;

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an alias node must contain at least one character');
  }

  alias = state.input.slice(_position, state.position);

  if (!state.anchorMap.hasOwnProperty(alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }

  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}

function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles,
      allowBlockScalars,
      allowBlockCollections,
      indentStatus = 1, // 1: this>parent, 0: this=parent, -1: this<parent
      atNewLine  = false,
      hasContent = false,
      typeIndex,
      typeQuantity,
      type,
      flowIndent,
      blockIndent;

  if (state.listener !== null) {
    state.listener('open', state);
  }

  state.tag    = null;
  state.anchor = null;
  state.kind   = null;
  state.result = null;

  allowBlockStyles = allowBlockScalars = allowBlockCollections =
    CONTEXT_BLOCK_OUT === nodeContext ||
    CONTEXT_BLOCK_IN  === nodeContext;

  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;

      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }

  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;

        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }

  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }

  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }

    blockIndent = state.position - state.lineStart;

    if (indentStatus === 1) {
      if (allowBlockCollections &&
          (readBlockSequence(state, blockIndent) ||
           readBlockMapping(state, blockIndent, flowIndent)) ||
          readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if ((allowBlockScalars && readBlockScalar(state, flowIndent)) ||
            readSingleQuotedScalar(state, flowIndent) ||
            readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;

        } else if (readAlias(state)) {
          hasContent = true;

          if (state.tag !== null || state.anchor !== null) {
            throwError(state, 'alias node should not have any properties');
          }

        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;

          if (state.tag === null) {
            state.tag = '?';
          }
        }

        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      // Special case: block sequences are allowed to have same indentation level as the parent.
      // http://www.yaml.org/spec/1.2/spec.html#id2799784
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }

  if (state.tag !== null && state.tag !== '!') {
    if (state.tag === '?') {
      for (typeIndex = 0, typeQuantity = state.implicitTypes.length;
           typeIndex < typeQuantity;
           typeIndex += 1) {
        type = state.implicitTypes[typeIndex];

        // Implicit resolving is not allowed for non-scalar types, and '?'
        // non-specific tag is only assigned to plain scalars. So, it isn't
        // needed to check for 'kind' conformity.

        if (type.resolve(state.result)) { // `state.result` updated in resolver if matched
          state.result = type.construct(state.result);
          state.tag = type.tag;
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
          break;
        }
      }
    } else if (_hasOwnProperty.call(state.typeMap, state.tag)) {
      type = state.typeMap[state.tag];

      if (state.result !== null && type.kind !== state.kind) {
        throwError(state, 'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
      }

      if (!type.resolve(state.result)) { // `state.result` updated in resolver if matched
        throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
      } else {
        state.result = type.construct(state.result);
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else {
      throwError(state, 'unknown tag !<' + state.tag + '>');
    }
  }

  if (state.listener !== null) {
    state.listener('close', state);
  }
  return state.tag !== null ||  state.anchor !== null || hasContent;
}

function readDocument(state) {
  var documentStart = state.position,
      _position,
      directiveName,
      directiveArgs,
      hasDirectives = false,
      ch;

  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = {};
  state.anchorMap = {};

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if (state.lineIndent > 0 || ch !== 0x25/* % */) {
      break;
    }

    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;

    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];

    if (directiveName.length < 1) {
      throwError(state, 'directive name must not be less than one character in length');
    }

    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      if (ch === 0x23/* # */) {
        do { ch = state.input.charCodeAt(++state.position); }
        while (ch !== 0 && !is_EOL(ch));
        break;
      }

      if (is_EOL(ch)) break;

      _position = state.position;

      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      directiveArgs.push(state.input.slice(_position, state.position));
    }

    if (ch !== 0) readLineBreak(state);

    if (_hasOwnProperty.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }

  skipSeparationSpace(state, true, -1);

  if (state.lineIndent === 0 &&
      state.input.charCodeAt(state.position)     === 0x2D/* - */ &&
      state.input.charCodeAt(state.position + 1) === 0x2D/* - */ &&
      state.input.charCodeAt(state.position + 2) === 0x2D/* - */) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);

  } else if (hasDirectives) {
    throwError(state, 'directives end mark is expected');
  }

  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);

  if (state.checkLineBreaks &&
      PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, 'non-ASCII line breaks are interpreted as content');
  }

  state.documents.push(state.result);

  if (state.position === state.lineStart && testDocumentSeparator(state)) {

    if (state.input.charCodeAt(state.position) === 0x2E/* . */) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }

  if (state.position < (state.length - 1)) {
    throwError(state, 'end of the stream or a document separator is expected');
  } else {
    return;
  }
}


function loadDocuments(input, options) {
  input = String(input);
  options = options || {};

  if (input.length !== 0) {

    // Add tailing `\n` if not exists
    if (input.charCodeAt(input.length - 1) !== 0x0A/* LF */ &&
        input.charCodeAt(input.length - 1) !== 0x0D/* CR */) {
      input += '\n';
    }

    // Strip BOM
    if (input.charCodeAt(0) === 0xFEFF) {
      input = input.slice(1);
    }
  }

  var state = new State(input, options);

  // Use 0 as string terminator. That significantly simplifies bounds check.
  state.input += '\0';

  while (state.input.charCodeAt(state.position) === 0x20/* Space */) {
    state.lineIndent += 1;
    state.position += 1;
  }

  while (state.position < (state.length - 1)) {
    readDocument(state);
  }

  return state.documents;
}


function loadAll(input, iterator, options) {
  var documents = loadDocuments(input, options), index, length;

  for (index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}


function load(input, options) {
  var documents = loadDocuments(input, options);

  if (documents.length === 0) {
    /*eslint-disable no-undefined*/
    return undefined;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new YAMLException('expected a single document in the stream, but found more');
}


function safeLoadAll(input, output, options) {
  loadAll(input, output, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
}


function safeLoad(input, options) {
  return load(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
}


module.exports.loadAll     = loadAll;
module.exports.load        = load;
module.exports.safeLoadAll = safeLoadAll;
module.exports.safeLoad    = safeLoad;


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var common = __webpack_require__(17);


function Mark(name, buffer, position, line, column) {
  this.name     = name;
  this.buffer   = buffer;
  this.position = position;
  this.line     = line;
  this.column   = column;
}


Mark.prototype.getSnippet = function getSnippet(indent, maxLength) {
  var head, start, tail, end, snippet;

  if (!this.buffer) return null;

  indent = indent || 4;
  maxLength = maxLength || 75;

  head = '';
  start = this.position;

  while (start > 0 && '\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(start - 1)) === -1) {
    start -= 1;
    if (this.position - start > (maxLength / 2 - 1)) {
      head = ' ... ';
      start += 5;
      break;
    }
  }

  tail = '';
  end = this.position;

  while (end < this.buffer.length && '\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(end)) === -1) {
    end += 1;
    if (end - this.position > (maxLength / 2 - 1)) {
      tail = ' ... ';
      end -= 5;
      break;
    }
  }

  snippet = this.buffer.slice(start, end);

  return common.repeat(' ', indent) + head + snippet + tail + '\n' +
         common.repeat(' ', indent + this.position - start + head.length) + '^';
};


Mark.prototype.toString = function toString(compact) {
  var snippet, where = '';

  if (this.name) {
    where += 'in "' + this.name + '" ';
  }

  where += 'at line ' + (this.line + 1) + ', column ' + (this.column + 1);

  if (!compact) {
    snippet = this.getSnippet();

    if (snippet) {
      where += ':\n' + snippet;
    }
  }

  return where;
};


module.exports = Mark;


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*eslint-disable no-bitwise*/

// A trick for browserified version.
// Since we make browserifier to ignore `buffer` module, NodeBuffer will be undefined
var NodeBuffer = __webpack_require__(185).Buffer;
var Type       = __webpack_require__(6);


// [ 64, 65, 66 ] -> [ padding, CR, LF ]
var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';


function resolveYamlBinary(data) {
  if (data === null) return false;

  var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;

  // Convert one by one.
  for (idx = 0; idx < max; idx++) {
    code = map.indexOf(data.charAt(idx));

    // Skip CR/LF
    if (code > 64) continue;

    // Fail on illegal characters
    if (code < 0) return false;

    bitlen += 6;
  }

  // If there are any bits left, source was corrupted
  return (bitlen % 8) === 0;
}

function constructYamlBinary(data) {
  var idx, tailbits,
      input = data.replace(/[\r\n=]/g, ''), // remove CR/LF & padding to simplify scan
      max = input.length,
      map = BASE64_MAP,
      bits = 0,
      result = [];

  // Collect by 6*4 bits (3 bytes)

  for (idx = 0; idx < max; idx++) {
    if ((idx % 4 === 0) && idx) {
      result.push((bits >> 16) & 0xFF);
      result.push((bits >> 8) & 0xFF);
      result.push(bits & 0xFF);
    }

    bits = (bits << 6) | map.indexOf(input.charAt(idx));
  }

  // Dump tail

  tailbits = (max % 4) * 6;

  if (tailbits === 0) {
    result.push((bits >> 16) & 0xFF);
    result.push((bits >> 8) & 0xFF);
    result.push(bits & 0xFF);
  } else if (tailbits === 18) {
    result.push((bits >> 10) & 0xFF);
    result.push((bits >> 2) & 0xFF);
  } else if (tailbits === 12) {
    result.push((bits >> 4) & 0xFF);
  }

  // Wrap into Buffer for NodeJS and leave Array for browser
  if (NodeBuffer) return new NodeBuffer(result);

  return result;
}

function representYamlBinary(object /*, style*/) {
  var result = '', bits = 0, idx, tail,
      max = object.length,
      map = BASE64_MAP;

  // Convert every three bytes to 4 ASCII characters.

  for (idx = 0; idx < max; idx++) {
    if ((idx % 3 === 0) && idx) {
      result += map[(bits >> 18) & 0x3F];
      result += map[(bits >> 12) & 0x3F];
      result += map[(bits >> 6) & 0x3F];
      result += map[bits & 0x3F];
    }

    bits = (bits << 8) + object[idx];
  }

  // Dump tail

  tail = max % 3;

  if (tail === 0) {
    result += map[(bits >> 18) & 0x3F];
    result += map[(bits >> 12) & 0x3F];
    result += map[(bits >> 6) & 0x3F];
    result += map[bits & 0x3F];
  } else if (tail === 2) {
    result += map[(bits >> 10) & 0x3F];
    result += map[(bits >> 4) & 0x3F];
    result += map[(bits << 2) & 0x3F];
    result += map[64];
  } else if (tail === 1) {
    result += map[(bits >> 2) & 0x3F];
    result += map[(bits << 4) & 0x3F];
    result += map[64];
    result += map[64];
  }

  return result;
}

function isBinary(object) {
  return NodeBuffer && NodeBuffer.isBuffer(object);
}

module.exports = new Type('tag:yaml.org,2002:binary', {
  kind: 'scalar',
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(6);

function resolveYamlBoolean(data) {
  if (data === null) return false;

  var max = data.length;

  return (max === 4 && (data === 'true' || data === 'True' || data === 'TRUE')) ||
         (max === 5 && (data === 'false' || data === 'False' || data === 'FALSE'));
}

function constructYamlBoolean(data) {
  return data === 'true' ||
         data === 'True' ||
         data === 'TRUE';
}

function isBoolean(object) {
  return Object.prototype.toString.call(object) === '[object Boolean]';
}

module.exports = new Type('tag:yaml.org,2002:bool', {
  kind: 'scalar',
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function (object) { return object ? 'true' : 'false'; },
    uppercase: function (object) { return object ? 'TRUE' : 'FALSE'; },
    camelcase: function (object) { return object ? 'True' : 'False'; }
  },
  defaultStyle: 'lowercase'
});


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var common = __webpack_require__(17);
var Type   = __webpack_require__(6);

var YAML_FLOAT_PATTERN = new RegExp(
  '^(?:[-+]?(?:[0-9][0-9_]*)\\.[0-9_]*(?:[eE][-+][0-9]+)?' +
  '|\\.[0-9_]+(?:[eE][-+][0-9]+)?' +
  '|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*' +
  '|[-+]?\\.(?:inf|Inf|INF)' +
  '|\\.(?:nan|NaN|NAN))$');

function resolveYamlFloat(data) {
  if (data === null) return false;

  if (!YAML_FLOAT_PATTERN.test(data)) return false;

  return true;
}

function constructYamlFloat(data) {
  var value, sign, base, digits;

  value  = data.replace(/_/g, '').toLowerCase();
  sign   = value[0] === '-' ? -1 : 1;
  digits = [];

  if ('+-'.indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }

  if (value === '.inf') {
    return (sign === 1) ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;

  } else if (value === '.nan') {
    return NaN;

  } else if (value.indexOf(':') >= 0) {
    value.split(':').forEach(function (v) {
      digits.unshift(parseFloat(v, 10));
    });

    value = 0.0;
    base = 1;

    digits.forEach(function (d) {
      value += d * base;
      base *= 60;
    });

    return sign * value;

  }
  return sign * parseFloat(value, 10);
}


var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;

function representYamlFloat(object, style) {
  var res;

  if (isNaN(object)) {
    switch (style) {
      case 'lowercase': return '.nan';
      case 'uppercase': return '.NAN';
      case 'camelcase': return '.NaN';
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase': return '.inf';
      case 'uppercase': return '.INF';
      case 'camelcase': return '.Inf';
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase': return '-.inf';
      case 'uppercase': return '-.INF';
      case 'camelcase': return '-.Inf';
    }
  } else if (common.isNegativeZero(object)) {
    return '-0.0';
  }

  res = object.toString(10);

  // JS stringifier can build scientific format without dots: 5e-100,
  // while YAML requres dot: 5.e-100. Fix it with simple hack

  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace('e', '.e') : res;
}

function isFloat(object) {
  return (Object.prototype.toString.call(object) === '[object Number]') &&
         (object % 1 !== 0 || common.isNegativeZero(object));
}

module.exports = new Type('tag:yaml.org,2002:float', {
  kind: 'scalar',
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: 'lowercase'
});


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var common = __webpack_require__(17);
var Type   = __webpack_require__(6);

function isHexCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) ||
         ((0x41/* A */ <= c) && (c <= 0x46/* F */)) ||
         ((0x61/* a */ <= c) && (c <= 0x66/* f */));
}

function isOctCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x37/* 7 */));
}

function isDecCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */));
}

function resolveYamlInteger(data) {
  if (data === null) return false;

  var max = data.length,
      index = 0,
      hasDigits = false,
      ch;

  if (!max) return false;

  ch = data[index];

  // sign
  if (ch === '-' || ch === '+') {
    ch = data[++index];
  }

  if (ch === '0') {
    // 0
    if (index + 1 === max) return true;
    ch = data[++index];

    // base 2, base 8, base 16

    if (ch === 'b') {
      // base 2
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (ch !== '0' && ch !== '1') return false;
        hasDigits = true;
      }
      return hasDigits;
    }


    if (ch === 'x') {
      // base 16
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits;
    }

    // base 8
    for (; index < max; index++) {
      ch = data[index];
      if (ch === '_') continue;
      if (!isOctCode(data.charCodeAt(index))) return false;
      hasDigits = true;
    }
    return hasDigits;
  }

  // base 10 (except 0) or base 60

  for (; index < max; index++) {
    ch = data[index];
    if (ch === '_') continue;
    if (ch === ':') break;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }

  if (!hasDigits) return false;

  // if !base60 - done;
  if (ch !== ':') return true;

  // base60 almost not used, no needs to optimize
  return /^(:[0-5]?[0-9])+$/.test(data.slice(index));
}

function constructYamlInteger(data) {
  var value = data, sign = 1, ch, base, digits = [];

  if (value.indexOf('_') !== -1) {
    value = value.replace(/_/g, '');
  }

  ch = value[0];

  if (ch === '-' || ch === '+') {
    if (ch === '-') sign = -1;
    value = value.slice(1);
    ch = value[0];
  }

  if (value === '0') return 0;

  if (ch === '0') {
    if (value[1] === 'b') return sign * parseInt(value.slice(2), 2);
    if (value[1] === 'x') return sign * parseInt(value, 16);
    return sign * parseInt(value, 8);
  }

  if (value.indexOf(':') !== -1) {
    value.split(':').forEach(function (v) {
      digits.unshift(parseInt(v, 10));
    });

    value = 0;
    base = 1;

    digits.forEach(function (d) {
      value += (d * base);
      base *= 60;
    });

    return sign * value;

  }

  return sign * parseInt(value, 10);
}

function isInteger(object) {
  return (Object.prototype.toString.call(object)) === '[object Number]' &&
         (object % 1 === 0 && !common.isNegativeZero(object));
}

module.exports = new Type('tag:yaml.org,2002:int', {
  kind: 'scalar',
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary:      function (object) { return '0b' + object.toString(2); },
    octal:       function (object) { return '0'  + object.toString(8); },
    decimal:     function (object) { return        object.toString(10); },
    hexadecimal: function (object) { return '0x' + object.toString(16).toUpperCase(); }
  },
  defaultStyle: 'decimal',
  styleAliases: {
    binary:      [ 2,  'bin' ],
    octal:       [ 8,  'oct' ],
    decimal:     [ 10, 'dec' ],
    hexadecimal: [ 16, 'hex' ]
  }
});


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var require;

var esprima;

// Browserified version does not have esprima
//
// 1. For node.js just require module as deps
// 2. For browser try to require mudule via external AMD system.
//    If not found - try to fallback to window.esprima. If not
//    found too - then fail to parse.
//
try {
  // workaround to exclude package from browserify list.
  var _require = require;
  esprima = __webpack_require__(156);
} catch (_) {
  /*global window */
  if (typeof window !== 'undefined') esprima = window.esprima;
}

var Type = __webpack_require__(6);

function resolveJavascriptFunction(data) {
  if (data === null) return false;

  try {
    var source = '(' + data + ')',
        ast    = esprima.parse(source, { range: true });

    if (ast.type                    !== 'Program'             ||
        ast.body.length             !== 1                     ||
        ast.body[0].type            !== 'ExpressionStatement' ||
        ast.body[0].expression.type !== 'FunctionExpression') {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

function constructJavascriptFunction(data) {
  /*jslint evil:true*/

  var source = '(' + data + ')',
      ast    = esprima.parse(source, { range: true }),
      params = [],
      body;

  if (ast.type                    !== 'Program'             ||
      ast.body.length             !== 1                     ||
      ast.body[0].type            !== 'ExpressionStatement' ||
      ast.body[0].expression.type !== 'FunctionExpression') {
    throw new Error('Failed to resolve function');
  }

  ast.body[0].expression.params.forEach(function (param) {
    params.push(param.name);
  });

  body = ast.body[0].expression.body.range;

  // Esprima's ranges include the first '{' and the last '}' characters on
  // function expressions. So cut them out.
  /*eslint-disable no-new-func*/
  return new Function(params, source.slice(body[0] + 1, body[1] - 1));
}

function representJavascriptFunction(object /*, style*/) {
  return object.toString();
}

function isFunction(object) {
  return Object.prototype.toString.call(object) === '[object Function]';
}

module.exports = new Type('tag:yaml.org,2002:js/function', {
  kind: 'scalar',
  resolve: resolveJavascriptFunction,
  construct: constructJavascriptFunction,
  predicate: isFunction,
  represent: representJavascriptFunction
});


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(6);

function resolveJavascriptRegExp(data) {
  if (data === null) return false;
  if (data.length === 0) return false;

  var regexp = data,
      tail   = /\/([gim]*)$/.exec(data),
      modifiers = '';

  // if regexp starts with '/' it can have modifiers and must be properly closed
  // `/foo/gim` - modifiers tail can be maximum 3 chars
  if (regexp[0] === '/') {
    if (tail) modifiers = tail[1];

    if (modifiers.length > 3) return false;
    // if expression starts with /, is should be properly terminated
    if (regexp[regexp.length - modifiers.length - 1] !== '/') return false;
  }

  return true;
}

function constructJavascriptRegExp(data) {
  var regexp = data,
      tail   = /\/([gim]*)$/.exec(data),
      modifiers = '';

  // `/foo/gim` - tail can be maximum 4 chars
  if (regexp[0] === '/') {
    if (tail) modifiers = tail[1];
    regexp = regexp.slice(1, regexp.length - modifiers.length - 1);
  }

  return new RegExp(regexp, modifiers);
}

function representJavascriptRegExp(object /*, style*/) {
  var result = '/' + object.source + '/';

  if (object.global) result += 'g';
  if (object.multiline) result += 'm';
  if (object.ignoreCase) result += 'i';

  return result;
}

function isRegExp(object) {
  return Object.prototype.toString.call(object) === '[object RegExp]';
}

module.exports = new Type('tag:yaml.org,2002:js/regexp', {
  kind: 'scalar',
  resolve: resolveJavascriptRegExp,
  construct: constructJavascriptRegExp,
  predicate: isRegExp,
  represent: representJavascriptRegExp
});


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(6);

function resolveJavascriptUndefined() {
  return true;
}

function constructJavascriptUndefined() {
  /*eslint-disable no-undefined*/
  return undefined;
}

function representJavascriptUndefined() {
  return '';
}

function isUndefined(object) {
  return typeof object === 'undefined';
}

module.exports = new Type('tag:yaml.org,2002:js/undefined', {
  kind: 'scalar',
  resolve: resolveJavascriptUndefined,
  construct: constructJavascriptUndefined,
  predicate: isUndefined,
  represent: representJavascriptUndefined
});


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(6);

module.exports = new Type('tag:yaml.org,2002:map', {
  kind: 'mapping',
  construct: function (data) { return data !== null ? data : {}; }
});


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(6);

function resolveYamlMerge(data) {
  return data === '<<' || data === null;
}

module.exports = new Type('tag:yaml.org,2002:merge', {
  kind: 'scalar',
  resolve: resolveYamlMerge
});


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(6);

function resolveYamlNull(data) {
  if (data === null) return true;

  var max = data.length;

  return (max === 1 && data === '~') ||
         (max === 4 && (data === 'null' || data === 'Null' || data === 'NULL'));
}

function constructYamlNull() {
  return null;
}

function isNull(object) {
  return object === null;
}

module.exports = new Type('tag:yaml.org,2002:null', {
  kind: 'scalar',
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function () { return '~';    },
    lowercase: function () { return 'null'; },
    uppercase: function () { return 'NULL'; },
    camelcase: function () { return 'Null'; }
  },
  defaultStyle: 'lowercase'
});


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(6);

var _hasOwnProperty = Object.prototype.hasOwnProperty;
var _toString       = Object.prototype.toString;

function resolveYamlOmap(data) {
  if (data === null) return true;

  var objectKeys = [], index, length, pair, pairKey, pairHasKey,
      object = data;

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;

    if (_toString.call(pair) !== '[object Object]') return false;

    for (pairKey in pair) {
      if (_hasOwnProperty.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;
        else return false;
      }
    }

    if (!pairHasKey) return false;

    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
    else return false;
  }

  return true;
}

function constructYamlOmap(data) {
  return data !== null ? data : [];
}

module.exports = new Type('tag:yaml.org,2002:omap', {
  kind: 'sequence',
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(6);

var _toString = Object.prototype.toString;

function resolveYamlPairs(data) {
  if (data === null) return true;

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    if (_toString.call(pair) !== '[object Object]') return false;

    keys = Object.keys(pair);

    if (keys.length !== 1) return false;

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return true;
}

function constructYamlPairs(data) {
  if (data === null) return [];

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    keys = Object.keys(pair);

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return result;
}

module.exports = new Type('tag:yaml.org,2002:pairs', {
  kind: 'sequence',
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(6);

module.exports = new Type('tag:yaml.org,2002:seq', {
  kind: 'sequence',
  construct: function (data) { return data !== null ? data : []; }
});


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(6);

var _hasOwnProperty = Object.prototype.hasOwnProperty;

function resolveYamlSet(data) {
  if (data === null) return true;

  var key, object = data;

  for (key in object) {
    if (_hasOwnProperty.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }

  return true;
}

function constructYamlSet(data) {
  return data !== null ? data : {};
}

module.exports = new Type('tag:yaml.org,2002:set', {
  kind: 'mapping',
  resolve: resolveYamlSet,
  construct: constructYamlSet
});


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(6);

module.exports = new Type('tag:yaml.org,2002:str', {
  kind: 'scalar',
  construct: function (data) { return data !== null ? data : ''; }
});


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Type = __webpack_require__(6);

var YAML_DATE_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9])'                    + // [2] month
  '-([0-9][0-9])$');                   // [3] day

var YAML_TIMESTAMP_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9]?)'                   + // [2] month
  '-([0-9][0-9]?)'                   + // [3] day
  '(?:[Tt]|[ \\t]+)'                 + // ...
  '([0-9][0-9]?)'                    + // [4] hour
  ':([0-9][0-9])'                    + // [5] minute
  ':([0-9][0-9])'                    + // [6] second
  '(?:\\.([0-9]*))?'                 + // [7] fraction
  '(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' + // [8] tz [9] tz_sign [10] tz_hour
  '(?::([0-9][0-9]))?))?$');           // [11] tz_minute

function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}

function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0,
      delta = null, tz_hour, tz_minute, date;

  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);

  if (match === null) throw new Error('Date resolve error');

  // match: [1] year [2] month [3] day

  year = +(match[1]);
  month = +(match[2]) - 1; // JS month starts with 0
  day = +(match[3]);

  if (!match[4]) { // no hour
    return new Date(Date.UTC(year, month, day));
  }

  // match: [4] hour [5] minute [6] second [7] fraction

  hour = +(match[4]);
  minute = +(match[5]);
  second = +(match[6]);

  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) { // milli-seconds
      fraction += '0';
    }
    fraction = +fraction;
  }

  // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

  if (match[9]) {
    tz_hour = +(match[10]);
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
    if (match[9] === '-') delta = -delta;
  }

  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));

  if (delta) date.setTime(date.getTime() - delta);

  return date;
}

function representYamlTimestamp(object /*, style*/) {
  return object.toISOString();
}

module.exports = new Type('tag:yaml.org,2002:timestamp', {
  kind: 'scalar',
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return punycode;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(184)(module), __webpack_require__(183)))

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(179);
exports.encode = exports.stringify = __webpack_require__(180);


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),
/* 183 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 184 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 185 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _stringify = __webpack_require__(37);

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(10);

var _createClass3 = _interopRequireDefault(_createClass2);

var _class, _class2, _temp;

var _PawShims = __webpack_require__(50);

var _apiFlowConfig = __webpack_require__(19);

var _apiFlow = __webpack_require__(77);

var _apiFlow2 = _interopRequireDefault(_apiFlow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SwaggerGenerator = (0, _PawShims.registerCodeGenerator)(_class = (_temp = _class2 = function () {
  function SwaggerGenerator() {
    (0, _classCallCheck3.default)(this, SwaggerGenerator);
  }

  (0, _createClass3.default)(SwaggerGenerator, [{
    key: 'generate',


    /* eslint-disable no-unused-vars */
    value: function generate(context, reqs, opts) {
      /* eslint-enable no-unused-vars */
      try {
        var options = { context: context, reqs: reqs, source: { format: 'paw', version: 'v3.0' }, target: _apiFlowConfig.target };
        var serialized = _apiFlow2.default.serialize(_apiFlow2.default.parse({ options: options }));
        return serialized;
      } catch (e) {
        /* eslint-disable no-console */
        console.error(this.constructor.title, 'generation failed with error:', e, e.stack, (0, _stringify2.default)(e, null, '  '));
        /* eslint-enable no-console */
        throw e;
      }
    }
  }]);
  return SwaggerGenerator;
}(), _class2.identifier = _apiFlowConfig.target.identifier, _class2.title = _apiFlowConfig.target.humanTitle, _class2.help = 'https://github.com/luckymarmot/API-Flow', _class2.languageHighlighter = 'json', _class2.fileExtension = 'json', _temp)) || _class;

exports.default = SwaggerGenerator;

/***/ })
/******/ ]);
});