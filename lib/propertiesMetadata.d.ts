export declare const PROPERTIES_KEY = "__properties";
export declare function getPropertiesMetadata(target: any): {
    [propertyName: string]: Array<any>;
};
export declare function getPropertyMetadata(target: any, propertyName: string): Array<any>;
export declare function findPropertyMetadata(target: any, annotationType: Function, propertyName: string): any;
export declare function makePropertyDecorator(annotationClass: Function): any;
