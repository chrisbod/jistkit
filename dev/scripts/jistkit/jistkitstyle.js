if (!this.Jistkit) {
	this.Jistkit = {}
}
Jistkit.JistkitStyle = function JistkitStyle() {
	this.styleSheetElement = document.head.appendChild(document.createElement("style"));
	this.styleSheetElement.id = "jistkitStyle"+JistkitStyle.instanceCount++;
	this.styleSheet = this.styleSheetElement.sheet;
	this.rulesById = {};
}
Jistkit.JistkitStyle.instanceCount = 0;
Jistkit.JistkitStyle.elementCount = 0;
Jistkit.JistkitStyle.prototype = {
	createJistkitStyleRule: function (selector) {
		var index = this.styleSheet.insertRule(selector+"{}");
		return this.styleSheet.cssRules[index];
	},
	createJistkitStyleForElement: function (element) {
		var id = element.id ? element.id : (element.id = "jistkitStyleElement"+Jistkit.JistkitStyle.elementCount++);
		return this.rulesById[id] = this.createJistkitStyleRule('#'+id).style;
	}
}
Jistkit.JistkitStyle.instance = new Jistkit.JistkitStyle();


Object.defineProperty(HTMLElement.prototype,"jistkitStyle",{
	get: function Jistkit_htmlElement_jistkitStyle_getter() {
		return Jistkit.JistkitStyle.instance.rulesById[this.id] || Jistkit.JistkitStyle.instance.createJistkitStyleForElement(this)
	}
})
