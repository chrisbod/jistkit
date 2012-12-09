function Jistkit(target) {
	if (target) {//Need to sort out disposal now I've changed the approach
		if (target instanceof HTMLElement) {
			Object.defineProperty(this,"element",{
				get: Jistkit.returnThis.bind(target)
			})
		} else {
			if ("element" in target) {
				if (!(target.element instanceof HTMLElement)) {
					throw new Error(Jistkit.caller.name+" illegal element type passed")
				}
				Object.defineProperty(this,"element",{
					get: Object.getOwnPropertyDescriptor(target,"element").get
				})
			}
			else throw new Error(Jistkit.caller.name+" passed target without element")
		} 
	} else {
			throw new Error(Jistkit.caller.name+" instantiated without a target")
	}
};
Jistkit.constructors = {};
Jistkit.returnThis = function Jistkit_returnThis() {
	return this;
}
Jistkit.createOnDemandProperty = function Jistkit_createOnDemandProperty(targetObject,propertyName,Constructor) {
	////NOOOOOOOOOOOOOO closures....think about using bind...
	function Jistkit_createOnDemandProperty_get() {
			var object = new Constructor(this);//IMPORTANT on demand property will ALWAYS pass the object it is being attached to		
			Object.defineProperty(this,propertyName, {
				get: function Jistkit_createOnDemandProperty_override_get() {
					if (object==null) {
						object = new Constructor(this);
					}
					return object;
			},
				set: function Jistkit_createOnDemandProperty_override_set(value) {
					if (value===null) object = null;
					return object;
				}
			})
			return object;
		}
	Jistkit_createOnDemandProperty_get.Constructor = Constructor
	Object.defineProperty(targetObject,propertyName, {
		get: Jistkit_createOnDemandProperty_get
	})
};
Jistkit.addPropertyDefinition = function Jistkit_addPropertyDefinition(propertyName,Constructor,descriptors) {
	this.createOnDemandProperty(this.prototype,propertyName,Constructor);
	if (Constructor.prototype.constructor == Object) {//should probably think about this some more!
		Constructor.prototype = Object.create(Constructor.prototype,descriptors||{});
	}
};
Jistkit.extendFromLiteral = function Jistkit_extend(Constructor,object,descriptors) {
	var propertyName,
		prototype = Constructor.prototype;
	if (object && object.constructor!=Object) {
		throw new Error("Jistkit extendFromLiteral should only be passed literal objects");
	}
	for (propertyName in object) {
		prototype[propertyName] = object[propertyName];
	}
	for (propertyName in descriptors) {
		Object.defineProperty(prototype,propertyName,descriptors[propertyName]);
	}
};
Jistkit.extendFromLiteral(Jistkit,
	{
		element: null,
		dispose: function jistkit_dispose(nonRecursive) {
			this.element.jistkit = null;
			for (var keys = Object.keys(this),l=keys.length-1;l!=-1;l--) {
				if (!nonRecursive && typeof this[keys[l]].dispose == "function") {
					this[keys[l]].dispose();
				}
				delete this[keys[l]];
			}
		},
		debug: this.DEBUG ? function jistkit_debug() {//looks for global/window debug flag
			var messages = [this];
			messages.push.apply(messages,arguments);
		} : function jistkit_debug_NONE()  {},
		parentConstructor: Object
	}
);
Jistkit.createType = function Jistkit_createType(propertyName,Constructor,literalDefinitionOfPrototype,ParentConstructor,descriptors,useObjectCreate) {
	if (ParentConstructor) {
		if (Constructor==ParentConstructor) {
			throw new Error("Inheritance error - an object cannot extend itself")
		}
		Constructor.prototype = Object.create(ParentConstructor.prototype);
		Constructor.prototype.parentConstructor = ParentConstructor;
	}
	if (propertyName.constructor == String) {
		propertyName = [propertyName];
	}
	if (propertyName.length==1) {
		this.createOnDemandProperty(Jistkit.prototype,propertyName[propertyName.length-1],Constructor);
	} else {
		this.createOnDemandProperty(this.getConstructor(propertyName.slice(0,-1).join(".")).prototype,propertyName[propertyName.length-1],Constructor);
	}
	this.defineConstructor(propertyName.join("."),Constructor);
	this.extendFromLiteral(Constructor,literalDefinitionOfPrototype,descriptors);
	return Constructor;
}
Jistkit.defineConstructor = function (path,Constructor) {
	for (var i in this.constructors) {
		if (this.constructors[i] == Constructor) {
			throw new Error("Jistkit.defineConstructor: duplicate constructor registered ["+path+"]");
		}
	}
	this.constructors[path] = Constructor;
}
Jistkit.getConstructor = function (propertiesString) {
	var Constructor = this.constructors[propertiesString]
	if (!Constructor) {
		throw new Error("Jistkit.getConstructor: no such constructor ["+propertiesString+"] exists")
	}
	return Constructor;
}
//Create the 'ondemand' slot in HTMLElement object
Jistkit.createOnDemandProperty(HTMLElement.prototype,"jistkit",Jistkit);
