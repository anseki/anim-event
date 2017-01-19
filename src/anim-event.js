/*
 * AnimEvent
 * https://github.com/anseki/anim-event
 *
 * Copyright (c) 2017 anseki
 * Licensed under the MIT license.
 */

// *** Currently, this code except `export` is not ES2015. ***

var
  MSPF = 1000 / 60, // ms/frame (FPS: 60)
  KEEP_LOOP = 500,

  requestAnim = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) { setTimeout(callback, MSPF); },
  cancelAnim = window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    function(requestID) { clearTimeout(requestID); },

  /**
   * @typedef {Object} task
   * @property {Event} event
   * @property {function} listener
   */

  /** @type {task[]} */
  tasks = [],
  requestID, lastFrameTime = Date.now();

function step() {
  var called, next;

  if (requestID) {
    cancelAnim.call(window, requestID);
    requestID = null;
  }

  tasks.forEach(function(task) {
    if (task.event) {
      task.listener(task.event);
      task.event = null;
      called = true;
    }
  });

  if (called) {
    lastFrameTime = Date.now();
    next = true;
  } else if (Date.now() - lastFrameTime < KEEP_LOOP) { // Go on for a while
    next = true;
  }
  if (next) { requestID = requestAnim.call(window, step); }
}

function indexOfTasks(listener) {
  var index = -1;
  tasks.some(function(task, i) {
    if (task.listener === listener) {
      index = i;
      return true;
    }
    return false;
  });
  return index;
}

var AnimEvent = {
  /**
   * @param {function} listener - An event listener.
   * @returns {(function|null)} - A wrapped event listener.
   */
  add: function(listener) {
    var task;
    if (indexOfTasks(listener) === -1) {
      tasks.push((task = {listener: listener}));
      return function(event) {
        task.event = event;
        if (!requestID) { step(); }
      };
    } else {
      return null;
    }
  },

  remove: function(listener) {
    var iRemove;
    if ((iRemove = indexOfTasks(listener)) > -1) {
      tasks.splice(iRemove, 1);
      if (!tasks.length && requestID) {
        cancelAnim.call(window, requestID);
        requestID = null;
      }
    }
  }
};

export default AnimEvent;
