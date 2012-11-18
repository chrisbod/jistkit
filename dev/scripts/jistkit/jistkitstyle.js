if (!this.JistKit) {
	this.JistKit = {}
}
JistKit.JistKitStyle = function JistKitStyle() {
	this.styleSheetElement = document.head.appendChild(document.createElement("style"));
	this.styleSheetElement.id = "jistKitStyle"+JistKitStyle.instanceCount++;
	this.styleSheet = this.styleSheetElement.sheet;
	this.rulesById = {};
}
JistKit.JistKitStyle.instanceCount = 0;
JistKit.JistKitStyle.elementCount = 0;
JistKit.JistKitStyle.prototype = {
	createJistKitStyleRule: function (selector) {
		var index = this.styleSheet.insertRule(selector+"{}");
		return this.styleSheet.cssRules[index];
	},
	createJistKitStyleForElement: function (element) {
		var id = element.id ? element.id : (element.id = "jistKitStyleElement"+JistKit.JistKitStyle.elementCount++);
		return this.rulesById[id] = this.createJistKitStyleRule('#'+id).style;
	}
}
JistKit.JistKitStyle.instance = new JistKit.JistKitStyle();


Object.defineProperty(HTMLElement.prototype,"jistKitStyle",{
	get: function JistKit_htmlElement_jistKitStyle_getter() {
		return JistKit.JistKitStyle.instance.rulesById[this.id] || JistKit.JistKitStyle.instance.createJistKitStyleForElement(this)
	}
})
