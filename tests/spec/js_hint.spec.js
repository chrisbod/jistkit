/*
  Adpated from original work by Brandon Keepers
  
  see:
  http://opensoul.org/blog/archives/2011/02/19/jslint-and-jasmine/
  and
  https://github.com/bkeepers/lucid/
  for details and licensing

*/
var _ = {
  each: function underscore_mockEach(collection, func) {

    for (var i=0,l=collection.length;i!=l;i++) {
      if (collection[i]) func(collection[i]);
    }
  }

}
describe('JSHint', function () {
  var options = {curly: true, white: true};

  function get(path) {
    path = path + "?" + new Date().getTime();

    var xhr;
    try {
      xhr = new jasmine.XmlHttpRequest();
      xhr.open("GET", path, false);
      xhr.send(null);
    } catch (e) {
      throw new Error("couldn't fetch " + path + ": " + e);
    }
    if (xhr.status < 200 || xhr.status > 299) {
      throw new Error("Could not load '" + path + "'.");
    }

    return xhr.responseText;
  }
  window.addEventListener("load", function () {

  _.each(document.querySelectorAll("script[data-jshint]"), function (element) {
    var script = element.getAttribute('src');
      var self = this;
      var source = get(script);
      var result = JSHINT(source, options);
      _.each(JSHINT.errors, function (error) {
          console.error(script+"-"+error.line)
          console.log(error.reason + '\n ' + error.evidence)
        });
    });
});
});