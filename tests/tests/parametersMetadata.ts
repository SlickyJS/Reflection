import {getParametersMetadata, findParameterMetadata, makeParameterDecorator, PARAMETERS_KEY} from '../../';
import {expect} from 'chai';


describe('#parametersMetadata', () => {

	describe('getParametersMetadata()', () => {

		it('should get all parameters in method', () => {
			class TestClass {}

			Reflect.defineMetadata(PARAMETERS_KEY, {method: [null, ['one']]}, TestClass);

			let metadata = getParametersMetadata(TestClass, 'method');

			expect(metadata).to.be.eql([
				null,
				[
					'one',
				],
			]);
		});

	});

	describe('findParameterMetadata()', () => {

		it('should not find parameter metadata', () => {
			class TestClass {}
			class ParameterMetadata {}

			let metadata = findParameterMetadata(TestClass, ParameterMetadata, 0, 'method');

			expect(metadata).to.be.equal(null);
		});

		it('should not find property metadata on property with other metadata', () => {
			class TestClass {}
			class ParameterMetadata {}

			Reflect.defineMetadata(PARAMETERS_KEY, {method: []}, TestClass);

			let metadata = findParameterMetadata(TestClass, ParameterMetadata, 0, 'method');

			expect(metadata).to.be.equal(null);
		});

		it('should find parameter metadata', () => {
			class TestClass {}
			class ParameterMetadata {}

			Reflect.defineMetadata(PARAMETERS_KEY, {method: [[new ParameterMetadata]]}, TestClass);

			let metadata = findParameterMetadata(TestClass, ParameterMetadata, 0, 'method');

			expect(metadata).to.be.an.instanceOf(ParameterMetadata);
		});

		it('should try to find parameter metadata on parameter without metadata', () => {
			class TestClass {}
			class ParameterMetadata {}

			Reflect.defineMetadata(PARAMETERS_KEY, {method: [null]}, TestClass);

			let metadata = findParameterMetadata(TestClass, ParameterMetadata, 0, 'method');

			expect(metadata).to.be.equal(null);
		});

	});

	describe('makeParameterDecorator', () => {

		it('should add simple parameter metadata in constructor', () => {
			class ParameterDefinition {}

			let Parameter = makeParameterDecorator(ParameterDefinition);

			class TestClass
			{

				constructor(@Parameter() param) {}

			}

			let metadata = Reflect.getMetadata(PARAMETERS_KEY, TestClass);

			expect(metadata).to.have.keys(['__ctor__']);
			expect(metadata.__ctor__).to.have.lengthOf(1);
			expect(metadata.__ctor__[0]).to.have.lengthOf(1);
			expect(metadata.__ctor__[0][0]).to.be.an.instanceOf(ParameterDefinition);
		});

		it('should add simple parameter metadata not in constructor', () => {
			class ParameterDefinition {}

			let Parameter = makeParameterDecorator(ParameterDefinition);

			class TestClass
			{

				method(@Parameter() param) {}

			}

			let metadata = Reflect.getMetadata(PARAMETERS_KEY, TestClass);

			expect(metadata).to.have.keys(['method']);
			expect(metadata.method).to.have.lengthOf(1);
			expect(metadata.method[0]).to.have.lengthOf(1);
			expect(metadata.method[0][0]).to.be.an.instanceOf(ParameterDefinition);
		});

		it('should add one parameter metadata with arguments', () => {
			class ParameterDefinition
			{

				constructor(first: boolean, second: number, third: string)
				{
					expect(first).to.be.equal(true);
					expect(second).to.be.equal(5);
					expect(third).to.be.equal('hello');
				}

			}

			let Parameter = makeParameterDecorator(ParameterDefinition);

			class TestClass
			{

				constructor(@Parameter(true, 5, 'hello') param) {}

			}

			let metadata = Reflect.getMetadata(PARAMETERS_KEY, TestClass);

			expect(metadata).to.have.keys(['__ctor__']);
			expect(metadata.__ctor__).to.have.lengthOf(1);
			expect(metadata.__ctor__[0]).to.have.lengthOf(1);
			expect(metadata.__ctor__[0][0]).to.be.an.instanceOf(ParameterDefinition);
		});

		it('should add many properties metadata', () => {
			class SimpleParameterDefinition {}
			class ArgumentParameterDefinition
			{

				constructor(arg: boolean)
				{
					expect(arg).to.be.equal(false);
				}

			}

			let SimpleMetadata = makeParameterDecorator(SimpleParameterDefinition);
			let ArgumentMetadata = makeParameterDecorator(ArgumentParameterDefinition);

			class TestClass
			{

				constructor(@SimpleMetadata() @ArgumentMetadata(false) param) {};

			}

			let metadata = Reflect.getMetadata(PARAMETERS_KEY, TestClass);

			expect(metadata).to.have.keys(['__ctor__']);
			expect(metadata.__ctor__).to.have.lengthOf(1);
			expect(metadata.__ctor__[0]).to.have.lengthOf(2);
			expect(metadata.__ctor__[0][0]).to.not.equal(metadata.__ctor__[0][1]);

			expect(metadata.__ctor__[0][0]).to.satisfy((metadata) => {
				return metadata instanceof SimpleParameterDefinition || metadata instanceof ArgumentParameterDefinition;
			});

			expect(metadata.__ctor__[0][1]).to.satisfy((metadata) => {
				return metadata instanceof SimpleParameterDefinition || metadata instanceof ArgumentParameterDefinition;
			});
		});

		it('should add many parameters', () => {
			class ParameterDefinition {}

			let Parameter = makeParameterDecorator(ParameterDefinition);

			class TestClass
			{

				constructor(first, @Parameter() second, third, @Parameter() fourth, fifth) {}

			}

			let metadata = Reflect.getMetadata(PARAMETERS_KEY, TestClass);

			expect(metadata).to.have.keys(['__ctor__']);
			expect(metadata.__ctor__).to.have.lengthOf(4);
			expect(metadata.__ctor__[0]).to.be.equal(null);
			expect(metadata.__ctor__[1]).to.have.lengthOf(1);
			expect(metadata.__ctor__[1][0]).to.be.an.instanceOf(ParameterDefinition);
			expect(metadata.__ctor__[2]).to.be.equal(null);
			expect(metadata.__ctor__[3]).to.have.lengthOf(1);
			expect(metadata.__ctor__[3][0]).to.be.an.instanceOf(ParameterDefinition);
		});

	});

});
