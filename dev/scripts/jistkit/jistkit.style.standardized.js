//Lazy object to refer to proprietary style implementations without prefix
Jistkit.createType(["style","inline"],function Jistkit_InlineStyle(target) {
    Jistkit.call(this.target);
    if (target) {
        this.style = target.element.style;
    }
},{},
null,
(function Jistkit_StandardStyle_descriptorsDefinitionGenerator() {
    var descriptors = {},
        prefix = Jistkit.globalStyle.prefix,
        style = document.documentElement.style,
        keys = Object.keys(style),
        propertyName,
        prefixAndFirstLetter = new RegExp("^"+prefix+"(\\w)");
    
    function convertFirstCharacterToLowerCase(match,firstLetter) {
        return firstLetter.toLowerCase()
    };
    function jistkit_standardStyle_$0$_get() {
            return this.style.$0$;
    };
    function jistkit_standardStyle_$0$_set(value) {
            this.style.$0$ = value;
    };

    for (var i=keys.length-1,key;i!=0;i--) {
        key = keys[i];
        if (key!=+key && typeof style[key] == "string") {
            propertyName = key.replace(prefixAndFirstLetter,convertFirstCharacterToLowerCase);
            if (!(propertyName in descriptors)) {
                descriptors[propertyName] = {
                    get: Jistkit.Function.generateFromTemplate(jistkit_standardStyle_$0$_get,key),
                    set: Jistkit.Function.generateFromTemplate(jistkit_standardStyle_$0$_set,key)
                };
            }
        }
    }
    return descriptors;  
})()
);

//create an outline equivalent for non Dom changing properties
Jistkit.createType(["style","sheet"], function Jistkit_SheetStyle(target) {
    Jistkit.call(this,target);
    this.style = target.element.jistkit.style.sheetStyle;
},
{},
Jistkit.getConstructor("style.inline")
);
