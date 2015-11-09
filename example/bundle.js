(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var xhr = require('xhr');
var finder = require('../index');
var _ = require('../util');

var emitter;
var xhrCnt = 0;

module.exports = createExample;


function createExample(container) {
  emitter = finder(container, remoteSource, {
    createItemContent: createItemContent
  });

  // scroll to the right if necessary
  emitter.on('column-created', function columnCreated() {
    container.scrollLeft = container.scrollWidth - container.clientWidth;
  });
}

function remoteSource(parent, cfg, callback) {
  var loading = createSimpleColumn(
    'Loading...', ['fa', 'fa-refresh', 'fa-spin']);
  var xhrUid = ++xhrCnt;

  cfg.emitter.emit('create-column', loading);
  xhr({
    uri: 'http://jsonplaceholder.typicode.com/users'
  }, function done(err, resp, body) {
    var data = JSON.parse(body);

    _.remove(loading);

    // stale request
    if (xhrUid !== xhrCnt) {
      return;
    }

    callback(data.map(function each(item) {
      return {
        label: item.address.city,
        id: item.id
      };
    }));
  });
}

// item render
function createItemContent(cfg, item) {
  var data = item.children || cfg.data;
  var frag = document.createDocumentFragment();
  var label = _.el('span');
  var iconPrepend = _.el('i');
  var iconAppend = _.el('i');
  var prependClasses = ['fa'];
  var appendClasses = ['fa'];

  // prepended icon
  if (data) {
    prependClasses.push('fa-folder');
  } else if (item.type === 'github-url') {
    prependClasses.push('fa-github');
  } else {
    prependClasses.push('fa-file-o');
  }
  _.addClass(iconPrepend, prependClasses);

  // text label
  label.appendChild(iconPrepend);
  label.appendChild(_.text(item.label));
  frag.appendChild(label);

  // appended icon
  if (data) {
    appendClasses.push('fa-caret-right');
  } else if ('url' in item) {
    appendClasses.push('fa-external-link');
  }
  _.addClass(iconAppend, appendClasses);
  frag.appendChild(iconAppend);

  return frag;
}

function createSimpleColumn(text, classes) {
  var div = _.el('div.fjs-col.leaf-col');
  var row = _.el('div.leaf-row');
  var text = _.text(text);
  var i = _.el('i');

  _.addClass(i, classes);
  _.append(row, [i, text]);

  return _.append(div, row);
}



},{"../index":4,"../util":17,"xhr":10}],2:[function(require,module,exports){
'use strict';

var finder = require('../index');
var _ = require('../util');

// sample data
var data = [{
  size: '10 KB',
  modified: '02/21/2015 at 10:04am',
  label: 'build',
  children: [{
    size: '44 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'build',
    children: [{
      size: '2 KB',
      modified: '02/21/2015 at 10:04am',
      label: 'finder.js'
    }]
  }, {
    size: '11 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'finder.js'
  }]
}, {
  size: '9 KB',
  modified: '02/21/2015 at 10:04am',
  label: 'example',
  children: [{
    size: '10 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'example',
    children: [{
      size: '33 KB',
      modified: '02/21/2015 at 10:04am',
      label: 'bundle.js'
    }, {
      size: '103 KB',
      modified: '02/21/2015 at 10:04am',
      label: 'finderjs.css'
    }, {
      size: '56 KB',
      modified: '02/21/2015 at 10:04am',
      label: 'index.html'
    }, {
      size: '122 KB',
      modified: '02/21/2015 at 10:04am',
      label: 'index.js'
    }]
  }, {
    size: '8 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'bundle.js'
  }, {
    size: '6 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'finderjs.css'
  }, {
    size: '4 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'index.html'
  }, {
    size: '2 KB',
    modified: '02/21/2015 at 10:04am',
    label: 'index.js'
  }]
}, {
  size: '10 KB',
  modified: '02/21/2015 at 10:04am',
  label: 'test',
  children: [{
    size: '10 KB',
    modified: '03/09/2014 at 11:45am',
    label: 'index.js'
  }, {
    size: '10 KB',
    modified: '03/09/2014 at 11:45am',
    label: 'test.js'
  }, {
    size: '10 KB',
    modified: '03/09/2014 at 11:45am',
    label: 'util.js'
  }]
}, {
  size: '56 KB',
  modified: '02/21/2015 at 10:04am',
  label: '.codeclimate.yml'
}, {
  size: '33 KB',
  modified: '02/21/2015 at 10:04am',
  label: '.eslintrc'
}, {
  size: '101 KB',
  modified: '02/21/2015 at 10:04am',
  label: '.gitignore'
}, {
  size: '96 KB',
  modified: '02/21/2015 at 10:04am',
  label: '.travis.yml'
}, {
  size: '69 KB',
  modified: '02/15/2012 at 1:02pm',
  label: 'index.js'
}, {
  size: '666 KB',
  modified: '02/15/2012 at 1:02pm',
  label: 'LICENSE'
}, {
  size: '187 KB',
  modified: '02/15/2012 at 1:02pm',
  label: 'Makefile'
}, {
  size: '45 KB',
  modified: '02/15/2012 at 1:02pm',
  label: 'package.json'
}, {
  size: '10 KB',
  modified: '02/15/2012 at 1:02pm',
  label: 'README.md'
}, {
  size: '7 KB',
  modified: '02/15/2012 at 1:02pm',
  label: 'util.js'
}, {
  size: '10 KB',
  modified: '02/21/2015 at 10:04am',
  label: 'Project page',
  type: 'github-url',
  url: 'https://github.com/mynameistechno/finderjs'
}];
var emitter;

module.exports = createExample;


function createExample(container) {
  emitter = finder(container, data, {
    createItemContent: createItemContent
  });

  // when a leaf node selected, display the details in a new column
  emitter.on('leaf-selected', function selected(item) {
    emitter.emit('create-column', createSimpleColumn(item));
  });

  // scroll to the right if necessary when a new column is created
  emitter.on('column-created', function columnCreated() {
    container.scrollLeft = container.scrollWidth - container.clientWidth;
  });
}

// how each item in a column should be rendered
function createItemContent(cfg, item) {
  var data = item.children || cfg.data;
  var frag = document.createDocumentFragment();
  var label = _.el('span');
  var iconPrepend = _.el('i');
  var iconAppend = _.el('i');
  var prependClasses = ['fa'];
  var appendClasses = ['fa'];

  // prepended icon
  if (data) {
    prependClasses.push('fa-folder');
  } else if (item.type === 'github-url') {
    prependClasses.push('fa-github');
  } else {
    prependClasses.push('fa-file-o');
  }
  _.addClass(iconPrepend, prependClasses);

  // text label
  _.append(label, [iconPrepend, _.text(item.label)]);
  frag.appendChild(label);

  // appended icon
  if (data) {
    appendClasses.push('fa-caret-right');
  } else if ('url' in item) {
    appendClasses.push('fa-external-link');
  }
  _.addClass(iconAppend, appendClasses);
  frag.appendChild(iconAppend);

  return frag;
}

function createSimpleColumn(item) {
  var div = _.el('div.fjs-col.leaf-col');
  var row = _.el('div.leaf-row');
  var filename = _.text(item.label);
  var i = _.el('i');
  var size = _.el('div.meta');
  var sizeLabel = _.el('strong');
  var mod = _.el('div.meta');
  var modLabel = _.el('strong');

  _.addClass(i, ['fa', 'fa-file-o']);
  _.append(sizeLabel, _.text('Size: '));
  _.append(size, [sizeLabel, _.text(item.size)]);
  _.append(modLabel, _.text('Modified: '));
  _.append(mod, [modLabel, _.text(item.modified)]);
  _.append(row, [i, filename, size, mod]);

  return _.append(div, row);
}

},{"../index":4,"../util":17}],3:[function(require,module,exports){
'use strict';

var exampleStatic = require('./example-static');
var exampleAsync = require('./example-async');


exampleStatic(document.getElementById('container1'));
exampleAsync(document.getElementById('container2'));

},{"./example-async":1,"./example-static":2}],4:[function(require,module,exports){
/**
 * finder.js module.
 * @module finderjs
 */
'use strict';

var extend = require('xtend');
var document = require('global/document');
var EventEmitter = require('eventemitter3');
var isArray = require('x-is-array');

var _ = require('./util');
var defaults = {
  className: {
    container: 'fjs-container',
    col: 'fjs-col',
    list: 'fjs-list',
    item: 'fjs-item',
    active: 'fjs-active',
    children: 'fjs-has-children',
    url: 'fjs-url',
    itemPrepend: 'fjs-item-prepend',
    itemContent: 'fjs-item-content',
    itemAppend: 'fjs-item-append'
  }
};

module.exports = finder;

/**
 * @param  {element} container
 * @param  {Array|Function} data
 * @param  {object} options
 * @return {object} event emitter
 */
function finder(container, data, options) {
  var emitter = new EventEmitter();
  var cfg = extend(defaults, {
    container: container,
    emitter: emitter
  }, options);

  // xtend doesn't deep merge
  cfg.className = extend(defaults.className, options ? options.className : {});

  // store the fn so we can call it on subsequent selections
  if (typeof data === 'function') {
    cfg.data = data;
  }

  // dom events
  container.addEventListener(
    'click', finder.clickEvent.bind(null, cfg, emitter));
  container.addEventListener(
    'keydown', finder.keydownEvent.bind(null, container, cfg, emitter));

  // internal events
  emitter.on('item-selected', finder.itemSelected.bind(null, cfg, emitter));
  emitter.on(
    'create-column', finder.addColumn.bind(null, container, cfg, emitter));
  emitter.on(
    'navigate', finder.navigate.bind(null, cfg, emitter));

  _.addClass(container, cfg.className.container);
  finder.createColumn(data, cfg, emitter);
  container.setAttribute('tabindex', 0);

  return emitter;
}

/**
 * @param {element} container
 * @param {element} column to append to container
 */
finder.addColumn = function addColumn(container, cfg, emitter, col) {
  container.appendChild(col);

  emitter.emit('column-created', col);
};

/**
 * @param  {object} config
 * @param  {object} event emitter
 * @param  {object} event value
 */
finder.itemSelected = function itemSelected(cfg, emitter, value) {
  var itemEl = value.item;
  var item = itemEl._item;
  var col = value.col;
  var data = item.children || cfg.data;
  var activeEls = col.getElementsByClassName(cfg.className.active);

  if (activeEls.length) {
    _.removeClass(activeEls[0], cfg.className.active);
  }
  _.addClass(itemEl, cfg.className.active);
  _.nextSiblings(col).map(_.remove);

  if (data) {
    finder.createColumn(data, cfg, emitter, item);
  } else if (item.url) {
    document.location.href = item.url;
  } else {
    emitter.emit('leaf-selected', item);
  }
};

/**
 * Click event handler for whole container
 * @param  {object} config
 * @param  {object} event emitter
 * @param  {object} event
 */
finder.clickEvent = function clickEvent(cfg, emitter, event) {
  var el = event.target;
  var col = _.closest(el, function test(el) {
    return _.hasClass(el, cfg.className.col);
  });
  var item = _.closest(el, function test(el) {
    return _.hasClass(el, cfg.className.item);
  });

  _.stop(event);

  // list item clicked
  if (item) {
    emitter.emit('item-selected', {
      col: col,
      item: item
    });
  }
};

/**
 * Keydown event handler for container
 * @param  {object} config
 * @param  {object} event emitter
 * @param  {object} event
 */
finder.keydownEvent = function keydownEvent(container, cfg, emitter, event) {
  var arrowCodes = {
    38: 'up',
    39: 'right',
    40: 'down',
    37: 'left'
  };

  if (event.keyCode in arrowCodes) {
    emitter.emit('navigate', {
      direction: arrowCodes[event.keyCode],
      container: container
    });
  }
};

/**
 * Navigate the finder up, down, right, or left
 * @param  {object} config
 * @param  {object} event emitter
 * @param  {object} event value - `container` prop contains a reference to the
 * container, and `direction` can be 'up', 'down', 'right', 'left'
 */
finder.navigate = function navigate(cfg, emitter, value) {
  var active = finder.findLastActive(value.container, cfg);
  var target = null;
  var dir = value.direction;
  var item;
  var col;

  if (active) {
    item = active.item;
    col = active.col;

    if (dir === 'up' && item.previousSibling) {
      target = item.previousSibling;
    } else if (dir === 'down' && item.nextSibling) {
      target = item.nextSibling;
    } else if (dir === 'right' && col.nextSibling) {
      col = col.nextSibling;
      target = _.first(col, '.' + cfg.className.item);
    } else if (dir === 'left' && col.previousSibling) {
      col = col.previousSibling;
      target = _.first(col, '.' + cfg.className.active) ||
        _.first(col, '.' + cfg.className.item);
    }
  } else {
    col = _.first(value.container, '.' + cfg.className.col);
    target = _.first(col, '.' + cfg.className.item);
  }

  if (target) {
    emitter.emit('item-selected', {
      col: col,
      item: target
    });
  }
};

/**
 * Find last (right-most) active item and column
 * @param  {Element} container
 * @param  {Object} config
 * @return {Object}
 */
finder.findLastActive = function findLastActive(container, cfg) {
  var activeItems = container.getElementsByClassName(cfg.className.active);
  var item;
  var col;

  if (!activeItems.length) {
    return null;
  }

  item = activeItems[activeItems.length - 1];
  col = _.closest(item, function test(el) {
    return _.hasClass(el, cfg.className.col);
  });

  return {
    col: col,
    item: item
  };
};

/**
 * @param  {object} data
 * @param  {object} config
 * @param  {object} event emitter
 * @param  {parent} [parent] - parent item that clicked/triggered createColumn
 * @return {element} column
 */
finder.createColumn = function createColumn(data, cfg, emitter, parent) {
  var div;
  var list;
  function callback(data) {
    finder.createColumn(data, cfg, emitter, parent);
  };

  if (typeof data === 'function') {
    data.call(null, parent, cfg, callback);
  } else if (isArray(data)) {
    list = finder.createList(data, cfg);
    div = _.el('div');
    div.appendChild(list);
    _.addClass(div, cfg.className.col);

    emitter.emit('create-column', div);
  } else {
    throw new Error('Unknown data type');
  }
};

/**
 * @param  {array} data
 * @param  {object} config
 * @return {element} list
 */
finder.createList = function createList(data, cfg) {
  var ul = _.el('ul');
  var items = data.map(finder.createItem.bind(null, cfg));
  var docFrag;

  docFrag = items.reduce(function each(docFrag, curr) {
    docFrag.appendChild(curr);
    return docFrag;
  }, document.createDocumentFragment());

  ul.appendChild(docFrag);
  _.addClass(ul, cfg.className.list);

  return ul;
};

/**
 * Default item render fn
 * @param  {object} cfg config object
 * @param  {object} item data
 * @return {DocumentFragment}
 */
finder.createItemContent = function createItemContent(cfg, item) {
  var frag = document.createDocumentFragment();
  var prepend = _.el('div.' + cfg.className.itemPrepend);
  var content = _.el('div.' + cfg.className.itemContent);
  var append = _.el('div.' + cfg.className.itemAppend);

  frag.appendChild(prepend);
  content.appendChild(document.createTextNode(item.label));
  frag.appendChild(content);
  frag.appendChild(append);

  return frag;
};

/**
 * @param  {object} cfg config object
 * @param  {object} item data
 * @return {element} list item
 */
finder.createItem = function createItem(cfg, item) {
  var frag = document.createDocumentFragment();
  var liClassNames = [cfg.className.item];
  var li = _.el('li');
  var a = _.el('a');
  var createItemContent = cfg.createItemContent || finder.createItemContent;

  frag = createItemContent.call(null, cfg, item);
  a.appendChild(frag);

  a.href = '';
  a.setAttribute('tabindex', -1);
  if (item.url) {
    a.href = item.url;
    liClassNames.push(cfg.className.url);
  }
  if (item.className) {
    liClassNames.push(item.className);
  }
  if (item.children) {
    liClassNames.push(cfg.className.children);
  }
  _.addClass(li, liClassNames);
  li.appendChild(a);
  li._item = item;

  return li;
};

},{"./util":17,"eventemitter3":6,"global/document":7,"x-is-array":9,"xtend":16}],5:[function(require,module,exports){

},{}],6:[function(require,module,exports){
'use strict';

//
// We store our EE objects in a plain object whose properties are event names.
// If `Object.create(null)` is not supported we prefix the event names with a
// `~` to make sure that the built-in object properties are not overridden or
// used as an attack vector.
// We also assume that `Object.create(null)` is available when the event name
// is an ES6 Symbol.
//
var prefix = typeof Object.create !== 'function' ? '~' : false;

/**
 * Representation of a single EventEmitter function.
 *
 * @param {Function} fn Event handler to be called.
 * @param {Mixed} context Context for function execution.
 * @param {Boolean} once Only emit once
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal EventEmitter interface that is molded against the Node.js
 * EventEmitter interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() { /* Nothing to set */ }

/**
 * Holds the assigned EventEmitters by name.
 *
 * @type {Object}
 * @private
 */
EventEmitter.prototype._events = undefined;

/**
 * Return a list of assigned event listeners.
 *
 * @param {String} event The events that should be listed.
 * @param {Boolean} exists We only need to know if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events && this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Emit an event to all registered event listeners.
 *
 * @param {String} event The name of the event.
 * @returns {Boolean} Indication if we've emitted an event.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events || !this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if ('function' === typeof listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Register a new EventListener for the given event.
 *
 * @param {String} event Name of the event.
 * @param {Functon} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events) this._events = prefix ? {} : Object.create(null);
  if (!this._events[evt]) this._events[evt] = listener;
  else {
    if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [
      this._events[evt], listener
    ];
  }

  return this;
};

/**
 * Add an EventListener that's only called once.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events) this._events = prefix ? {} : Object.create(null);
  if (!this._events[evt]) this._events[evt] = listener;
  else {
    if (!this._events[evt].fn) this._events[evt].push(listener);
    else this._events[evt] = [
      this._events[evt], listener
    ];
  }

  return this;
};

/**
 * Remove event listeners.
 *
 * @param {String} event The event we want to remove.
 * @param {Function} fn The listener that we need to find.
 * @param {Mixed} context Only remove listeners matching this context.
 * @param {Boolean} once Only remove once listeners.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events || !this._events[evt]) return this;

  var listeners = this._events[evt]
    , events = [];

  if (fn) {
    if (listeners.fn) {
      if (
           listeners.fn !== fn
        || (once && !listeners.once)
        || (context && listeners.context !== context)
      ) {
        events.push(listeners);
      }
    } else {
      for (var i = 0, length = listeners.length; i < length; i++) {
        if (
             listeners[i].fn !== fn
          || (once && !listeners[i].once)
          || (context && listeners[i].context !== context)
        ) {
          events.push(listeners[i]);
        }
      }
    }
  }

  //
  // Reset the array, or remove it completely if we have no more listeners.
  //
  if (events.length) {
    this._events[evt] = events.length === 1 ? events[0] : events;
  } else {
    delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners or only the listeners for the specified event.
 *
 * @param {String} event The event want to remove all listeners for.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  if (!this._events) return this;

  if (event) delete this._events[prefix ? prefix + event : event];
  else this._events = prefix ? {} : Object.create(null);

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}

},{}],7:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"min-document":5}],8:[function(require,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window;
} else if (typeof global !== "undefined") {
    module.exports = global;
} else if (typeof self !== "undefined"){
    module.exports = self;
} else {
    module.exports = {};
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],9:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],10:[function(require,module,exports){
"use strict";
var window = require("global/window")
var once = require("once")
var parseHeaders = require("parse-headers")



module.exports = createXHR
createXHR.XMLHttpRequest = window.XMLHttpRequest || noop
createXHR.XDomainRequest = "withCredentials" in (new createXHR.XMLHttpRequest()) ? createXHR.XMLHttpRequest : window.XDomainRequest


function isEmpty(obj){
    for(var i in obj){
        if(obj.hasOwnProperty(i)) return false
    }
    return true
}

function createXHR(options, callback) {
    function readystatechange() {
        if (xhr.readyState === 4) {
            loadFunc()
        }
    }

    function getBody() {
        // Chrome with requestType=blob throws errors arround when even testing access to responseText
        var body = undefined

        if (xhr.response) {
            body = xhr.response
        } else if (xhr.responseType === "text" || !xhr.responseType) {
            body = xhr.responseText || xhr.responseXML
        }

        if (isJson) {
            try {
                body = JSON.parse(body)
            } catch (e) {}
        }

        return body
    }

    var failureResponse = {
                body: undefined,
                headers: {},
                statusCode: 0,
                method: method,
                url: uri,
                rawRequest: xhr
            }

    function errorFunc(evt) {
        clearTimeout(timeoutTimer)
        if(!(evt instanceof Error)){
            evt = new Error("" + (evt || "Unknown XMLHttpRequest Error") )
        }
        evt.statusCode = 0
        callback(evt, failureResponse)
    }

    // will load the data & process the response in a special response object
    function loadFunc() {
        if (aborted) return
        var status
        clearTimeout(timeoutTimer)
        if(options.useXDR && xhr.status===undefined) {
            //IE8 CORS GET successful response doesn't have a status field, but body is fine
            status = 200
        } else {
            status = (xhr.status === 1223 ? 204 : xhr.status)
        }
        var response = failureResponse
        var err = null

        if (status !== 0){
            response = {
                body: getBody(),
                statusCode: status,
                method: method,
                headers: {},
                url: uri,
                rawRequest: xhr
            }
            if(xhr.getAllResponseHeaders){ //remember xhr can in fact be XDR for CORS in IE
                response.headers = parseHeaders(xhr.getAllResponseHeaders())
            }
        } else {
            err = new Error("Internal XMLHttpRequest Error")
        }
        callback(err, response, response.body)

    }

    if (typeof options === "string") {
        options = { uri: options }
    }

    options = options || {}
    if(typeof callback === "undefined"){
        throw new Error("callback argument missing")
    }
    callback = once(callback)

    var xhr = options.xhr || null

    if (!xhr) {
        if (options.cors || options.useXDR) {
            xhr = new createXHR.XDomainRequest()
        }else{
            xhr = new createXHR.XMLHttpRequest()
        }
    }

    var key
    var aborted
    var uri = xhr.url = options.uri || options.url
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data
    var headers = xhr.headers = options.headers || {}
    var sync = !!options.sync
    var isJson = false
    var timeoutTimer

    if ("json" in options) {
        isJson = true
        headers["accept"] || headers["Accept"] || (headers["Accept"] = "application/json") //Don't override existing accept header declared by user
        if (method !== "GET" && method !== "HEAD") {
            headers["content-type"] || headers["Content-Type"] || (headers["Content-Type"] = "application/json") //Don't override existing accept header declared by user
            body = JSON.stringify(options.json)
        }
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = loadFunc
    xhr.onerror = errorFunc
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    xhr.ontimeout = errorFunc
    xhr.open(method, uri, !sync, options.username, options.password)
    //has to be after open
    if(!sync) {
        xhr.withCredentials = !!options.withCredentials
    }
    // Cannot set timeout with sync request
    // not setting timeout on the xhr object, because of old webkits etc. not handling that correctly
    // both npm's request and jquery 1.x use this kind of timeout, so this is being consistent
    if (!sync && options.timeout > 0 ) {
        timeoutTimer = setTimeout(function(){
            aborted=true//IE9 may still call readystatechange
            xhr.abort("timeout")
            var e = new Error("XMLHttpRequest timeout")
            e.code = "ETIMEDOUT"
            errorFunc(e)
        }, options.timeout )
    }

    if (xhr.setRequestHeader) {
        for(key in headers){
            if(headers.hasOwnProperty(key)){
                xhr.setRequestHeader(key, headers[key])
            }
        }
    } else if (options.headers && !isEmpty(options.headers)) {
        throw new Error("Headers cannot be set on an XDomainRequest object")
    }

    if ("responseType" in options) {
        xhr.responseType = options.responseType
    }

    if ("beforeSend" in options &&
        typeof options.beforeSend === "function"
    ) {
        options.beforeSend(xhr)
    }

    xhr.send(body)

    return xhr


}

function noop() {}

},{"global/window":8,"once":11,"parse-headers":15}],11:[function(require,module,exports){
module.exports = once

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })
})

function once (fn) {
  var called = false
  return function () {
    if (called) return
    called = true
    return fn.apply(this, arguments)
  }
}

},{}],12:[function(require,module,exports){
var isFunction = require('is-function')

module.exports = forEach

var toString = Object.prototype.toString
var hasOwnProperty = Object.prototype.hasOwnProperty

function forEach(list, iterator, context) {
    if (!isFunction(iterator)) {
        throw new TypeError('iterator must be a function')
    }

    if (arguments.length < 3) {
        context = this
    }
    
    if (toString.call(list) === '[object Array]')
        forEachArray(list, iterator, context)
    else if (typeof list === 'string')
        forEachString(list, iterator, context)
    else
        forEachObject(list, iterator, context)
}

function forEachArray(array, iterator, context) {
    for (var i = 0, len = array.length; i < len; i++) {
        if (hasOwnProperty.call(array, i)) {
            iterator.call(context, array[i], i, array)
        }
    }
}

function forEachString(string, iterator, context) {
    for (var i = 0, len = string.length; i < len; i++) {
        // no such thing as a sparse string.
        iterator.call(context, string.charAt(i), i, string)
    }
}

function forEachObject(object, iterator, context) {
    for (var k in object) {
        if (hasOwnProperty.call(object, k)) {
            iterator.call(context, object[k], k, object)
        }
    }
}

},{"is-function":13}],13:[function(require,module,exports){
module.exports = isFunction

var toString = Object.prototype.toString

function isFunction (fn) {
  var string = toString.call(fn)
  return string === '[object Function]' ||
    (typeof fn === 'function' && string !== '[object RegExp]') ||
    (typeof window !== 'undefined' &&
     // IE8 and below
     (fn === window.setTimeout ||
      fn === window.alert ||
      fn === window.confirm ||
      fn === window.prompt))
};

},{}],14:[function(require,module,exports){

exports = module.exports = trim;

function trim(str){
  return str.replace(/^\s*|\s*$/g, '');
}

exports.left = function(str){
  return str.replace(/^\s*/, '');
};

