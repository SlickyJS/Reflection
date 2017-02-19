export declare const ANNOTATIONS_KEY = "__annotations";
export declare function getAnnotations(target: any): Array<any>;
export declare function findAnnotation(target: any, annotationType: Function): any;
export declare function makeClassDecorator(annotationClass: Function): any;
