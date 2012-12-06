JistKit.Style = {
    styleSheet: this.document.head.appendChild(this.document.createElement("style")).sheet,
    prefix: (function () {
        for (var style = getComputedStyle(document.documentElement,null),i=0;i!=style.length;i++) {
            if (style[i].charAt(0)=='-') {
                return style[i].match(/-[^-]+-/)[0]
            }
        }
    })(),
    ruleCache: {},
    propertyCache: {},
    addRuleDefinition: function (selector,definitionObject) {
        if (selector.charAt(0)=="@") {
            return this.addNestedRuleDefinition(selector,definitionObject);
        }
        this.styleSheet.insertRule(selector+"{}",this.styleSheet.cssRules.length);
        var rule = this.styleSheet.cssRules[this.styleSheet.cssRules.length-1],
            style = rule.style,
            propertyName,
            propertyType;
        for (propertyName in definitionObject) {
                this.setStylePropertyValue(style,propertyName,definitionObject[propertyName]);
        }
        this.storeRuleInCache(selector,rule);
        return rule;
    },
    addNestedRuleDefinition: function (selector,definitionObject) {
        try {
            this.styleSheet.insertRule(selector+"{}",this.styleSheet.cssRules.length);
        } catch (e) {
            this.styleSheet.insertRule(selector.replace("@","@"+this.prefix,""))
        }
        var rule = this.styleSheet.cssRules[this.styleSheet.cssRules.length-1];
        for (var i in definitionObject) {
            rule.insertRule(i+"{}",rule.cssRules.length);
            var nestedRule = rule.cssRules[rule.cssRules.length-1];
            for (var j in definitionObject[i]) {
                this.setStylePropertyValue(nestedRule.style,j,definitionObject[i][j]);
            }
        }

    },
    setRulePropertyValue: function (rule,propertyName,value) {
        this.setStylePropertyValue(rule.style,propertyName,value)
    },
    setStylePropertyValue: function (style,propertyName,value) {
        if (typeof value != "string") {
            throw new Error("JistKit.Style: style property ["+propertyName+"] must be string")
        }
        style.setProperty(this.propertyCache[propertyName] || propertyName,value);
        if (style.getPropertyValue(propertyName)===null) {//unsupported property
            style.setProperty(this.prefix+propertyName,value);
            if (style.getPropertyValue(this.prefix+propertyName)==null) {
                throw new Error("JistKitStyle unsupported property name ["+propertyName+"] or property value ["+definitionObject[propertyName]+"] passed");
            } else {
                this.propertyCache[propertyName] = this.prefix+propertyName;
            }
        }
    },
    storeRuleInCache: function (selector,rule) {
        for (var cache = this.ruleCache,matchingRules,selectors = selector.split(/\s*,\s*/g), i=selectors.length-1;i!=-1;i--) {
            matchingRules = cache[selectors[i]];
            if (!matchingRules) {
                cache[selectors[i]] = [rule];
            } else {
                cache[selectors[i]].push(rule);
            }
        }
    },
    getRulesBySelector: function (selector) {
        var rules = [];
        for (var cache = this.ruleCache, selectors = selector.split(/\s*,\s*/g), i = selectors.length-1; i!=-1;i--) {
            if (cache[selectors[i]]) {
                rules.push.apply(rules,(cache[selectors[i]]));
            }
        }
        return rules;
    },
    getRulesThatApplyToElement: function (element) {//THIS IS REALLY ONLY FOR DEV - it could easily grind a browser to a halt...
        var methodName = "matchesSelector" in element ? "matchesSelector" : this.prefix.replace(/-/g,'')+"MatchesSelector",
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
    dispose: function () {
        //
    }
}
JistKit.Style.styleSheet.ownerNode.id = "jistKitStyleSheet"