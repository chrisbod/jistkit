//TODO: move property 'resets' in detach from target to a reset method
//TODO: add swipe and flick support
//TODO: decide whether there should be a touchmovehold/pause event
//TODO: provide a lastTouchEvent property that returns the last native touchevent that occured
//TODO: look into touchcancel and touchleave events...
//TODO: doubletap events...?

JistKit.TouchTracker = function TouchTracker(target) {
	if (target instanceof JistKit) {
		this.target = target.element;
		JistKit.call(this,target)
	} else if (target)  {
		this.target = target;
	}
	this.touchHistory = [];
}
JistKit.TouchTracker.prototype = new JistKit();
JistKit.extendFromLiteral(JistKit.TouchTracker,{
	cancelClickDistance: 40,//distance in pixels to decide that the user hasn't just moved finger slightly and meant to click
	currentDistance: 0,
	target: this,//defaults to the window object for adding event listeners
	captureEvents: true,//determines event flow
	trackTouchHistory: false,//when set to true you have a list of objects with coords and times set for the path travelled by the touch
	disabled: false,//can be set at any time and will prevent the object from responding to ANY events (does not detach it)


	//custom event flags (hence lowercase) - fastdomclick fires a 'real' click the others are prefixed with jistkit e.g. jistkit.touchmove

	fastdomclick: false,//set to true to avoid ios 300ms pause on click
	touchstart: true,//determines whether a jistkit.touchstart event is fired
	touchmove: false,//set to true for touch move events - disabled by default for performance
	touchmovestart: true,//fires when the touch has moved further than the cancel click distance - use native touch move for immediated tracking
	touchmove: false,//this will fire the NEXT move after the touchmovestart SO if you want more responsive touchmoves DON'T use this!!
	touchchange: true,//fires if additional fingers are added to the touch - if this occurs the tracker will no longer report any events - TODO make this a flag
	touchhold: true,//whether you want a longpress/gold event to fire (remember to use CSS to disable default behaviours..)
	touchholdDelay: 750,//determines how long a user needs to press for it to be considered a long press(hold)
	touchend: true,//determines whether a jistkit.touchend fires
	touchout: false,//ALSO means that touchin events can fire if the user returns to the element,should fire when the touch leaves the element the tracker is bound to...it does NOT effect any event tracking merely sends the message
	touchtap: true,//determines whether a jistkit.tap is fired (this occurs before a fast click is dispatched, preventing default will stop the fast click to be sent)

	//state 'flags' TODO make readonly...

	activated: false,
	moving: false,
	clicked: false,
	held: false,
	currentX: -1,
	currentY: -1,
	touchIsOutside: false,

	//other instance properties used by object so handle with care (better yet don't handle at all!)
	touch: null,//the touch that is currently being tracked
	touchHistory: null,//a collection of touch 'positions' tracked so far
	eventTarget: null, //the target element of the touch events
	
	touchstartEvent: "jistkit.touchstart",
	touchstartmoveEvent: "jistkit.touchstartmove",
	touchmoveEvent: "jistkit.touchmove",
	touchinEvent: "jistkit.touchin",
	touchoutEvent:"jistkit.touchout",
	touchendEvent: "jistkit.touchend",
	touchholdEvent: "jistkit.touchhold",
	touchchangeEvent: "jistkit.touchchange",
	touchtapEvent: "jistkit.touchtap",

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
			switch (event.type) {
				case "touchmove": this.moveTouch(event); break;
				case "touchstart" : this.startTouch(event); break;	
				case "touchend" : this.endTouch(event); break;
				case "click": if (this.clicked) {
					this.cancelClickEvent(event);
				}
			}
		} 
	},
	cancelClickEvent: function touchTracker_cancelClickEvent(event) {
		event.stopPropagation();
		event.preventDefault()
		this.clicked = false;
	},
	attachToTarget: function touchTracker_attachToTarget(touchStartEvent) {
		this.target.addEventListener("touchend", this,true);
		this.target.addEventListener("click", this,true);
		this.target.addEventListener("touchmove", this,true);		
	},
	detachFromTarget: function touchTracker_detachFromTarget() {
		this.target.removeEventListener("touchend", this);
		this.target.removeEventListener("click", this);
		this.target.removeEventListener("touchmove", this);
		this.touchHistory.length = 0;
		this.clicked = this.moving = this.held = false;
		this.currentX = this.currentY = -1;
		this.touch = this.eventTarget = null;
	},
	startTouch: function touchTracker_startTouch(touchStartEvent) {
		var touch;
		if (touchStartEvent.touches.length==1) {
			this.attachToTarget(touchStartEvent);
			this.touchStartEvent = touchStartEvent;
			this.eventTarget = touchStartEvent.target;
			this.touch = touch = touchStartEvent.changedTouches[0];
			this.startX = this.currentX = touch.clientX;
			this.startY = this.currentY = touch.clientY;		
			if (this.touchstart) {
				this.dispatchTouchEvent(this.touchstartEvent,touchStartEvent);
			}
			if (this.trackTouchHistory) {
				this.trackTouch(touchStartEvent.timeStamp,touch)
			}
	
			if (this.touchhold) {
				this.setScopedTimeout(this.checkForTouchHold,this.touchholdDelay,[touchStartEvent]);
			}
		} else if (this.touchchange) {
			this.dispatchTouchEvent(this.touchchangeEvent,touchStartEvent);
		}
	},
	moveTouch: function touchTracker_moveTouch(touchMoveEvent) {
		var touch = touchMoveEvent.changedTouches[0];
		this.currentX = touch.clientX;
		this.currentY = touch.clientY;
		if (this.trackTouchHistory) {
			this.trackTouch(touchMoveEvent.timeStamp,touch);
		}
		if (this.touchout) {
			var outside = this.touchIsOutsideTarget();
			if (outside) {
				if (!this.touchIsOutside) {
					this.touchIsOutside = true;
					this.dispatchTouchEvent(this.touchoutEvent,touchMoveEvent,false);
				}
			} else {
				if (this.touchIsOutside) {
					this.touchIsOutside = false;
					this.dispatchTouchEvent(this.touchinEvent,touchMoveEvent,false);
				}
			}
		}

		if (this.touchIsInsideTolerance()) {
			this.moving = false;
		} else if (!this.moving && this.touchmovestart) {
			this.moving = true;
			this.dispatchTouchEvent(this.touchmovestartEvent,touchMoveEvent);
		} else if (this.touchmove) {
			this.dispatchTouchEvent(this.touchmoveEvent,touchMoveEvent);
		}
	},
	endTouch: function touchTracker_endTouch(touchEndEvent) {
		var touch = this.touch,
			tapEvent,
			fastdomclick = this.fastdomclick;
		this.currentX = touch.clientX;
		this.currentY = touch.clientY;
		if (this.trackTouchHistory) {
			this.trackTouch(touchEndEvent.timeStamp,touch);
		};
		if (!this.held && this.touchIsInsideTolerance()) {
			if (this.touchtap) {
				if (this.dispatchTouchEvent(this.touchtapEvent,touchEndEvent).defaultPrevented) {
					fastdomclick = false;
					this.moving = false;
				}
			}
			if (fastdomclick) {
				this.clicked = true;
		 		this.moving = false;
				this.dispatchTouchEvent("click",touchEndEvent);
			}
		}
		if (this.touchend) {
			this.dispatchTouchEvent(this.touchendEvent,touchEndEvent);
		}
		this.detachFromTarget();
	},
	checkForTouchHold: function touchTracker_checkForTouchHold(touchStartEvent) {
		if (this.touchStartEvent == touchStartEvent && this.touchIsInsideTolerance()) {
			this.held = true;
			if (this.touchhold) {
				this.dispatchTouchEvent(this.touchholdEvent,this.touchStartEvent);
			}
		}
	},
	trackTouch: function touchTracker_trackTouch(time,touch) {
		return this.touchHistory.push({timeStamp:time,clientX:touch.clientX,clientY:touch.clientY})
	},
	touchIsInsideTolerance: function touchTracker_insideTolerance() {
		var x = this.currentX-this.startX,
			y = this.currentY-this.startY;
		return this.cancelClickDistance > Math.sqrt((x*x)+(y*y));
	},
	touchIsOutsideTarget: function touchTracker_touchIsOutsideTarget() {
		var rect = this.getBoundingClientRect(),
			x = this.currentX,
			y = this.currentY;
		return x < rect.left || x > rect.right || y < rect.top || y > rect.bottom;
	},
	getBoundingClientRect: function touchTracker_getBoundingClientRect() {
		if (this.target.getBoundingClientRect) {
			return this.target.getBoundingClientRect();//CAREFUL body and html (and other) elements won't auto expand to absolutely positioned stuff...
		} else {
			var rect = document.documentElement.getBoundingClientRect(),
				height = Math.max(rect.height,window.innerHeight),
				width = Math.max(rect.width,window.innerWidth);
			return {
				width: width,
				height: height,
				top: 0,
				left:0,
				bottom: height,
				right: width
			}
		}

	},
	dispatchTouchEvent: function touchTracker_dispatchTouchEvent(type,touchEvent,bubbles) {
		var event = document.createEvent("MouseEvents"),
			touch = this.touch;
		event.initMouseEvent(type, bubbles == undefined ? true : bubbles, true, window, touchEvent.detail, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		event.touchEvent = touchEvent;
		event.touchTracker = this;
		this.eventTarget.dispatchEvent(event);
		return event;
	}
});