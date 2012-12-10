/****
    Things to check for ideally
    anonymous functions/methods
    long methods
    blobs
    properties not specified in prototype or prototype chain
    closures
    overrides that do not match prototype types
    (allow null for object slots)
    objects shared in the prototype chain
    nested loops
    everything disabled until enabled
    maximum number of arguments
    

*/

function CodeQuality (manifest) {
    window.addEventListener("load", this);
    this.manifest = manifest;
    this.generateScriptTags();
    this.sectionFragment = document.createDocumentFragment();
    this.results = [];
}
CodeQuality.prototype = {
    manifest: null,
    handleEvent: function codeQuality_handleEvent(event) {
        switch (event.type) {
            case "load": {
                this.build();
                this.check();
                this.output();
            }
        }
    },
    generateScriptTags: function codeQuality_generateScriptTags() {
        var manifest = this.manifest,
            scripts = manifest.scripts;
        for (var i=0;i<scripts.length;i++) {
            document.writeln('<scr'+'ipt src="'+(manifest.base? manifest.base+'/' : '')+'/'+manifest.scripts[i].file+'"></scr'+'ipt>')
        }
    },
    check: function codeQuality_check() {
        var manifest = this.manifest;
        if (manifest.jshint) {
            this.jshintScripts()
        }
        this.interrogateScripts(this.manifest.scripts);
    },
    output: function () {
        var resultsFragment = document.createDocumentFragment();

        for (var i=0,section;i<this.results.length;i++) {
            section = this.buildSection(this.scripts[i].name,this.scripts[i].filepath);
            section.querySelector("section").appendChild(this.outputResults(this.results[i]))
            resultsFragment.appendChild(section)
        };
        this.element.appendChild(resultsFragment)
    },
    build: function () {
        this.element = document.createElement("div")
        this.element.classList.add("codequality-output")
        document.body.appendChild(this.element)
    },
    buildSection: function (name,filepath) {
        var section = this.sectionTemplate.cloneNode(true);
        section.querySelector("h2").textContent = name;
        section.querySelector("h3").textContent = filepath;
        return section;
    },
    sectionTemplate: (function () {
        var section = document.createElement("section"),
            header = document.createElement("header"),
            heading = document.createElement("h2"),
            subheader = document.createElement("h3"),
            output = document.createElement("section");
        header.appendChild(heading);
        header.appendChild(subheader);
        section.appendChild(output)
        return section;
    })(),
    jshintScripts: function () {},
    interrogateScripts: function (scripts) {
        for (var i=0;i<scripts.length;i++) {
            this.results.push(this.interrogateScript(scripts[i]));
        }
    },
    interrogateScript: function (script) {
        var target = script.getter();
        switch (typeof target) {
            case "object": {
                return {
                    object:this.interrogateObject(target)
                };
            }
            case "function": {
                return {
                    func:this.interrogateFunction(target),
                    object:this.interrogateObject(target)
                }
            }
        }
    },
    interrogateObject: function (object) {
        var prototype = Object.getPrototypeOf(object);
        var keys = Object.getOwnPropertyNames(object);
        for (var i=0,key;i<keys.length;i++) {
            key = keys[i]
            //if (!(key in prototype)) {
               this.analyzeDescriptor(object,key,prototype);
            //}
        }

    },
    analyzeDescriptor: function (object,key,prototype) {
    var descriptor = Object.getOwnPropertyDescriptor(object,key);
        if (typeof descriptor.value == "function") {
            if (!descriptor.value.name) console.log(key,"anonymous function")
        } else if (typeof descriptor.value == "object" && descriptor.value) {
           console.log(descriptor.value.constructor.name in window)
                
        }
    },
    interrogateFunction: function () {

    }

}

function CodeQualityNotification(type,object,key,details) {
    this.type = type;
    this.object = object;
    this.key = key
    this.details = details;
}

    /*anonymous functions/methods
    */
CodeQualityNotification.ANONYMOUS_METHODS = 0;
CodeQualityNotification.NUMEROUS_METHODS = 2;
CodeQualityNotification.NUMEROUS_ARGUMENTS = 3;
CodeQualityNotification.CLOSURES = 5;
CodeQualityNotification.NESTED_FUNCTIONS = 234234;

CodeQualityNotification.DEEP_INHERITANCE_CHAIN = 1;
CodeQualityNotification.UNDECLARED_PROPERTIES = 4;
CodeQualityNotification.INCONSISTENT_OVERRIDES = 6;
CodeQualityNotification.SHARED_REFERENCES = 7;
CodeQualityNotification.ASSIGNMENT_TO_DESCRIPTORS = 4;

CodeQualityNotification.SHORT_VARIABLES = 10;
CodeQualityNotification.NUMEROUS_VARIABLES = 16;
CodeQualityNotification.CONSECUTIVE_VAR_DECLARATIONS = 18;
CodeQualityNotification.NUMEROUS_VAR_DECLARATIONS = 18;



CodeQualityNotification.OVERLONG_METHOD = 9;
CodeQualityNotification.OVERLONG_LOOP = 9;
CodeQualityNotification.DEEP_LOOP_NESTING = 8;
CodeQualityNotification.CONSECUTIVE_CONDITIONALS = 7;

CodeQualityNotification.LONG_REFERENCE_CHAINS = 17;


CodeQualityNotification.CONSOLE_CALLS = 13;
CodeQualityNotification.DEBUGGER_STATEMENT = 14;

CodeQualityNotification.DEEP_LOOP_NESTING = 8;
CodeQualityNotification.LARGE_TRY_BLOCKS = 3123123;
CodeQualityNotification.EMPTY_CATCH_BLOCKS = 1232;
CodeQualityNotification.THROWING_STRINGS = 1231231;

CodeQualityNotification.PROTOTYPICAL_HELPERS = 11;
CodeQualityNotification.CASE_CONVENTIONS = 12;

CodeQualityNotification.JIST_NAMING_CONVENTIONS = 11;
CodeQualityNotification.JIST_INHERTIANCE_CONVENTIONS = 11;

