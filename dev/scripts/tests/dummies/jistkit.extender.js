JistKit.DummyExtender = function JistKit_DummyExtender(jistkit) {
	JistKit.call(this,jistkit);
}
JistKit.DummyExtender.prototype = new JistKit();
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
JistKit.createOnDemandProperty(JistKit.prototype,"dummy",JistKit.DummyExtender);
