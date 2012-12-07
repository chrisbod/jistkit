describe("JistKit", function () {
  var element = document.documentElement,
     temporaryPointer;
  /*
  it ("jistkit prototype should be the 'true' prototype of JistKit not an object literal", function () {
     // expect(element.jistkit.constructor).toEqual(JistKit);
  })*/
  it("jistkit should be reported in HTMLElements", function () {
    expect(("jistKit" in element)).toEqual(true);
  });
  it("elements should return the same object on each call to their jistkit property ", function () {
    expect(element.jistKit).toEqual(element.jistKit);
  });
  it("'element' property of instance of jistkit should point to the element it is attached to", function () {
    expect(element.jistKit.element).toEqual(element);
  });
  it("jistkit objects properties should be disposed when the dispose method is called...", function () {
    element.jistKit.dummyProperty = 1;
    element.jistKit.dispose();
    expect(element.jistKit.dummyProperty).toNotEqual(1);
    
  });
  it("jistkit objects' element property should neither be settable nor deletable", function () {
      //TODO decide if this is really the correct behaviour as it creates a circular reference...
      expect(element.jistKit.hasOwnProperty("element")).toEqual(true);
      delete element.jistKit.element;
      expect(element.jistKit.hasOwnProperty("element")).toEqual(true);
      element.jistKit.element = null;
      expect(element.jistKit.element).toNotEqual(null);
    });
  it("jistkit property can be set to null and the next call will return a fresh jistkit", function () {
      var firstJistkit = element.jistKit;
      element.jistKit.foo = true;
      element.jistKit = null;
      expect(element.jistKit.foo).toNotEqual(true);
      expect(element.jistKit).toNotEqual(firstJistkit);
    }
  );
  it("jistkit property should return new instances for different elements", function () {
    expect(element.jistKit).toNotEqual(document.createElement("div").jistKit)
  })
});
//okay dummy extender tests should be elsewhere (and should be run on EVERY extender) really but they're pretty central to jistKit

//TODO - abstract this for all types
describe("JistKit.DummyExtender (using normal prototypical inheritence)", function () {
  var element = document.documentElement;
it("dummy property should now exist in element.jistKit", function () {
    expect(("dummy" in element.jistKit)).toEqual(true);
  })
it("dummy property should be an instance of JistKitDummyExtender", function () {
    expect(element.jistKit.dummy instanceof JistKit.DummyExtender)
})
it("dummy property should return same object", function () {
  var dummy = element.jistKit.dummy;
  expect(dummy).toEqual(element.jistKit.dummy);
})
it("DummyExtender should not be in global namespace", function () {
  expect(typeof JistKit_DummyExtender).toEqual("undefined");
})
it("dummy property should be settable to null etc", function () {
  var dummy2 = element.jistKit.dummy;
  element.jistKit.dummy = null;
  expect(dummy2==element.jistKit.dummy).toEqual(false);

});
it("dummy property should be instance of DummyExtender", function () {
  expect(element.jistKit.dummy instanceof JistKit.DummyExtender).toEqual(true);
});
it("dummy element getter should return the element", function () {
  expect(element.jistKit.dummy.element).toEqual(element);
});
})



describe("JistKit.DummyExtender2 (using Object.create)", function () {
  var element = document.documentElement;
it("dummy2 property should now exist in element.jistKit", function () {
    expect(("dummy2" in element.jistKit)).toEqual(true);
  })
it("dummy property should be an instance of JistKitDummyExtender2", function () {
    expect(element.jistKit.dummy2 instanceof JistKit.DummyExtender2)
})
it("dummy property should return same object", function () {
  var dummy2 = element.jistKit.dummy2;
  expect(dummy2).toEqual(element.jistKit.dummy2);
})
it("DummyExtender should not be in global namespace", function () {
  expect(typeof JistKit_DummyExtender2).toEqual("undefined");
})
it("dummy property should be settable to null etc", function () {
  var dummy2 = element.jistKit.dummy2;
  element.jistkit.dummy2 = null;
  expect(dummy2==element.jistKit.dummy2).toEqual(false);

});
it("dummy property should be instance of DummyExtender", function () {
  expect(element.jistKit.dummy2 instanceof JistKit.DummyExtender2).toEqual(true);
});
it("dummy element getter should return the element", function () {
  expect(element.jistKit.dummy2.element).toEqual(element);
});
})

describe("JistKit.DummyExtender3 (using JistKit.createType)", function () {
  var element = document.documentElement;
it("dummy3 property should now exist in element.jistKit", function () {
    expect(("dummy3" in element.jistKit)).toEqual(true);
  })
it("dummy property should be an instance of JistKitDummyExtender3", function () {
    expect(element.jistKit.dummy3 instanceof JistKit.DummyExtender3)
})
it("dummy property should return same object", function () {
  var dummy3 = element.jistKit.dummy3;
  expect(dummy3).toEqual(element.jistKit.dummy3);
})
it("DummyExtender should not be in global namespace", function () {
  expect(typeof JistKit_DummyExtender3).toEqual("undefined");
})
it("dummy property should be settable to null etc", function () {
  var dummy3 = element.jistKit.dummy3;
  element.jistKit.dummy3 = null;
  expect(dummy3==element.jistKit.dummy3).toEqual(false);

});
it("dummy property should be instance of DummyExtender", function () {
  expect(element.jistKit.dummy3 instanceof JistKit.DummyExtender3).toEqual(true);
});
it("dummy element getter should return the element", function () {
  expect(element.jistKit.dummy3.element).toEqual(element);
});
})