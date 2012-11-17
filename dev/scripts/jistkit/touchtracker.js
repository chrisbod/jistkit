function TouchTracker(target) {
	this.target = target||this.target;
	this.target.addEventListener("touchstart", this,true);
	this.target.addEventListener("touchend", this,true);
	this.target.addEventListener("click", this,true);
	this.target.addEventListener("touchmove", this,true);
}
TouchTracker.prototype = {
	cancelClickDistance: 80,
	pressLength: 1000,
	currentDistance: 0,
	moving: false,
	handleEvent: function (event) {
		switch (event.type) {
			case "touchmove": this.checkMove(event); break;
			case "touchstart" : this.addStartTouch(event); break;
			case "touchend" : this.addEndTouch(event); break;	
			case "click": if (this.clicked) {
				event.stopPropagation();
				event.preventDefault()
			}
		}
		return false
	},
	addStartTouch: function (touchStartEvent) {
		this.startX = this.currentX = touchStartEvent.changedTouches[0].clientX;
		this.startY = this.currentY = touchStartEvent.changedTouches[0].clientY;
		this.currentElement = touchStartEvent.target;
		this.clicked = false;
		this.touchStartEvent = touchStartEvent;
		this.touchEndEvent 

		this.startTime = touchStartEvent.timeStamp
	},
	addEndTouch: function (touchEndEvent) {
		this.currentX = touchEndEvent.changedTouches[0].clientX;
		this.currentY = touchEndEvent.changedTouches[0].clientY;
		if (this.insideTolerance()) {
			this.simulateClick(touchEndEvent);
			if (this.touchStartEvent.timeStamp+this.pressLength<=touchEndEvent.timeStamp) {
				this.dispatchTouchHold(touchEndEvent.changeTouches[0])
			}
		} else {
			this.dispatchBespokeTouchEnd(touchEndEvent.changeTouches[0]);
		}
		this.clicked = false;
		this.moving = false;
		this.touchEndEvent = touchEndEvent;
	},
	insideTolerance: function () {
		var x = this.currentX-this.startX,
			y = this.currentY-this.startY;
		return this.cancelClickDistance > Math.sqrt((x*x)+(y*y))
	},

	checkMove: function (event) {
		this.currentX = event.changedTouches[0].clientX;
		this.currentY = event.changedTouches[0].clientY;
		if (this.insideTolerance()) {
			this.moving = false
		} else if (!this.moving) {
			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent("touchtracker.movestart", true, true, window, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, false, false, false, false, 0, null);
			this.currentElement.dispatchEvent(evt);
			this.moving = true;
		}
	},
	simulateClick: function (event) {
		 this.clicked = true;
		 var evt = document.createEvent("MouseEvents");
		 evt.initMouseEvent("click", true, true, window, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, false, false, false, false, 0, null);
		 this.currentElement.dispatchEvent(evt);
		 this.moving = false;
	},
	dispatchBespokeTouchEnd: function (event) {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("touchtracker.touchend", true, true, window, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, false, false, false, false, 0, null);
		this.currentElement.dispatchEvent(evt);
	},
	dispatchTouchHold: function (event) {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("touchtracker.touchhold", true, true, window, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, false, false, false, false, 0, null);
		this.currentElement.dispatchEvent(evt);
	},
	destroy: function () {
		this.target.removeEventListener("touchstart", this);
		this.target.removeEventListener("touchend", this);
		this.target.removeEventListener("click", this);
		this.target.removeEventListener("touchmove", this);
	}
}