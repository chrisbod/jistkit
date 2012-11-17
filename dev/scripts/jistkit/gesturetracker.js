if (!this.JistKit) {
	this.JistKit = {}
}
this.JistKit.GestureTracker = function GestureTracker(target) {
	this.target = target||this.target;
	this.target.addEventListener("touchstart", this, true);	
	this.touches = [];
	this.endedTouches = [];
}
this.JistKit.GestureTracker.prototype = {
	target: this,
	maximumGestureTime: 1500,
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
		setTimeout(function () {
			method.apply(touchTracker,pseudoArguments)
		},time)
	},
	handleTouchStart: function gestureTracker_handleTouchStart(event) {
		var touches = this.touches;
		if (touches.length == 0) {
			this.activate();
			touches.push(event.changedTouches[0]);
		} 
		if (touches.indexOf(event.changedTouches[0]) == -1) {
			touches.push(event.changedTouches[0]);
		}
	},
	handleTouchEnd: function gestureTracker_handleTouchEnd (event) {
		var touches = this.touches,
			index = touches.indexOf(event.changedTouches[0])
		if (index != -1) {
			this.endedTouches.push(event.changedTouches[0]);
		}
	},
	activate: function gestureTracker_activate() {
		this.target.addEventListener("touchend", this, true);
		this.setTimeout(this.checkTime,this.maximumGestureTime);
	},
	deactivate: function gestureTracker_deactivate() {
		this.target.removeEventListener("touchend", this);
		this.touches.length = this.endedTouches.length = 0;
	},
	checkTime: function gestureTracker_checkTime () {
		if (Date.now()+this.maximumGestureTime > this.touches[0].timeStamp) {
			this.deactivate()
		}
	}




}