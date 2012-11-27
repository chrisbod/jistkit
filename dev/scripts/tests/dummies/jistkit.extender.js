JistKit.DummyExtender = function JistKit_DummyExtender(jistkit) {
	JistKit.call(this,jistkit);
}
JistKit.DummyExtender.prototype = {
	ownerPropertyName: "dummy"
}
JistKit.createOnDemandProperty(JistKit.prototype,"dummy",JistKit.DummyExtender);//TODO simplify this baby!
