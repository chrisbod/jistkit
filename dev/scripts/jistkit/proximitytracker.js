//TODO decide on precendence behaviour....
//CHANGE TO PROXIMITY GAIN and PROXIMITY LOST like focus
if (!this.JistKit) {
	this.JistKit = {};
}
JistKit.ProximityTracker = function ProximityTracker(target) {
	this.target = target||this.target;
	this.target.addEventListener(this.moveEvent,this,true);
	this.elements = new this.elementsConstructor();
}
JistKit.ProximityTracker.prototype = {
	moveEvent: "ontouchmove" in this ? "touchmove" : "mousemove",
	target: this,
	elements: null,
	elementsConstructor: Array,
	addElements: function proximityTracker_addElements() {
		this.elements.push.apply(this.elements,arguments);
	},
	removeElements: function proximityTracker_removeElements() {
		var elements = this.elements;
		for (var i = arguments.length-1;i!=-1;i--) {
			for (var j = elements.length-1,index;j!=-1;j--) {
				index = elements.indexOf(arguments[i])
				if (index != -1) elements.splice(index,1);
			}
		}	
	},
	handleEvent: function proximityTracker_handleEvent(event) {
		switch (event.type) {
			case this.moveEvent: return this.handleMove(event)
		}
	},
	handleMove: function proximityTracker_handleMove(event) {
		var outsideElements = [],
			proximityEvent = this.createOutsideElementMoveEvent(event);
		for (var elements = this.elements, i=elements.length-1, 
					x = event.clientX, y = event.clientY
					elementRect,
					distanceX, distanceY
				;i!=-1; i--) {
				elementRect = elements[i].getBoundingClientRect();
				if (!this.rectangleContainsPoint(elementRect,x,y)) {
					distanceX = x<elementRect.left ? elementRect.left-x : x-elementRect.right;
					distanceY = y<elementRect.top ? elementRect.top-y : x-elementRect.bottom
					proximityEvent.distanceFromCurrentTarget = Math.sqrt((distanceX*distanceX)+(distanceY*distanceY);
					if (proximityEvent.propagationStopped) break;
					elements[i].dispatchEvent(proximityEvent);
					proximityEvent.previousProximityTrackers.push(elements[i]);
				}
		}
	},
	getElementBoundingClientRect: function proximityTracker_getElementBoundingClientRect(target) {
		target = target || this.target;
		if (target.getBoundingClientRect) return target.getBoundingClientRect();
		if (target==window) return document.documentElement.getBoundingClientRect();
	},
	rectangleContainsPoint: function proximityTracker_rectangleContainsPoint(elementRect,x,y) {
		return (x>=elementRect.left || x<=elementRect.right) && (y>=elementRect.top || y<=elementRect.bottom);
	},
	createOutsideElementMoveEvent: function proximityTracker_createOutsideElementMoveEvent(event,distance) {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("jistkit.proximitytracker.move", false, false, window, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, false, false, false, false, 0, null);
		evt.stopPropagation = this.moveinside_stopPropagation;
		evt.previousProximityTrackers = [];
		return evt;
	},
	moveinside_stopPropagation: function proximityTracker_moveinside_stopPropagation() {
		this.propagationStopped = true;
	}
}
