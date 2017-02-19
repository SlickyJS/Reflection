export declare const PARAMETERS_KEY = "__parameters";
export declare function getParametersMetadata(target: any, methodName?: string): Array<Array<any>>;
export declare function findParameterMetadata(target: any, annotationType: Function, index: number, methodName?: string): any;
export declare function makeParameterDecorator(annotationClass: Function): any;
