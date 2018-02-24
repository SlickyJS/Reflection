import '../bootstrap';

import {getPropertiesMetadata, getPropertyMetadata, findPropertyMetadata, makePropertyDecorator, PROPERTIES_KEY} from '../../';
import {expect} from 'chai';


describe('#propertiesMetadata', () => {

	describe('getPropertiesMetadata()', () => {

		it('should get all property metadata', () => {
			class TestClass {}

			Reflect.defineMetadata(PROPERTIES_KEY, {one: [], two: []}, TestClass);

			let metadata = getPropertiesMetadata(TestClass);

			expect(metadata).to.be.eql({
				one: [],
				two: [],
			});
		});

	});

	describe('getPropertyMetadata()', () => {

		it('should get all property metadata', () => {
			class TestClass {}

			Reflect.defineMetadata(PROPERTIES_KEY, {property: ['first', 'second']}, TestClass);

			let metadata = getPropertyMetadata(TestClass, 'property');

			expect(metadata).to.be.eql([
				'first',
				'second',
			]);
		});

	});

	describe('findPropertyMetadata()', () => {

		it('should not find property metadata', () => {
			class TestClass {}
			class PropertyMetadata {}

			let metadata = findPropertyMetadata(TestClass, PropertyMetadata, 'property');

			expect(metadata).to.be.equal(null);
		});

		it('should not find property metadata on property with other metadata', () => {
			class TestClass {}
			class PropertyMetadata {}

			Reflect.defineMetadata(PROPERTIES_KEY, {property: []}, TestClass);

			let metadata = findPropertyMetadata(TestClass, PropertyMetadata, 'property');

			expect(metadata).to.be.equal(null);
		});

		it('should find property metadata', () => {
			class TestClass {}
			class PropertyMetadata {}

			Reflect.defineMetadata(PROPERTIES_KEY, {property: [new PropertyMetadata]}, TestClass);

			let metadata = findPropertyMetadata(TestClass, PropertyMetadata, 'property');

			expect(metadata).to.be.an.instanceOf(PropertyMetadata);
		});

	});

	describe('makePropertyDecorator', () => {

		it('should add simple annotation to property', () => {
			class MetadataDefinition {}

			let Metadata = makePropertyDecorator(MetadataDefinition);

			class TestClass
			{

				@Metadata()
				public property;

			}

			let metadata = Reflect.getMetadata(PROPERTIES_KEY, TestClass);

			expect(metadata).to.have.keys(['property']);
			expect(metadata.property).to.have.lengthOf(1);
			expect(metadata.property[0]).to.be.an.instanceOf(MetadataDefinition);
		});

		it('should add one property metadata with arguments', () => {
			class MetadataDefinition
			{

				constructor(first: boolean, second: number, third: string)
				{
					expect(first).to.be.equal(true);
					expect(second).to.be.equal(5);
					expect(third).to.be.equal('hello');
				}

			}

			let Metadata = makePropertyDecorator(MetadataDefinition);

			class TestClass
			{

				@Metadata(true, 5, 'hello')
				public property;

			}

			let metadata = Reflect.getMetadata(PROPERTIES_KEY, TestClass);

			expect(metadata).to.have.keys(['property']);
			expect(metadata.property).to.have.lengthOf(1);
			expect(metadata.property[0]).to.be.an.instanceOf(MetadataDefinition);
		});

		it('should add many properties metadata', () => {
			class SimpleMetadataDefinition {}
			class ArgumentMetadataDefinition
			{

				constructor(arg: boolean)
				{
					expect(arg).to.be.equal(false);
				}

			}

			let SimpleMetadata = makePropertyDecorator(SimpleMetadataDefinition);
			let ArgumentMetadata = makePropertyDecorator(ArgumentMetadataDefinition);

			class TestClass
			{

				@SimpleMetadata()
				@ArgumentMetadata(false)
				public property;

			}

			let metadata = Reflect.getMetadata(PROPERTIES_KEY, TestClass);

			expect(metadata).to.have.keys(['property']);
			expect(metadata.property[0]).to.not.equal(metadata.property[1]);

			expect(metadata.property[0]).to.satisfy((metadata) => {
				return metadata instanceof SimpleMetadataDefinition || metadata instanceof ArgumentMetadataDefinition;
			});

			expect(metadata.property[1]).to.satisfy((metadata) => {
				return metadata instanceof SimpleMetadataDefinition || metadata instanceof ArgumentMetadataDefinition;
			});
		});

	});

});
