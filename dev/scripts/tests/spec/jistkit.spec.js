describe("JistKit", function () {

var element = document.documentElement,
	temporaryPointer;
  it ("jistkit should be reported in HTMLElements", function () {
  	expect(("jistkit" in element)).toEqual(true);
  }


  );
  it("elements should return the same object on each call to their jistkit property ", function() {
   // player.play(song);
    expect(element.jistkit).toEqual(element.jistkit);
  });
  it("'element' property of instance of jistkit should point to the element it is attached to", function () {
  	expect(element.jistkit.element).toEqual(element);
  })
  it("jistkit objects should be disposable", function () {
  	element.jistkit.dummyProperty = 1;
  	element.jistkit.dispose()
  	expect(element.jistkit.dummyProperty).toNotEqual(1);
  	
  })
  it("jistkit objects' element property should neither be settable nor deletable", function () {
	expect(element.jistkit.hasOwnProperty("element")).toEqual(true);
  	delete element.jistkit.element;

  	expect(element.jistkit.hasOwnProperty("element")).toEqual(true)
  	element.jistkit.element = null
  	expect(element.jistkit.element).toNotEqual(null)
  })


});