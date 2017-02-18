declare let Reflect: any;


export const PROPERTIES_KEY = '__properties';


function addPropertyMetadata(target: any, annotation: any, propertyName: string): void
{
	let metadata = Reflect.getMetadata(PROPERTIES_KEY, target) || {};

	if (typeof metadata[propertyName] === 'undefined') {
		metadata[propertyName] = [];
	}

	metadata[propertyName].push(annotation);

	Reflect.defineMetadata(PROPERTIES_KEY, metadata, target);
}


export function getPropertiesMetadata(target: any): {[propertyName: string]: Array<any>}
{
	return Reflect.getMetadata(PROPERTIES_KEY, target) || {};
}


export function getPropertyMetadata(target: any, propertyName: string): Array<any>
{
	let metadata = getPropertiesMetadata(target);
	return metadata[propertyName] || [];
}


export function findPropertyMetadata(target: any, annotationType: Function, propertyName: string): any
{
	let metadata = getPropertyMetadata(target, propertyName);

	for (let i = 0; i < metadata.length; i++) {
		if (metadata[i] instanceof annotationType) {
			return metadata[i];
		}
	}

	return null;
}


export function makePropertyDecorator(annotationClass: Function): any
{
	function DecoratorFactory(...args: Array<any>) {
		let annotationInstance = new (<any>annotationClass)(...args);

		return function (target: any, name: string) {
			addPropertyMetadata(
				target.constructor,
				annotationInstance,
				name
			);
		}
	}

	DecoratorFactory.prototype = Object.create(annotationClass.prototype);

	return DecoratorFactory;
}
