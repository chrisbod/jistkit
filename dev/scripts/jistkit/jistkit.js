function JistKit(owner) {
	if (owner) {
		Object.defineProperty(this,owner instanceof JistKit? "jistKit" : "element", {
			value: owner
		});
	}
};
JistKit.createOnDemandProperty = function JistKit_createOnDemandProperty(targetObject,propertyName,Constructor) {
	Object.defineProperty(targetObject,propertyName, {
		get: function JistKit_createOnDemandProperty_get() {
			var object = new Constructor(this);//IMPORTANT on demand property will ALWAYS pass the object it is being attached to
			Object.defineProperty(this,propertyName, {
				get: function JistKit_createOnDemandProperty_override_get() {
					if (object==null) {
						object = new Constructor(this);
					}
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
};
JistKit.addPropertyDefinition = function JistKit_addPropertyDefinition(propertyName,Constructor,descriptors) {
	this.createOnDemandProperty(this.prototype,propertyName,Constructor);
	if (Constructor.prototype.constructor == Object) {//should probably think about this some more!
		Constructor.prototype = Object.create(Constructor.prototype,descriptors||{});
	}
};
JistKit.extendFromLiteral = function JistKit_extend(Constructor,object,descriptors) {
	var propertyName;
	if (object && object.constructor!=Object) {
		throw new Error("JistKit extendFromLiteral should only be passed literal objects");
	}
	for (propertyName in object) {
		Constructor.prototype[propertyName] = object[propertyName];
	}
	for (propertyName in descriptors) {
		Object.defineProperty(Constructor.prototype,propertyName,descriptors[propertyName]);
	}
		Object.defineProperty(Constructor.prototype,"element",{
			get: function () {
				return this.jistKit.element;
			}
		});

};
JistKit.extendFromLiteral(JistKit,
	{
		ownerPropertyName: "element",//IMPORTANT this should always be overwritten
		element: null,
		dispose: function jistKit_dispose(nonRecursive) {
			this.element.jistKit = null;
			for (var keys = Object.keys(this),l=keys.length-1;l!=-1;l--) {
				if (!nonRecursive && typeof this[keys[l]].dispose == "function") {
					this[keys[l]].dispose();
				}
				delete this[keys[l]];
			}
		},
		debug: this.DEBUG ? function jistKit_debug() {//looks for global/window debug flag
			var messages = [this];
			messages.push.apply(messages,arguments);
		} : function jistKit_debug_NONE()  {},
		setScopedTimeout: function jistKit_setTimeout(method,time,pseudoArguments) {
			var jistKitObject = this;
			setTimeout(function () {
				method.apply(jistKitObject,pseudoArguments)
			},time)
		}
	}
);
JistKit.createType = function JistKit_createType(propertyName,Constructor,literalDefinitionOfPrototype,ParentConstructor,descriptors,useObjectCreate) {
	if (!ParentConstructor) {
		ParentConstructor = JistKit;
	}
	if (useObjectCreate) {
		Constructor.prototype = Object.create(ParentConstructor.prototype);
	} else {
		Constructor.prototype = new ParentConstructor();
	}
	this.createOnDemandProperty(ParentConstructor.prototype,propertyName,Constructor);
	this.extendFromLiteral(Constructor,literalDefinitionOfPrototype,descriptors);
	return Constructor;
}
//Create the 'ondemand' slot in HTMLElement object
JistKit.createOnDemandProperty(HTMLElement.prototype,"jistKit",JistKit);


