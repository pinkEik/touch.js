//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
//
//     Updated: 2013-09-02 Supported jQuery by wata

(function($){
	var touch = {}, touchTimeout, longTapDelay = 750;

	function parentIfText(node) {
		return 'tagName' in node ? node : node.parentNode;
	}

	function swipeDirection(x1, x2, y1, y2) {
		var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
		return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
	}

	function longTap() {
        if (touch.last && Date.now() - touch.last >= longTapDelay) {
			touch.el.trigger('longTap');
			touch = {};
		}
	}

	$(document).ready(function(){
		var now, delta;

		document.body.addEventListener('touchstart', function(e){
			now = Date.now();
			delta = now - (touch.last || now);
			touch.el = $(parentIfText(e.touches[0].target));
			touchTimeout && window.clearTimeout(touchTimeout);
			touch.x1 = e.touches[0].pageX;
			touch.y1 = e.touches[0].pageY;
			if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
			touch.last = now;
		}, false);

		document.body.addEventListener('touchmove', function(e){
			touch.x2 = e.touches[0].pageX;
			touch.y2 = e.touches[0].pageY;
			if (Math.abs(touch.x1 - touch.x2) > 10) {
				e.preventDefault();
			}
		}, false);

		document.body.addEventListener('touchend', function(e){
			if (touch.isDoubleTap) {
				touch.el.trigger('doubleTap');
				touch = {};
			} else if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {
				touch.el.trigger('swipe');
				touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
				touch = {};
			} else if ('last' in touch) {
				touchTimeout = window.setTimeout(function(){
					touchTimeout = null;
					touch.el.trigger('tap');
					touch = {};
				}, 250);
			}
		}, false);

		document.body.addEventListener('touchcancel', function(){
            touch = {};
		}, false);
	});

	['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'longTap'].forEach(function(m){
		$.fn[m] = function(callback){
			return this.bind(m, callback);
		};
	});
})(this.Zepto || this.jQuery);