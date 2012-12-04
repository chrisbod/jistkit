//TODO: refactor event creation to one (or two) helper methods
//TODO: move property 'resets' in detach from target to a reset method
//TODO: actually implement the custom touchmove event
//TODO: add swipe and flick support
//TODO: add touchout event (will only fire on the target element not any others)
//TODO: decide whether there should be a touchmovehold event (probably should be)

JistKit.TouchTracker = function TouchTracker(target) {
	if (target instanceof JistKit) {
		this.target = target.element;
		JistKit.call(this,target)
	} else if (target)  {
		this.target = target;
		this.touchList = []
	}
}
JistKit.TouchTracker.prototype = new JistKit();
JistKit.extendFromLiteral(JistKit.TouchTracker,{
	ownerPropertyName: "jistkit",
	cancelClickDistance: 40,//distance in pixels to decide that the user hasn't just moved finger slightly and meant to click
	currentDistance: 0,
	target: this,//defaults to the window object for adding evenet listeners
	captureEvents: true,//determines event flow
	recordTouches: false,//when set to true you have a list of objects with coords and times set for the path travelled by the touch
	disabled: false,//can be set at any time and will prevent the object from responding to ANY events (does not detach it)


	//custom event flags (hence lowercase) - fastdomclick fires a 'real' click the others are prefixed with jistkit e.g. jistkit.touchmove

	fastdomclick: false,//set to true to avoid ios 300ms pause on click
	touchstart: true,//determines whether a jistkit.touchstart event is fired
	//touchmove: false,//set to true for touch move events - disabled by default for performance
	touchmovestart: true,//fires when the touch has moved further than the cancel click distance - use native touch move for immediated tracking
	touchchange: true,//fires if additional fingers are added to the touch - if this occurs the tracker will no longer report any events - TODO make this a flag
	touchhold: true,//whether you want a longpress/gold event to fire (remember to use CSS to disable default behaviours..)
	touchholdDelay: 750,//determines how long a user needs to press for it to be considered a long press(hold)
	touchend: true,//determines whether a jistkit.touchend fires
	tap: true,//determines whether a jistkit.tap is fired (this occurs before a fast click is dispatched, preventing default will stop the fast click to be sent)

	//state 'flags' TODO make readonly...

	activated: false,
	active: false, //TODO rename this to avoid confusion with activated
	moving: false,
	clicked: false,
	held: false,
	currentX: -1,
	currentY: -1,

	//other instance properties used by object so handle with care (better yet don't handle at all!)
	touch: null,//the touch that is currently being tracked
	touchList: null,//a collection of touch 'positions' tracked so far
	currentElement: null, //the target element of the touch events
	//begin methods



	activate: function touchTracker_activate() {
		this.target.addEventListener("touchstart", this, this.captureEvents);
		this.activated = true;
	},
	deactivate: function touchTracker_deactivate() {
		this.target.removeEventListener("touchstart");
		this.detachFromTarget();
		this.activated = false;
	},
	handleEvent: function touchTracker_handleEvent(event) {
		if (!this.disabled) {
			if (this.active) {
				switch (event.type) {
					case "touchmove": this.moveTouch(event); break;
					case "touchend" : this.endTouch(event); break;	
					case "click": if (this.clicked) {
						event.stopPropagation();
						event.preventDefault()
					}
				}
			} else {
				switch (event.type) {
					case "touchstart" : this.startTouch(event); break;
				}
			}
		}
	},
	attachToTarget: function touchTracker_attachToTarget(touchStartEvent) {
		this.target.addEventListener("touchend", this,true);
		this.target.addEventListener("click", this,true);
		this.target.addEventListener("touchmove", this,true);
		this.currentElement = touchStartEvent.target;
		this.clicked = false;
		this.touchStartEvent = touchStartEvent;
		this.touch = touchStartEvent.touches[0];
		this.active = true;
	},
	detachFromTarget: function touchTracker_detachFromTarget() {
		this.target.removeEventListener("touchend", this);
		this.target.removeEventListener("click", this);
		this.target.removeEventListener("touchmove", this);
		delete this.clicked;
		delete this.moving;
		delete this.active;
		delete this.held;
		delete this.currentX;
		delete this.currentY;
		delete this.touch;
		this.touchList.length = 0;
	},
	startTouch: function touchTracker_startTouch(touchStartEvent) {
		var touch;
		if (touchStartEvent.changedTouches.length==1) {
			if (!this.active) {
				touch = touchStartEvent.changedTouches[0];
				if (this.recordTouches) {
					this.recordTouch(touchStartEvent.timeStamp,touch)
				}
				this.startX = this.currentX = touch.clientX;
				this.startY = this.currentY = touch.clientY;
				this.attachToTarget(touchStartEvent);
				if (this.touchhold) {
					this.setScopedTimeout(this.checkForTouchHold,this.pressLength);
				}
				if (this.touchstart) {
					this.dispatchTouchStart(touchStartEvent);
				}
			}
		} else if (this.touchchange) {
			this.dispatchTouchChange(touchStartEvent);
		}
	},
	moveTouch: function touchTracker_moveTouch(touchMoveEvent) {
		var touch = touchMoveEvent.changedTouches[0];
		this.currentX = touch.clientX;
		this.currentY = touch.clientY;
		if (this.recordTouches) {
			this.recordTouch(touchMoveEvent.timeStamp,touch);
		}
		if (this.insideTolerance()) {
			this.moving = false;
		} else if (!this.moving && this.touchmovestart) {
			this.moving = true;
			this.dispatchTouchMoveStart(touchMoveEvent);
		}
	},
	endTouch: function touchTracker_endTouch(touchEndEvent) {
		var touch = this.touch;
		this.currentX = touch.clientX;
		this.currentY = touch.clientY;
		if (this.recordTouches) {
			this.recordTouch(touchEndEvent.timeStamp,touch)
		};
		if (!this.held && this.active && this.insideTolerance()) {
			if (this.touchtap) {
				var tap = this.dispatchTouchTap(touchEndEvent);
			}
			if (this.fastdomclick) {
				this.dispatchDOMClick(touchEndEvent);
			}
		}
		if (this.touchend) {
			this.dispatchTouchEnd(touchEndEvent);
		}
		this.detachFromTarget(touchEndEvent);
	},
	checkForTouchHold: function touchTracker_checkForTouchHold() {
		if (this.active && this.insideTolerance()) {
			this.held = true;
			if (this.touchhold) {
				this.dispatchTouchHold(this.touchStartEvent);
			}
		}
	},

	recordTouch: function touchTracker_recordTouch(time,touch) {
		return this.touchList.push({timeStamp:time,clientX:touch.clientX,clientY:touch.clientY})
	},
	insideTolerance: function touchTracker_insideTolerance() {
		var x = this.currentX-this.startX,
			y = this.currentY-this.startY;
		return this.cancelClickDistance > Math.sqrt((x*x)+(y*y));
	},

	//event dispatcher methods

	dispatchDOMClick: function touchTracker_simulateClick(touchEndEvent) {
		 this.clicked = true;
		 var evt = document.createEvent("MouseEvents");
		 evt.initMouseEvent("click", true, true, window, touchEndEvent.detail, touchEndEvent.screenX, touchEndEvent.screenY, touchEndEvent.clientX, touchEndEvent.clientY, false, false, false, false, 0, null);
		 evt.touchEvent = touchEndEvent;
		 this.currentElement.dispatchEvent(evt);
		 this.moving = false;
		 return evt;
	},
	dispatchTouchStart: function touchTracker_dispatchTouchStart(touchStartEvent) {
		var evt = document.createEvent("MouseEvents"),
			touch = touchStartEvent.touches[0];
		evt.initMouseEvent("jistkit.touchstart", true, true, window, touchStartEvent.detail, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		evt.touchEvent = touchStartEvent;
		this.currentElement.dispatchEvent(evt);
		return evt;
	},
	dispatchTouchMoveStart: function touchTracker_dispatchTouchMoveStart(touchMoveEvent) {
		var evt = document.createEvent("MouseEvents");
		touch = touchMoveEvent.touches[0];
		evt.initMouseEvent("jistkit.touchmovestart", true, true, window, touchMoveEvent.detail, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		evt.touchEvent = touchMoveEvent;
		this.currentElement.dispatchEvent(evt);
		return evt;
	},
	dispatchTouchEnd: function touchTracker_dispatchTouchEnd(touchEndEvent) {
		var evt = document.createEvent("MouseEvents"),
			x = this.currentX-this.startX,
			y = this.currentY-this.startY,
			touch = this.touch;
		evt.initMouseEvent("jistkit.touchend", true, true, window, touchEndEvent.detail, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		evt.touchMoveSpeed = 1000*Math.sqrt(x*x+y*y)/(touchEndEvent.timeStamp-this.touchStartEvent.timeStamp);
		evt.touchList = this.touchList.concat();
		evt.touchEvent = touchEndEvent;
		this.currentElement.dispatchEvent(evt);
		return evt;
	},
	dispatchTouchHold: function touchTracker_dispatchTouchHold (touchStartEvent) {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("jistkit.touchhold", true, true, window, touchStartEvent.detail, touchStartEvent.screenX, touchStartEvent.screenY, touchStartEvent.clientX, touchStartEvent.clientY, false, false, false, false, 0, null);
		evt.touchEvent = touchStartEvent;
		this.currentElement.dispatchEvent(evt);
		return evt;
	},
	dispatchTouchTap: function touchTracker_dispatchTouchHold (touchEndEvent) {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("jistkit.touchtap", true, true, window, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, false, false, false, false, 0, null);
		evt.touchEvent = touchEndEvent;
		this.currentElement.dispatchEvent(evt);
		return evt;
	},
	dispatchTouchChange: function touchTracker_dispatchTouchStart(touchStartEvent) {
		var evt = document.createEvent("MouseEvents"),
			touch = touchStartEvent.touches[0];
		evt.initMouseEvent("jistkit.touchchange", true, true, window, touchStartEvent.detail, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		evt.touchEvent = touchStartEvent;
		this.currentElement.dispatchEvent(evt);
		return evt;
	}
});