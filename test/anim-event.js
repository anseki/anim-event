var AnimEvent =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/*
	 * AnimEvent
	 * https://github.com/anseki/anim-event
	 *
	 * Copyright (c) 2016 anseki
	 * Licensed under the MIT license.
	 */
	
	// *** Currently, this code except `export` is not ES2015. ***
	
	var MSPF = 1000 / 60,
	    // ms/frame (FPS: 60)
	KEEP_LOOP = 500,
	    requestAnim = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
	  setTimeout(callback, MSPF);
	},
	    cancelAnim = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || function (requestID) {
	  clearTimeout(requestID);
	},
	
	
	/**
	 * @typedef {Object} task
	 * @property {Event} event
	 * @property {function} listener
	 */
	
	/** @type {task[]} */
	tasks = [],
	    requestID,
	    lastFrameTime = Date.now();
	
	function step() {
	  var called, next;
	
	  if (requestID) {
	    cancelAnim.call(window, requestID);
	    requestID = null;
	  }
	
	  tasks.forEach(function (task) {
	    if (task.event) {
	      task.listener(task.event);
	      task.event = null;
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
	   * @returns {(function|null)} - A wrapped event listener.
	   */
	  add: function add(listener) {
	    var task;
	    if (indexOfTasks(listener) === -1) {
	      tasks.push(task = { listener: listener });
	      return function (event) {
	        task.event = event;
	        if (!requestID) {
	          step();
	        }
	      };
	    } else {
	      return null;
	    }
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
	
	exports.default = AnimEvent;
	module.exports = exports["default"];

/***/ }
/******/ ]);
//# sourceMappingURL=anim-event.js.map