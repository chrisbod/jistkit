Jistkit.DummyExtender = function Jistkit_DummyExtender(jistkit) {
	Jistkit.call(this,jistkit);
}
Jistkit.DummyExtender.prototype = new Jistkit();
Jistkit.createOnDemandProperty(Jistkit.prototype,"dummy",Jistkit.DummyExtender);
Jistkit.extendFromLiteral(Jistkit.DummyExtender);

Jistkit.DummyExtender2 = function Jistkit_DummyExtender2(jistkit) {
	Jistkit.call(this,jistkit);
}
Jistkit.DummyExtender2.prototype = Object.create(Jistkit.prototype);
Jistkit.createOnDemandProperty(Jistkit.prototype,"dummy2",Jistkit.DummyExtender2);
Jistkit.extendFromLiteral(Jistkit.DummyExtender2);

Jistkit.DummyExtender3 = function Jistkit_DummyExtender3(jistkit) {
	Jistkit.call(this,jistkit);
}
Jistkit.createType(Jistkit.DummyExtender3,"dummy3")
