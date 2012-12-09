describe("Jistkit", function () {
  var element = document.documentElement,
     temporaryPointer;
  /*
  it ("jistkit prototype should be the 'true' prototype of Jistkit not an object literal", function () {
     // expect(element.jistkit.constructor).toEqual(Jistkit);
  })*/
  it("jistkit should be reported in HTMLElements", function () {
    expect(("jistkit" in element)).toEqual(true);
  });
  it("jistkit should report as object", function () {
    expect(typeof element.jistkit).toEqual("object")
  });
    it ("omce it is reference element should have its own property ", function () {
    expect(element.hasOwnProperty("jistkit")).toEqual(true)
  });
  it("elements should return the same object on each call to their jistkit property ", function () {
    expect(element.jistkit).toEqual(element.jistkit);
  });
  it("'element' property of instance of jistkit should point to the element it is attached to", function () {
    expect(element.jistkit.element).toEqual(element);
  });
  it("jistkit objects properties should be disposed when the dispose method is called...", function () {
    element.jistkit.dummyProperty = 1;
    element.jistkit.dispose();
    expect(element.jistkit.dummyProperty).toNotEqual(1);
  });

  it("jistkit objects' element property should neither be settable nor deletable", function () {
      //TODO decide if this is really the correct behaviour as it creates a circular reference...
      expect(element.jistkit.hasOwnProperty("element")).toEqual(true);
      delete element.jistkit.element;
      expect(element.jistkit.hasOwnProperty("element")).toEqual(true);
      element.jistkit.element = null;
      expect(element.jistkit.element).toNotEqual(null);
    });
  it("jistkit property can be set to null and the next call will return a fresh jistkit", function () {
      var firstJistkit = element.jistkit;
      element.jistkit.foo = true;
      element.jistkit = null;
      expect(element.jistkit.foo).toNotEqual(true);
      expect(element.jistkit).toNotEqual(firstJistkit);
    }
  );
  it("jistkit property should return new instances for different elements", function () {
    expect(element.jistkit).toNotEqual(document.createElement("div").jistkit)
  })
});


