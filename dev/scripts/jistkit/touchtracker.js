if (!this.JistKit) {
	this.JistKit = {}
}

this.JistKit.TouchTracker = function TouchTracker(target,capture) {
	this.target = target||this.target;
	this.capture = capture == undefined ? this.capture : capture;
	this.target.addEventListener("touchstart", this, this.capture);
}
this.JistKit.TouchTracker.prototype = {
	cancelClickDistance: 80,
	pressLength: 750,
	currentDistance: 0,
	moving: false,
	target: this,
	capture: true,
	debug: this.DEBUG ? function touchTracker_debug() {
		var messages = [this];
		messages.push.apply(messages,arguments);
		console.log.apply(console,messages)
	} : function touchTracker_debug_NONE()  {},
	setTimeout: function touchTracker_setTimeout(method,time) {
		var touchTracker = this,
			pseudoArguments = arguments.length > 2 ? [].slice.call(arguments,2) : [];
		setTimeout(function () {
			method.apply(touchTracker,pseudoArguments)
		},time)
	},
	handleEvent: function touchTracker_handleEvent(event) {
		if (this.active) {
			switch (event.type) {
				case "touchmove": this.checkMove(event); break;
				case "touchend" : this.addEndTouch(event); break;	
				case "click": if (this.clicked) {
					event.stopPropagation();
					event.preventDefault()
				}
			}
		} else {
			switch (event.type) {
				case "touchstart" : this.addStartTouch(event); break;
			}
		}
		return false
	},
	addStartTouch: function touchTracker_addStartTouch(touchStartEvent) {
		if (touchStartEvent.changedTouches.length==1) {
			if (!this.active) {
				this.touch = touchStartEvent.changedTouches[0];
				this.startX = this.currentX = this.touch.clientX;
				this.startY = this.currentY = this.touch.clientY;
				this.attachToTarget(touchStartEvent);
				this.setTimeout(this.checkHold,this.pressLength,touchStartEvent);
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
		this.active = true;
	},
	detachFromTarget: function touchTracker_detachFromTarget(touchEndEvent) {
		this.target.removeEventListener("touchend", this);
		this.target.removeEventListener("click", this);
		this.target.removeEventListener("touchmove", this);
		this.clicked = false;
		this.moving = false;
		this.active = false;
	},
	addEndTouch: function touchTracker_addEndTouch(touchEndEvent) {
		this.currentX = this.touch.clientX;
		this.currentY = this.touch.clientY;
		if (this.insideTolerance()) {
			this.simulateClick(touchEndEvent);
		} else {
			this.dispatchBespokeTouchEnd(this.touch);
		}
		this.detachFromTarget(touchEndEvent);
	},
	insideTolerance: function touchTracker_insideTolerance() {
		var x = this.currentX-this.startX,
			y = this.currentY-this.startY;
		return this.cancelClickDistance > Math.sqrt((x*x)+(y*y))
	},
	checkHold: function touchTracker_checkHold(lastTouchEvent) {
		if (this.active) {
				this.dispatchTouchHold(lastTouchEvent);
		}
	},
	checkMove: function touchTracker_checkMove(event) {
			if (event)
		this.currentX = this.touch.clientX;
		this.currentY = this.touch.clientY;
		if (this.insideTolerance()) {
			this.moving = false;
		} else if (!this.moving) {
			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent("jistkit.touchtracker.movestart", true, true, window, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, false, false, false, false, 0, null);
			this.currentElement.dispatchEvent(evt);
			this.moving = true;
		} 
	},
	simulateClick: function touchTracker_simulateClick(event) {
		 this.clicked = true;
		 var evt = document.createEvent("MouseEvents");
		 evt.initMouseEvent("click", true, true, window, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, false, false, false, false, 0, null);
		 this.currentElement.dispatchEvent(evt);
		 this.moving = false;
	},
	dispatchBespokeTouchEnd: function touchTracker_dispatchBespokeTouchEnd(event) {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("jistkit.touchtracker.touchend", true, true, window, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, false, false, false, false, 0, null);
		this.currentElement.dispatchEvent(evt);
	},
	dispatchTouchHold: function touchTracker_dispatchTouchHold (event) {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("jistkit.touchtracker.touchhold", true, true, window, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, false, false, false, false, 0, null);
		this.currentElement.dispatchEvent(evt);
	},
	destroy: function touchTracker_destroy() {
		this.target.removeEventListener("touchstart", this);
		this.target.addEventListener("touchend", this);
		this.target.addEventListener("click", this);
		this.target.addEventListener("touchmove", this);
		//remove keys
	}
}