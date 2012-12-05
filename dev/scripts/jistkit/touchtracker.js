//TODO: move property 'resets' in detach from target to a reset method
//TODO: decide whether there should be a touchmovehold/pause event
//TODO: look into touchcancel and touchleave events...
//TODO: doubletap events...?
//TODO: decide whether the move start event is useful (and check the logic too!)
//TODO: edit the comments to explain the use of Aspect Ratios better
//TODO: fix the innerHeight and innerWidth problem with getBounding client Rect

JistKit.TouchTracker = function TouchTracker(target) {
	if (target instanceof JistKit) {
		this.target = target.element;
		JistKit.call(this,target);
	} else if (target)  {
		this.target = target;
	}
	this.touchHistory = [];
};
JistKit.createType(JistKit.TouchTracker,"touchTracker",JistKit,{
	cancelClickDistance: 50,//distance in pixels to decide that the user hasn't just moved finger slightly and meant to click
	currentDistance: 0,
	target: this,//defaults to the window object for adding event listeners
	disabled: false,//can be set at any time and will prevent the object from responding to ANY events (does not detach it)

	//custom event flags (hence lowercase) - fastdomclick fires a 'real' click the others are prefixed with jistkit e.g. jistkit.touchmove

	fastdomclick: false,//set to true to avoid ios 300ms pause on click
	
	touchstart: true,//determines whether a jistkit.touchstart event is fired
	touchmove: false,//set to true for touch move events - disabled by default for performance
	touchmovestart: true,//fires when the touch has moved further than the cancel click distance - use native touch move for immediated tracking
	touchchange: true,//fires if additional fingers are added to the touch - if this occurs the tracker will no longer report any events - TODO make this a flag
	touchhold: true,//whether you want a longpress/gold event to fire (remember to use CSS to disable default behaviours..)
	touchholdDelay: 750,//determines how long a user needs to press for it to be considered a long press(hold)
	touchend: true,//determines whether a jistkit.touchend fires
	touchout: false,//ALSO means that touchin events can fire if the user returns to the element,should fire when the touch leaves the element the tracker is bound to...it does NOT effect any event tracking merely sends the message
	touchtap: true,//determines whether a jistkit.tap is fired (this occurs before a fast click is dispatched, preventing default will stop the fast click to be sent)

	flick: false, //generic flick -  fires at ANY angle
	flickleft: false, //see thresholds/tolerances below
	flickright: false,
	flickup: false,
	flickdown: false,

	//some of these are probably going to be redundant..
	//IMPORTANT these values are used WITH the aspect ratio taken into account
	//if you want to use 1:1 ratio over ride the getRawAspectRatio method to return 1
	flickMinimumDistance: 75, //minimum distance (px) that must be travelled by the touch to trigger a flick
	flickMinimumSpeed: 500, //minimum speed (px/s) the touch should be moving to trigger a flick

	//state 'flags' - changing these outside the object could create much fun

	activated: false,
	touchWithinTolerance: false,
	clicked: false,
	held: false,
	currentX: -1,
	currentY: -1,
	touchIsOutside: false,

	//other instance properties used by object so handle with care (better yet don't handle at all!)
	touchHistory: null,//a collection of touch 'positions' tracked so far 
	eventTarget: null, //the target element of the touch events
	
	//touchevent names
	startEvent: "jistkit.touch.start",
	startmoveEvent: "jistkit.touch.startmove",
	moveEvent: "jistkit.touch.move",
	inEvent: "jistkit.touch.in",
	outEvent:"jistkit.touch.out",
	endEvent: "jistkit.touch.end",
	holdEvent: "jistkit.touch.hold",
	changeEvent: "jistkit.touch.change",
	tapEvent: "jistkit.touch.tap",

	flickEvent: "jistkit.flick",
	//flick event names
	leftEvent: "jistkit.flick.left",
	rightEvent: "jistkit.flick.right",
	upEvent: "jistkit.flick.up",
	downEvent: "jistkit.flick.down",

	//begin methods
	activate: function touchTracker_activate() {
		this.target.addEventListener("touchstart", this, true);
		this.activated = true;
	},
	deactivate: function touchTracker_deactivate() {
		this.target.removeEventListener("touchstart",this, true);
		this.detachFromTarget();
		this.reset();
		this.activated = false;
	},
	handleEvent: function touchTracker_handleEvent(event) {
		if (!this.disabled) {
			switch (event.type) {
				case "touchmove": this.moveTouch(event); break;
				case "touchstart" : this.startTouch(event); break;	
				case "touchend" : this.endTouch(event); break;
				case "click": {
					return this.cancelClickEvent(event);
				}
			}
		} 
	},
	cancelClickEvent: function touchTracker_cancelClickEvent(event) {
		event.stopPropagation();
		event.preventDefault();
		
		return false;
	},
	attachToTarget: function touchTracker_attachToTarget() {
		this.target.addEventListener("touchend", this,true);
		this.target.addEventListener("touchmove", this,true);		
	},
	detachFromTarget: function touchTracker_detachFromTarget() {
		this.target.removeEventListener("touchend", this, true);
		this.target.removeEventListener("touchmove", this, true);
	},
	reset: function touchTracker_reset() {
		this.touchHistory.length = 0;//NOTE: the same array is always used
		delete this.clicked;
		delete this.touchWithinTolerance;
		delete this.held;
		delete this.currentX;
		delete this.currentY
		delete this.eventTarget;
		delete this.startX;
		delete this.startY;
		delete this.startTime;
		delete this.touchIsOutside;
		delete this.endTime; 
	},
	startTouch: function touchTracker_startTouch(touchStartEvent) {
		var touch = touchStartEvent.touches[0];
		if (touchStartEvent.touches.length==1) {
			this.attachToTarget(touchStartEvent);
			this.trackTouch(touchStartEvent.timeStamp, touch.clientX, touch.clientY);
			this.eventTarget = touchStartEvent.target;
			this.startX = this.currentX = touch.clientX;
			this.startY = this.currentY = touch.clientY;
			this.startTime = touchStartEvent.timeStamp;	
			if (this.touchstart) {
				this.dispatchTouchEvent(this.startEvent,touchStartEvent);
			}
			this.trackTouch(touchStartEvent.timeStamp,touch.clientX,touch.clientY);
			if (this.touchhold) {
				this.setScopedTimeout(this.checkForTouchHold,this.touchholdDelay,[touchStartEvent]);
			}
		} else if (this.touchchange) {
			this.dispatchTouchEvent(this.changeEvent,touchStartEvent);
		}
	},
	moveTouch: function touchTracker_moveTouch(touchMoveEvent) {
		var touch = touchMoveEvent.touches[0];
		this.currentX = touch.clientX;
		this.currentY = touch.clientY;
		this.trackTouch(touchMoveEvent.timeStamp,this.currentX,this.currentY);
		if (this.touchout) {
			if (this.touchIsOutsideTarget()) {
				if (!this.touchIsOutside) {
					this.touchIsOutside = true;
					this.dispatchTouchEvent(this.outEvent,touchMoveEvent,false);
				}
			} else {
				if (this.touchIsOutside) {
					this.touchIsOutside = false;
					this.dispatchTouchEvent(this.inEvent,touchMoveEvent,false);
				}
			}
		}
		if (this.touchIsInsideTolerance()) {
			this.touchWithinTolerance = false;
		} else if (!this.touchWithinTolerance && this.touchmovestart) {
			this.touchWithinTolerance = true;
			this.dispatchTouchEvent(this.moveEvent,touchMoveEvent);
		} else if (this.touchmove) {
			this.dispatchTouchEvent(this.moveEvent,touchMoveEvent);
		}
	},
	endTouch: function touchTracker_endTouch(touchEndEvent) {
		var	fastdomclick = this.fastdomclick;
		this.currentX = touchEndEvent.changedTouches[0].clientX;
		this.currentY = touchEndEvent.changedTouches[0].clientY;
		this.endTime = touchEndEvent.timeStamp;
		this.trackTouch(touchEndEvent.timeStamp,touchEndEvent.clientX,touchEndEvent.clientY);
		if (!this.held && this.touchIsInsideTolerance()) {
			if (this.touchtap) {
				if (this.dispatchTouchEvent(this.tapEvent,touchEndEvent).defaultPrevented) {
					fastdomclick = false;
				}
			}
			if (fastdomclick) {
				window.removeEventListener("click",this,true);
				this.dispatchTouchEvent("click",touchEndEvent);
				window.addEventListener("click",this,true);
			}
		}
		if (this.touchend) {
			this.dispatchTouchEvent(this.endEvent,touchEndEvent);
		}
		this.checkForFlick(touchEndEvent);
		this.detachFromTarget();
		this.reset();
	},
	checkForTouchHold: function touchTracker_checkForTouchHold(touchStartEvent) {
		if (this.touchStartEvent == touchStartEvent && this.touchIsInsideTolerance()) {
			this.held = true;
			if (this.touchhold) {
				this.dispatchTouchEvent(this.holdEvent,this.touchStartEvent);
			}
		}
	},
	checkForFlick: function touchTracker_checkForFlick(touchEndEvent) {
		if (this.flick||this.flickleft||this.flickright||this.flickup||this.flickdown) {
			var x = this.currentX-this.startX,
				y = this.currentY-this.startY,
				aspect = this.getDeviceAspectRatio(),
				distance = Math.sqrt((x*x)+(y*y)),
				time = (this.endTime-this.startTime)/1000;
			if (distance >= this.flickMinimumDistance*aspect && distance/time >= this.flickMinimumSpeed) {
				var degrees = Math.atan2(-x,-y)*180/Math.PI,
					landscape = aspect>1,
					verticalTolerance = landscape? 45 : 45/aspect,
					horizontalTolerance = landscape? 45/aspect : 45;
				if (this.flick) {
					if (this.dispatchTouchEvent(this.flickEvent,touchEndEvent).defaultPrevented) {
						return;
					}
				}
				if (this.flickleft && (degrees>0 && degrees<90+horizontalTolerance && degrees>90-horizontalTolerance)) {
					this.dispatchTouchEvent(this.leftEvent,touchEndEvent);
				}
				if (this.flickright && (degrees<0 && degrees<-90+horizontalTolerance && degrees>-90-horizontalTolerance)) {
					this.dispatchTouchEvent(this.rightEvent,touchEndEvent);
				}
				if (this.flickup && Math.abs(degrees)<verticalTolerance) {
					this.dispatchTouchEvent(this.upEvent,touchEndEvent);
				}
				if (this.flickdown && Math.abs(degrees)>180-verticalTolerance) {
					this.dispatchTouchEvent(this.downEvent,touchEndEvent);
				}
				
			}

		}
	},
	trackTouch: function touchTracker_trackTouch(time,clientX,clientY) {
		return this.touchHistory.push({
			timeStamp: time,
			clientX: clientX,
			clientY: clientY
		});
	},
	touchIsInsideTolerance: function touchTracker_touchIsInsideTolerance() {
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
			var rect =  document.documentElement.getBoundingClientRect(),
				height = Math.max(rect.height,window.innerHeight),
				width = Math.max(rect.width,window.innerWidth);
			return {
				width: width,
				height: height,
				top: 0,
				left:0,
				bottom: height,
				right: width
			};
		}

	},
	dispatchTouchEvent: function touchTracker_dispatchTouchEvent(type,touchEvent,bubbles) {
		var event = document.createEvent("MouseEvents"),
			touch = touchEvent.changedTouches ? touchEvent.changedTouches[0] : touchEvent;
		event.initMouseEvent(type, bubbles == undefined ? true : bubbles, true, window, touchEvent.detail, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		event.touchEvent = touchEvent;
		event.touchTracker = this;
		this.eventTarget.dispatchEvent(event);
		return event;
	},
	getDeviceAspectRatio: function touchTracker_getDeviceAspectRatio() {
		//BEWARE orientation bugs...
		return screen.width>screen.height ? screen.width/screen.height : screen.height/screen.width;
	}
});