function JistKit(owner) {
	if (owner) {
		if (owner instanceof HTMLElement) {
			this.element = owner;
		} else {
			if (owner.element) {
				this.element = owner.element;
			}	
		}
	}
};
JistKit.constructors = {};
JistKit.createOnDemandProperty = function JistKit_createOnDemandProperty(targetObject,propertyName,Constructor) {
	////NOOOOOOOOOOOOOO closures....
	function JistKit_createOnDemandProperty_get() {
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
	JistKit_createOnDemandProperty_get.Constructor = Constructor
	Object.defineProperty(targetObject,propertyName, {
		get: JistKit_createOnDemandProperty_get
	})
};
JistKit.addPropertyDefinition = function JistKit_addPropertyDefinition(propertyName,Constructor,descriptors) {
	this.createOnDemandProperty(this.prototype,propertyName,Constructor);
	if (Constructor.prototype.constructor == Object) {//should probably think about this some more!
		Constructor.prototype = Object.create(Constructor.prototype,descriptors||{});
	}
};
JistKit.extendFromLiteral = function JistKit_extend(Constructor,object,descriptors) {
	var propertyName,
		prototype = Constructor.prototype;
	if (object && object.constructor!=Object) {
		throw new Error("JistKit extendFromLiteral should only be passed literal objects");
	}
	for (propertyName in object) {
		prototype[propertyName] = object[propertyName];
	}
	for (propertyName in descriptors) {
		Object.defineProperty(prototype,propertyName,descriptors[propertyName]);
	}
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
	}
);
JistKit.createType = function JistKit_createType(propertyName,Constructor,literalDefinitionOfPrototype,ParentConstructor,descriptors,useObjectCreate) {
	if (!ParentConstructor) {
		ParentConstructor = JistKit;
	} else if (typeof ParentConstructor=="object") {
		ParentConstructor == ParentConstructor.constructor;
	}
	if (ParentConstructor == Object) {
		throw new Error("JistKit_createType: illegal type passed - types with literal prototypes not supported")
	}
	if (Constructor==ParentConstructor) {
		throw new Error("Inheritance error - an object cannot extend itself")
	}
	Constructor.prototype = Object.create(ParentConstructor.prototype);
	Constructor.prototype.type = Constructor;
	if (propertyName.constructor == String) {
		propertyName = [propertyName];
	}
	if (propertyName.length==1) {
		this.createOnDemandProperty(JistKit.prototype,propertyName[propertyName.length-1],Constructor);
	} else {
		this.createOnDemandProperty(this.getConstructor(propertyName.slice(0,-1).join(".")).prototype,propertyName[propertyName.length-1],Constructor);
	}
	this.defineConstructor(propertyName.join("."),Constructor);
	this.extendFromLiteral(Constructor,literalDefinitionOfPrototype,descriptors);
	return Constructor;
}
JistKit.defineConstructor = function (path,Constructor) {
	for (var i in this.constructors) {
		if (this.constructors[i] == Constructor) {
			throw new Error("JistKit.defineConstructor: duplicate constructor registered ["+path+"]");
		}
	}
	this.constructors[path] = Constructor;
}
JistKit.getConstructor = function (propertiesString) {
	var Constructor = this.constructors[propertiesString]
	if (!Constructor) {
		throw new Error("JistKit.getConstructor: no such constructor ["+propertiesString+"] exists")
	}
	return Constructor;
}
//Create the 'ondemand' slot in HTMLElement object
JistKit.createOnDemandProperty(HTMLElement.prototype,"jistKit",JistKit);

