# AnimEvent

[![npm](https://img.shields.io/npm/v/anim-event.svg)](https://www.npmjs.com/package/anim-event) [![GitHub issues](https://img.shields.io/github/issues/anseki/anim-event.svg)](https://github.com/anseki/anim-event/issues) [![dependencies](https://img.shields.io/badge/dependencies-No%20dependency-brightgreen.svg)](package.json) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE-MIT)

Super Simple Event Manager for Animation

Some DOM events (e.g. `scroll`, `resize`, `mousemove`, `drag`, etc.) are fired too frequently.  
The listening to those events for animation is performance degradation.  
AnimEvent controls timing of calling event listeners with [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) (or 60fps in a web browser that doesn't support it).

AnimEvent works like [lodash's `throttle` function](https://lodash.com/docs#throttle), but it uses `requestAnimationFrame` that is more optimized for animation, instead of "wait-time".

Example: Open a file `test/test.html` by web browser.

## Usage

Load AnimEvent into your web page.

```html
<script src="anim-event.min.js"></script>
```

To register your event listener, pass `AnimEvent.add(listener)` instead of `listener` to [`addEventListener` method](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener).

For example, replace first code with second code:

```js
window.addEventListener('scroll', listener, false);
```

```js
window.addEventListener('scroll', AnimEvent.add(listener), false);
```

Then `listener` is called when the window is scrolled, with optimized timing for animation. Superfluous fired events are ignored.

## Methods

### `AnimEvent.add`

```js
wrappedListener = AnimEvent.add(listener)
```

Add an event listener that is controlled by AnimEvent.  
Pass a returned `wrappedListener` to `addEventListener` method.

A listener that has already been added can not be added.  
For example, use one listener for multiple events:

```js
var listener = AnimEvent.add(function(event) { console.log(event); });
window.addEventListener('scroll', listener, false);
window.addEventListener('resize', listener, false);
```

### `AnimEvent.remove`

```js
AnimEvent.remove(listener)
```

Remove an event listener that was added by [`AnimEvent.add` method](#animeventadd).  
You can remove a `wrappedListener` that was added by `addEventListener` method from the event by [`removeEventListener` method](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener). `AnimEvent.remove` method removes a listener from listeners that are controlled by AnimEvent.
