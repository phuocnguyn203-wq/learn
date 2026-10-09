import { number } from "zod";

function sing(song: string) {
  console.log(`Sing ${song}`);
}

/*
sing(1);
number is not assignable to string
*/

function singTwo(firstSong: string, secondSong: string) {
  console.log(`Sing ${firstSong}`);
  console.log(`Sing ${secondSong}`);
}

/*
singTwo("Only you");
singTwo("Me", "And", "You");
singTwo only accepts 2, if there are too many
or too few ts will complaints
*/
singTwo("Just", "Right");


/*
optional parameter, it can be not passed to function
if it's passed it must be string or undefined (implicitly add | undefined)
both of function calls below are the same
*/
function announceSong(songName: string, singerName?: string) {
  console.log(`Song ${songName}`);
  if (singerName) { console.log(`Singer ${singerName}`); }
}

announceSong("John");
announceSong("John", undefined);

/*
default parameter, default value for parameter
like value, ts will infer type if type isn't declared
explicitly (implicitly add | undefined)
important: null doesn't trigger default undefined does
*/

function rateSong(songName: string, rate = 0) {
  console.log(`${songName} is rated ${rate}`);
}

rateSong("Me and you", undefined); // print: Me and you is rated 0

/*
rest parameter: annotate it with type and [] follows
*/
function singAllSongs(singerName: string, ...songs: string[]) {
  console.log(`Singer Name: ${singerName}`);
  for (const song of songs) {
    console.log(`Song: ${song}`);
  }
}

singAllSongs("John", "me", "and", "you");
singAllSongs("John");
// singAllSongs("John", 1, 2,3  4); not assignable

/*
return type
*/

function singSongRecursive(songs: string[], count = 0): number {
  return songs.length === 0 ? singSongRecursive(songs.slice(1), count+1) : count;
}

singSongRecursive(["Propose", "BunnyGirl"])

/*
Function type
*/

let countSongByAuthor = (songs: string[], author: string) => number;

/*
parameter type inferences
if a function is declared, ts will check
when it first assign a new function
function passed as parameters will be inferred
as well if the location it it passed has type declared
*/

let singer: (song: string) => string;
singer = function(song) { return `Song ${song}`};

/*
type allias
function type can be alliased as well
*/

type StringToNumber = (input: string) => number;

/*
let numberToString: StringToNumber = (input: number) => {
  return input.toString();
}
error have 3 level of indentations
Type '(input: number) => string' is not assignable to type 'StringToNumber'.
  Types of parameters 'input' and 'input' are incompatible.
    Type 'string' is not assignable to type 'number'.
*/

let stringToNumber: StringToNumber = (input: string) => {
  return Number(input)
}

/*
a function can return nothing or has no return statement
in that case it should declare to return void
If a parameter in a function declares to take 
void function which means it will ignore returned type
even that function return something else
*/

let logRoute = (req: string, res: string): void => {
  console.log(req);
  return undefined;
}

/*
never returns
a function doesn't return anything
should have return type is never
for example: only throw or run infinite loop
*/

function fail(message: string): never {
  throw new Error(message);
}

/*
Function overload provides several
interface for one function. when compiled
to js, it will be deleted
All interfaces must be compatible with
implementation
*/

function createDate(timestamp: number): Date;
function createDate(month: number, day: number, year: number): Date;
function createDate(monthOrTimestamp: number, day?: number, year?: number) {
  return day === undefined || year === undefined
  ? new Date(monthOrTimestamp)
  : new Date(year, monthOrTimestamp, day);
}

createDate(2183912389); // Ok
createDate(12, 20, 2026); // Ok
//createDate(12, 10) // not Ok because no interface for 2 parameters

