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

    /*
    
    types of issue (CONSTANTS)

    levels:
    -1 - don't even bother
    0 - count only - all default to count only
    1 - report
    2 - warn
    3 - error

    */
    ANONYMOUS_METHODS: {
        name: "anonymous methods",
        explanation: "Naming your methods is jsut a tidy thing to do and can aid debugging",
        level: 0
    },
    CLOSURES: {
        name:"closures",
        description: "closures degrade performance, use memory, slow debugging, and make code harder to understand - checkout function.bind(object,[args,..])",
        ignoreArguments: true,
        level: 0
    },
    ANONYMOUS_CLOSURES: {
        name: "anonymous closures".
        explanation: "naming nested functions/closures aids debugging as well as make code more self explanatory",
        level: 0
    },
    NUMEROUS_METHODS: {
        name: "numerous methods",
        explanation: "if it looks like a blob, tastes a blob and its not a binary large object then it's a blob",
        defaultTolerance: 50,
        ignoreInherited: true,
        ignoreIndicatedPrivate: true,
        ignoreIndicatedSpecial: true,
        ignoreIndicatedClosure: true,
        ignoreIndicatedBound: true,
        ignoreIndicatedGetSet: true,
        level: 0
    },
    NUMEROUS_PROPERTIES: {
        name: "numerous properties",
        explanation: "there are a lot of properties in the object - are you on the blob again?",
        defaultTolerance: 50,
        ignoreInherited: true,
        ignoreMarkedPrivate: true,
        level: 0
    }
    NUMEROUS_ARGUMENTS: {
        name: "numerous arguments",
        explanation: "methods that take a lot of arguments can be hard to work with",
        ignoreConstructors: true,
        ignoreCreates: true,
        ignoreInits: true,
        level: 0
    },
    NESTED_CLOSURES: {
        name: "nested functions",
        explanation: "nested closures (functions) are exponentially worse than normal closures, memory use, performance, readability are all degraded",
        level: 0
    },
    DEEP_INHERITANCE_CHAIN: {
        name: "deep inheritance chain",
        //assume that Base, Abstract Object Interface indicate 
        ignoreBase: true,//ignore any types with Base in their name,
        ignoreAbstract: true,//ignore any types with Abstract in their name,
        ignoreObject: true,//ignore any types with Object in their name,
        level: 0

    },
    UNDECLARED_PROPERTIES: {
        name: "undeclared properties",
        explanation: "your type may be using properties that are not explicitly declared in its prototype chain",
        level: 0
    },
    INCONSISTENT_OVERRIDES: {
        name: "inconsistent overrides",
        explanation: "your types seem to have clashing definitions of the same property",
        ignoreNullForObjects, true,
        ignoreNullForPrimitives: true,
        ignoreNullForFunctions: true,
        level: 0
    },
    INCONSISTENT_SIGNATURES: {
        name "inconsistent method signatures",
        explanation: "your object's methods seem to take a different number of arguments up their inheritance tree",
        level: 0
    },
    SHARED_REFERENCES: {
        name: "shared references",
        explanation: "you have pointers to objects in your prototype chain (excluding Elements, windows etc)) - these will be shared down the heirarchy - unless this is the correct behaviour consider using nulls and declaring them explicitly in the constructor/instance methods"
        level: 0
    },
    ASSIGNMENT_TO_DESCRIPTORS: {
        name: "assignment to value descriptors",
        explanation: "assignment to properties with non-writable value descriptors set up the chain will fail, use setters and getters "
        level: 0
    },

    SHORT_VARIABLES: {
        name: "short variables",
        explanation: "It's always nice to give your variables clear names",
        ignoreL: true,
        ignoreXYZ: true,
        ignoreProto: true,
        ignoreFunc: true,
        ignoreObj: true,
        ignoreElm: true,
        ignoreIJK: true
        ignoreAlpha: true,
        level: 0
    },
    NUMEROUS_VARIABLES: {
        name: "numerous variables in your methods",
        explanation: "too many variables in a method indicate that it may be too complex",
        tolerance: 10,
        ignoreLoops: true,
        level: 0
    },
    CONSECUTIVE_VAR_DECLARATIONS: {
        name: "consecutive var statements",
        explanation: "you don't really need to use multiple vars everywhere you can comma seperate them in groups"
        level: 0,
    },
    NUMEROUS_VAR_DECLARATIONS: {
        name: "numerous var statements",
        explanation: "like numerous variables sometimes lots of var statements may indicated complex methods",
        level: 0
    },
    OVERLONG_METHOD: {
        name: "overlong method",
        explanation: "overlong methods are prone to bugs, hard to read/understand and probably indicate that a refactor is needed".
        tolerance: 16,
        ignoreVar: true,
        ignoreSwitch: true,
        level: 0
    },
    OVERLONG_LOOP: {
        name: "overlong loop",
        explanation: "overlong loops probably indicate the need to abstract",
        tolerance: 8,
        ignoreAssignments: true,
        level: 0
    },
    DEEP_LOOP_NESTING: {
        name: "deep loop nesting",
        explanation: "can be just plain confusing especially",
        tolerance: 2,
        ignoreLabel: true,
        level: 0
    },
    CONSECUTIVE_IF_ELSE: {
        name: "lots of if elses in a row",
        description: "long if elses get confusing quickly, often are bug prone, try switches or strategies/behaviours instead",
        tolerance: 3,
        level: 0
    },
    LONG_REFERENCE_CHAINS: {
        name: "long reference chains",
        decription: "long reference chains can be inefficient as well as hard to follow consider using a well-named variable to bring the object into scope or simply to make it clearer what your intention is",
        propertyTolerance: 3,
        ignoreOutsideLoop: true,
        ignoreInsideLoop: true,
        usageTolerance: 3,
        level: 0
    },
    CONSOLE_CALLS: {
        name: "console calls",
        description: "console calls shouldn't make it into most deployment-ready code",
        level: 0
    },
    DEBUGGER_STATEMENT: {
        name: "debugger calls",
        description: "debugger calls really shouldn't be in deployment code - and often break code minimizers too",
        level: 0
    },
    ANY_TRY_CATCH_BLOCKS: {
        name: "try/catch blocks",
        description: "In simple/single threaded environment like a browser you can often to use 'state' detection to avoid using a try catch",
        level: 0
    },
    LARGE_TRY_CATCH_BLOCKS: {
        name: "large try/catch blocks",
        description: "If you're going to use try and catch consider making it granular as possible so you can narrow down the root of the problem",
        level: 0

    },
    EMPTY_CATCH_BLOCKS: {
        name: "empty catch blocks",
        description: "you probably ought to do something with your errors - maybe toss it to a debug function or something",
        level: 0
    },
    THROWING_STRINGS: {
        name "throw strings instead of Errors",
        description: "you should probably throw an Error or some sort of Object rather than a string as Errors often provide more info when debugging",
        ignoreStringObjects: true,
        level: 0
    },

    CASE_CONVENTIONS: {
        name:"case conventions",
        description: "generally javascript conventions are Constructor, methodsOrFunctions, CONSTANTS",
        ignoreNewThis: true,
        ignoreNewVariable: true,
        level:0
    },
    JIST_PROTOTYPICAL_HELPERTYPES: {
        name:"Jist: prototypical helper types",
        description: "I like to put Helpers on the prototype for overriding types down the line easily",
        level: -1
    },
    JIST_METHOD_NAMING_CONVENTIONS: {
        name: "Jist: method naming conventions",
        description: "I like to be obsessive about my naming conventions on Constructors and instances e.g. SomeType.Helper becomes Type_Helper but instance[OfType].Helper becomes type_Helper",
        level: -1
    },
    JIST_FUNCTION_NAMING_CONVENTIONS: {
        name: "Jist: function naming conventions",
        description: "I like my binds and my closures to be indicative of where they come form and that they are Binds or Closures",
        level: -1
    }



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
            document.writeln('<scr'+'ipt src="'+(manifest.base? manifest.base+'/': '')+'/'+manifest.scripts[i].file+'"></scr'+'ipt>')
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
            if (!descriptor.value.name) {

            }
        } else if (typeof descriptor.value == "object" && descriptor.value) {
           console.log(descriptor.value.constructor.name in window)
                
        }
    },
    interrogateFunction: function () {

    }


    //Helpers

    Notification: function CodeQuality_Notification(type,script,object,key,lineNumber) {
        this.type = type;
        this.script = script;
        this.object = object;
        this.key = key;
        this.lineNumber = lineNumber;
    }

}

    /*anonymous functions/methods
    */


