function JistKit(element) {
	Object.defineProperty(this,this.ownerPropertyName,{
		value: element
	})
	this[this.ownerPropertyName] = element;
}
JistKit.createOnDemandProperty = function (targetObject,property,Constructor) {
	Object.defineProperty(targetObject,property,{
		get: function JistKit_onPrototypicalDemand_get() {
			var object = new Constructor(this);//important on demand property will ALWAYS pass the object being attached to it
			Object.defineProperty(this,property,{
				value: object,
				configurable: true
			})
			return object;
		},
		configurable: true
	})
}
JistKit.prototype = {
	ownerPropertyName: "element",
	element: null,
	dispose: function jistKit_dispose(nonRecursive) {
		for (var keys = Object.keys(this),l=keys.length-1;l!=-1;l--) {
			if (!nonRecursive && typeof this[keys[l]].dispose == "function") {
				this[keys[l]].dispose();
			}
			if (keys[l] != "element") delete this[keys[l]];
		}
	}
};
//'Restore' prototype so it's not an object literal but an instance of JistKit!
//This will also 
JistKit.prototype = Object.create(JistKit.prototype);
//Create the 'ondemand' slot in HTMLElement object
JistKit.createOnDemandProperty(HTMLElement.prototype,"jistkit",JistKit);