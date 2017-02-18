import {getAnnotations, findAnnotation, makeClassDecorator, ANNOTATIONS_KEY} from '../../';
import {expect} from 'chai';


describe('#annotations', () => {

	describe('getAnnotations()', () => {

		it('should return all annotations on class', () => {
			class TestClass {}

			Reflect.defineMetadata(ANNOTATIONS_KEY, ['first', 'second'], TestClass);

			let annotations = getAnnotations(TestClass);

			expect(annotations).to.be.eql([
				'first',
				'second',
			]);
		});

	});

	describe('findAnnotation()', () => {

		it('should not find annotation', () => {
			class TestClass {}
			class Annotation {}

			let annotation = findAnnotation(TestClass, Annotation);

			expect(annotation).to.be.equal(null);
		});

		it('should find annotation', () => {
			class TestClass {}
			class Annotation {}

			Reflect.defineMetadata(ANNOTATIONS_KEY, [new Annotation], TestClass);

			let annotation = findAnnotation(TestClass, Annotation);

			expect(annotation).to.be.an.instanceOf(Annotation);
		});

	});

	describe('makeClassDecorator()', () => {

		it('should add one simple class annotation', () => {
			class AnnotationDefinition {}

			let Annotation = makeClassDecorator(AnnotationDefinition);

			@Annotation()
			class TestClass {}

			let annotations = Reflect.getMetadata(ANNOTATIONS_KEY, TestClass);

			expect(annotations).to.have.lengthOf(1);
			expect(annotations[0]).to.be.an.instanceOf(AnnotationDefinition);
		});

		it('should add one class annotations with arguments', () => {
			class AnnotationDefinition
			{

				constructor(first: boolean, second: number, third: string)
				{
					expect(first).to.be.equal(true);
					expect(second).to.be.equal(5);
					expect(third).to.be.equal('hello');
				}

			}

			let Annotation = makeClassDecorator(AnnotationDefinition);

			@Annotation(true, 5, 'hello')
			class TestClass {}

			let annotations = Reflect.getMetadata(ANNOTATIONS_KEY, TestClass);

			expect(annotations).to.have.lengthOf(1);
			expect(annotations[0]).to.be.an.instanceOf(AnnotationDefinition);
		});

		it('should add many class annotations', () => {
			class SimpleAnnotationDefinition {}
			class ArgumentAnnotationDefinition
			{

				constructor(arg: boolean)
				{
					expect(arg).to.be.equal(false);
				}

			}

			let SimpleAnnotation = makeClassDecorator(SimpleAnnotationDefinition);
			let ArgumentAnnotation = makeClassDecorator(ArgumentAnnotationDefinition);

			@SimpleAnnotation()
			@ArgumentAnnotation(false)
			class TestClass {}

			let annotations = Reflect.getMetadata(ANNOTATIONS_KEY, TestClass);

			expect(annotations).to.have.lengthOf(2);
			expect(annotations[0]).to.not.equal(annotations[1]);

			expect(annotations[0]).to.satisfy((annotation) => {
				return annotation instanceof SimpleAnnotationDefinition || annotation instanceof ArgumentAnnotationDefinition;
			});

			expect(annotations[1]).to.satisfy((annotation) => {
				return annotation instanceof SimpleAnnotationDefinition || annotation instanceof ArgumentAnnotationDefinition;
			});
		});

	});

});
