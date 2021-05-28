/* ================================================
        DON'T MANUALLY EDIT THIS FILE
================================================ */

/*
 * AnimEvent
 * https://github.com/anseki/anim-event
 *
 * Copyright (c) 2021 anseki
 * Licensed under the MIT license.
 */
var MSPF = 1000 / 60,
    // ms/frame (FPS: 60)
KEEP_LOOP = 500,

/**
 * @typedef {Object} task
 * @property {Event} event
 * @property {function} listener
 */

/** @type {task[]} */
tasks = [];
/* [DEBUG/]
const
[DEBUG/] */

var // [DEBUG/]
requestAnim = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
  return setTimeout(callback, MSPF);
},
    cancelAnim = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || function (requestID) {
  return clearTimeout(requestID);
};

var lastFrameTime = Date.now(),
    requestID; // [DEBUG]

var requestAnimSave = requestAnim,
    cancelAnimSave = cancelAnim;

window.AnimEventByTimer = function (byTimer) {
  if (byTimer) {
    requestAnim = function requestAnim(callback) {
      return setTimeout(callback, MSPF);
    };

    cancelAnim = function cancelAnim(requestID) {
      return clearTimeout(requestID);
    };
  } else {
    requestAnim = requestAnimSave;
    cancelAnim = cancelAnimSave;
  }
}; // [/DEBUG]


function step() {
  var called, next;

  if (requestID) {
    cancelAnim.call(window, requestID);
    requestID = null;
  }

  tasks.forEach(function (task) {
    var event;

    if (event = task.event) {
      task.event = null; // Clear it before `task.listener()` because that might fire another event.

      task.listener(event);
      called = true;
    }
  });

  if (called) {
    lastFrameTime = Date.now();
    next = true;
  } else if (Date.now() - lastFrameTime < KEEP_LOOP) {
    // Go on for a while
    next = true;
  }

  if (next) {
    requestID = requestAnim.call(window, step);
  }
}

function indexOfTasks(listener) {
  var index = -1;
  tasks.some(function (task, i) {
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
   * @returns {(function|null)} A wrapped event listener.
   */
  add: function add(listener) {
    var task;

    if (indexOfTasks(listener) === -1) {
      tasks.push(task = {
        listener: listener
      });
      return function (event) {
        task.event = event;

        if (!requestID) {
          step();
        }
      };
    }

    return null;
  },
  remove: function remove(listener) {
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