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
JistKit.createOnDemandProperty = function JistKit_createOnDemandProperty(targetObject,propertyName,Constructor) {
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
	}
	if (typeof ParentConstructor=="object") {
		ParentConstructor == ParentConstructor.constructor;
	}
	if (ParentConstructor == Object) {
		throw new Error("JistKit_createType: illegal type passed - types with literal prototypes not supported")
	}
	if (useObjectCreate) {
		Constructor.prototype = Object.create(ParentConstructor.prototype);
	} else {
		Constructor.prototype = new ParentConstructor();
	}
	Constructor.prototype.type = Constructor;
	if (propertyName.constructor == String) {
		this.createOnDemandProperty(ParentConstructor.prototype,propertyName,Constructor);
	} else {
		for (var i=0, CurrentConstructor;i<propertyName.length-1;i++) {
			CurrentConstructor = (Object.getOwnPropertyDescriptor(ParentConstructor.prototype,propertyName[i]).get.Constructor);
			if (!CurrentConstructor) {
				throw new Error("JistKit.createType: [jistKit."+propertyName.slice(0,i+1).join(".")+"] has not been defined yet");
			}
			ParentConstructor = CurrentConstructor;
		}
		if (propertyName[i] in CurrentConstructor.prototype) {
			throw new Error("JistKit.createType: [jistKit."+propertyName.join(".")+"] is already defined")
		}
		this.createOnDemandProperty(CurrentConstructor.prototype,propertyName[i],Constructor);
	}
	
	this.extendFromLiteral(Constructor,literalDefinitionOfPrototype,descriptors);
	return Constructor;
}
//Create the 'ondemand' slot in HTMLElement object
JistKit.createOnDemandProperty(HTMLElement.prototype,"jistKit",JistKit);
JistKit.createOnDemandProperty(JistKit.prototype,"touch",function JistKitTouch(target){JistKit.call(this,target);});

