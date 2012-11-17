if (!this.JistKit) {
	this.JistKit = {}
}
this.JistKit.GestureTracker = function GestureTracker(target) {
	this.target = target||this.target;
	this.target.addEventListener("touchstart", this,true);
}
this.JistKit.TouchTracker.prototype = {
	target: this,



	handleEvent: function () {}



}