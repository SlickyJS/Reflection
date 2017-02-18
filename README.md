[![NPM version](https://img.shields.io/npm/v/@slicky/reflection.svg?style=flat-square)](https://www.npmjs.com/package/@slicky/reflection)
[![Build Status](https://img.shields.io/travis/SlickyJS/Reflection.svg?style=flat-square)](https://travis-ci.org/SlickyJS/Reflection)

[![Donate](https://img.shields.io/badge/donate-PayPal-brightgreen.svg?style=flat-square)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CXNA2P52EBYKE)

# Slicky/Reflection

Helpers for working with typescript's reflection.

## Installation

```
$ npm install @slicky/reflection
```

## Class annotations

**Annotation definition:**

```typescript
import {makeClassDecorator} from '@slicky/reflection';

class NamedClassDefinition
{
	
	constructor(name: string) { ... }
	
}

let NamedClass = makeClassDecorator(NamedClassDefinition);
```

**Usage:**

```typescript
import {getAnnotations, findAnnotation} from '@slicky/reflection';

@NamedClass('Test')
class TestClass { ... }

// get all annotations on class:
getAnnotations(TestClass);

// finding annotation for class:
findAnnotation(TestClass, NamedClassDefinition);
```

##Properties metadata

Properties metadata can be used also for methods and accessors.

**Metadata definition:**

```typescript
import {makePropertyDecorator} from '@slicky/reflection';

class NamedPropertyDefinition
{
	
	constructor(name: string) { ... }
	
}

let NamedProperty = makePropertyDecorator(NamedPropertyDefinition);
```

**Usage:**

```typescript
import {getPropertiesMetadata, getPropertyMetadata, findPropertyMetadata} from '@slicky/reflection';

class TestClass
{
	
	@NamedProperty('test')
	prop;
	
}

// get all properties on class:
getPropertiesMetadata(TestClass);

// get all metadata for property "prop":
getPropertyMetadata(TestClass, 'prop');

// finding metadata for property "prop":
findPropertyMetadata(TestClass, NamedPropertyDefinition, 'prop');
```

## Parameters metadata

**Metadata definition:**

```typescript
import {makeParameterDecorator} from '@slicky/reflection';

class NamedParameterDefinition
{
	
	constructor(name: string) { ... }
	
}

let NamedParameter = makeParameterDecorator(NamedParameterDefinition);
```

**Usage:**

```typescript
import {getParametersMetadata, findParameterMetadata} from '@slicky/reflection';

class TestClass
{
	
	constructor(@NamedParameter('param') arg) { ... }
	
	method(arg1, @NamedParameter('param2') arg2) { ... }
	
}

// get all parameters in constructor:
getParametersMetadata(TestClass);

// get all parameters in method "method":
getParametersMetadata(TestClass, 'method');

// finding metadata for first argument in constructor:
findParameterMetadata(TestClass, NamedParameterDefinition, 0);

// finding metadata for second argument in method "method":
findParameterMetadata(TestClass, NamedParameterDefinition, 1, 'method');
```
