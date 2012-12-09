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
//okay dummy extender tests should be elsewhere (and should be run on EVERY extender) really but they're pretty central to jistkit

//TODO - abstract this for all types
describe("Jistkit.DummyExtender (using normal prototypical inheritence)", function () {
  var element = document.documentElement;
it("dummy property should now exist in element.jistkit", function () {
    expect(("dummy" in element.jistkit)).toEqual(true);
  })
it("dummy property should be an instance of JistkitDummyExtender", function () {
    expect(element.jistkit.dummy instanceof Jistkit.DummyExtender)
})
it("dummy property should return same object", function () {
  var dummy = element.jistkit.dummy;
  expect(dummy).toEqual(element.jistkit.dummy);
})
it("DummyExtender should not be in global namespace", function () {
  expect(typeof Jistkit_DummyExtender).toEqual("undefined");
})
it("dummy property should be settable to null etc", function () {
  var dummy2 = element.jistkit.dummy;
  element.jistkit.dummy = null;
  expect(dummy2==element.jistkit.dummy).toEqual(false);

});
it("dummy property should be instance of DummyExtender", function () {
  expect(element.jistkit.dummy instanceof Jistkit.DummyExtender).toEqual(true);
});
it("dummy element getter should return the element", function () {
  expect(element.jistkit.dummy.element).toEqual(element);
});
})



describe("Jistkit.DummyExtender2 (using Object.create)", function () {
  var element = document.documentElement;
it("dummy2 property should now exist in element.jistkit", function () {
    expect(("dummy2" in element.jistkit)).toEqual(true);
  })
it("dummy property should be an instance of JistkitDummyExtender2", function () {
    expect(element.jistkit.dummy2 instanceof Jistkit.DummyExtender2)
})
it("dummy property should return same object", function () {
  var dummy2 = element.jistkit.dummy2;
  expect(dummy2).toEqual(element.jistkit.dummy2);
})
it("DummyExtender should not be in global namespace", function () {
  expect(typeof Jistkit_DummyExtender2).toEqual("undefined");
})
it("dummy property should be settable to null etc", function () {
  var dummy2 = element.jistkit.dummy2;
  element.jistkit.dummy2 = null;
  expect(dummy2==element.jistkit.dummy2).toEqual(false);

});
it("dummy property should be instance of DummyExtender", function () {
  expect(element.jistkit.dummy2 instanceof Jistkit.DummyExtender2).toEqual(true);
});
it("dummy element getter should return the element", function () {
  expect(element.jistkit.dummy2.element).toEqual(element);
});
})

describe("Jistkit.DummyExtender3 (using Jistkit.createType)", function () {
  var element = document.documentElement;
it("dummy3 property should now exist in element.jistkit", function () {
    expect(("dummy3" in element.jistkit)).toEqual(true);
  })
it("dummy property should be an instance of JistkitDummyExtender3", function () {
    expect(element.jistkit.dummy3 instanceof Jistkit.DummyExtender3)
})
it("dummy property should return same object", function () {
  var dummy3 = element.jistkit.dummy3;
  expect(dummy3).toEqual(element.jistkit.dummy3);
})
it("DummyExtender should not be in global namespace", function () {
  expect(typeof Jistkit_DummyExtender3).toEqual("undefined");
})
it("dummy property should be settable to null etc", function () {
  var dummy3 = element.jistkit.dummy3;
  element.jistkit.dummy3 = null;
  expect(dummy3==element.jistkit.dummy3).toEqual(false);

});
it("dummy property should be instance of DummyExtender", function () {
  expect(element.jistkit.dummy3 instanceof Jistkit.DummyExtender3).toEqual(true);
});
it("dummy element getter should return the element", function () {
  expect(element.jistkit.dummy3.element).toEqual(element);
});
})