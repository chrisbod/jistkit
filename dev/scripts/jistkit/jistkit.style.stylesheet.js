
Jistkit.globalStyle = {

    styleSheet: (function Jistkit_globalStyle_styleSheet_get() {
        var element = this.document.head.appendChild(this.document.createElement("style"));
        element.id = "jistkitstylesheet"
        return element.sheet
    })(),
    prefix: (function Jistkit_globalStyle_prefix_get() {
        for (var style = getComputedStyle(document.documentElement,null),i=0;i!=style.length;i++) {
            if (style[i].charAt(0)=='-') {
                return style[i].match(/-([^-]+)-/)[1];
            }
        }
    })(),

    ruleCache: {},
    propertyCache: {},
    idCount: 0,

    generateId: function Jistkit_globalStyle_generateId(prefix) {
        prefix = prefix || "jistkitElement";
        return prefix+this.idCount++;
    },

    addRuleDefinition: function Jistkit_globalStyle_addRuleDefinition(selector,definitionObject) {
        if (selector.charAt(0)=="@") {
            return this.addNestedRuleDefinitions(selector,definitionObject);
        } else {
            this.styleSheet.insertRule(selector+"{}",this.styleSheet.cssRules.length);
            var rule = this.styleSheet.cssRules[this.styleSheet.cssRules.length-1];
            this.defineStyleDeclaration(rule.style,definitionObject)
            return rule;
        }
    },
    defineStyleDeclaration: function Jistkit_defineRuleStyleDeclaration(styleDeclaration, definitionObject) {
        for (var propertyName in definitionObject) {
                this.setStylePropertyValue(styleDeclaration,propertyName,definitionObject[propertyName]);
        }
    },
    addNestedRuleDefinitions: function Jistkit_globalStyle_addNestedRuleDefinitions(selector, definitionObject) {
        var declarations = selector.trim().split(' '),
            ruleDeclaration = declarations[0],
            name = declarations[1]||'',
            cssRules = this.styleSheet.cssRules;
        if (this.propertyCache[ruleDeclaration]) {
            ruleDeclaration = this.propertyCache[ruleDeclaration];
        }
        try {
            this.styleSheet.insertRule(ruleDeclaration+' '+name+"{}",cssRules.length);
        } catch (e) {
            var proprietaryPropertyName = selector.replace("@","@-"+this.prefix+'-',"");
            this.styleSheet.insertRule(proprietaryPropertyName+"{}");
            this.propertyCache[selector.split(' ')[0]] = proprietaryPropertyName.split(' ')[0];
        }
        this.addNestedRuleDefinition(cssRules[cssRules.length-1], definitionObject);
    },
    addNestedRuleDefinition: function Jistkit_globalStyle_addNestedRuleDefinition(parentRule,definitionObject) {
        var cssRules = parentRule.cssRules;
        for (var propertyName in definitionObject) {
            parentRule.insertRule(propertyName+"{}",cssRules.length);
            this.defineStyleDeclaration(cssRules[cssRules.length-1].style,definitionObject[propertyName]);
        }
    },
    setRulePropertyValue: function Jistkit_globalStyle_setRulePropertyValue(rule,propertyName,value) {
        this.setStylePropertyValue(rule.style,propertyName,value)
    },
    setStylePropertyValue: function Jistkit_globalStyle_setStylePropertyValue(style,propertyName,value) {
        if (typeof value != "string") {
            throw new Error("Jistkit.Style: style property ["+propertyName+"] must be string")
        }
        style.setProperty(this.propertyCache[propertyName] || propertyName,value);
        if (style.getPropertyValue(propertyName)===null) {//unsupported property
            style.setProperty("-"+this.prefix+"-"+propertyName,value);
            if (style.getPropertyValue("-"+this.prefix+"-"+propertyName)==null) {
                throw new Error("JistkitStyle unsupported property name ["+propertyName+"] or property value ["+definitionObject[propertyName]+"] passed");
            } else {
                this.propertyCache[propertyName] = "-"+this.prefix+"-"+propertyName;
            }
        }
    },
    storeRuleInCache: function Jistkit_globalStyle_storeRuleInCache(selector,rule) {
        for (var cache = this.ruleCache, matchingRules, selectors = selector.split(/\s*,\s*/g), i=selectors.length-1;i!=-1;i--) {
            matchingRules = cache[selectors[i]];
            if (!matchingRules) {
                cache[selectors[i]] = [rule];
            } else {
                cache[selectors[i]].push(rule);
            }
        }
    },
    getRulesBySelector: function Jistkit_globalStyle_getRulesBySelector(selector) {
        var rules = [];
        for (var cache = this.ruleCache, selectors = selector.split(/\s*,\s*/g), i = selectors.length-1; i!=-1;i--) {
            if (cache[selectors[i]]) {
                rules.push.apply(rules,(cache[selectors[i]]));
            }
        }
        return rules;
    },
    getRulesThatApplyToElement: function Jistkit_globalStyle_getRulesThatApplyToElement(element) {//THIS IS REALLY ONLY FOR DEV - it could easily grind a browser to a halt...
        var methodName = "matchesSelector" in element ? "matchesSelector" : this.prefix+"MatchesSelector",
            rules = [];
        if (element[methodName]) {
            for (var cache = this.styleSheet.cssRules, i=cache.length-1;i!=-1;i--) {
               if (element[methodName](cache[i].selectorText)) {
                rules.push(cache[i])
               }
                
            }
        } else {
            throw new Error("This browser does not support HTMLElement.matchesSelector or variant thereof and using a workaround really will grind things to a halt")
        }
        return rules;
    },
    dispose: function Jistkit_globalStyle_dispose() {
        //TODO!!!!
    }
}

Jistkit.createOnDemandProperty(Jistkit.getConstructor("style").prototype,"stylesheet",function jistkit_sheetStyle(jistkit) {
    var element = jistkit.element,
        id = element.id,
        globalStyle = Jistkit.globalStyle;
    if (!id) {
        id = element.id = globalStyle.generateId();
    }
    return globalStyle.ruleCache['#'+id] ? globalStyle.ruleCache['#'+id][0] : globalStyle.addRuleDefinition('#'+id,{}).style;
},null)