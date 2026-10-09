/*
Excess type checking only works for object literal
which is newly created in location that has expected shape.
Those existing will be not
*/

type Poet = {
  name: string,
  born: number,
}

const me: Poet = {
  name: "John",
  born: 1000
}

/*
job here is redundant because anotherMe is declared to have shape Poet
const anotherMe: Poet = {
  name: "John",
  born: 1000,
  job: "Hehe"
}
*/

const who = {
  name: "John",
  born: 1000,
  job: "Hehe"
}
/*
but this is ok, because who is existing one
*/
let anotherMe: Poet = who;

/*
make property optional by using ? before :
? is not the same as undefined, if a property
is declared to be undefined then it must exist
even its value if undefined
*/

type Book = {
  name?: string,
  author: {
    name: string,
    born: number,
  }
}

let myBook: Book = {
  author: {
    name: "john",
    born: 1000
  }
}

let anotherBook: Book = {
  name: "Blank",
  author: {
    name: "john",
    born: 1000
  }
}

/*
Discriminated union is union that has property indicates the
shape of object itself
*/

type Human = {
  name: string,
  age: number,
  type: "person",
}

type Allien = {
  name: number,
  age: string,
  type: "allien",
}

type Entity = Human | Allien;

let entity: Entity = Math.random() > 0.5 ? { name: "John", age: 21, type: "person" } : { name: 21, age: "Al2m", type: "allien" }
if (entity.type === "allien") {
  // entity is narrowed down to allien
} else {
  // entity is narrowed down to human
}
