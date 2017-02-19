"use strict";
exports.ANNOTATIONS_KEY = '__annotations';
function addAnnotation(target, annotation) {
    var annotations = Reflect.getMetadata(exports.ANNOTATIONS_KEY, target) || [];
    annotations.push(annotation);
    Reflect.defineMetadata(exports.ANNOTATIONS_KEY, annotations, target);
}
function getAnnotations(target) {
    return Reflect.getMetadata(exports.ANNOTATIONS_KEY, target) || [];
}
exports.getAnnotations = getAnnotations;
function findAnnotation(target, annotationType) {
    var annotations = getAnnotations(target);
    for (var i = 0; i < annotations.length; i++) {
        if (annotations[i] instanceof annotationType) {
            return annotations[i];
        }
    }
    return null;
}
exports.findAnnotation = findAnnotation;
function makeClassDecorator(annotationClass) {
    function DecoratorFactory() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var annotationInstance = new ((_a = annotationClass).bind.apply(_a, [void 0].concat(args)))();
        return function (target) {
            addAnnotation(target, annotationInstance);
        };
        var _a;
    }
    DecoratorFactory.prototype = Object.create(annotationClass.prototype);
    return DecoratorFactory;
}
exports.makeClassDecorator = makeClassDecorator;
