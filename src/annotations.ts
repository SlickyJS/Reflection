declare let Reflect: any;


export const ANNOTATIONS_KEY = '__annotations';


function addAnnotation(target: any, annotation: any): void
{
	let annotations = Reflect.getMetadata(ANNOTATIONS_KEY, target) || [];
	annotations.push(annotation);

	Reflect.defineMetadata(ANNOTATIONS_KEY, annotations, target);
}


export function getAnnotations(target: any): Array<any>
{
	return Reflect.getMetadata(ANNOTATIONS_KEY, target) || [];
}


export function findAnnotation(target: any, annotationType: Function): any
{
	let annotations = getAnnotations(target);

	for (let i = 0; i < annotations.length; i++) {
		if (annotations[i] instanceof annotationType) {
			return annotations[i];
		}
	}

	return null;
}


export function makeClassDecorator(annotationClass: Function): any
{
	function DecoratorFactory(...args: Array<any>) {
		let annotationInstance = new (<any>annotationClass)(...args);

		return function (target: Function) {
			addAnnotation(target, annotationInstance);
		}
	}

	DecoratorFactory.prototype = Object.create(annotationClass.prototype);

	return DecoratorFactory;
}
