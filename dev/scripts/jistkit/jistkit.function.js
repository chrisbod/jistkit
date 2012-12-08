Jistkit.Function = {
    generateFromTemplate: function Jistkit_Function_generateFromTemplate(templateFunction) {
        var functionString = templateFunction.toString();
        for (var i=1,l=arguments.length;i!=l;i++) {
            functionString = functionString.replace(new RegExp("\\$"+(i-1)+"\\$","g"),arguments[i]);
        }
        return (new Function("return "+functionString))();
    }

};