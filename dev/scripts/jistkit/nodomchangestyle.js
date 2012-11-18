if (!this.JistKit) {
	this.JistKit = {}
}
JistKit.NoDOMChangeStyle = function NoDOMChangeStyle(element) {
	this.element = element;
	if (!element.id) element.id = this.generateId();
	this.stylesheet.sheet.insertRule('#'+element.id,this.stylesheet.rules.length);
	this.rule = this.stylesheet.cssRules[this.stylesheet.cssRules.length-1];
	this.styleObject = 
}
JistKit.NoDOMChangeStyle.prototype = {
	elementCounter: {count:0},
	stylesheet: this.document.appendChild(this.document.head.createElement("style"))
	generateId: function () {
		return "jistKitNoDOMChangeStyle"+this.elementCounter.count++
	}

}