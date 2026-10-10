//Interface
interface Poet {
  born: number;
  name: string;
}

/*
readonly modifier make a property can be
only read, not assigned a new value
*/

interface Page {
  readonly text: string;
}

function read(page: Page) {
  console.log(page.text);
  // page.text = "new" not allowed
}

/*
interface can declare method, it can be optional by
put question mark after method name
*/

interface HasBothFunctionTypes {
  property: () => string; //property
  method?(): string; //method
}

/*
Call signature
both FunctionAlias and CallSignature decribes
the same type of function
*/

type FunctionAlias = (input: string) => number;

interface CallSignature {
  (another: number): number;
  (input: string): number;
}

const getLength: FunctionAlias = (input) => input.length;
const getAnotherLength: CallSignature = (input) => (typeof input === "string") ? input.length : 0;

/*
Call signature can also define type
that has additional property
*/

interface Counter {
  count: number;
  (): number;
}

let counter: Counter;

function counterFunc() {
  counterFunc.count += 1;
  return counterFunc.count;
}
counterFunc.count = 0;

counter = counterFunc;

/*
Index signature
ScoreMap assumes every string key will be mapped to number
therefore it's not safe, me doesn't have who property
but ts thinks its returned type is number 
*/

interface ScoreMap {
  [i: string]: number;
}

let me: ScoreMap = {
  "score": 100,
}
me.who

/*
Index signature can be used 
with number as key, but its value type
must satisfy with the type of string index
signature because number is converted to
string implicitly
*/

interface Mixed {
  // [i: number]: 1; got warning
  [i: number]: "Number"; //great
  [i: string]: string;
}

/*
extends interface using extends kw
*/

interface Writing {
  title: string;
}

interface Novella extends Writing {
  pages: number;
}

let myNovella: Novella = {
  title: "Okultiophile",
  pages: 10,
} //OK

/*
let weirdNovella: Novella = {
  title: "No",
}
Not OK
*/

/*
derived interface from extends can override
base type but with caveat that new property
you override must satisfy the base one.
*/

interface WithNullableName {
  name: string | null;
}

interface WithNonNullableName extends WithNullableName {
  // name: number Not ok because number doesn't fit into name of base
  name: string;
}

/*
Merging is a feature that merge definition
of interface from multiple places into big one.
2 interfaces below have the same name and get merged
into big one with the same name
*/

interface Merged {
  first: string;
}

interface Merged {
  second: string;
}

let rank: Merged = {
  first: "John",
  second: "Alex"
}