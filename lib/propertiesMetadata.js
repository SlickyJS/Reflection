"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROPERTIES_KEY = '__properties';
function addPropertyMetadata(target, annotation, propertyName) {
    var metadata = Reflect.getMetadata(exports.PROPERTIES_KEY, target) || {};
    if (typeof metadata[propertyName] === 'undefined') {
        metadata[propertyName] = [];
    }
    metadata[propertyName].push(annotation);
    Reflect.defineMetadata(exports.PROPERTIES_KEY, metadata, target);
}
function getPropertiesMetadata(target) {
    return Reflect.getMetadata(exports.PROPERTIES_KEY, target) || {};
}
exports.getPropertiesMetadata = getPropertiesMetadata;
function getPropertyMetadata(target, propertyName) {
    var metadata = getPropertiesMetadata(target);
    return metadata[propertyName] || [];
}
exports.getPropertyMetadata = getPropertyMetadata;
function findPropertyMetadata(target, annotationType, propertyName) {
    var metadata = getPropertyMetadata(target, propertyName);
    for (var i = 0; i < metadata.length; i++) {
        if (metadata[i] instanceof annotationType) {
            return metadata[i];
        }
    }
    return null;
}
exports.findPropertyMetadata = findPropertyMetadata;
function makePropertyDecorator(annotationClass) {
    function DecoratorFactory() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var annotationInstance = new ((_a = annotationClass).bind.apply(_a, [void 0].concat(args)))();
        return function (target, name) {
            addPropertyMetadata(target.constructor, annotationInstance, name);
        };
        var _a;
    }
    DecoratorFactory.prototype = Object.create(annotationClass.prototype);
    return DecoratorFactory;
}
exports.makePropertyDecorator = makePropertyDecorator;
