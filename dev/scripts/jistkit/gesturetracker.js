if (!this.JistKit) {
	this.JistKit = {}
}
this.JistKit.GestureTracker = function GestureTracker(target) {
	this.target = target||this.target;
	this.target.addEventListener("touchstart", this, true);	
	this.touches = [];
	this.endedTouches = [];
	this.events = [];
}
this.JistKit.GestureTracker.prototype = {
	target: this,
	maximumGestureTime: 500,
	activated: false,
	handleEvent: function gestureTracker_handleEvent(event) {
		switch (event.type) {
			case "touchstart" : this.handleTouchStart(event); break;
			case "touchend": this.handleTouchEnd(event); break;
			default: throw new Error("jistkit.gesturetracker:",this,"received unsupported event")
		}		
	},
	setTimeout: function gestureTracker_setTimeout(method,time) {
		var touchTracker = this,
			pseudoArguments = arguments.length > 2 ? [].slice.call(arguments,2) : [];
		return setTimeout(function () {
			method.apply(touchTracker,pseudoArguments)
		},time)
	},
	handleTouchStart: function gestureTracker_handleTouchStart(event) {
		var touches = this.touches,
			events = this.events,
			touch = event.changedTouches[0];
		if (touches.length == 0 && !this.activated) {
			this.activate(event);
		} else if (this.activated && touches.indexOf(touch) == -1) {
			touches.push(touch);
			events.push(event);
		} 
	},
	handleTouchEnd: function gestureTracker_handleTouchEnd (event) {
		var touches = this.touches,
			index = touches.indexOf(event.changedTouches[0])
		if (index != -1) {
			this.events.push(event);
			this.endedTouches.push(event.changedTouches[0]);
				if (this.endedTouches.length > 2) {
				this.dispatchBespokeMultiTap();
			}
		}
		
	},
	activate: function gestureTracker_activate(event) {
		this.target.addEventListener("touchend", this, true);
		this.activatingTouch = event.changedTouches[0];
		this.touches.push(this.activatingTouch);
		this.setTimeout(this.checkTime,this.maximumGestureTime,this.activatingTouch);
		this.activated = true;
	},
	deactivate: function gestureTracker_deactivate() {
		if (this.activated) {
			this.target.removeEventListener("touchend", this);
			this.touches.length = this.endedTouches.length = this.events.length = 0;
			this.activatingTouch = null;
			this.activated = false;
			this.tapCount = 0;
		}
	},
	checkTime: function gestureTracker_checkTime (activatingTouch) {
		if (activatingTouch == this.activatingTouch) {
			this.deactivate()
		}
	},
	dispatchBespokeMultiTap: function gestureTracker_dispatchBespokeTripleTap() {
			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent("jistkit.gesturetracker.multitap", true, false, window, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, false, false, false, false, 0, null);
			evt.touchEvents = this.events.concat();
			evt.tapCount = this.endedTouches.length
			this.target.dispatchEvent(evt);
	}

}