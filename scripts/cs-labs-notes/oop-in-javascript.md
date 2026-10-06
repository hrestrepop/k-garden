# OOP in JavaScript

JavaScript is prototype-based, not class-based: the `class` keyword introduced in ES2015 is syntactic sugar over prototype delegation. These notes cover the prototype chain, ES5 vs ES6 inheritance, constructor functions, and two standalone ways of modeling a "class" (constructor/prototype-based vs. plain object-literal-based).

## prototypeChain

JavaScript has no real class implementation; objects delegate to other objects via an internal `[[Prototype]]` link, accessed with `Object.getPrototypeOf()`/`Object.setPrototypeOf()`. `null` terminates the chain. The `Graph` example shows a constructor whose `prototype` is replaced outright with a plain object holding shared methods.

```javascript
function Parent() {
  this.a = 42
}

// everything you attach to prototype will be inherited by children objects
Parent.prototype.foo = function () {
  console.log('hello foo')
}

function Child() {
  this.b = 3.14159
}

Child.prototype = Object.create(Parent.prototype)

const intance = Object.create(Child)

/** Since ECMAScript 2015, the [[Prototype]] is accessed using the accessors
 * Object.getPrototypeOf() and Object.setPrototypeOf().
 */
Object.getPrototypeOf(intance)

Object.setPrototypeOf(intance, { any: 'prop' })

// Prototype Chain Sample
function Graph() {
  this.vertices = []
  this.edges = []
}

Graph.prototype = {
  addVertex: function (v) {
    this.vertices.push(v)
  }
}

var g = new Graph()
// g is an object with own properties 'vertices' and 'edges'.
// g.[[Prototype]] is the value of Graph.prototype when new Graph() is executed.
```

## es5Inheritance

Pre-ES6 inheritance pattern: call the parent constructor inside the child via `Parent.call(this)` to inherit instance properties, then relink `Child.prototype` to an object created from `Parent.prototype` (and restore `Child.prototype.constructor`) to inherit methods.

```javascript
// Parent class constructor
function Parent() {
  this.a = 42
}

// Parent class method
Parent.prototype.method = function method() {}

// Child class constructor
function Child() {
  Parent.call(this)

  this.b = 3.14159
}

// Inherit from the parent class
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child

// Child class method
Child.prototype.method = function method() {
  Parent.prototype.method.call(this)
}

// Instantiate
this.instance = new Child()
```

## es6Inheritance

The same inheritance relationship expressed with ES2015 `class`/`extends`/`super`, which is sugar over the ES5 prototype-chaining pattern above.

```javascript
// Parent class
class Parent {
  // Parent class constructor
  constructor() {
    this.a = 42
  }

  // Parent class method
  method() {}
}

// Child class inherits from Parent
class Child extends Parent {
  // Child class constructor
  constructor() {
    super()

    this.b = 3.14159
  }

  // Child class method
  method() {
    super.method()
  }
}

// Instantiate
this.instance = new Child()
```

## constructors

A `Person` constructor sets instance properties and defines a shared `greeting` method on its prototype; `Teacher` extends it by calling `Person.call(this, ...)` to reuse the parent's property setup before adding its own `subject` field.

```javascript
function Person(first, last, age, gender) {
  this.name = {
    first,
    last
  }

  this.age = age
  this.gender = gender
}

Person.prototype.greeting = function () {
  return `Hi! I am ${this.name.first}`
}

function Teacher(first, last, age, gender, interests, subject) {
  Person.call(this, first, last, age, gender, interests)

  this.subject = subject
}
```

## jsoop: two models compared

This file illustrates two independent, mutually exclusive ways to model a "class" in JavaScript — a classical constructor/prototype approach and a plain object-literal approach. They redeclare the same names (`Person`, `person`), so they are presented here as two separate standalone snippets rather than one script.

### Classical (constructor/prototype-based)

A class (or equivalently, a constructor function) acts as a blueprint; instances are created with `new`.

```javascript
// Classical model: Object is created from a blueprint (class)
class Person {
  fn() {}
}

// Equivalent ES5 form: function Person() {}

// create instance
let person = new Person()
```

### Object-literal-based

The prototypal model: an object is created directly from another object via `Object.create`, with no blueprint/constructor involved.

```javascript
// Prototypal model: Object is created directly from another object.

// base object
let Person = { fn() {} }

// instance
let person = Object.create(Person)

// In either case, Inheritance* is achieved by linking objects using prototype object.
```
