//TODO make the style property dynamic based on the inline setting
Jistkit.createType(["style","transform"],
    function Jistkit_Transform(target) {
        Jistkit.call(this,target);
        this.style = this.element.jistkit.style.inline;
        this.transforms = {};
    },{
    inline: false,
    apply: function jistkit_transform_apply () {
        var transforms = [];
        for (var propertyName in this.transforms) {
            transforms.push(propertyName+'('+this.transforms[i]+')');
        }
        this.style.transform = transforms.sort().toString();
        return this.style.transform;
    },
    reset: function jistkit_transform_apply() {
        
        for (var propertyName in this.transforms) {
            delete this.transforms[propertyName];
        }
        return this.style.transform;
    },
    synchronizeWith: function() {},
    getCurrentValue: function () {
        return this.style.transform;
    },
    getSpecificValue: function (transformName) {
        
    },
    getCurrent2dMatrix: function () {

    },
    getCurrent3dMatrix: function () {

    },  
    //begin CHAINED methods
    transform: function (propertyName,args) {
        if (arguments[0]===null) {
            delete this.transforms[propertyName];
        } else {
            if (arguments.length>2) {
                for (var i=0;i!=args.length;i++) {
                    if (typeof args[i] == 'number') {
                        args[i]+=arguments[i+2];
                    }
                }
            }
            this.transforms[propertyName] = [].splice.apply(args);
        }
        return this;
    },
    matrix: function jistkit_transform_matrix (a, b, c, d, e, f) {
        return this.transform("matrix",arguments);
    },
    matrix3d: function jistkit_transform_matrix3d (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p ) {
        return this.transform("matrix3d",arguments);
    },
    perspective: function jistkit_transform_perspective (distance) {
        return this.transform("perspective",arguments,"px");
    },
    rotate: function jistkit_transform_rotate (angle) {
        return this.transform("rotate",arguments,"deg");
    },
    rotate3d: function jistkit_transform_rotate3d (lengthX, lengthY, lengthZ, angle) {
        return this.transform("rotate3d",arguments,"px","px","px","deg");
    },
    rotateX: function jistkit_transform_rotateX (angle) {
        return this.transform("rotateX",arguments,"deg");
    },
    rotateY: function jistkit_transform_rotateY (angle) {
        return this.transform("rotateY",arguments,"deg");
    },
    rotateZ: function jistkit_transform_rotateZ (angle) {
        return this.transform("rotateZ",arguments,"deg");
    },
    scale: function jistkit_transform_scale (numberX,numberY) {
        return this.transform("scale",arguments);
    },
    scale3d: function jistkit_transform_scale3d (numberX, numberY, numberZ) {
        return this.transform("scale3d",arguments);
    },
    scaleX: function jistkit_transform_scaleX (numberX) {
        return this.transform("scaleX",arguments);
    },
    scaleY: function jistkit_transform_scaleY (numberY) {
        return this.transform("scaleY",arguments);

    },
    scaleZ: function jistkit_transform_scaleZ (numberZ) {
        return this.transform("scaleZ",arguments);
    },
    skewX: function jistkit_transform_skewX (angle) {
        return this.transform("skewX",arguments,"deg");
    },
    skewY: function jistkit_transform_skewY (angle) {
        return this.transform("skewY",arguments,"deg");
    },
    translate: function jistkit_transform_translate (lengthX,lengthY) {
        return this.transform("translate",arguments);
    },
    translate3d: function jistkit_transform_translate3d (lengthX,lengthY,lengthZ) {
        return this.transform("translate3d",arguments);
    },
    translateX: function jistkit_transform_translateX (lengthX) {
        return this.transform("translateX",arguments,"px");
    },
    translateY: function jistkit_transform_translateY (lengthY) {
        return this.transform("translateY",arguments, "px");
    },
    translateZ: function jistkit_transform_translateZ (lengthZ) {
        return this.transform("translateZ",arguments, "px");
    }
});