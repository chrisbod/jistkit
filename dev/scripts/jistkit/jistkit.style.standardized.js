//Lazy object to refer to proprietary style implementations without prefix
JistKit.createType(["style","inline"],function JistKit_InlineStyle(target) {
    JistKit.call(this.target);
    if (target) {
        this.style = target.element.style;
    }
},{},
null,
(function JistKit_StandardStyle_descriptorsDefinitionGenerator() {
    var descriptors = {},
        prefix = JistKit.globalStyle.prefix,
        style = document.documentElement.style,
        keys = Object.keys(style),
        propertyName,
        prefixAndFirstLetter = new RegExp("^"+prefix+"(\\w)");
    
    function convertFirstCharacterToLowerCase(match,firstLetter) {
        return firstLetter.toLowerCase()
    };
    function jistKit_standardStyle_$0$_get() {
            return this.style.$0$;
    };
    function jistKit_standardStyle_$0$_set(value) {
            this.style.$0$ = value;
    };

    for (var i=keys.length-1,key;i!=0;i--) {
        key = keys[i];
        if (key!=+key && typeof style[key] == "string") {
            propertyName = key.replace(prefixAndFirstLetter,convertFirstCharacterToLowerCase);
            if (!(propertyName in descriptors)) {
                descriptors[propertyName] = {
                    get: JistKit.Function.generateFromTemplate(jistKit_standardStyle_$0$_get,key),
                    set: JistKit.Function.generateFromTemplate(jistKit_standardStyle_$0$_set,key)
                };
            }
        }
    }
    return descriptors;  
})()
);

//create an outline equivalent for non Dom changing properties
JistKit.createType(["style","sheet"], function JistKit_SheetStyle(target) {
    JistKit.call(this,target);
    this.style = target.element.jistKit.style.sheetStyle;
},
{},
JistKit.getConstructor("style.inline")
);
