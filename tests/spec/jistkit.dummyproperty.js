describe("Jistkit.DummyProperty (using Jistkit.createType)", function () {
  var element = document.documentElement;
it("dummy property should now exist in element.jistkit", function () {
    expect(("dummy" in element.jistkit)).toEqual(true);
  })
it("dummy property should be an instance of JistkitDummyExtender", function () {
    expect(element.jistkit.dummy instanceof window.DummyProperty)
})
it ("dummy property should not (any longer) be an instanceof Jistkit",  function () {
    expect(element.jistkit.dummy instanceof Jistkit).toEqual(false)
})
it("dummy property should return same object", function () {
  var dummy = element.jistkit.dummy;
  expect(dummy).toEqual(element.jistkit.dummy);
})
it("DummyProperty constructor should not be in global namespace", function () {
  expect(typeof Jistkit_DummyProperty).toEqual("undefined");
});
delete window.DummyProperty;//okay so I'm cleaning up here
})