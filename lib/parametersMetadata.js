"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PARAMETERS_KEY = '__parameters';
function addParameterMetadata(target, annotation, index, methodName) {
    if (methodName === void 0) { methodName = '__ctor__'; }
    var metadata = Reflect.getMetadata(exports.PARAMETERS_KEY, target) || {};
    if (typeof metadata[methodName] === 'undefined') {
        metadata[methodName] = [];
    }
    while (metadata[methodName].length <= index) {
        metadata[methodName].push(null);
    }
    metadata[methodName][index] = metadata[methodName][index] || [];
    metadata[methodName][index].push(annotation);
    Reflect.defineMetadata(exports.PARAMETERS_KEY, metadata, target);
}
function getParametersMetadata(target, methodName) {
    if (methodName === void 0) { methodName = '__ctor__'; }
    var metadata = Reflect.getMetadata(exports.PARAMETERS_KEY, target) || {};
    return metadata[methodName] || [];
}
exports.getParametersMetadata = getParametersMetadata;
function findParameterMetadata(target, annotationType, index, methodName) {
    if (methodName === void 0) { methodName = '__ctor__'; }
    var metadata = getParametersMetadata(target, methodName);
    if (metadata[index] == null) {
        return null;
    }
    for (var i = 0; i < metadata[index].length; i++) {
        if (metadata[index][i] instanceof annotationType) {
            return metadata[index][i];
        }
    }
    return null;
}
exports.findParameterMetadata = findParameterMetadata;
function makeParameterDecorator(annotationClass) {
    function DecoratorFactory() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var annotationInstance = new ((_a = annotationClass).bind.apply(_a, [void 0].concat(args)))();
        return function (target, methodName, index) {
            addParameterMetadata(target instanceof Function ? target : target.constructor, annotationInstance, index, methodName);
        };
        var _a;
    }
    DecoratorFactory.prototype = Object.create(annotationClass.prototype);
    return DecoratorFactory;
}
exports.makeParameterDecorator = makeParameterDecorator;
