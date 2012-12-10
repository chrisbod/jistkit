new CodeQuality({
    base: "../dev/scripts/jistkit",
    jshint: {},
    scripts: [
        {file:"jistkit.js", name: "JistKit", getter: function () {return Jistkit}},
        {file:"jistkit.function.js", name: "JistKit.Function", getter: function () {return Jistkit.Function}},
        {file:"jistkit.style.js", name: "JistKit.Style", getter: function () {return Jistkit.getConstructor("style")}}
    ]
})