exports.right = function(str){
  return str.replace(/\s*$/, '');
};

},{}],15:[function(require,module,exports){
var trim = require('trim')
  , forEach = require('for-each')
  , isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    }

module.exports = function (headers) {
  if (!headers)
    return {}

  var result = {}

  forEach(
      trim(headers).split('\n')
    , function (row) {
        var index = row.indexOf(':')
          , key = trim(row.slice(0, index)).toLowerCase()
          , value = trim(row.slice(index + 1))

        if (typeof(result[key]) === 'undefined') {
          result[key] = value
        } else if (isArray(result[key])) {
          result[key].push(value)
        } else {
          result[key] = [ result[key], value ]
        }
      }
  )

  return result
}
},{"for-each":12,"trim":14}],16:[function(require,module,exports){
module.exports = extend

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],17:[function(require,module,exports){
/**
 * util.js module.
 * @module util
 */
'use strict';

var document = require('global/document');
var isArray = require('x-is-array');

/**
 * check if variable is an element
 * @param  {*} potential element
 * @return {Boolean} return true if is an element
 */
function isElement(element) {
  try {
    return element instanceof Element;
  } catch (error) {
    return !!(element && element.nodeType === 1);
  }
}

/**
 * createElement shortcut
 * @param  {String} tag
 * @return {Element} element
 */
function el(element) {
  var classes = [];
  var tag = element;
  var el;

  if (isElement(element)) {
    return element;
  }

  classes = element.split('.');
  if (classes.length > 1) {
    tag = classes[0];
  }
  el = document.createElement(tag);
  addClass(el, classes.slice(1));

  return el;
}

/**
 * createDocumentFragment shortcut
 * @return {DocumentFragment}
 */
function frag() {
  return document.createDocumentFragment();
}

/**
 * createTextNode shortcut
 * @return {TextNode}
 */
function text(text) {
  return document.createTextNode(text);
}

/**
 * remove element
 * @param  {Element} element to remove
 * @return {Element} removed element
 */
function remove(element) {
  if ('remove' in element) {
    element.remove();
  } else {
    element.parentNode.removeChild(element);
  }

  return element;
}

/**
 * Find first element that tests true, starting with the element itself
 * and traversing up through its ancestors
 * @param  {Element} element
 * @param  {Function} test fn - return true when element located
 * @return {Element}
 */
function closest(element, test) {
  var el = element;

  while (el) {
    if (test(el)) {
      return el;
    }
    el = el.parentNode;
  }

  return null;
}

/**
 * Add one or more classnames to an element
 * @param {Element} element
 * @param {Array.<string>|String} array of classnames or string with
 * classnames separated by whitespace
 * @return {Element}
 */
function addClass(element, className) {
  var classNames = className;

  function _addClass(el, cn) {
    if (!el.className) {
      el.className = cn;
    } else if (!hasClass(el, cn)) {
      el.className += ' ' + cn;
    }
  }

  if (!isArray(className)) {
    classNames = className.trim().split(/\s+/);
  }
  classNames.forEach(_addClass.bind(null, element));

  return element;
}

/**
 * Remove a class from an element
 * @param  {Element} element
 * @param  {Array.<string>|String} array of classnames or string with
 * @return {Element}
 */
function removeClass(element, className) {
  var classNames = className;

  function _removeClass(el, cn) {
    var classRegex = new RegExp('(?:^|\\s)' + cn + '(?!\\S)', 'g');
    el.className = el.className.replace(classRegex, '').trim();
  }

  if (!isArray(className)) {
    classNames = className.trim().split(/\s+/);
  }
  classNames.forEach(_removeClass.bind(null, element));

  return element;
}

/**
 * Check if element has a class
 * @param  {Element}  element
 * @param  {String}  className
 * @return {boolean}
 */
function hasClass(element, className) {
  if (!element || !('className' in element)) {
    return false;
  }

  return element.className.split(/\s+/).indexOf(className) !== -1;
}

/**
 * Return all next siblings
 * @param  {Element} element
 * @return {Array.<element>}
 */
function nextSiblings(element) {
  var next = element.nextSibling;
  var siblings = [];

  while (next) {
    siblings.push(next);
    next = next.nextSibling;
  }

  return siblings;
}

/**
 * Return all prev siblings
 * @param  {Element} element
 * @return {Array.<element>}
 */
function previousSiblings(element) {
  var prev = element.previousSibling;
  var siblings = [];

  while (prev) {
    siblings.push(prev);
    prev = prev.previousSibling;
  }

  return siblings;
}

/**
 * Stop event propagation
 * @param  {Event} event
 * @return {Event}
 */
function stop(event) {
  event.stopPropagation();
  event.preventDefault();

  return event;
}

/**
 * Returns first element in parent that matches selector
 * @param  {Element} parent
 * @param  {String} selector
 * @return {Element}
 */
function first(parent, selector) {
  return parent.querySelector(selector);
}

function append(parent, children) {
  var _frag = frag();
  var children = isArray(children) ? children : [children];

  children.forEach(_frag.appendChild.bind(_frag));
  parent.appendChild(_frag);

  return parent;
}

module.exports = {
  el: el,
  frag: frag,
  text: text,
  closest: closest,
  addClass: addClass,
  removeClass: removeClass,
  hasClass: hasClass,
  nextSiblings: nextSiblings,
  previousSiblings: previousSiblings,
  remove: remove,
  stop: stop,
  first: first,
  append: append
};

},{"global/document":7,"x-is-array":9}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL2V4YW1wbGUtYXN5bmMuanMiLCJleGFtcGxlL2V4YW1wbGUtc3RhdGljLmpzIiwiZXhhbXBsZS9pbmRleC5qcyIsImluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcmVzb2x2ZS9lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9ldmVudGVtaXR0ZXIzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2dsb2JhbC9kb2N1bWVudC5qcyIsIm5vZGVfbW9kdWxlcy9nbG9iYWwvd2luZG93LmpzIiwibm9kZV9tb2R1bGVzL3gtaXMtYXJyYXkvaW5kZXguanMiLCJub2RlX21vZHVsZXMveGhyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvb25jZS9vbmNlLmpzIiwibm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvcGFyc2UtaGVhZGVycy9ub2RlX21vZHVsZXMvZm9yLWVhY2gvaW5kZXguanMiLCJub2RlX21vZHVsZXMveGhyL25vZGVfbW9kdWxlcy9wYXJzZS1oZWFkZXJzL25vZGVfbW9kdWxlcy9mb3ItZWFjaC9ub2RlX21vZHVsZXMvaXMtZnVuY3Rpb24vaW5kZXguanMiLCJub2RlX21vZHVsZXMveGhyL25vZGVfbW9kdWxlcy9wYXJzZS1oZWFkZXJzL25vZGVfbW9kdWxlcy90cmltL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3hoci9ub2RlX21vZHVsZXMvcGFyc2UtaGVhZGVycy9wYXJzZS1oZWFkZXJzLmpzIiwibm9kZV9tb2R1bGVzL3h0ZW5kL2ltbXV0YWJsZS5qcyIsInV0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFVBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIHhociA9IHJlcXVpcmUoJ3hocicpO1xudmFyIGZpbmRlciA9IHJlcXVpcmUoJy4uL2luZGV4Jyk7XG52YXIgXyA9IHJlcXVpcmUoJy4uL3V0aWwnKTtcblxudmFyIGVtaXR0ZXI7XG52YXIgeGhyQ250ID0gMDtcblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVFeGFtcGxlO1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZUV4YW1wbGUoY29udGFpbmVyKSB7XG4gIGVtaXR0ZXIgPSBmaW5kZXIoY29udGFpbmVyLCByZW1vdGVTb3VyY2UsIHtcbiAgICBjcmVhdGVJdGVtQ29udGVudDogY3JlYXRlSXRlbUNvbnRlbnRcbiAgfSk7XG5cbiAgLy8gc2Nyb2xsIHRvIHRoZSByaWdodCBpZiBuZWNlc3NhcnlcbiAgZW1pdHRlci5vbignY29sdW1uLWNyZWF0ZWQnLCBmdW5jdGlvbiBjb2x1bW5DcmVhdGVkKCkge1xuICAgIGNvbnRhaW5lci5zY3JvbGxMZWZ0ID0gY29udGFpbmVyLnNjcm9sbFdpZHRoIC0gY29udGFpbmVyLmNsaWVudFdpZHRoO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVtb3RlU291cmNlKHBhcmVudCwgY2ZnLCBjYWxsYmFjaykge1xuICB2YXIgbG9hZGluZyA9IGNyZWF0ZVNpbXBsZUNvbHVtbihcbiAgICAnTG9hZGluZy4uLicsIFsnZmEnLCAnZmEtcmVmcmVzaCcsICdmYS1zcGluJ10pO1xuICB2YXIgeGhyVWlkID0gKyt4aHJDbnQ7XG5cbiAgY2ZnLmVtaXR0ZXIuZW1pdCgnY3JlYXRlLWNvbHVtbicsIGxvYWRpbmcpO1xuICB4aHIoe1xuICAgIHVyaTogJ2h0dHA6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3VzZXJzJ1xuICB9LCBmdW5jdGlvbiBkb25lKGVyciwgcmVzcCwgYm9keSkge1xuICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShib2R5KTtcblxuICAgIF8ucmVtb3ZlKGxvYWRpbmcpO1xuXG4gICAgLy8gc3RhbGUgcmVxdWVzdFxuICAgIGlmICh4aHJVaWQgIT09IHhockNudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNhbGxiYWNrKGRhdGEubWFwKGZ1bmN0aW9uIGVhY2goaXRlbSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGFiZWw6IGl0ZW0uYWRkcmVzcy5jaXR5LFxuICAgICAgICBpZDogaXRlbS5pZFxuICAgICAgfTtcbiAgICB9KSk7XG4gIH0pO1xufVxuXG4vLyBpdGVtIHJlbmRlclxuZnVuY3Rpb24gY3JlYXRlSXRlbUNvbnRlbnQoY2ZnLCBpdGVtKSB7XG4gIHZhciBkYXRhID0gaXRlbS5jaGlsZHJlbiB8fCBjZmcuZGF0YTtcbiAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIHZhciBsYWJlbCA9IF8uZWwoJ3NwYW4nKTtcbiAgdmFyIGljb25QcmVwZW5kID0gXy5lbCgnaScpO1xuICB2YXIgaWNvbkFwcGVuZCA9IF8uZWwoJ2knKTtcbiAgdmFyIHByZXBlbmRDbGFzc2VzID0gWydmYSddO1xuICB2YXIgYXBwZW5kQ2xhc3NlcyA9IFsnZmEnXTtcblxuICAvLyBwcmVwZW5kZWQgaWNvblxuICBpZiAoZGF0YSkge1xuICAgIHByZXBlbmRDbGFzc2VzLnB1c2goJ2ZhLWZvbGRlcicpO1xuICB9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PT0gJ2dpdGh1Yi11cmwnKSB7XG4gICAgcHJlcGVuZENsYXNzZXMucHVzaCgnZmEtZ2l0aHViJyk7XG4gIH0gZWxzZSB7XG4gICAgcHJlcGVuZENsYXNzZXMucHVzaCgnZmEtZmlsZS1vJyk7XG4gIH1cbiAgXy5hZGRDbGFzcyhpY29uUHJlcGVuZCwgcHJlcGVuZENsYXNzZXMpO1xuXG4gIC8vIHRleHQgbGFiZWxcbiAgbGFiZWwuYXBwZW5kQ2hpbGQoaWNvblByZXBlbmQpO1xuICBsYWJlbC5hcHBlbmRDaGlsZChfLnRleHQoaXRlbS5sYWJlbCkpO1xuICBmcmFnLmFwcGVuZENoaWxkKGxhYmVsKTtcblxuICAvLyBhcHBlbmRlZCBpY29uXG4gIGlmIChkYXRhKSB7XG4gICAgYXBwZW5kQ2xhc3Nlcy5wdXNoKCdmYS1jYXJldC1yaWdodCcpO1xuICB9IGVsc2UgaWYgKCd1cmwnIGluIGl0ZW0pIHtcbiAgICBhcHBlbmRDbGFzc2VzLnB1c2goJ2ZhLWV4dGVybmFsLWxpbmsnKTtcbiAgfVxuICBfLmFkZENsYXNzKGljb25BcHBlbmQsIGFwcGVuZENsYXNzZXMpO1xuICBmcmFnLmFwcGVuZENoaWxkKGljb25BcHBlbmQpO1xuXG4gIHJldHVybiBmcmFnO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTaW1wbGVDb2x1bW4odGV4dCwgY2xhc3Nlcykge1xuICB2YXIgZGl2ID0gXy5lbCgnZGl2LmZqcy1jb2wubGVhZi1jb2wnKTtcbiAgdmFyIHJvdyA9IF8uZWwoJ2Rpdi5sZWFmLXJvdycpO1xuICB2YXIgdGV4dCA9IF8udGV4dCh0ZXh0KTtcbiAgdmFyIGkgPSBfLmVsKCdpJyk7XG5cbiAgXy5hZGRDbGFzcyhpLCBjbGFzc2VzKTtcbiAgXy5hcHBlbmQocm93LCBbaSwgdGV4dF0pO1xuXG4gIHJldHVybiBfLmFwcGVuZChkaXYsIHJvdyk7XG59XG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZmluZGVyID0gcmVxdWlyZSgnLi4vaW5kZXgnKTtcbnZhciBfID0gcmVxdWlyZSgnLi4vdXRpbCcpO1xuXG4vLyBzYW1wbGUgZGF0YVxudmFyIGRhdGEgPSBbe1xuICBzaXplOiAnMTAgS0InLFxuICBtb2RpZmllZDogJzAyLzIxLzIwMTUgYXQgMTA6MDRhbScsXG4gIGxhYmVsOiAnYnVpbGQnLFxuICBjaGlsZHJlbjogW3tcbiAgICBzaXplOiAnNDQgS0InLFxuICAgIG1vZGlmaWVkOiAnMDIvMjEvMjAxNSBhdCAxMDowNGFtJyxcbiAgICBsYWJlbDogJ2J1aWxkJyxcbiAgICBjaGlsZHJlbjogW3tcbiAgICAgIHNpemU6ICcyIEtCJyxcbiAgICAgIG1vZGlmaWVkOiAnMDIvMjEvMjAxNSBhdCAxMDowNGFtJyxcbiAgICAgIGxhYmVsOiAnZmluZGVyLmpzJ1xuICAgIH1dXG4gIH0sIHtcbiAgICBzaXplOiAnMTEgS0InLFxuICAgIG1vZGlmaWVkOiAnMDIvMjEvMjAxNSBhdCAxMDowNGFtJyxcbiAgICBsYWJlbDogJ2ZpbmRlci5qcydcbiAgfV1cbn0sIHtcbiAgc2l6ZTogJzkgS0InLFxuICBtb2RpZmllZDogJzAyLzIxLzIwMTUgYXQgMTA6MDRhbScsXG4gIGxhYmVsOiAnZXhhbXBsZScsXG4gIGNoaWxkcmVuOiBbe1xuICAgIHNpemU6ICcxMCBLQicsXG4gICAgbW9kaWZpZWQ6ICcwMi8yMS8yMDE1IGF0IDEwOjA0YW0nLFxuICAgIGxhYmVsOiAnZXhhbXBsZScsXG4gICAgY2hpbGRyZW46IFt7XG4gICAgICBzaXplOiAnMzMgS0InLFxuICAgICAgbW9kaWZpZWQ6ICcwMi8yMS8yMDE1IGF0IDEwOjA0YW0nLFxuICAgICAgbGFiZWw6ICdidW5kbGUuanMnXG4gICAgfSwge1xuICAgICAgc2l6ZTogJzEwMyBLQicsXG4gICAgICBtb2RpZmllZDogJzAyLzIxLzIwMTUgYXQgMTA6MDRhbScsXG4gICAgICBsYWJlbDogJ2ZpbmRlcmpzLmNzcydcbiAgICB9LCB7XG4gICAgICBzaXplOiAnNTYgS0InLFxuICAgICAgbW9kaWZpZWQ6ICcwMi8yMS8yMDE1IGF0IDEwOjA0YW0nLFxuICAgICAgbGFiZWw6ICdpbmRleC5odG1sJ1xuICAgIH0sIHtcbiAgICAgIHNpemU6ICcxMjIgS0InLFxuICAgICAgbW9kaWZpZWQ6ICcwMi8yMS8yMDE1IGF0IDEwOjA0YW0nLFxuICAgICAgbGFiZWw6ICdpbmRleC5qcydcbiAgICB9XVxuICB9LCB7XG4gICAgc2l6ZTogJzggS0InLFxuICAgIG1vZGlmaWVkOiAnMDIvMjEvMjAxNSBhdCAxMDowNGFtJyxcbiAgICBsYWJlbDogJ2J1bmRsZS5qcydcbiAgfSwge1xuICAgIHNpemU6ICc2IEtCJyxcbiAgICBtb2RpZmllZDogJzAyLzIxLzIwMTUgYXQgMTA6MDRhbScsXG4gICAgbGFiZWw6ICdmaW5kZXJqcy5jc3MnXG4gIH0sIHtcbiAgICBzaXplOiAnNCBLQicsXG4gICAgbW9kaWZpZWQ6ICcwMi8yMS8yMDE1IGF0IDEwOjA0YW0nLFxuICAgIGxhYmVsOiAnaW5kZXguaHRtbCdcbiAgfSwge1xuICAgIHNpemU6ICcyIEtCJyxcbiAgICBtb2RpZmllZDogJzAyLzIxLzIwMTUgYXQgMTA6MDRhbScsXG4gICAgbGFiZWw6ICdpbmRleC5qcydcbiAgfV1cbn0sIHtcbiAgc2l6ZTogJzEwIEtCJyxcbiAgbW9kaWZpZWQ6ICcwMi8yMS8yMDE1IGF0IDEwOjA0YW0nLFxuICBsYWJlbDogJ3Rlc3QnLFxuICBjaGlsZHJlbjogW3tcbiAgICBzaXplOiAnMTAgS0InLFxuICAgIG1vZGlmaWVkOiAnMDMvMDkvMjAxNCBhdCAxMTo0NWFtJyxcbiAgICBsYWJlbDogJ2luZGV4LmpzJ1xuICB9LCB7XG4gICAgc2l6ZTogJzEwIEtCJyxcbiAgICBtb2RpZmllZDogJzAzLzA5LzIwMTQgYXQgMTE6NDVhbScsXG4gICAgbGFiZWw6ICd0ZXN0LmpzJ1xuICB9LCB7XG4gICAgc2l6ZTogJzEwIEtCJyxcbiAgICBtb2RpZmllZDogJzAzLzA5LzIwMTQgYXQgMTE6NDVhbScsXG4gICAgbGFiZWw6ICd1dGlsLmpzJ1xuICB9XVxufSwge1xuICBzaXplOiAnNTYgS0InLFxuICBtb2RpZmllZDogJzAyLzIxLzIwMTUgYXQgMTA6MDRhbScsXG4gIGxhYmVsOiAnLmNvZGVjbGltYXRlLnltbCdcbn0sIHtcbiAgc2l6ZTogJzMzIEtCJyxcbiAgbW9kaWZpZWQ6ICcwMi8yMS8yMDE1IGF0IDEwOjA0YW0nLFxuICBsYWJlbDogJy5lc2xpbnRyYydcbn0sIHtcbiAgc2l6ZTogJzEwMSBLQicsXG4gIG1vZGlmaWVkOiAnMDIvMjEvMjAxNSBhdCAxMDowNGFtJyxcbiAgbGFiZWw6ICcuZ2l0aWdub3JlJ1xufSwge1xuICBzaXplOiAnOTYgS0InLFxuICBtb2RpZmllZDogJzAyLzIxLzIwMTUgYXQgMTA6MDRhbScsXG4gIGxhYmVsOiAnLnRyYXZpcy55bWwnXG59LCB7XG4gIHNpemU6ICc2OSBLQicsXG4gIG1vZGlmaWVkOiAnMDIvMTUvMjAxMiBhdCAxOjAycG0nLFxuICBsYWJlbDogJ2luZGV4LmpzJ1xufSwge1xuICBzaXplOiAnNjY2IEtCJyxcbiAgbW9kaWZpZWQ6ICcwMi8xNS8yMDEyIGF0IDE6MDJwbScsXG4gIGxhYmVsOiAnTElDRU5TRSdcbn0sIHtcbiAgc2l6ZTogJzE4NyBLQicsXG4gIG1vZGlmaWVkOiAnMDIvMTUvMjAxMiBhdCAxOjAycG0nLFxuICBsYWJlbDogJ01ha2VmaWxlJ1xufSwge1xuICBzaXplOiAnNDUgS0InLFxuICBtb2RpZmllZDogJzAyLzE1LzIwMTIgYXQgMTowMnBtJyxcbiAgbGFiZWw6ICdwYWNrYWdlLmpzb24nXG59LCB7XG4gIHNpemU6ICcxMCBLQicsXG4gIG1vZGlmaWVkOiAnMDIvMTUvMjAxMiBhdCAxOjAycG0nLFxuICBsYWJlbDogJ1JFQURNRS5tZCdcbn0sIHtcbiAgc2l6ZTogJzcgS0InLFxuICBtb2RpZmllZDogJzAyLzE1LzIwMTIgYXQgMTowMnBtJyxcbiAgbGFiZWw6ICd1dGlsLmpzJ1xufSwge1xuICBzaXplOiAnMTAgS0InLFxuICBtb2RpZmllZDogJzAyLzIxLzIwMTUgYXQgMTA6MDRhbScsXG4gIGxhYmVsOiAnUHJvamVjdCBwYWdlJyxcbiAgdHlwZTogJ2dpdGh1Yi11cmwnLFxuICB1cmw6ICdodHRwczovL2dpdGh1Yi5jb20vbXluYW1laXN0ZWNobm8vZmluZGVyanMnXG59XTtcbnZhciBlbWl0dGVyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUV4YW1wbGU7XG5cblxuZnVuY3Rpb24gY3JlYXRlRXhhbXBsZShjb250YWluZXIpIHtcbiAgZW1pdHRlciA9IGZpbmRlcihjb250YWluZXIsIGRhdGEsIHtcbiAgICBjcmVhdGVJdGVtQ29udGVudDogY3JlYXRlSXRlbUNvbnRlbnRcbiAgfSk7XG5cbiAgLy8gd2hlbiBhIGxlYWYgbm9kZSBzZWxlY3RlZCwgZGlzcGxheSB0aGUgZGV0YWlscyBpbiBhIG5ldyBjb2x1bW5cbiAgZW1pdHRlci5vbignbGVhZi1zZWxlY3RlZCcsIGZ1bmN0aW9uIHNlbGVjdGVkKGl0ZW0pIHtcbiAgICBlbWl0dGVyLmVtaXQoJ2NyZWF0ZS1jb2x1bW4nLCBjcmVhdGVTaW1wbGVDb2x1bW4oaXRlbSkpO1xuICB9KTtcblxuICAvLyBzY3JvbGwgdG8gdGhlIHJpZ2h0IGlmIG5lY2Vzc2FyeSB3aGVuIGEgbmV3IGNvbHVtbiBpcyBjcmVhdGVkXG4gIGVtaXR0ZXIub24oJ2NvbHVtbi1jcmVhdGVkJywgZnVuY3Rpb24gY29sdW1uQ3JlYXRlZCgpIHtcbiAgICBjb250YWluZXIuc2Nyb2xsTGVmdCA9IGNvbnRhaW5lci5zY3JvbGxXaWR0aCAtIGNvbnRhaW5lci5jbGllbnRXaWR0aDtcbiAgfSk7XG59XG5cbi8vIGhvdyBlYWNoIGl0ZW0gaW4gYSBjb2x1bW4gc2hvdWxkIGJlIHJlbmRlcmVkXG5mdW5jdGlvbiBjcmVhdGVJdGVtQ29udGVudChjZmcsIGl0ZW0pIHtcbiAgdmFyIGRhdGEgPSBpdGVtLmNoaWxkcmVuIHx8IGNmZy5kYXRhO1xuICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgdmFyIGxhYmVsID0gXy5lbCgnc3BhbicpO1xuICB2YXIgaWNvblByZXBlbmQgPSBfLmVsKCdpJyk7XG4gIHZhciBpY29uQXBwZW5kID0gXy5lbCgnaScpO1xuICB2YXIgcHJlcGVuZENsYXNzZXMgPSBbJ2ZhJ107XG4gIHZhciBhcHBlbmRDbGFzc2VzID0gWydmYSddO1xuXG4gIC8vIHByZXBlbmRlZCBpY29uXG4gIGlmIChkYXRhKSB7XG4gICAgcHJlcGVuZENsYXNzZXMucHVzaCgnZmEtZm9sZGVyJyk7XG4gIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSAnZ2l0aHViLXVybCcpIHtcbiAgICBwcmVwZW5kQ2xhc3Nlcy5wdXNoKCdmYS1naXRodWInKTtcbiAgfSBlbHNlIHtcbiAgICBwcmVwZW5kQ2xhc3Nlcy5wdXNoKCdmYS1maWxlLW8nKTtcbiAgfVxuICBfLmFkZENsYXNzKGljb25QcmVwZW5kLCBwcmVwZW5kQ2xhc3Nlcyk7XG5cbiAgLy8gdGV4dCBsYWJlbFxuICBfLmFwcGVuZChsYWJlbCwgW2ljb25QcmVwZW5kLCBfLnRleHQoaXRlbS5sYWJlbCldKTtcbiAgZnJhZy5hcHBlbmRDaGlsZChsYWJlbCk7XG5cbiAgLy8gYXBwZW5kZWQgaWNvblxuICBpZiAoZGF0YSkge1xuICAgIGFwcGVuZENsYXNzZXMucHVzaCgnZmEtY2FyZXQtcmlnaHQnKTtcbiAgfSBlbHNlIGlmICgndXJsJyBpbiBpdGVtKSB7XG4gICAgYXBwZW5kQ2xhc3Nlcy5wdXNoKCdmYS1leHRlcm5hbC1saW5rJyk7XG4gIH1cbiAgXy5hZGRDbGFzcyhpY29uQXBwZW5kLCBhcHBlbmRDbGFzc2VzKTtcbiAgZnJhZy5hcHBlbmRDaGlsZChpY29uQXBwZW5kKTtcblxuICByZXR1cm4gZnJhZztcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2ltcGxlQ29sdW1uKGl0ZW0pIHtcbiAgdmFyIGRpdiA9IF8uZWwoJ2Rpdi5manMtY29sLmxlYWYtY29sJyk7XG4gIHZhciByb3cgPSBfLmVsKCdkaXYubGVhZi1yb3cnKTtcbiAgdmFyIGZpbGVuYW1lID0gXy50ZXh0KGl0ZW0ubGFiZWwpO1xuICB2YXIgaSA9IF8uZWwoJ2knKTtcbiAgdmFyIHNpemUgPSBfLmVsKCdkaXYubWV0YScpO1xuICB2YXIgc2l6ZUxhYmVsID0gXy5lbCgnc3Ryb25nJyk7XG4gIHZhciBtb2QgPSBfLmVsKCdkaXYubWV0YScpO1xuICB2YXIgbW9kTGFiZWwgPSBfLmVsKCdzdHJvbmcnKTtcblxuICBfLmFkZENsYXNzKGksIFsnZmEnLCAnZmEtZmlsZS1vJ10pO1xuICBfLmFwcGVuZChzaXplTGFiZWwsIF8udGV4dCgnU2l6ZTogJykpO1xuICBfLmFwcGVuZChzaXplLCBbc2l6ZUxhYmVsLCBfLnRleHQoaXRlbS5zaXplKV0pO1xuICBfLmFwcGVuZChtb2RMYWJlbCwgXy50ZXh0KCdNb2RpZmllZDogJykpO1xuICBfLmFwcGVuZChtb2QsIFttb2RMYWJlbCwgXy50ZXh0KGl0ZW0ubW9kaWZpZWQpXSk7XG4gIF8uYXBwZW5kKHJvdywgW2ksIGZpbGVuYW1lLCBzaXplLCBtb2RdKTtcblxuICByZXR1cm4gXy5hcHBlbmQoZGl2LCByb3cpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZXhhbXBsZVN0YXRpYyA9IHJlcXVpcmUoJy4vZXhhbXBsZS1zdGF0aWMnKTtcbnZhciBleGFtcGxlQXN5bmMgPSByZXF1aXJlKCcuL2V4YW1wbGUtYXN5bmMnKTtcblxuXG5leGFtcGxlU3RhdGljKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXIxJykpO1xuZXhhbXBsZUFzeW5jKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXIyJykpO1xuIiwiLyoqXG4gKiBmaW5kZXIuanMgbW9kdWxlLlxuICogQG1vZHVsZSBmaW5kZXJqc1xuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBleHRlbmQgPSByZXF1aXJlKCd4dGVuZCcpO1xudmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnZ2xvYmFsL2RvY3VtZW50Jyk7XG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRlbWl0dGVyMycpO1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCd4LWlzLWFycmF5Jyk7XG5cbnZhciBfID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgZGVmYXVsdHMgPSB7XG4gIGNsYXNzTmFtZToge1xuICAgIGNvbnRhaW5lcjogJ2Zqcy1jb250YWluZXInLFxuICAgIGNvbDogJ2Zqcy1jb2wnLFxuICAgIGxpc3Q6ICdmanMtbGlzdCcsXG4gICAgaXRlbTogJ2Zqcy1pdGVtJyxcbiAgICBhY3RpdmU6ICdmanMtYWN0aXZlJyxcbiAgICBjaGlsZHJlbjogJ2Zqcy1oYXMtY2hpbGRyZW4nLFxuICAgIHVybDogJ2Zqcy11cmwnLFxuICAgIGl0ZW1QcmVwZW5kOiAnZmpzLWl0ZW0tcHJlcGVuZCcsXG4gICAgaXRlbUNvbnRlbnQ6ICdmanMtaXRlbS1jb250ZW50JyxcbiAgICBpdGVtQXBwZW5kOiAnZmpzLWl0ZW0tYXBwZW5kJ1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRlcjtcblxuLyoqXG4gKiBAcGFyYW0gIHtlbGVtZW50fSBjb250YWluZXJcbiAqIEBwYXJhbSAge0FycmF5fEZ1bmN0aW9ufSBkYXRhXG4gKiBAcGFyYW0gIHtvYmplY3R9IG9wdGlvbnNcbiAqIEByZXR1cm4ge29iamVjdH0gZXZlbnQgZW1pdHRlclxuICovXG5mdW5jdGlvbiBmaW5kZXIoY29udGFpbmVyLCBkYXRhLCBvcHRpb25zKSB7XG4gIHZhciBlbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICB2YXIgY2ZnID0gZXh0ZW5kKGRlZmF1bHRzLCB7XG4gICAgY29udGFpbmVyOiBjb250YWluZXIsXG4gICAgZW1pdHRlcjogZW1pdHRlclxuICB9LCBvcHRpb25zKTtcblxuICAvLyB4dGVuZCBkb2Vzbid0IGRlZXAgbWVyZ2VcbiAgY2ZnLmNsYXNzTmFtZSA9IGV4dGVuZChkZWZhdWx0cy5jbGFzc05hbWUsIG9wdGlvbnMgPyBvcHRpb25zLmNsYXNzTmFtZSA6IHt9KTtcblxuICAvLyBzdG9yZSB0aGUgZm4gc28gd2UgY2FuIGNhbGwgaXQgb24gc3Vic2VxdWVudCBzZWxlY3Rpb25zXG4gIGlmICh0eXBlb2YgZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNmZy5kYXRhID0gZGF0YTtcbiAgfVxuXG4gIC8vIGRvbSBldmVudHNcbiAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgJ2NsaWNrJywgZmluZGVyLmNsaWNrRXZlbnQuYmluZChudWxsLCBjZmcsIGVtaXR0ZXIpKTtcbiAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgJ2tleWRvd24nLCBmaW5kZXIua2V5ZG93bkV2ZW50LmJpbmQobnVsbCwgY29udGFpbmVyLCBjZmcsIGVtaXR0ZXIpKTtcblxuICAvLyBpbnRlcm5hbCBldmVudHNcbiAgZW1pdHRlci5vbignaXRlbS1zZWxlY3RlZCcsIGZpbmRlci5pdGVtU2VsZWN0ZWQuYmluZChudWxsLCBjZmcsIGVtaXR0ZXIpKTtcbiAgZW1pdHRlci5vbihcbiAgICAnY3JlYXRlLWNvbHVtbicsIGZpbmRlci5hZGRDb2x1bW4uYmluZChudWxsLCBjb250YWluZXIsIGNmZywgZW1pdHRlcikpO1xuICBlbWl0dGVyLm9uKFxuICAgICduYXZpZ2F0ZScsIGZpbmRlci5uYXZpZ2F0ZS5iaW5kKG51bGwsIGNmZywgZW1pdHRlcikpO1xuXG4gIF8uYWRkQ2xhc3MoY29udGFpbmVyLCBjZmcuY2xhc3NOYW1lLmNvbnRhaW5lcik7XG4gIGZpbmRlci5jcmVhdGVDb2x1bW4oZGF0YSwgY2ZnLCBlbWl0dGVyKTtcbiAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKTtcblxuICByZXR1cm4gZW1pdHRlcjtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge2VsZW1lbnR9IGNvbnRhaW5lclxuICogQHBhcmFtIHtlbGVtZW50fSBjb2x1bW4gdG8gYXBwZW5kIHRvIGNvbnRhaW5lclxuICovXG5maW5kZXIuYWRkQ29sdW1uID0gZnVuY3Rpb24gYWRkQ29sdW1uKGNvbnRhaW5lciwgY2ZnLCBlbWl0dGVyLCBjb2wpIHtcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbCk7XG5cbiAgZW1pdHRlci5lbWl0KCdjb2x1bW4tY3JlYXRlZCcsIGNvbCk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSAge29iamVjdH0gY29uZmlnXG4gKiBAcGFyYW0gIHtvYmplY3R9IGV2ZW50IGVtaXR0ZXJcbiAqIEBwYXJhbSAge29iamVjdH0gZXZlbnQgdmFsdWVcbiAqL1xuZmluZGVyLml0ZW1TZWxlY3RlZCA9IGZ1bmN0aW9uIGl0ZW1TZWxlY3RlZChjZmcsIGVtaXR0ZXIsIHZhbHVlKSB7XG4gIHZhciBpdGVtRWwgPSB2YWx1ZS5pdGVtO1xuICB2YXIgaXRlbSA9IGl0ZW1FbC5faXRlbTtcbiAgdmFyIGNvbCA9IHZhbHVlLmNvbDtcbiAgdmFyIGRhdGEgPSBpdGVtLmNoaWxkcmVuIHx8IGNmZy5kYXRhO1xuICB2YXIgYWN0aXZlRWxzID0gY29sLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2ZnLmNsYXNzTmFtZS5hY3RpdmUpO1xuXG4gIGlmIChhY3RpdmVFbHMubGVuZ3RoKSB7XG4gICAgXy5yZW1vdmVDbGFzcyhhY3RpdmVFbHNbMF0sIGNmZy5jbGFzc05hbWUuYWN0aXZlKTtcbiAgfVxuICBfLmFkZENsYXNzKGl0ZW1FbCwgY2ZnLmNsYXNzTmFtZS5hY3RpdmUpO1xuICBfLm5leHRTaWJsaW5ncyhjb2wpLm1hcChfLnJlbW92ZSk7XG5cbiAgaWYgKGRhdGEpIHtcbiAgICBmaW5kZXIuY3JlYXRlQ29sdW1uKGRhdGEsIGNmZywgZW1pdHRlciwgaXRlbSk7XG4gIH0gZWxzZSBpZiAoaXRlbS51cmwpIHtcbiAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gaXRlbS51cmw7XG4gIH0gZWxzZSB7XG4gICAgZW1pdHRlci5lbWl0KCdsZWFmLXNlbGVjdGVkJywgaXRlbSk7XG4gIH1cbn07XG5cbi8qKlxuICogQ2xpY2sgZXZlbnQgaGFuZGxlciBmb3Igd2hvbGUgY29udGFpbmVyXG4gKiBAcGFyYW0gIHtvYmplY3R9IGNvbmZpZ1xuICogQHBhcmFtICB7b2JqZWN0fSBldmVudCBlbWl0dGVyXG4gKiBAcGFyYW0gIHtvYmplY3R9IGV2ZW50XG4gKi9cbmZpbmRlci5jbGlja0V2ZW50ID0gZnVuY3Rpb24gY2xpY2tFdmVudChjZmcsIGVtaXR0ZXIsIGV2ZW50KSB7XG4gIHZhciBlbCA9IGV2ZW50LnRhcmdldDtcbiAgdmFyIGNvbCA9IF8uY2xvc2VzdChlbCwgZnVuY3Rpb24gdGVzdChlbCkge1xuICAgIHJldHVybiBfLmhhc0NsYXNzKGVsLCBjZmcuY2xhc3NOYW1lLmNvbCk7XG4gIH0pO1xuICB2YXIgaXRlbSA9IF8uY2xvc2VzdChlbCwgZnVuY3Rpb24gdGVzdChlbCkge1xuICAgIHJldHVybiBfLmhhc0NsYXNzKGVsLCBjZmcuY2xhc3NOYW1lLml0ZW0pO1xuICB9KTtcblxuICBfLnN0b3AoZXZlbnQpO1xuXG4gIC8vIGxpc3QgaXRlbSBjbGlja2VkXG4gIGlmIChpdGVtKSB7XG4gICAgZW1pdHRlci5lbWl0KCdpdGVtLXNlbGVjdGVkJywge1xuICAgICAgY29sOiBjb2wsXG4gICAgICBpdGVtOiBpdGVtXG4gICAgfSk7XG4gIH1cbn07XG5cbi8qKlxuICogS2V5ZG93biBldmVudCBoYW5kbGVyIGZvciBjb250YWluZXJcbiAqIEBwYXJhbSAge29iamVjdH0gY29uZmlnXG4gKiBAcGFyYW0gIHtvYmplY3R9IGV2ZW50IGVtaXR0ZXJcbiAqIEBwYXJhbSAge29iamVjdH0gZXZlbnRcbiAqL1xuZmluZGVyLmtleWRvd25FdmVudCA9IGZ1bmN0aW9uIGtleWRvd25FdmVudChjb250YWluZXIsIGNmZywgZW1pdHRlciwgZXZlbnQpIHtcbiAgdmFyIGFycm93Q29kZXMgPSB7XG4gICAgMzg6ICd1cCcsXG4gICAgMzk6ICdyaWdodCcsXG4gICAgNDA6ICdkb3duJyxcbiAgICAzNzogJ2xlZnQnXG4gIH07XG5cbiAgaWYgKGV2ZW50LmtleUNvZGUgaW4gYXJyb3dDb2Rlcykge1xuICAgIGVtaXR0ZXIuZW1pdCgnbmF2aWdhdGUnLCB7XG4gICAgICBkaXJlY3Rpb246IGFycm93Q29kZXNbZXZlbnQua2V5Q29kZV0sXG4gICAgICBjb250YWluZXI6IGNvbnRhaW5lclxuICAgIH0pO1xuICB9XG59O1xuXG4vKipcbiAqIE5hdmlnYXRlIHRoZSBmaW5kZXIgdXAsIGRvd24sIHJpZ2h0LCBvciBsZWZ0XG4gKiBAcGFyYW0gIHtvYmplY3R9IGNvbmZpZ1xuICogQHBhcmFtICB7b2JqZWN0fSBldmVudCBlbWl0dGVyXG4gKiBAcGFyYW0gIHtvYmplY3R9IGV2ZW50IHZhbHVlIC0gYGNvbnRhaW5lcmAgcHJvcCBjb250YWlucyBhIHJlZmVyZW5jZSB0byB0aGVcbiAqIGNvbnRhaW5lciwgYW5kIGBkaXJlY3Rpb25gIGNhbiBiZSAndXAnLCAnZG93bicsICdyaWdodCcsICdsZWZ0J1xuICovXG5maW5kZXIubmF2aWdhdGUgPSBmdW5jdGlvbiBuYXZpZ2F0ZShjZmcsIGVtaXR0ZXIsIHZhbHVlKSB7XG4gIHZhciBhY3RpdmUgPSBmaW5kZXIuZmluZExhc3RBY3RpdmUodmFsdWUuY29udGFpbmVyLCBjZmcpO1xuICB2YXIgdGFyZ2V0ID0gbnVsbDtcbiAgdmFyIGRpciA9IHZhbHVlLmRpcmVjdGlvbjtcbiAgdmFyIGl0ZW07XG4gIHZhciBjb2w7XG5cbiAgaWYgKGFjdGl2ZSkge1xuICAgIGl0ZW0gPSBhY3RpdmUuaXRlbTtcbiAgICBjb2wgPSBhY3RpdmUuY29sO1xuXG4gICAgaWYgKGRpciA9PT0gJ3VwJyAmJiBpdGVtLnByZXZpb3VzU2libGluZykge1xuICAgICAgdGFyZ2V0ID0gaXRlbS5wcmV2aW91c1NpYmxpbmc7XG4gICAgfSBlbHNlIGlmIChkaXIgPT09ICdkb3duJyAmJiBpdGVtLm5leHRTaWJsaW5nKSB7XG4gICAgICB0YXJnZXQgPSBpdGVtLm5leHRTaWJsaW5nO1xuICAgIH0gZWxzZSBpZiAoZGlyID09PSAncmlnaHQnICYmIGNvbC5uZXh0U2libGluZykge1xuICAgICAgY29sID0gY29sLm5leHRTaWJsaW5nO1xuICAgICAgdGFyZ2V0ID0gXy5maXJzdChjb2wsICcuJyArIGNmZy5jbGFzc05hbWUuaXRlbSk7XG4gICAgfSBlbHNlIGlmIChkaXIgPT09ICdsZWZ0JyAmJiBjb2wucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICBjb2wgPSBjb2wucHJldmlvdXNTaWJsaW5nO1xuICAgICAgdGFyZ2V0ID0gXy5maXJzdChjb2wsICcuJyArIGNmZy5jbGFzc05hbWUuYWN0aXZlKSB8fFxuICAgICAgICBfLmZpcnN0KGNvbCwgJy4nICsgY2ZnLmNsYXNzTmFtZS5pdGVtKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29sID0gXy5maXJzdCh2YWx1ZS5jb250YWluZXIsICcuJyArIGNmZy5jbGFzc05hbWUuY29sKTtcbiAgICB0YXJnZXQgPSBfLmZpcnN0KGNvbCwgJy4nICsgY2ZnLmNsYXNzTmFtZS5pdGVtKTtcbiAgfVxuXG4gIGlmICh0YXJnZXQpIHtcbiAgICBlbWl0dGVyLmVtaXQoJ2l0ZW0tc2VsZWN0ZWQnLCB7XG4gICAgICBjb2w6IGNvbCxcbiAgICAgIGl0ZW06IHRhcmdldFxuICAgIH0pO1xuICB9XG59O1xuXG4vKipcbiAqIEZpbmQgbGFzdCAocmlnaHQtbW9zdCkgYWN0aXZlIGl0ZW0gYW5kIGNvbHVtblxuICogQHBhcmFtICB7RWxlbWVudH0gY29udGFpbmVyXG4gKiBAcGFyYW0gIHtPYmplY3R9IGNvbmZpZ1xuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5maW5kZXIuZmluZExhc3RBY3RpdmUgPSBmdW5jdGlvbiBmaW5kTGFzdEFjdGl2ZShjb250YWluZXIsIGNmZykge1xuICB2YXIgYWN0aXZlSXRlbXMgPSBjb250YWluZXIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjZmcuY2xhc3NOYW1lLmFjdGl2ZSk7XG4gIHZhciBpdGVtO1xuICB2YXIgY29sO1xuXG4gIGlmICghYWN0aXZlSXRlbXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpdGVtID0gYWN0aXZlSXRlbXNbYWN0aXZlSXRlbXMubGVuZ3RoIC0gMV07XG4gIGNvbCA9IF8uY2xvc2VzdChpdGVtLCBmdW5jdGlvbiB0ZXN0KGVsKSB7XG4gICAgcmV0dXJuIF8uaGFzQ2xhc3MoZWwsIGNmZy5jbGFzc05hbWUuY29sKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBjb2w6IGNvbCxcbiAgICBpdGVtOiBpdGVtXG4gIH07XG59O1xuXG4vKipcbiAqIEBwYXJhbSAge29iamVjdH0gZGF0YVxuICogQHBhcmFtICB7b2JqZWN0fSBjb25maWdcbiAqIEBwYXJhbSAge29iamVjdH0gZXZlbnQgZW1pdHRlclxuICogQHBhcmFtICB7cGFyZW50fSBbcGFyZW50XSAtIHBhcmVudCBpdGVtIHRoYXQgY2xpY2tlZC90cmlnZ2VyZWQgY3JlYXRlQ29sdW1uXG4gKiBAcmV0dXJuIHtlbGVtZW50fSBjb2x1bW5cbiAqL1xuZmluZGVyLmNyZWF0ZUNvbHVtbiA9IGZ1bmN0aW9uIGNyZWF0ZUNvbHVtbihkYXRhLCBjZmcsIGVtaXR0ZXIsIHBhcmVudCkge1xuICB2YXIgZGl2O1xuICB2YXIgbGlzdDtcbiAgZnVuY3Rpb24gY2FsbGJhY2soZGF0YSkge1xuICAgIGZpbmRlci5jcmVhdGVDb2x1bW4oZGF0YSwgY2ZnLCBlbWl0dGVyLCBwYXJlbnQpO1xuICB9O1xuXG4gIGlmICh0eXBlb2YgZGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGRhdGEuY2FsbChudWxsLCBwYXJlbnQsIGNmZywgY2FsbGJhY2spO1xuICB9IGVsc2UgaWYgKGlzQXJyYXkoZGF0YSkpIHtcbiAgICBsaXN0ID0gZmluZGVyLmNyZWF0ZUxpc3QoZGF0YSwgY2ZnKTtcbiAgICBkaXYgPSBfLmVsKCdkaXYnKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQobGlzdCk7XG4gICAgXy5hZGRDbGFzcyhkaXYsIGNmZy5jbGFzc05hbWUuY29sKTtcblxuICAgIGVtaXR0ZXIuZW1pdCgnY3JlYXRlLWNvbHVtbicsIGRpdik7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGRhdGEgdHlwZScpO1xuICB9XG59O1xuXG4vKipcbiAqIEBwYXJhbSAge2FycmF5fSBkYXRhXG4gKiBAcGFyYW0gIHtvYmplY3R9IGNvbmZpZ1xuICogQHJldHVybiB7ZWxlbWVudH0gbGlzdFxuICovXG5maW5kZXIuY3JlYXRlTGlzdCA9IGZ1bmN0aW9uIGNyZWF0ZUxpc3QoZGF0YSwgY2ZnKSB7XG4gIHZhciB1bCA9IF8uZWwoJ3VsJyk7XG4gIHZhciBpdGVtcyA9IGRhdGEubWFwKGZpbmRlci5jcmVhdGVJdGVtLmJpbmQobnVsbCwgY2ZnKSk7XG4gIHZhciBkb2NGcmFnO1xuXG4gIGRvY0ZyYWcgPSBpdGVtcy5yZWR1Y2UoZnVuY3Rpb24gZWFjaChkb2NGcmFnLCBjdXJyKSB7XG4gICAgZG9jRnJhZy5hcHBlbmRDaGlsZChjdXJyKTtcbiAgICByZXR1cm4gZG9jRnJhZztcbiAgfSwgZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpKTtcblxuICB1bC5hcHBlbmRDaGlsZChkb2NGcmFnKTtcbiAgXy5hZGRDbGFzcyh1bCwgY2ZnLmNsYXNzTmFtZS5saXN0KTtcblxuICByZXR1cm4gdWw7XG59O1xuXG4vKipcbiAqIERlZmF1bHQgaXRlbSByZW5kZXIgZm5cbiAqIEBwYXJhbSAge29iamVjdH0gY2ZnIGNvbmZpZyBvYmplY3RcbiAqIEBwYXJhbSAge29iamVjdH0gaXRlbSBkYXRhXG4gKiBAcmV0dXJuIHtEb2N1bWVudEZyYWdtZW50fVxuICovXG5maW5kZXIuY3JlYXRlSXRlbUNvbnRlbnQgPSBmdW5jdGlvbiBjcmVhdGVJdGVtQ29udGVudChjZmcsIGl0ZW0pIHtcbiAgdmFyIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIHZhciBwcmVwZW5kID0gXy5lbCgnZGl2LicgKyBjZmcuY2xhc3NOYW1lLml0ZW1QcmVwZW5kKTtcbiAgdmFyIGNvbnRlbnQgPSBfLmVsKCdkaXYuJyArIGNmZy5jbGFzc05hbWUuaXRlbUNvbnRlbnQpO1xuICB2YXIgYXBwZW5kID0gXy5lbCgnZGl2LicgKyBjZmcuY2xhc3NOYW1lLml0ZW1BcHBlbmQpO1xuXG4gIGZyYWcuYXBwZW5kQ2hpbGQocHJlcGVuZCk7XG4gIGNvbnRlbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaXRlbS5sYWJlbCkpO1xuICBmcmFnLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuICBmcmFnLmFwcGVuZENoaWxkKGFwcGVuZCk7XG5cbiAgcmV0dXJuIGZyYWc7XG59O1xuXG4vKipcbiAqIEBwYXJhbSAge29iamVjdH0gY2ZnIGNvbmZpZyBvYmplY3RcbiAqIEBwYXJhbSAge29iamVjdH0gaXRlbSBkYXRhXG4gKiBAcmV0dXJuIHtlbGVtZW50fSBsaXN0IGl0ZW1cbiAqL1xuZmluZGVyLmNyZWF0ZUl0ZW0gPSBmdW5jdGlvbiBjcmVhdGVJdGVtKGNmZywgaXRlbSkge1xuICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgdmFyIGxpQ2xhc3NOYW1lcyA9IFtjZmcuY2xhc3NOYW1lLml0ZW1dO1xuICB2YXIgbGkgPSBfLmVsKCdsaScpO1xuICB2YXIgYSA9IF8uZWwoJ2EnKTtcbiAgdmFyIGNyZWF0ZUl0ZW1Db250ZW50ID0gY2ZnLmNyZWF0ZUl0ZW1Db250ZW50IHx8IGZpbmRlci5jcmVhdGVJdGVtQ29udGVudDtcblxuICBmcmFnID0gY3JlYXRlSXRlbUNvbnRlbnQuY2FsbChudWxsLCBjZmcsIGl0ZW0pO1xuICBhLmFwcGVuZENoaWxkKGZyYWcpO1xuXG4gIGEuaHJlZiA9ICcnO1xuICBhLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAtMSk7XG4gIGlmIChpdGVtLnVybCkge1xuICAgIGEuaHJlZiA9IGl0ZW0udXJsO1xuICAgIGxpQ2xhc3NOYW1lcy5wdXNoKGNmZy5jbGFzc05hbWUudXJsKTtcbiAgfVxuICBpZiAoaXRlbS5jbGFzc05hbWUpIHtcbiAgICBsaUNsYXNzTmFtZXMucHVzaChpdGVtLmNsYXNzTmFtZSk7XG4gIH1cbiAgaWYgKGl0ZW0uY2hpbGRyZW4pIHtcbiAgICBsaUNsYXNzTmFtZXMucHVzaChjZmcuY2xhc3NOYW1lLmNoaWxkcmVuKTtcbiAgfVxuICBfLmFkZENsYXNzKGxpLCBsaUNsYXNzTmFtZXMpO1xuICBsaS5hcHBlbmRDaGlsZChhKTtcbiAgbGkuX2l0ZW0gPSBpdGVtO1xuXG4gIHJldHVybiBsaTtcbn07XG4iLG51bGwsIid1c2Ugc3RyaWN0JztcblxuLy9cbi8vIFdlIHN0b3JlIG91ciBFRSBvYmplY3RzIGluIGEgcGxhaW4gb2JqZWN0IHdob3NlIHByb3BlcnRpZXMgYXJlIGV2ZW50IG5hbWVzLlxuLy8gSWYgYE9iamVjdC5jcmVhdGUobnVsbClgIGlzIG5vdCBzdXBwb3J0ZWQgd2UgcHJlZml4IHRoZSBldmVudCBuYW1lcyB3aXRoIGFcbi8vIGB+YCB0byBtYWtlIHN1cmUgdGhhdCB0aGUgYnVpbHQtaW4gb2JqZWN0IHByb3BlcnRpZXMgYXJlIG5vdCBvdmVycmlkZGVuIG9yXG4vLyB1c2VkIGFzIGFuIGF0dGFjayB2ZWN0b3IuXG4vLyBXZSBhbHNvIGFzc3VtZSB0aGF0IGBPYmplY3QuY3JlYXRlKG51bGwpYCBpcyBhdmFpbGFibGUgd2hlbiB0aGUgZXZlbnQgbmFtZVxuLy8gaXMgYW4gRVM2IFN5bWJvbC5cbi8vXG52YXIgcHJlZml4ID0gdHlwZW9mIE9iamVjdC5jcmVhdGUgIT09ICdmdW5jdGlvbicgPyAnficgOiBmYWxzZTtcblxuLyoqXG4gKiBSZXByZXNlbnRhdGlvbiBvZiBhIHNpbmdsZSBFdmVudEVtaXR0ZXIgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gRXZlbnQgaGFuZGxlciB0byBiZSBjYWxsZWQuXG4gKiBAcGFyYW0ge01peGVkfSBjb250ZXh0IENvbnRleHQgZm9yIGZ1bmN0aW9uIGV4ZWN1dGlvbi5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb25jZSBPbmx5IGVtaXQgb25jZVxuICogQGFwaSBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIEVFKGZuLCBjb250ZXh0LCBvbmNlKSB7XG4gIHRoaXMuZm4gPSBmbjtcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgdGhpcy5vbmNlID0gb25jZSB8fCBmYWxzZTtcbn1cblxuLyoqXG4gKiBNaW5pbWFsIEV2ZW50RW1pdHRlciBpbnRlcmZhY2UgdGhhdCBpcyBtb2xkZWQgYWdhaW5zdCB0aGUgTm9kZS5qc1xuICogRXZlbnRFbWl0dGVyIGludGVyZmFjZS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhcGkgcHVibGljXG4gKi9cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHsgLyogTm90aGluZyB0byBzZXQgKi8gfVxuXG4vKipcbiAqIEhvbGRzIHRoZSBhc3NpZ25lZCBFdmVudEVtaXR0ZXJzIGJ5IG5hbWUuXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqIEBwcml2YXRlXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBSZXR1cm4gYSBsaXN0IG9mIGFzc2lnbmVkIGV2ZW50IGxpc3RlbmVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQgVGhlIGV2ZW50cyB0aGF0IHNob3VsZCBiZSBsaXN0ZWQuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGV4aXN0cyBXZSBvbmx5IG5lZWQgdG8ga25vdyBpZiB0aGVyZSBhcmUgbGlzdGVuZXJzLlxuICogQHJldHVybnMge0FycmF5fEJvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uIGxpc3RlbmVycyhldmVudCwgZXhpc3RzKSB7XG4gIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50XG4gICAgLCBhdmFpbGFibGUgPSB0aGlzLl9ldmVudHMgJiYgdGhpcy5fZXZlbnRzW2V2dF07XG5cbiAgaWYgKGV4aXN0cykgcmV0dXJuICEhYXZhaWxhYmxlO1xuICBpZiAoIWF2YWlsYWJsZSkgcmV0dXJuIFtdO1xuICBpZiAoYXZhaWxhYmxlLmZuKSByZXR1cm4gW2F2YWlsYWJsZS5mbl07XG5cbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBhdmFpbGFibGUubGVuZ3RoLCBlZSA9IG5ldyBBcnJheShsKTsgaSA8IGw7IGkrKykge1xuICAgIGVlW2ldID0gYXZhaWxhYmxlW2ldLmZuO1xuICB9XG5cbiAgcmV0dXJuIGVlO1xufTtcblxuLyoqXG4gKiBFbWl0IGFuIGV2ZW50IHRvIGFsbCByZWdpc3RlcmVkIGV2ZW50IGxpc3RlbmVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQgVGhlIG5hbWUgb2YgdGhlIGV2ZW50LlxuICogQHJldHVybnMge0Jvb2xlYW59IEluZGljYXRpb24gaWYgd2UndmUgZW1pdHRlZCBhbiBldmVudC5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQoZXZlbnQsIGExLCBhMiwgYTMsIGE0LCBhNSkge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW2V2dF0pIHJldHVybiBmYWxzZTtcblxuICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW2V2dF1cbiAgICAsIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIGFyZ3NcbiAgICAsIGk7XG5cbiAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBsaXN0ZW5lcnMuZm4pIHtcbiAgICBpZiAobGlzdGVuZXJzLm9uY2UpIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVycy5mbiwgdW5kZWZpbmVkLCB0cnVlKTtcblxuICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCksIHRydWU7XG4gICAgICBjYXNlIDI6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEpLCB0cnVlO1xuICAgICAgY2FzZSAzOiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiksIHRydWU7XG4gICAgICBjYXNlIDQ6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMyksIHRydWU7XG4gICAgICBjYXNlIDU6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMywgYTQpLCB0cnVlO1xuICAgICAgY2FzZSA2OiByZXR1cm4gbGlzdGVuZXJzLmZuLmNhbGwobGlzdGVuZXJzLmNvbnRleHQsIGExLCBhMiwgYTMsIGE0LCBhNSksIHRydWU7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMSwgYXJncyA9IG5ldyBBcnJheShsZW4gLTEpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgIH1cblxuICAgIGxpc3RlbmVycy5mbi5hcHBseShsaXN0ZW5lcnMuY29udGV4dCwgYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGhcbiAgICAgICwgajtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGxpc3RlbmVyc1tpXS5vbmNlKSB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcnNbaV0uZm4sIHVuZGVmaW5lZCwgdHJ1ZSk7XG5cbiAgICAgIHN3aXRjaCAobGVuKSB7XG4gICAgICAgIGNhc2UgMTogbGlzdGVuZXJzW2ldLmZuLmNhbGwobGlzdGVuZXJzW2ldLmNvbnRleHQpOyBicmVhaztcbiAgICAgICAgY2FzZSAyOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEpOyBicmVhaztcbiAgICAgICAgY2FzZSAzOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEsIGEyKTsgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgaWYgKCFhcmdzKSBmb3IgKGogPSAxLCBhcmdzID0gbmV3IEFycmF5KGxlbiAtMSk7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgYXJnc1tqIC0gMV0gPSBhcmd1bWVudHNbal07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGlzdGVuZXJzW2ldLmZuLmFwcGx5KGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qKlxuICogUmVnaXN0ZXIgYSBuZXcgRXZlbnRMaXN0ZW5lciBmb3IgdGhlIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudCBOYW1lIG9mIHRoZSBldmVudC5cbiAqIEBwYXJhbSB7RnVuY3Rvbn0gZm4gQ2FsbGJhY2sgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge01peGVkfSBjb250ZXh0IFRoZSBjb250ZXh0IG9mIHRoZSBmdW5jdGlvbi5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBmdW5jdGlvbiBvbihldmVudCwgZm4sIGNvbnRleHQpIHtcbiAgdmFyIGxpc3RlbmVyID0gbmV3IEVFKGZuLCBjb250ZXh0IHx8IHRoaXMpXG4gICAgLCBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKSB0aGlzLl9ldmVudHMgPSBwcmVmaXggPyB7fSA6IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHRoaXMuX2V2ZW50c1tldnRdID0gbGlzdGVuZXI7XG4gIGVsc2Uge1xuICAgIGlmICghdGhpcy5fZXZlbnRzW2V2dF0uZm4pIHRoaXMuX2V2ZW50c1tldnRdLnB1c2gobGlzdGVuZXIpO1xuICAgIGVsc2UgdGhpcy5fZXZlbnRzW2V2dF0gPSBbXG4gICAgICB0aGlzLl9ldmVudHNbZXZ0XSwgbGlzdGVuZXJcbiAgICBdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZCBhbiBFdmVudExpc3RlbmVyIHRoYXQncyBvbmx5IGNhbGxlZCBvbmNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudCBOYW1lIG9mIHRoZSBldmVudC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIENhbGxiYWNrIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtNaXhlZH0gY29udGV4dCBUaGUgY29udGV4dCBvZiB0aGUgZnVuY3Rpb24uXG4gKiBAYXBpIHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbiBvbmNlKGV2ZW50LCBmbiwgY29udGV4dCkge1xuICB2YXIgbGlzdGVuZXIgPSBuZXcgRUUoZm4sIGNvbnRleHQgfHwgdGhpcywgdHJ1ZSlcbiAgICAsIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHByZWZpeCA/IHt9IDogT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgdGhpcy5fZXZlbnRzW2V2dF0gPSBsaXN0ZW5lcjtcbiAgZWxzZSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XS5mbikgdGhpcy5fZXZlbnRzW2V2dF0ucHVzaChsaXN0ZW5lcik7XG4gICAgZWxzZSB0aGlzLl9ldmVudHNbZXZ0XSA9IFtcbiAgICAgIHRoaXMuX2V2ZW50c1tldnRdLCBsaXN0ZW5lclxuICAgIF07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIGV2ZW50IGxpc3RlbmVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQgVGhlIGV2ZW50IHdlIHdhbnQgdG8gcmVtb3ZlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIHRoYXQgd2UgbmVlZCB0byBmaW5kLlxuICogQHBhcmFtIHtNaXhlZH0gY29udGV4dCBPbmx5IHJlbW92ZSBsaXN0ZW5lcnMgbWF0Y2hpbmcgdGhpcyBjb250ZXh0LlxuICogQHBhcmFtIHtCb29sZWFufSBvbmNlIE9ubHkgcmVtb3ZlIG9uY2UgbGlzdGVuZXJzLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKGV2ZW50LCBmbiwgY29udGV4dCwgb25jZSkge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW2V2dF0pIHJldHVybiB0aGlzO1xuXG4gIHZhciBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbZXZ0XVxuICAgICwgZXZlbnRzID0gW107XG5cbiAgaWYgKGZuKSB7XG4gICAgaWYgKGxpc3RlbmVycy5mbikge1xuICAgICAgaWYgKFxuICAgICAgICAgICBsaXN0ZW5lcnMuZm4gIT09IGZuXG4gICAgICAgIHx8IChvbmNlICYmICFsaXN0ZW5lcnMub25jZSlcbiAgICAgICAgfHwgKGNvbnRleHQgJiYgbGlzdGVuZXJzLmNvbnRleHQgIT09IGNvbnRleHQpXG4gICAgICApIHtcbiAgICAgICAgZXZlbnRzLnB1c2gobGlzdGVuZXJzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICAgbGlzdGVuZXJzW2ldLmZuICE9PSBmblxuICAgICAgICAgIHx8IChvbmNlICYmICFsaXN0ZW5lcnNbaV0ub25jZSlcbiAgICAgICAgICB8fCAoY29udGV4dCAmJiBsaXN0ZW5lcnNbaV0uY29udGV4dCAhPT0gY29udGV4dClcbiAgICAgICAgKSB7XG4gICAgICAgICAgZXZlbnRzLnB1c2gobGlzdGVuZXJzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vXG4gIC8vIFJlc2V0IHRoZSBhcnJheSwgb3IgcmVtb3ZlIGl0IGNvbXBsZXRlbHkgaWYgd2UgaGF2ZSBubyBtb3JlIGxpc3RlbmVycy5cbiAgLy9cbiAgaWYgKGV2ZW50cy5sZW5ndGgpIHtcbiAgICB0aGlzLl9ldmVudHNbZXZ0XSA9IGV2ZW50cy5sZW5ndGggPT09IDEgPyBldmVudHNbMF0gOiBldmVudHM7XG4gIH0gZWxzZSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldnRdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbGwgbGlzdGVuZXJzIG9yIG9ubHkgdGhlIGxpc3RlbmVycyBmb3IgdGhlIHNwZWNpZmllZCBldmVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQgVGhlIGV2ZW50IHdhbnQgdG8gcmVtb3ZlIGFsbCBsaXN0ZW5lcnMgZm9yLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbiByZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnQpIHtcbiAgaWYgKCF0aGlzLl9ldmVudHMpIHJldHVybiB0aGlzO1xuXG4gIGlmIChldmVudCkgZGVsZXRlIHRoaXMuX2V2ZW50c1twcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50XTtcbiAgZWxzZSB0aGlzLl9ldmVudHMgPSBwcmVmaXggPyB7fSA6IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vL1xuLy8gQWxpYXMgbWV0aG9kcyBuYW1lcyBiZWNhdXNlIHBlb3BsZSByb2xsIGxpa2UgdGhhdC5cbi8vXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbjtcblxuLy9cbi8vIFRoaXMgZnVuY3Rpb24gZG9lc24ndCBhcHBseSBhbnltb3JlLlxuLy9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24gc2V0TWF4TGlzdGVuZXJzKCkge1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vXG4vLyBFeHBvc2UgdGhlIHByZWZpeC5cbi8vXG5FdmVudEVtaXR0ZXIucHJlZml4ZWQgPSBwcmVmaXg7XG5cbi8vXG4vLyBFeHBvc2UgdGhlIG1vZHVsZS5cbi8vXG5pZiAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBtb2R1bGUpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG59XG4iLCJ2YXIgdG9wTGV2ZWwgPSB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6XG4gICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB7fVxudmFyIG1pbkRvYyA9IHJlcXVpcmUoJ21pbi1kb2N1bWVudCcpO1xuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQ7XG59IGVsc2Uge1xuICAgIHZhciBkb2NjeSA9IHRvcExldmVsWydfX0dMT0JBTF9ET0NVTUVOVF9DQUNIRUA0J107XG5cbiAgICBpZiAoIWRvY2N5KSB7XG4gICAgICAgIGRvY2N5ID0gdG9wTGV2ZWxbJ19fR0xPQkFMX0RPQ1VNRU5UX0NBQ0hFQDQnXSA9IG1pbkRvYztcbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGRvY2N5O1xufVxuIiwiaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHdpbmRvdztcbn0gZWxzZSBpZiAodHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZ2xvYmFsO1xufSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBzZWxmO1xufSBlbHNlIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHt9O1xufVxuIiwidmFyIG5hdGl2ZUlzQXJyYXkgPSBBcnJheS5pc0FycmF5XG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nXG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlSXNBcnJheSB8fCBpc0FycmF5XG5cbmZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiXG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciB3aW5kb3cgPSByZXF1aXJlKFwiZ2xvYmFsL3dpbmRvd1wiKVxudmFyIG9uY2UgPSByZXF1aXJlKFwib25jZVwiKVxudmFyIHBhcnNlSGVhZGVycyA9IHJlcXVpcmUoXCJwYXJzZS1oZWFkZXJzXCIpXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZVhIUlxuY3JlYXRlWEhSLlhNTEh0dHBSZXF1ZXN0ID0gd2luZG93LlhNTEh0dHBSZXF1ZXN0IHx8IG5vb3BcbmNyZWF0ZVhIUi5YRG9tYWluUmVxdWVzdCA9IFwid2l0aENyZWRlbnRpYWxzXCIgaW4gKG5ldyBjcmVhdGVYSFIuWE1MSHR0cFJlcXVlc3QoKSkgPyBjcmVhdGVYSFIuWE1MSHR0cFJlcXVlc3QgOiB3aW5kb3cuWERvbWFpblJlcXVlc3RcblxuXG5mdW5jdGlvbiBpc0VtcHR5KG9iail7XG4gICAgZm9yKHZhciBpIGluIG9iail7XG4gICAgICAgIGlmKG9iai5oYXNPd25Qcm9wZXJ0eShpKSkgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVhIUihvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIGZ1bmN0aW9uIHJlYWR5c3RhdGVjaGFuZ2UoKSB7XG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgbG9hZEZ1bmMoKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Qm9keSgpIHtcbiAgICAgICAgLy8gQ2hyb21lIHdpdGggcmVxdWVzdFR5cGU9YmxvYiB0aHJvd3MgZXJyb3JzIGFycm91bmQgd2hlbiBldmVuIHRlc3RpbmcgYWNjZXNzIHRvIHJlc3BvbnNlVGV4dFxuICAgICAgICB2YXIgYm9keSA9IHVuZGVmaW5lZFxuXG4gICAgICAgIGlmICh4aHIucmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGJvZHkgPSB4aHIucmVzcG9uc2VcbiAgICAgICAgfSBlbHNlIGlmICh4aHIucmVzcG9uc2VUeXBlID09PSBcInRleHRcIiB8fCAheGhyLnJlc3BvbnNlVHlwZSkge1xuICAgICAgICAgICAgYm9keSA9IHhoci5yZXNwb25zZVRleHQgfHwgeGhyLnJlc3BvbnNlWE1MXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNKc29uKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGJvZHkgPSBKU09OLnBhcnNlKGJvZHkpXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJvZHlcbiAgICB9XG5cbiAgICB2YXIgZmFpbHVyZVJlc3BvbnNlID0ge1xuICAgICAgICAgICAgICAgIGJvZHk6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiAwLFxuICAgICAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgICAgIHVybDogdXJpLFxuICAgICAgICAgICAgICAgIHJhd1JlcXVlc3Q6IHhoclxuICAgICAgICAgICAgfVxuXG4gICAgZnVuY3Rpb24gZXJyb3JGdW5jKGV2dCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dFRpbWVyKVxuICAgICAgICBpZighKGV2dCBpbnN0YW5jZW9mIEVycm9yKSl7XG4gICAgICAgICAgICBldnQgPSBuZXcgRXJyb3IoXCJcIiArIChldnQgfHwgXCJVbmtub3duIFhNTEh0dHBSZXF1ZXN0IEVycm9yXCIpIClcbiAgICAgICAgfVxuICAgICAgICBldnQuc3RhdHVzQ29kZSA9IDBcbiAgICAgICAgY2FsbGJhY2soZXZ0LCBmYWlsdXJlUmVzcG9uc2UpXG4gICAgfVxuXG4gICAgLy8gd2lsbCBsb2FkIHRoZSBkYXRhICYgcHJvY2VzcyB0aGUgcmVzcG9uc2UgaW4gYSBzcGVjaWFsIHJlc3BvbnNlIG9iamVjdFxuICAgIGZ1bmN0aW9uIGxvYWRGdW5jKCkge1xuICAgICAgICBpZiAoYWJvcnRlZCkgcmV0dXJuXG4gICAgICAgIHZhciBzdGF0dXNcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRUaW1lcilcbiAgICAgICAgaWYob3B0aW9ucy51c2VYRFIgJiYgeGhyLnN0YXR1cz09PXVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy9JRTggQ09SUyBHRVQgc3VjY2Vzc2Z1bCByZXNwb25zZSBkb2Vzbid0IGhhdmUgYSBzdGF0dXMgZmllbGQsIGJ1dCBib2R5IGlzIGZpbmVcbiAgICAgICAgICAgIHN0YXR1cyA9IDIwMFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdHVzID0gKHhoci5zdGF0dXMgPT09IDEyMjMgPyAyMDQgOiB4aHIuc3RhdHVzKVxuICAgICAgICB9XG4gICAgICAgIHZhciByZXNwb25zZSA9IGZhaWx1cmVSZXNwb25zZVxuICAgICAgICB2YXIgZXJyID0gbnVsbFxuXG4gICAgICAgIGlmIChzdGF0dXMgIT09IDApe1xuICAgICAgICAgICAgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgICAgICAgYm9keTogZ2V0Qm9keSgpLFxuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IHN0YXR1cyxcbiAgICAgICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgICAgICAgICB1cmw6IHVyaSxcbiAgICAgICAgICAgICAgICByYXdSZXF1ZXN0OiB4aHJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMpeyAvL3JlbWVtYmVyIHhociBjYW4gaW4gZmFjdCBiZSBYRFIgZm9yIENPUlMgaW4gSUVcbiAgICAgICAgICAgICAgICByZXNwb25zZS5oZWFkZXJzID0gcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVyciA9IG5ldyBFcnJvcihcIkludGVybmFsIFhNTEh0dHBSZXF1ZXN0IEVycm9yXCIpXG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXNwb25zZSwgcmVzcG9uc2UuYm9keSlcblxuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBvcHRpb25zID0geyB1cmk6IG9wdGlvbnMgfVxuICAgIH1cblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgaWYodHlwZW9mIGNhbGxiYWNrID09PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiY2FsbGJhY2sgYXJndW1lbnQgbWlzc2luZ1wiKVxuICAgIH1cbiAgICBjYWxsYmFjayA9IG9uY2UoY2FsbGJhY2spXG5cbiAgICB2YXIgeGhyID0gb3B0aW9ucy54aHIgfHwgbnVsbFxuXG4gICAgaWYgKCF4aHIpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuY29ycyB8fCBvcHRpb25zLnVzZVhEUikge1xuICAgICAgICAgICAgeGhyID0gbmV3IGNyZWF0ZVhIUi5YRG9tYWluUmVxdWVzdCgpXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgeGhyID0gbmV3IGNyZWF0ZVhIUi5YTUxIdHRwUmVxdWVzdCgpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIga2V5XG4gICAgdmFyIGFib3J0ZWRcbiAgICB2YXIgdXJpID0geGhyLnVybCA9IG9wdGlvbnMudXJpIHx8IG9wdGlvbnMudXJsXG4gICAgdmFyIG1ldGhvZCA9IHhoci5tZXRob2QgPSBvcHRpb25zLm1ldGhvZCB8fCBcIkdFVFwiXG4gICAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHkgfHwgb3B0aW9ucy5kYXRhXG4gICAgdmFyIGhlYWRlcnMgPSB4aHIuaGVhZGVycyA9IG9wdGlvbnMuaGVhZGVycyB8fCB7fVxuICAgIHZhciBzeW5jID0gISFvcHRpb25zLnN5bmNcbiAgICB2YXIgaXNKc29uID0gZmFsc2VcbiAgICB2YXIgdGltZW91dFRpbWVyXG5cbiAgICBpZiAoXCJqc29uXCIgaW4gb3B0aW9ucykge1xuICAgICAgICBpc0pzb24gPSB0cnVlXG4gICAgICAgIGhlYWRlcnNbXCJhY2NlcHRcIl0gfHwgaGVhZGVyc1tcIkFjY2VwdFwiXSB8fCAoaGVhZGVyc1tcIkFjY2VwdFwiXSA9IFwiYXBwbGljYXRpb24vanNvblwiKSAvL0Rvbid0IG92ZXJyaWRlIGV4aXN0aW5nIGFjY2VwdCBoZWFkZXIgZGVjbGFyZWQgYnkgdXNlclxuICAgICAgICBpZiAobWV0aG9kICE9PSBcIkdFVFwiICYmIG1ldGhvZCAhPT0gXCJIRUFEXCIpIHtcbiAgICAgICAgICAgIGhlYWRlcnNbXCJjb250ZW50LXR5cGVcIl0gfHwgaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXSB8fCAoaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXSA9IFwiYXBwbGljYXRpb24vanNvblwiKSAvL0Rvbid0IG92ZXJyaWRlIGV4aXN0aW5nIGFjY2VwdCBoZWFkZXIgZGVjbGFyZWQgYnkgdXNlclxuICAgICAgICAgICAgYm9keSA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuanNvbilcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSByZWFkeXN0YXRlY2hhbmdlXG4gICAgeGhyLm9ubG9hZCA9IGxvYWRGdW5jXG4gICAgeGhyLm9uZXJyb3IgPSBlcnJvckZ1bmNcbiAgICAvLyBJRTkgbXVzdCBoYXZlIG9ucHJvZ3Jlc3MgYmUgc2V0IHRvIGEgdW5pcXVlIGZ1bmN0aW9uLlxuICAgIHhoci5vbnByb2dyZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBJRSBtdXN0IGRpZVxuICAgIH1cbiAgICB4aHIub250aW1lb3V0ID0gZXJyb3JGdW5jXG4gICAgeGhyLm9wZW4obWV0aG9kLCB1cmksICFzeW5jLCBvcHRpb25zLnVzZXJuYW1lLCBvcHRpb25zLnBhc3N3b3JkKVxuICAgIC8vaGFzIHRvIGJlIGFmdGVyIG9wZW5cbiAgICBpZighc3luYykge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gISFvcHRpb25zLndpdGhDcmVkZW50aWFsc1xuICAgIH1cbiAgICAvLyBDYW5ub3Qgc2V0IHRpbWVvdXQgd2l0aCBzeW5jIHJlcXVlc3RcbiAgICAvLyBub3Qgc2V0dGluZyB0aW1lb3V0IG9uIHRoZSB4aHIgb2JqZWN0LCBiZWNhdXNlIG9mIG9sZCB3ZWJraXRzIGV0Yy4gbm90IGhhbmRsaW5nIHRoYXQgY29ycmVjdGx5XG4gICAgLy8gYm90aCBucG0ncyByZXF1ZXN0IGFuZCBqcXVlcnkgMS54IHVzZSB0aGlzIGtpbmQgb2YgdGltZW91dCwgc28gdGhpcyBpcyBiZWluZyBjb25zaXN0ZW50XG4gICAgaWYgKCFzeW5jICYmIG9wdGlvbnMudGltZW91dCA+IDAgKSB7XG4gICAgICAgIHRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGFib3J0ZWQ9dHJ1ZS8vSUU5IG1heSBzdGlsbCBjYWxsIHJlYWR5c3RhdGVjaGFuZ2VcbiAgICAgICAgICAgIHhoci5hYm9ydChcInRpbWVvdXRcIilcbiAgICAgICAgICAgIHZhciBlID0gbmV3IEVycm9yKFwiWE1MSHR0cFJlcXVlc3QgdGltZW91dFwiKVxuICAgICAgICAgICAgZS5jb2RlID0gXCJFVElNRURPVVRcIlxuICAgICAgICAgICAgZXJyb3JGdW5jKGUpXG4gICAgICAgIH0sIG9wdGlvbnMudGltZW91dCApXG4gICAgfVxuXG4gICAgaWYgKHhoci5zZXRSZXF1ZXN0SGVhZGVyKSB7XG4gICAgICAgIGZvcihrZXkgaW4gaGVhZGVycyl7XG4gICAgICAgICAgICBpZihoZWFkZXJzLmhhc093blByb3BlcnR5KGtleSkpe1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgaGVhZGVyc1trZXldKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmhlYWRlcnMgJiYgIWlzRW1wdHkob3B0aW9ucy5oZWFkZXJzKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJIZWFkZXJzIGNhbm5vdCBiZSBzZXQgb24gYW4gWERvbWFpblJlcXVlc3Qgb2JqZWN0XCIpXG4gICAgfVxuXG4gICAgaWYgKFwicmVzcG9uc2VUeXBlXCIgaW4gb3B0aW9ucykge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gb3B0aW9ucy5yZXNwb25zZVR5cGVcbiAgICB9XG5cbiAgICBpZiAoXCJiZWZvcmVTZW5kXCIgaW4gb3B0aW9ucyAmJlxuICAgICAgICB0eXBlb2Ygb3B0aW9ucy5iZWZvcmVTZW5kID09PSBcImZ1bmN0aW9uXCJcbiAgICApIHtcbiAgICAgICAgb3B0aW9ucy5iZWZvcmVTZW5kKHhocilcbiAgICB9XG5cbiAgICB4aHIuc2VuZChib2R5KVxuXG4gICAgcmV0dXJuIHhoclxuXG5cbn1cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG4iLCJtb2R1bGUuZXhwb3J0cyA9IG9uY2Vcblxub25jZS5wcm90byA9IG9uY2UoZnVuY3Rpb24gKCkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVuY3Rpb24ucHJvdG90eXBlLCAnb25jZScsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG9uY2UodGhpcylcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KVxufSlcblxuZnVuY3Rpb24gb25jZSAoZm4pIHtcbiAgdmFyIGNhbGxlZCA9IGZhbHNlXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGNhbGxlZCkgcmV0dXJuXG4gICAgY2FsbGVkID0gdHJ1ZVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gIH1cbn1cbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnaXMtZnVuY3Rpb24nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvckVhY2hcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ1xudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuXG5mdW5jdGlvbiBmb3JFYWNoKGxpc3QsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKCFpc0Z1bmN0aW9uKGl0ZXJhdG9yKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpdGVyYXRvciBtdXN0IGJlIGEgZnVuY3Rpb24nKVxuICAgIH1cblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgICAgICBjb250ZXh0ID0gdGhpc1xuICAgIH1cbiAgICBcbiAgICBpZiAodG9TdHJpbmcuY2FsbChsaXN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJylcbiAgICAgICAgZm9yRWFjaEFycmF5KGxpc3QsIGl0ZXJhdG9yLCBjb250ZXh0KVxuICAgIGVsc2UgaWYgKHR5cGVvZiBsaXN0ID09PSAnc3RyaW5nJylcbiAgICAgICAgZm9yRWFjaFN0cmluZyhsaXN0LCBpdGVyYXRvciwgY29udGV4dClcbiAgICBlbHNlXG4gICAgICAgIGZvckVhY2hPYmplY3QobGlzdCwgaXRlcmF0b3IsIGNvbnRleHQpXG59XG5cbmZ1bmN0aW9uIGZvckVhY2hBcnJheShhcnJheSwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoYXJyYXksIGkpKSB7XG4gICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIGFycmF5W2ldLCBpLCBhcnJheSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZm9yRWFjaFN0cmluZyhzdHJpbmcsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHN0cmluZy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAvLyBubyBzdWNoIHRoaW5nIGFzIGEgc3BhcnNlIHN0cmluZy5cbiAgICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBzdHJpbmcuY2hhckF0KGkpLCBpLCBzdHJpbmcpXG4gICAgfVxufVxuXG5mdW5jdGlvbiBmb3JFYWNoT2JqZWN0KG9iamVjdCwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBrIGluIG9iamVjdCkge1xuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGspKSB7XG4gICAgICAgICAgICBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9iamVjdFtrXSwgaywgb2JqZWN0KVxuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdcblxuZnVuY3Rpb24gaXNGdW5jdGlvbiAoZm4pIHtcbiAgdmFyIHN0cmluZyA9IHRvU3RyaW5nLmNhbGwoZm4pXG4gIHJldHVybiBzdHJpbmcgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXScgfHxcbiAgICAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nICYmIHN0cmluZyAhPT0gJ1tvYmplY3QgUmVnRXhwXScpIHx8XG4gICAgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgIC8vIElFOCBhbmQgYmVsb3dcbiAgICAgKGZuID09PSB3aW5kb3cuc2V0VGltZW91dCB8fFxuICAgICAgZm4gPT09IHdpbmRvdy5hbGVydCB8fFxuICAgICAgZm4gPT09IHdpbmRvdy5jb25maXJtIHx8XG4gICAgICBmbiA9PT0gd2luZG93LnByb21wdCkpXG59O1xuIiwiXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSB0cmltO1xuXG5mdW5jdGlvbiB0cmltKHN0cil7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyp8XFxzKiQvZywgJycpO1xufVxuXG5leHBvcnRzLmxlZnQgPSBmdW5jdGlvbihzdHIpe1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMqLywgJycpO1xufTtcblxuZXhwb3J0cy5yaWdodCA9IGZ1bmN0aW9uKHN0cil7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvXFxzKiQvLCAnJyk7XG59O1xuIiwidmFyIHRyaW0gPSByZXF1aXJlKCd0cmltJylcbiAgLCBmb3JFYWNoID0gcmVxdWlyZSgnZm9yLWVhY2gnKVxuICAsIGlzQXJyYXkgPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGhlYWRlcnMpIHtcbiAgaWYgKCFoZWFkZXJzKVxuICAgIHJldHVybiB7fVxuXG4gIHZhciByZXN1bHQgPSB7fVxuXG4gIGZvckVhY2goXG4gICAgICB0cmltKGhlYWRlcnMpLnNwbGl0KCdcXG4nKVxuICAgICwgZnVuY3Rpb24gKHJvdykge1xuICAgICAgICB2YXIgaW5kZXggPSByb3cuaW5kZXhPZignOicpXG4gICAgICAgICAgLCBrZXkgPSB0cmltKHJvdy5zbGljZSgwLCBpbmRleCkpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAsIHZhbHVlID0gdHJpbShyb3cuc2xpY2UoaW5kZXggKyAxKSlcblxuICAgICAgICBpZiAodHlwZW9mKHJlc3VsdFtrZXldKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlXG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShyZXN1bHRba2V5XSkpIHtcbiAgICAgICAgICByZXN1bHRba2V5XS5wdXNoKHZhbHVlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdFtrZXldID0gWyByZXN1bHRba2V5XSwgdmFsdWUgXVxuICAgICAgICB9XG4gICAgICB9XG4gIClcblxuICByZXR1cm4gcmVzdWx0XG59IiwibW9kdWxlLmV4cG9ydHMgPSBleHRlbmRcblxuZnVuY3Rpb24gZXh0ZW5kKCkge1xuICAgIHZhciB0YXJnZXQgPSB7fVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXVxuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXRcbn1cbiIsIi8qKlxuICogdXRpbC5qcyBtb2R1bGUuXG4gKiBAbW9kdWxlIHV0aWxcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCdnbG9iYWwvZG9jdW1lbnQnKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgneC1pcy1hcnJheScpO1xuXG4vKipcbiAqIGNoZWNrIGlmIHZhcmlhYmxlIGlzIGFuIGVsZW1lbnRcbiAqIEBwYXJhbSAgeyp9IHBvdGVudGlhbCBlbGVtZW50XG4gKiBAcmV0dXJuIHtCb29sZWFufSByZXR1cm4gdHJ1ZSBpZiBpcyBhbiBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIGlzRWxlbWVudChlbGVtZW50KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiAhIShlbGVtZW50ICYmIGVsZW1lbnQubm9kZVR5cGUgPT09IDEpO1xuICB9XG59XG5cbi8qKlxuICogY3JlYXRlRWxlbWVudCBzaG9ydGN1dFxuICogQHBhcmFtICB7U3RyaW5nfSB0YWdcbiAqIEByZXR1cm4ge0VsZW1lbnR9IGVsZW1lbnRcbiAqL1xuZnVuY3Rpb24gZWwoZWxlbWVudCkge1xuICB2YXIgY2xhc3NlcyA9IFtdO1xuICB2YXIgdGFnID0gZWxlbWVudDtcbiAgdmFyIGVsO1xuXG4gIGlmIChpc0VsZW1lbnQoZWxlbWVudCkpIHtcbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfVxuXG4gIGNsYXNzZXMgPSBlbGVtZW50LnNwbGl0KCcuJyk7XG4gIGlmIChjbGFzc2VzLmxlbmd0aCA+IDEpIHtcbiAgICB0YWcgPSBjbGFzc2VzWzBdO1xuICB9XG4gIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICBhZGRDbGFzcyhlbCwgY2xhc3Nlcy5zbGljZSgxKSk7XG5cbiAgcmV0dXJuIGVsO1xufVxuXG4vKipcbiAqIGNyZWF0ZURvY3VtZW50RnJhZ21lbnQgc2hvcnRjdXRcbiAqIEByZXR1cm4ge0RvY3VtZW50RnJhZ21lbnR9XG4gKi9cbmZ1bmN0aW9uIGZyYWcoKSB7XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG59XG5cbi8qKlxuICogY3JlYXRlVGV4dE5vZGUgc2hvcnRjdXRcbiAqIEByZXR1cm4ge1RleHROb2RlfVxuICovXG5mdW5jdGlvbiB0ZXh0KHRleHQpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpO1xufVxuXG4vKipcbiAqIHJlbW92ZSBlbGVtZW50XG4gKiBAcGFyYW0gIHtFbGVtZW50fSBlbGVtZW50IHRvIHJlbW92ZVxuICogQHJldHVybiB7RWxlbWVudH0gcmVtb3ZlZCBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIHJlbW92ZShlbGVtZW50KSB7XG4gIGlmICgncmVtb3ZlJyBpbiBlbGVtZW50KSB7XG4gICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG4gIH1cblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuLyoqXG4gKiBGaW5kIGZpcnN0IGVsZW1lbnQgdGhhdCB0ZXN0cyB0cnVlLCBzdGFydGluZyB3aXRoIHRoZSBlbGVtZW50IGl0c2VsZlxuICogYW5kIHRyYXZlcnNpbmcgdXAgdGhyb3VnaCBpdHMgYW5jZXN0b3JzXG4gKiBAcGFyYW0gIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gdGVzdCBmbiAtIHJldHVybiB0cnVlIHdoZW4gZWxlbWVudCBsb2NhdGVkXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxuICovXG5mdW5jdGlvbiBjbG9zZXN0KGVsZW1lbnQsIHRlc3QpIHtcbiAgdmFyIGVsID0gZWxlbWVudDtcblxuICB3aGlsZSAoZWwpIHtcbiAgICBpZiAodGVzdChlbCkpIHtcbiAgICAgIHJldHVybiBlbDtcbiAgICB9XG4gICAgZWwgPSBlbC5wYXJlbnROb2RlO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogQWRkIG9uZSBvciBtb3JlIGNsYXNzbmFtZXMgdG8gYW4gZWxlbWVudFxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fFN0cmluZ30gYXJyYXkgb2YgY2xhc3NuYW1lcyBvciBzdHJpbmcgd2l0aFxuICogY2xhc3NuYW1lcyBzZXBhcmF0ZWQgYnkgd2hpdGVzcGFjZVxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuZnVuY3Rpb24gYWRkQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKSB7XG4gIHZhciBjbGFzc05hbWVzID0gY2xhc3NOYW1lO1xuXG4gIGZ1bmN0aW9uIF9hZGRDbGFzcyhlbCwgY24pIHtcbiAgICBpZiAoIWVsLmNsYXNzTmFtZSkge1xuICAgICAgZWwuY2xhc3NOYW1lID0gY247XG4gICAgfSBlbHNlIGlmICghaGFzQ2xhc3MoZWwsIGNuKSkge1xuICAgICAgZWwuY2xhc3NOYW1lICs9ICcgJyArIGNuO1xuICAgIH1cbiAgfVxuXG4gIGlmICghaXNBcnJheShjbGFzc05hbWUpKSB7XG4gICAgY2xhc3NOYW1lcyA9IGNsYXNzTmFtZS50cmltKCkuc3BsaXQoL1xccysvKTtcbiAgfVxuICBjbGFzc05hbWVzLmZvckVhY2goX2FkZENsYXNzLmJpbmQobnVsbCwgZWxlbWVudCkpO1xuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG4vKipcbiAqIFJlbW92ZSBhIGNsYXNzIGZyb20gYW4gZWxlbWVudFxuICogQHBhcmFtICB7RWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtICB7QXJyYXkuPHN0cmluZz58U3RyaW5nfSBhcnJheSBvZiBjbGFzc25hbWVzIG9yIHN0cmluZyB3aXRoXG4gKiBAcmV0dXJuIHtFbGVtZW50fVxuICovXG5mdW5jdGlvbiByZW1vdmVDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpIHtcbiAgdmFyIGNsYXNzTmFtZXMgPSBjbGFzc05hbWU7XG5cbiAgZnVuY3Rpb24gX3JlbW92ZUNsYXNzKGVsLCBjbikge1xuICAgIHZhciBjbGFzc1JlZ2V4ID0gbmV3IFJlZ0V4cCgnKD86XnxcXFxccyknICsgY24gKyAnKD8hXFxcXFMpJywgJ2cnKTtcbiAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZShjbGFzc1JlZ2V4LCAnJykudHJpbSgpO1xuICB9XG5cbiAgaWYgKCFpc0FycmF5KGNsYXNzTmFtZSkpIHtcbiAgICBjbGFzc05hbWVzID0gY2xhc3NOYW1lLnRyaW0oKS5zcGxpdCgvXFxzKy8pO1xuICB9XG4gIGNsYXNzTmFtZXMuZm9yRWFjaChfcmVtb3ZlQ2xhc3MuYmluZChudWxsLCBlbGVtZW50KSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgZWxlbWVudCBoYXMgYSBjbGFzc1xuICogQHBhcmFtICB7RWxlbWVudH0gIGVsZW1lbnRcbiAqIEBwYXJhbSAge1N0cmluZ30gIGNsYXNzTmFtZVxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gaGFzQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKSB7XG4gIGlmICghZWxlbWVudCB8fCAhKCdjbGFzc05hbWUnIGluIGVsZW1lbnQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQuY2xhc3NOYW1lLnNwbGl0KC9cXHMrLykuaW5kZXhPZihjbGFzc05hbWUpICE9PSAtMTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYWxsIG5leHQgc2libGluZ3NcbiAqIEBwYXJhbSAge0VsZW1lbnR9IGVsZW1lbnRcbiAqIEByZXR1cm4ge0FycmF5LjxlbGVtZW50Pn1cbiAqL1xuZnVuY3Rpb24gbmV4dFNpYmxpbmdzKGVsZW1lbnQpIHtcbiAgdmFyIG5leHQgPSBlbGVtZW50Lm5leHRTaWJsaW5nO1xuICB2YXIgc2libGluZ3MgPSBbXTtcblxuICB3aGlsZSAobmV4dCkge1xuICAgIHNpYmxpbmdzLnB1c2gobmV4dCk7XG4gICAgbmV4dCA9IG5leHQubmV4dFNpYmxpbmc7XG4gIH1cblxuICByZXR1cm4gc2libGluZ3M7XG59XG5cbi8qKlxuICogUmV0dXJuIGFsbCBwcmV2IHNpYmxpbmdzXG4gKiBAcGFyYW0gIHtFbGVtZW50fSBlbGVtZW50XG4gKiBAcmV0dXJuIHtBcnJheS48ZWxlbWVudD59XG4gKi9cbmZ1bmN0aW9uIHByZXZpb3VzU2libGluZ3MoZWxlbWVudCkge1xuICB2YXIgcHJldiA9IGVsZW1lbnQucHJldmlvdXNTaWJsaW5nO1xuICB2YXIgc2libGluZ3MgPSBbXTtcblxuICB3aGlsZSAocHJldikge1xuICAgIHNpYmxpbmdzLnB1c2gocHJldik7XG4gICAgcHJldiA9IHByZXYucHJldmlvdXNTaWJsaW5nO1xuICB9XG5cbiAgcmV0dXJuIHNpYmxpbmdzO1xufVxuXG4vKipcbiAqIFN0b3AgZXZlbnQgcHJvcGFnYXRpb25cbiAqIEBwYXJhbSAge0V2ZW50fSBldmVudFxuICogQHJldHVybiB7RXZlbnR9XG4gKi9cbmZ1bmN0aW9uIHN0b3AoZXZlbnQpIHtcbiAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgcmV0dXJuIGV2ZW50O1xufVxuXG4vKipcbiAqIFJldHVybnMgZmlyc3QgZWxlbWVudCBpbiBwYXJlbnQgdGhhdCBtYXRjaGVzIHNlbGVjdG9yXG4gKiBAcGFyYW0gIHtFbGVtZW50fSBwYXJlbnRcbiAqIEBwYXJhbSAge1N0cmluZ30gc2VsZWN0b3JcbiAqIEByZXR1cm4ge0VsZW1lbnR9XG4gKi9cbmZ1bmN0aW9uIGZpcnN0KHBhcmVudCwgc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHBhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbn1cblxuZnVuY3Rpb24gYXBwZW5kKHBhcmVudCwgY2hpbGRyZW4pIHtcbiAgdmFyIF9mcmFnID0gZnJhZygpO1xuICB2YXIgY2hpbGRyZW4gPSBpc0FycmF5KGNoaWxkcmVuKSA/IGNoaWxkcmVuIDogW2NoaWxkcmVuXTtcblxuICBjaGlsZHJlbi5mb3JFYWNoKF9mcmFnLmFwcGVuZENoaWxkLmJpbmQoX2ZyYWcpKTtcbiAgcGFyZW50LmFwcGVuZENoaWxkKF9mcmFnKTtcblxuICByZXR1cm4gcGFyZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZWw6IGVsLFxuICBmcmFnOiBmcmFnLFxuICB0ZXh0OiB0ZXh0LFxuICBjbG9zZXN0OiBjbG9zZXN0LFxuICBhZGRDbGFzczogYWRkQ2xhc3MsXG4gIHJlbW92ZUNsYXNzOiByZW1vdmVDbGFzcyxcbiAgaGFzQ2xhc3M6IGhhc0NsYXNzLFxuICBuZXh0U2libGluZ3M6IG5leHRTaWJsaW5ncyxcbiAgcHJldmlvdXNTaWJsaW5nczogcHJldmlvdXNTaWJsaW5ncyxcbiAgcmVtb3ZlOiByZW1vdmUsXG4gIHN0b3A6IHN0b3AsXG4gIGZpcnN0OiBmaXJzdCxcbiAgYXBwZW5kOiBhcHBlbmRcbn07XG4iXX0=
