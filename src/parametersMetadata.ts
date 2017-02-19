declare let Reflect: any;


export const PARAMETERS_KEY = '__parameters';


function addParameterMetadata(target: any, annotation: any, index: number, methodName: string = '__ctor__'): void
{
	let metadata = Reflect.getMetadata(PARAMETERS_KEY, target) || {};

	if (typeof metadata[methodName] === 'undefined') {
		metadata[methodName] = [];
	}

	while (metadata[methodName].length <= index) {
		metadata[methodName].push(null);
	}

	metadata[methodName][index] = metadata[methodName][index] || [];
	metadata[methodName][index].push(annotation);

	Reflect.defineMetadata(PARAMETERS_KEY, metadata, target);
}


export function getParametersMetadata(target: any, methodName: string = '__ctor__'): Array<Array<any>>
{
	let metadata = Reflect.getMetadata(PARAMETERS_KEY, target) || {};
	return metadata[methodName] || [];
}


export function findParameterMetadata(target: any, annotationType: Function, index: number, methodName: string = '__ctor__'): any
{
	let metadata = getParametersMetadata(target, methodName);

	if (metadata[index] == null) {
		return null;
	}

	for (let i = 0; i < metadata[index].length; i++) {
		if (metadata[index][i] instanceof annotationType) {
			return metadata[index][i];
		}
	}

	return null;
}


export function makeParameterDecorator(annotationClass: Function): any
{
	function DecoratorFactory(...args: Array<any>) {
		let annotationInstance = new (<any>annotationClass)(...args);

		return function (target: any, methodName: string, index: number) {
			addParameterMetadata(
				target instanceof Function ? target : target.constructor,
				annotationInstance,
				index,
				methodName
			);
		}
	}

	DecoratorFactory.prototype = Object.create(annotationClass.prototype);

	return DecoratorFactory;
}
