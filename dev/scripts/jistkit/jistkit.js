function JistKit(owner) {
	Object.defineProperty(this,this.ownerPropertyName,{
		value: owner
	})
}
JistKit.createOnDemandProperty = function JistKit_createOnDemandProperty(targetObject,property,Constructor) {
	Object.defineProperty(targetObject,property,{
		get: function JistKit_createOnDemandProperty_get() {
			var object = new Constructor(this);//important on demand property will ALWAYS pass the object being attached to it
			Object.defineProperty(this,property,{
				get: function JistKit_createOnDemandProperty_override_get() {
					if (object==null) object = new Constructor(this);
					return object;
				},
				set: function JistKit_createOnDemandProperty_override_set(value) {
					if (value===null) object = null;
					return object;
				}
			})
			return object;
		}
	})
}
JistKit.prototype = {
	ownerPropertyName: "element",
	element: null,
	dispose: function jistKit_dispose(nonRecursive) {
		this.element.jistkit = null;
		for (var keys = Object.keys(this),l=keys.length-1;l!=-1;l--) {
			if (!nonRecursive && typeof this[keys[l]].dispose == "function") {
				this[keys[l]].dispose();
			}
			delete this[keys[l]];
		}

	}
};
//'Restore' prototype so it's not an object literal but an instance of JistKit!
//This will also 
JistKit.prototype = Object.create(JistKit.prototype);
//Create the 'ondemand' slot in HTMLElement object
JistKit.createOnDemandProperty(HTMLElement.prototype,"jistkit",JistKit);

