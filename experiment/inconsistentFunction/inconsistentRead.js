import { readFile } from "node:fs";
const cache = new Map();

function inconsistentRead(filename, cb) {
    if (cache.has(filename)) {
        cb(cache.get(filename));
        return;
    }
    readFile(filename, "utf8", (_err, data) => {
        cache.set(filename, data);
        cb(data);
    })
}

function createFileReader(filename) {
    const listeners = [];
    inconsistentRead(filename, value => {
        for (const listener of listeners) {
            listener(value);
        }
    })

    return {
        onDataRead: listener => { listeners.push(listener); }
    }
}

const reader1 = createFileReader("./data.txt");
reader1.onDataRead(value => {
    console.log(`First`);  
    const reader2 = createFileReader("./data.txt");
    reader2.onDataRead(() => {console.log(`Second`)});
})

//Output: First
/*
Output is only First, because first time when reader1 is created it's asynchronous, when onDataRead is called
it doesn't call listeners yet, so all listeners are registered by calling onDataRead will be called, but in the second one because data is cached, it would run listeners first and then register, so every listenered registered would not be called
*/