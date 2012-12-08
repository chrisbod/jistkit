//Lazy object to refer to proprietary style implementations without prefix
JistKit.createType("standardStyle",function JistKitStandardStyle(target) {
    JistKit.call(this.target);
    if (target) {
        this.style = target.element.style;
    }
},{},
null,
(function () {

    var descriptors = {},
        standardStyle_property_getter_template = function jistKit_standardStyle_$0$_get() {
            return this.style.$0$;
        },
        standardStyle_property_setter_template = function jistKit_standardStyle_$0$_set(value) {
            this.style.$0$ = value;
        },
        prefix = JistKit.globalStyle.prefix,
        style = document.documentElement.style,
        keys = Object.keys(style),
        propertyName,
        prefixAndFirstLetter = new RegExp("^"+prefix+"(\\w)"),
        lowerCaser = function (match,firstLetter) {

                    return firstLetter.toLowerCase()
        };
    for (var i=keys.length-1,key;i!=0;i--) {
        key = keys[i];
        if (key!=+key && typeof style[key] == "string") {
            propertyName = key.replace(prefixAndFirstLetter,lowerCaser);

            if (!(propertyName in descriptors)) {
                descriptors[propertyName] = {
                    get: JistKit.Function.generateFromTemplate(standardStyle_property_getter_template,key),
                    set: JistKit.Function.generateFromTemplate(standardStyle_property_setter_template,key)
                };
            }
        }
    }
    return descriptors;  
})()
);
JistKit.createType("standardSheetStyle", function JistKitStandardSheetStyle(target) {
    JistKit.call(this,target);
    this.style = target.element.jistKit.sheetStyle;
},
{},
JistKit.getConstructor("standardStyle")
);
