// methematican is of type string | undefined
let mathematican = Math.random() > 0.5 ? undefined : "Terence Tao";

// declare union types
let thinker: string | number = 1;
if (Math.random() > 0.5) {
  thinker = "PlMeow";
}
/*
// this is error, only methods exist on both type can be called
// so toString is allow, but not thinker.toFixed or thinker.slice(1, 0)
thinker.toFixed();
*/

/*
This is allowed by a process called narrowing
first me is of type string or number, but after assignment it's string
so a call to toUpperCase is valid
*/
let me: string | number;
me = "John";
me.toUpperCase();

/*
when a variable is declared as const and value
being assigned is primitive then that variable
is of type literal which is the value being assigned
*/
const myName = "Phuoc";

/*
a variable can be truthiness narrowing
in if statement below, truth is of type
string or undefined, but undefined is falsy
then ts knows inside if block truth must be
string. Outer call to LowerCase get warning
because it can be undefined
*/

let truth: string | undefined;
truth = Math.random() > 0.5 ? "Truth here" : undefined
if (truth) {
  truth.toLowerCase();
}
// truth.toLowerCase();

/*
type alias
type alias don't have to be declared in order of usage
BestCoder includes name which is declared after BestCoder
*/

type BestCoder = Name | string;

type Name = "John" | "Dougas" | "Mike" | "Gonda";