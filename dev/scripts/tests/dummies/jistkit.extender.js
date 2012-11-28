JistKit.DummyExtender = function JistKit_DummyExtender(jistkit) {
	JistKit.call(this,jistkit);
}
JistKit.DummyExtender.prototype = new JistKit();
JistKit.createOnDemandProperty(JistKit.prototype,"dummy",JistKit.DummyExtender);
JistKit.extendFromLiteral(JistKit.DummyExtender,{
		ownerPropertyName: "jistkit"
	},
	{
		element: {
			get: function () {
				return this.jistkit.element;
			}
		}
	}

);




JistKit.DummyExtender2 = function JistKit_DummyExtender2(jistkit) {
	JistKit.call(this,jistkit);
}
JistKit.DummyExtender2.prototype = Object.create(JistKit.prototype);
JistKit.createOnDemandProperty(JistKit.prototype,"dummy2",JistKit.DummyExtender2);
JistKit.extendFromLiteral(JistKit.DummyExtender2,{
		ownerPropertyName: "jistkit"
	},
	{
		element: {
			get: function () {
				return this.jistkit.element;
			}
		}
	}

);

JistKit.DummyExtender3 = function JistKit_DummyExtender3(jistkit) {
	JistKit.call(this,jistkit);
}
JistKit.createType(
	JistKit.DummyExtender3,
	JistKit,
	"dummy3",
	{
		ownerPropertyName: "jistkit"
	},
	{
		element: {
			get: function () {
				return this.jistkit.element;
			}
		}
	}
)
