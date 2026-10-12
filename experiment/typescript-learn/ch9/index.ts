/*
top type is type that is
accepts any type, any makes ts
not to check type, which is problem
*/

import { keyof } from "zod";

function map(a: any) {
  return a;
}

map(123); //fine
map("123"); //also fine
map({ name: "John" }); //also fine

/*
Like any, unknown accepts any types
but in restrictive way:
- ts does not allow directly accessing properties of unknown typed values
- unknown is not assignable to types that are not a top type (any or unknown);
*/

function process(input: unknown) {
  if (typeof input === "string") {
    input.toLowerCase();
  }
  if (typeof input === "object") {
    if (input !== null) {
      Object.keys(input);
    }
  }
  //input.toFixed(2); // warning
}

/*
type predicate is a function that returns boolean
and helps narrow the type of parameter
syntax: function fn(value: GeneralType): value is   NarrowType { ... }
**note**: type predicate also narrows type in false case
*/


function isNumberOrString(value: unknown) : value is number | string {
  return ["string", "number"].includes(typeof value);
}

function logOnlyNumberOrString(value: string | number | null | undefined) {
  if (isNumberOrString(value)) {
    console.log(value.toString());
    return;
  }
  value; // value is null or undefined
}

/*
ketof operator gives back a union of all keys allowed
on object operand
*/

interface Review {
  review: string;
  rating: number;
}

function getProperty(review: Review, key: keyof Review) { // equivalent to key: "review" | "rating"
  return review[key];
}

/*
typeof operator gives the type of operand,
it's just coincidentally the same as runtime typeof in javascript
*/

let origin = {
  name: "john",
  age: 21,
}

let copy: typeof origin;

copy = {
  name: "Jack",
  age: 42
} // ok

//let anotherCopy: typeof origin;
//anotherCopy = {
//  name: 281,
//  age: "21";
//} //not ok

/*
type assertion:
using as YourType after value, ts will
defer to assertion and treat the value as
YourType
*/

const rawData = `["24", "John"]`;

JSON.parse(rawData) as string[];

//using assertion when throw error
try {
  // ...
} catch (error) {
  console.warn("Oh no!!!", (error as Error).message);
}

/*
not null assertion, a variable can be asserted not null
by adding ! after variable
Assertion should be avoided, it bypasses ts even if there's
potential error. use it only when it's completely safe to do so.
*/

const points = new Map([
  ["john", 1938.2],
  ["jack", 289]
]);
const johnPoint = points.get("john")!;
johnPoint.toFixed(2);

/*
The difference between declared variable
with type is not the same as assertion
assertion tell ts to skip type checking
*/

interface Bottle {
  volumn: number;
  expire: Date;
}

// const bottle1: Bottle = {
//   volumn: 294,
// } // caught here


const bottle2 = {
  volumn: 100,
} as Bottle
// pass but not ok

/*
const declaration is like making mutable to immutable
*/

//literal to primitives

const getName = () => "John"; // type () => string
const getLiteralName = () => "john" as const; //type () => "john";

//readonly objects

let me = {
  name: "John",
  age: 21,
} as const; //become readonly